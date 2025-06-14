import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeUserCollections } from './userService';

const FirebaseInit = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Initializing Firebase...');
    
    // Set a timeout to prevent blocking the app for too long
    const initTimeout = setTimeout(() => {
      if (initializing) {
        console.log('Firebase initialization timeout - continuing anyway');
        setInitialized(true);
        setInitializing(false);
      }
    }, 3000); // 3 seconds timeout
    
    // Check current auth state without blocking the app
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          console.log('User is signed in:', user.uid);
          
          // Try to initialize user collections in the background
          // but don't block the app if it fails
          initializeUserCollections(user.uid, {
            email: user.email || '',
            displayName: user.displayName || '',
            phoneNumber: user.phoneNumber || '',
            emailVerified: user.emailVerified,
            photoURL: user.photoURL || '',
          }).catch(err => {
            console.error('Error initializing user collections:', err);
            // Don't block the app for this error
          });
        } else {
          console.log('No user is signed in');
        }
        
        // Allow the app to continue regardless of Firestore status
        setInitialized(true);
        setInitializing(false);
        clearTimeout(initTimeout);
      } catch (err) {
        console.error('Firebase initialization error:', err);
        // Don't block the app for auth errors
        setInitialized(true);
        setInitializing(false);
        clearTimeout(initTimeout);
      }
    });

    // Clean up subscription and timeout
    return () => {
      unsubscribe();
      clearTimeout(initTimeout);
    };
  }, [initializing]);

  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500">
        <div className="text-white text-xl font-bold mb-4">Initializing MindCare...</div>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  // Always render the app, even if there are Firebase errors
  return children;
};

export default FirebaseInit; 