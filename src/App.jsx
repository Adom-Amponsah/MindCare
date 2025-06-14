import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

// Components will be imported here
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Chat from './components/Chat'
import Resources from './components/Resources'
import SignIn from './auth/SignIn'
import Signup from './auth/Signup'
import { AuthProvider, useAuth } from './auth/AuthContext'
import FirebaseInit from './firebase/FirebaseInit'
import ResourceDemo from './pages/ResourceDemo'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

const AppContent = () => {
  const { currentUser } = useAuth();
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Routes>
          <Route path="/" element={
            currentUser ? <Navigate to="/chat" /> : <Hero onStartChat={() => window.location.href = '/signup'} />
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat onClose={() => window.location.href = '/'} />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={<Resources />} />
          <Route path="/signup" element={
            currentUser ? <Navigate to="/chat" /> : <Signup onSwitchToSignIn={() => window.location.href = '/signin'} onSuccessfulSignup={() => window.location.href = '/chat'} />
          } />
          <Route path="/signin" element={
            currentUser ? <Navigate to="/chat" /> : <SignIn onSwitchToSignUp={() => window.location.href = '/signup'} onSuccessfulSignIn={() => window.location.href = '/chat'} />
          } />
          <Route path="/resource-demo" element={<ResourceDemo />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <FirebaseInit>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </FirebaseInit>
  );
};

export default App
