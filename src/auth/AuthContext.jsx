import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  saveUserData, 
  getUserData, 
  recordUserSession,
  initializeUserCollections
} from '../firebase/userService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  // Clear any previous errors
  const clearError = () => setError('');

  // Format Firebase error messages
  const formatError = (error) => {
    console.error("Firebase Auth Error:", error);
    
    // Extract error code
    const errorCode = error.code || '';
    
    // Map error codes to user-friendly messages
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-phone-number':
        return 'Please enter a valid phone number with country code (e.g., +233...).';
      case 'auth/invalid-verification-code':
        return 'Incorrect verification code. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/configuration-not-found':
        return 'Authentication configuration error. Please contact support.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  };

  // Load user data from Firestore
  const loadUserData = async (user) => {
    if (!user) return null;
    
    try {
      const data = await getUserData(user.uid);
      setUserData(data);
      return data;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName, additionalData = {}) => {
    clearError();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      
      // Initialize all collections for the new user
      const userData = {
        email,
        displayName: displayName || '',
        phoneNumber: user.phoneNumber || '',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL || '',
        ...additionalData
      };
      
      await initializeUserCollections(user.uid, userData);
      
      // Record login session
      await recordUserSession(user.uid, {
        type: 'signup',
        method: 'email',
        device: navigator.userAgent
      });
      
      return user;
    } catch (error) {
      const errorMessage = formatError(error);
      setError(errorMessage);
      throw error;
    }
  };

  // Sign in with email and password
  const signin = async (email, password) => {
    clearError();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Record login session
      await recordUserSession(user.uid, {
        type: 'signin',
        method: 'email',
        device: navigator.userAgent
      });
      
      return user;
    } catch (error) {
      const errorMessage = formatError(error);
      setError(errorMessage);
      throw error;
    }
  };

  // Setup phone authentication
  const setupPhoneAuth = (elementId) => {
    clearError();
    try {
      // Check if reCAPTCHA container exists
      const container = document.getElementById(elementId);
      if (!container) {
        throw new Error(`reCAPTCHA container #${elementId} not found`);
      }
      
      // Clear existing reCAPTCHA if any
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      // Create new reCAPTCHA verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA verified");
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("reCAPTCHA expired");
          setError('reCAPTCHA expired. Please refresh the page and try again.');
        }
      });
      
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("reCAPTCHA setup error:", error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      throw error;
    }
  };

  // Sign in with phone number
  const signinWithPhone = async (phoneNumber, recaptchaVerifier) => {
    clearError();
    try {
      console.log("Sending verification code to:", phoneNumber);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      console.log("Verification code sent successfully");
      return confirmationResult;
    } catch (error) {
      console.error("Phone auth error:", error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      throw error;
    }
  };

  // Verify OTP code
  const verifyOtp = async (code, additionalData = {}) => {
    clearError();
    try {
      if (!window.confirmationResult) {
        throw new Error('No verification in progress. Please restart the process.');
      }
      
      console.log("Verifying code:", code);
      const result = await window.confirmationResult.confirm(code);
      const user = result.user;
      console.log("Code verified successfully");
      
      // Initialize all collections for the new user
      const userData = {
        phoneNumber: user.phoneNumber || '',
        displayName: user.displayName || '',
        email: user.email || '',
        emailVerified: user.emailVerified,
        photoURL: user.photoURL || '',
        ...additionalData
      };
      
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
      
      if (isNewUser) {
        // For new users, initialize all collections
        await initializeUserCollections(user.uid, userData);
      } else {
        // For existing users, just update their data
        await saveUserData(user.uid, userData);
      }
      
      // Record login session
      await recordUserSession(user.uid, {
        type: isNewUser ? 'signup' : 'signin',
        method: 'phone',
        device: navigator.userAgent
      });
      
      return user;
    } catch (error) {
      console.error("OTP verification error:", error);
      const errorMessage = formatError(error);
      setError(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    clearError();
    try {
      if (!currentUser) throw new Error('No authenticated user');
      
      // Update Firebase Auth profile if display name or photo URL is provided
      if (profileData.displayName || profileData.photoURL) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName || currentUser.displayName,
          photoURL: profileData.photoURL || currentUser.photoURL
        });
      }
      
      // Save to Firestore
      await saveUserData(currentUser.uid, profileData);
      
      // Refresh user data
      await loadUserData(currentUser);
      
      return true;
    } catch (error) {
      const errorMessage = formatError(error);
      setError(errorMessage);
      throw error;
    }
  };

  // Sign out
  const signout = () => {
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? `User: ${user.uid}` : "No user");
      setCurrentUser(user);
      
      if (user) {
        // Load user data from Firestore
        await loadUserData(user);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    error,
    signup,
    signin,
    signout,
    setupPhoneAuth,
    signinWithPhone,
    verifyOtp,
    updateUserProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 