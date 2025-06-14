import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  addDoc,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './config';

// Collection references - these should match exactly what's in Firebase console
const USERS_COLLECTION = 'users';
const SESSIONS_COLLECTION = 'sessions';
const CHAT_HISTORY_COLLECTION = 'chat_history';
const CONVERSATIONS_COLLECTION = 'conversations';
const ASSESSMENTS_COLLECTION = 'assessments';

/**
 * Initialize Firestore collections for a new user
 * This ensures all required collections exist in Firebase
 * @param {string} uid - User ID from Firebase Auth
 * @param {object} userData - Initial user data
 */
export const initializeUserCollections = async (uid, userData = {}) => {
  try {
    // 1. Create/update main user document
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
      userId: uid,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      ...userData
    }, { merge: true });
    
    // Check if the user already has conversations
    const conversationsRef = collection(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION);
    const conversationsSnap = await getDocs(conversationsRef);
    
    let conversationId;
    
    if (conversationsSnap.empty) {
      // 2. Create initial conversation ONLY if none exist
      conversationId = await createNewConversation(uid, "First Conversation");
      
      // 3. Add initial welcome message to chat history
      await addMessageToConversation(uid, conversationId, {
        role: 'assistant',
        content: `Hello ${userData?.displayName || 'there'}! Welcome to MindCare. How are you feeling today?`,
        timestamp: serverTimestamp()
      });
    } else {
      // Use the first existing conversation
      conversationId = conversationsSnap.docs[0].id;
    }
    
    // 4. Record initial session
    const sessionRef = collection(db, USERS_COLLECTION, uid, SESSIONS_COLLECTION);
    await addDoc(sessionRef, {
      type: 'initial_signup',
      timestamp: serverTimestamp()
    });
    
    return conversationId;
  } catch (error) {
    // Don't throw errors for permission issues - just log them
    // This allows the app to continue working even if Firestore access fails
    console.error('Error initializing user collections:', error);
    
    // Return false to indicate initialization failed but don't crash the app
    return false;
  }
};

/**
 * Create or update user profile in Firestore
 * @param {string} uid - User ID from Firebase Auth
 * @param {object} userData - User data to store
 */
