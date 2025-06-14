import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, LogIn, Phone, Mail } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from './AuthContext';
import { recordUserSession } from '../firebase/userService';

const SignIn = ({ onSwitchToSignUp, onSuccessfulSignIn }) => {
  const { signin, setupPhoneAuth, signinWithPhone, verifyOtp, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [signinMethod, setSigninMethod] = useState('email'); // 'email' or 'phone'
  const recaptchaContainerRef = useRef(null);
  
  // Clear any existing reCAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error);
        }
      }
    };
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    clearError();
    setLoading(true);
    
    try {
      if (signinMethod === 'email') {
        // Email/password signin
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        
        const user = await signin(email, password);
        
        // Record additional login data
        await recordUserSession(user.uid, {
          type: 'signin',
          method: 'email',
          device: navigator.userAgent,
          browser: getBrowserInfo(),
          timestamp: new Date().toISOString()
        });
        
        onSuccessfulSignIn();
      } else {
        // Phone signin
        if (!phone) {
          throw new Error('Phone number is required');
        }
        
        // Ensure phone number has international format
        let formattedPhone = phone;
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = `+${formattedPhone}`;
        }
        
        // Setup recaptcha
        const recaptchaVerifier = setupPhoneAuth('recaptcha-container-signin');
        
        // Start phone verification
        await signinWithPhone(formattedPhone, recaptchaVerifier);
        setShowOtp(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    clearError();
    setLoading(true);
    
    try {
      if (!otp) {
        throw new Error('Please enter the verification code');
      }
      
      const additionalData = {
        device: navigator.userAgent,
        browser: getBrowserInfo(),
        timestamp: new Date().toISOString()
      };
      
      const user = await verifyOtp(otp, additionalData);
      onSuccessfulSignIn();
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get browser info
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge";
    }
    
    return browserName;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 px-4">
      <form onSubmit={showOtp ? handleVerifyOtp : handleSignIn} className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-[#2563eb] mb-2 flex items-center justify-center gap-2">
          <LogIn className="w-7 h-7 text-[#fbbf24]" /> Sign In
        </h2>

        {/* Signin method toggle */}
        <div className="flex rounded-lg overflow-hidden border border-[#fbbf24]/40">
          <button 
            type="button"
            className={`flex-1 py-2 text-center ${signinMethod === 'email' ? 'bg-[#fbbf24] text-white' : 'bg-white text-[#2563eb]'}`}
            onClick={() => setSigninMethod('email')}
          >
            Email
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-center ${signinMethod === 'phone' ? 'bg-[#fbbf24] text-white' : 'bg-white text-[#2563eb]'}`}
            onClick={() => setSigninMethod('phone')}
          >
            Phone
          </button>
        </div>

        {!showOtp ? (
          <>
            {signinMethod === 'email' ? (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-[#2563eb] font-semibold">Email</label>
                  <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40">
                    <Mail className="w-5 h-5 text-[#fbbf24] mr-2" />
                    <input 
                      type="email" 
                      className="flex-1 bg-transparent outline-none text-[#2563eb]" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#2563eb] font-semibold">Password</label>
                  <input 
                    type="password" 
                    className="bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40 text-[#2563eb] outline-none" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-[#2563eb] font-semibold">Phone Number</label>
                <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40">
                  <Phone className="w-5 h-5 text-[#fbbf24] mr-2" />
                  <input 
                    type="tel" 
                    className="flex-1 bg-transparent outline-none text-[#2563eb]" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="e.g. +233..." 
                    required 
                  />
                </div>
                <div className="text-xs text-[#2563eb]/70">Enter your full phone number with country code</div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-[#2563eb] font-semibold">Verification Code</label>
            <input 
              type="text" 
              className="bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40 text-[#2563eb] outline-none text-center text-xl tracking-widest" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              placeholder="Enter OTP" 
              required 
              maxLength={6}
            />
            <div className="text-xs text-[#2563eb]/70 text-center">Enter the 6-digit code sent to your phone</div>
          </div>
        )}
        
        {/* Dedicated reCAPTCHA container */}
        <div id="recaptcha-container-signin" className="flex justify-center"></div>

        {(error || authError) && <div className="text-red-600 text-center text-sm">{error || authError}</div>}
        
        <Button type="submit" disabled={loading}>
          <MessageCircle className="w-5 h-5 mr-2" /> 
          {loading 
            ? 'Processing...' 
            : showOtp 
              ? 'Verify Code' 
              : 'Sign In'
          }
        </Button>
        
        <div className="text-center text-[#2563eb] text-sm mt-2">
          Don&apos;t have an account?{' '}
          <button type="button" className="underline hover:text-[#fbbf24]" onClick={onSwitchToSignUp}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn; 