# Firestore Collection Structure Fixes

## Problem
The application was encountering a 400 Bad Request error when trying to save chat messages because:
1. We were trying to create subcollections without ensuring the parent document existed
2. We were using incorrect collection naming conventions
3. We were using `setDoc(doc(chatRef), messageToSave)` which was creating documents with empty IDs

## Solution

### 1. Updated Collection Names
Changed collection names to match Firebase console conventions:
- `users` - Main users collection
- `chat_history` - Chat history subcollection (changed from `chatHistory`)
- `sessions` - User sessions subcollection
- `assessments` - New collection for mental health assessments

### 2. Created Initialization Function
Added `initializeUserCollections` function that:
- Creates the parent user document if it doesn't exist
- Sets up the initial chat message
- Records the initial user session
- Uses proper document creation with `merge: true` to avoid overwriting existing data

### 3. Fixed Document Creation
- Changed from `setDoc(doc(chatRef), messageToSave)` to `addDoc(chatRef, messageToSave)`
- This ensures Firebase generates proper document IDs automatically

### 4. Added User Document Checks
- Added checks in Chat and ChatInterface components to verify if user document exists
- If not, we initialize all collections before attempting to read/write data

### 5. Updated AuthContext
- Modified signup and phone verification flows to use the new initialization function
- Added special handling for new vs. returning users

## Firestore Structure

```
users/
  {userId}/
    - userId: string
    - displayName: string
    - email: string
    - phoneNumber: string
    - createdAt: timestamp
    - lastUpdated: timestamp
    - [other user fields]
    
    chat_history/
      {autoId}/
        - role: "user" | "assistant"
        - content: string
        - timestamp: timestamp
        - clientTimestamp: timestamp
        - isEmergency: boolean (optional)
        - resources: array (optional)
    
    sessions/
      {autoId}/
        - type: "signup" | "signin" | "initial_signup"
        - method: "email" | "phone"
        - timestamp: timestamp
        - device: string
```

## Next Steps
1. Ensure all collections are visible in Firebase console
2. Monitor for any additional Firestore errors
3. Consider adding indexes if query performance becomes an issue 