export const saveUserData = async (uid, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    const dataToSave = {
      ...userData,
      lastUpdated: serverTimestamp()
    };
    
    if (!userSnap.exists()) {
      // New user - include creation timestamp
      await setDoc(userRef, {
        ...dataToSave,
        createdAt: serverTimestamp(),
        userId: uid
      });
    } else {
      // Existing user - just update
      await updateDoc(userRef, dataToSave);
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 * @param {string} uid - User ID
 */
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Record a user login session
 * @param {string} uid - User ID
 * @param {object} sessionData - Session data like device, location, etc.
 */
export const recordUserSession = async (uid, sessionData = {}) => {
  try {
    const sessionRef = collection(db, USERS_COLLECTION, uid, SESSIONS_COLLECTION);
    
    await setDoc(doc(sessionRef), {
      timestamp: serverTimestamp(),
      ...sessionData
    });
    
    return true;
  } catch (error) {
    console.error('Error recording session:', error);
    // Don't throw here, as this is not critical functionality
    return false;
  }
};

/**
 * Create a new conversation
 * @param {string} uid - User ID
 * @param {string} title - Conversation title
 * @returns {string} - The new conversation ID
 */
export const createNewConversation = async (uid, title = "New Conversation") => {
  try {
    const conversationsRef = collection(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION);
    
    const conversationData = {
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0
    };
    
    const docRef = await addDoc(conversationsRef, conversationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Get user's conversations
 * @param {string} uid - User ID
 * @param {number} limit - Maximum number of conversations to retrieve
 */
export const getUserConversations = async (uid, limit = 20) => {
  try {
    const conversationsRef = collection(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION);
    const q = query(
      conversationsRef, 
      orderBy('updatedAt', 'desc'),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    
    const conversations = [];
    querySnapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return conversations;
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

/**
 * Update conversation title
 * @param {string} uid - User ID
 * @param {string} conversationId - Conversation ID
 * @param {string} newTitle - New conversation title
 */
export const updateConversationTitle = async (uid, conversationId, newTitle) => {
  try {
    const conversationRef = doc(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION, conversationId);
    
    await updateDoc(conversationRef, {
      title: newTitle,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating conversation title:', error);
    return false;
  }
};

/**
 * Add message to a specific conversation
 * @param {string} uid - User ID
 * @param {string} conversationId - Conversation ID
 * @param {object} message - Message object with content, role, etc.
 */
export const addMessageToConversation = async (uid, conversationId, message) => {
  try {
    // Add the message to the conversation's messages subcollection
    const messagesRef = collection(
      db, 
      USERS_COLLECTION, 
      uid, 
      CONVERSATIONS_COLLECTION, 
      conversationId, 
      'messages'
    );
    
    // Preserve client-side timestamp for UI but add server timestamp
    const messageToSave = {
      ...message,
      clientTimestamp: message.timestamp || new Date(),
      timestamp: serverTimestamp()
    };
    
    await addDoc(messagesRef, messageToSave);
    
    // Update the conversation's metadata
    const conversationRef = doc(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION, conversationId);
    await updateDoc(conversationRef, {
      updatedAt: serverTimestamp(),
      lastMessage: message.content,
      lastMessageRole: message.role,
      messageCount: (await getDoc(conversationRef)).data().messageCount + 1 || 1
    });
    
    return true;
  } catch (error) {
    console.error('Error adding message to conversation:', error);
    return false;
  }
};

/**
 * Get messages for a specific conversation
 * @param {string} uid - User ID
 * @param {string} conversationId - Conversation ID
 * @param {number} limit - Maximum number of messages to retrieve
 */
export const getConversationMessages = async (uid, conversationId, limit = 100) => {
  try {
    const messagesRef = collection(
      db, 
      USERS_COLLECTION, 
      uid, 
      CONVERSATIONS_COLLECTION, 
      conversationId, 
      'messages'
    );
    
    const q = query(
      messagesRef, 
      orderBy('timestamp', 'asc'),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore timestamp to JS Date if necessary
      const timestamp = data.timestamp?.toDate ? data.timestamp.toDate() : data.timestamp;
      
      messages.push({
        id: doc.id,
        ...data,
        timestamp: timestamp
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    return [];
  }
};

/**
 * Save chat message to history (legacy method)
 * @param {string} uid - User ID
 * @param {object} message - Message object with content, timestamp, etc.
 */
export const saveChatMessage = async (uid, message) => {
  try {
    // First check if user document exists
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    
    // Create user document if it doesn't exist
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        userId: uid,
        createdAt: serverTimestamp()
      });
    }
    
    // Check if user has any conversations
    const conversationsRef = collection(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION);
    const conversationsSnap = await getDocs(conversationsRef);
    
    let conversationId;
    
    if (conversationsSnap.empty) {
      // Create a new conversation ONLY if none exist
      conversationId = await createNewConversation(uid, "First Conversation");
    } else {
      // Use the first conversation found
      conversationId = conversationsSnap.docs[0].id;
    }
    
    // Add message to the conversation
    return await addMessageToConversation(uid, conversationId, message);
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
};

/**
 * Get user's chat history (legacy method)
 * @param {string} uid - User ID
 * @param {number} limit - Maximum number of messages to retrieve
 */
export const getChatHistory = async (uid, limit = 50) => {
  try {
    // Check if user has any conversations
    const conversationsRef = collection(db, USERS_COLLECTION, uid, CONVERSATIONS_COLLECTION);
    const conversationsSnap = await getDocs(conversationsRef);
    
    if (conversationsSnap.empty) {
      // Create a new conversation if none exist
      const conversationId = await createNewConversation(uid, "First Conversation");
      return [];
    } else {
      // Use the first conversation found
      const conversationId = conversationsSnap.docs[0].id;
      return await getConversationMessages(uid, conversationId, limit);
    }
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

/**
 * Find user by phone number
 * @param {string} phoneNumber - Phone number to search for
 */
export const findUserByPhone = async (phoneNumber) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        uid: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding user by phone:', error);
    throw error;
  }
};

/**
 * Find user by email
 * @param {string} email - Email to search for
 */
export const findUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        uid: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

/**
 * Update user profile data
 * @param {string} uid - User ID
 * @param {object} profileData - Profile data to update
 */
export const updateUserProfile = async (uid, profileData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    
    await updateDoc(userRef, {
      ...profileData,
      lastUpdated: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 