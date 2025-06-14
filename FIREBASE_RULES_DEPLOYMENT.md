# Firebase Rules Deployment Guide

This guide explains how to deploy the updated Firestore security rules for MindCare's conversation-based chat system.

## Prerequisites

1. Firebase CLI installed (`npm install -g firebase-tools`)
2. Firebase project properly configured
3. Admin access to the Firebase project

## Deploying Firestore Rules

1. Make sure you're logged in to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project if not already done:
   ```bash
   firebase init
   ```
   - Select Firestore when prompted
   - Choose to use an existing project
   - Accept the default rules file location

3. Deploy the updated rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Understanding the New Rules

The updated rules support the new conversation-based structure:

- Each user has their own `/users/{userId}` document
- Conversations are stored in `/users/{userId}/conversations/{conversationId}`
- Messages within conversations are in `/users/{userId}/conversations/{conversationId}/messages/{messageId}`
- Only authenticated users can access their own data
- Legacy chat_history collection is still supported for backward compatibility

## Data Migration

If you have existing chat data in the old format, you may need to migrate it to the new conversation-based structure:

1. Create a new conversation for each user
2. Move messages from `/users/{userId}/chat_history` to `/users/{userId}/conversations/{conversationId}/messages`
3. Update message metadata as needed

## Testing Rules

You can test these rules in the Firebase Console:
1. Go to Firestore Database in the Firebase Console
2. Click on "Rules" tab
3. Paste the rules from `firestore.rules`
4. Click "Publish"

## Troubleshooting

If you encounter permission issues:
1. Check that users are properly authenticated
2. Verify that the user ID in the request matches the document path
3. Check the Firebase console logs for specific error messages 