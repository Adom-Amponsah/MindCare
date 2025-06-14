import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, UserPlus, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from './AuthContext';

const Signup = ({ onSwitchToSignIn, onSuccessfulSignup }) => {
  const { signup, setupPhoneAuth, signinWithPhone, verifyOtp, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [signupMethod, setSignupMethod] = useState('email'); // 'email' or 'phone'
  const [step, setStep] = useState(1); // 1: basic info, 2: additional info
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

  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (signupMethod === 'email' && (!email || !password)) {
      setError('Email and password are required');
      return;
    }
    
    if (signupMethod === 'phone' && !phone) {
      setError('Phone number is required');
      return;
    }
    
    setError('');
    setStep(2);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    clearError();
    setLoading(true);
    
    // Additional user data to save
    const additionalData = {
      age: age || '',
      gender: gender || '',
      location: location || '',
      preferredLanguage: language || 'English',
      signupDate: new Date().toISOString(),
    };
    
    try {
      if (signupMethod === 'email') {
        // Email/password signup
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
        
        await signup(email, password, displayName, additionalData);
        onSuccessfulSignup();
      } else {
        // Phone signup
        if (!phone) {
          throw new Error('Phone number is required');
        }
        
        // Ensure phone number has international format
        let formattedPhone = phone;
        if (!formattedPhone.startsWith('+')) {
          formattedPhone = `+${formattedPhone}`;
        }
        
        console.log("Setting up reCAPTCHA for phone auth");
        // Setup recaptcha
        const recaptchaVerifier = setupPhoneAuth('recaptcha-container');
        
        // Start phone verification
        await signinWithPhone(formattedPhone, recaptchaVerifier);
        setShowOtp(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
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
      
      // Additional user data to save
      const additionalData = {
        displayName,
        age: age || '',
        gender: gender || '',
        location: location || '',
        preferredLanguage: language || 'English',
        signupDate: new Date().toISOString(),
      };
      
      await verifyOtp(otp, additionalData);
      onSuccessfulSignup();
    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 px-4">
      <form onSubmit={showOtp ? handleVerifyOtp : (step === 1 ? handleNextStep : handleSignup)} className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-center text-[#2563eb] mb-2 flex items-center justify-center gap-2">
          <UserPlus className="w-7 h-7 text-[#fbbf24]" /> Sign Up
        </h2>

        {!showOtp ? (
          <>
            {step === 1 ? (
              <>
                {/* Signup method toggle */}
                <div className="flex rounded-lg overflow-hidden border border-[#fbbf24]/40">
                  <button 
                    type="button"
                    className={`flex-1 py-2 text-center ${signupMethod === 'email' ? 'bg-[#fbbf24] text-white' : 'bg-white text-[#2563eb]'}`}
                    onClick={() => setSignupMethod('email')}
                  >
                    Email
                  </button>
                  <button 
                    type="button"
                    className={`flex-1 py-2 text-center ${signupMethod === 'phone' ? 'bg-[#fbbf24] text-white' : 'bg-white text-[#2563eb]'}`}
                    onClick={() => setSignupMethod('phone')}
                  >
                    Phone
                  </button>
                </div>

                {signupMethod === 'email' ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#2563eb] font-semibold">Display Name</label>
                      <input 
                        type="text" 
                        className="bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40 text-[#2563eb] outline-none" 
                        value={displayName} 
                        onChange={e => setDisplayName(e.target.value)} 
                        placeholder="Your name (optional)"
                      />
                    </div>
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
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#2563eb] font-semibold">Display Name</label>
                      <input 
                        type="text" 
                        className="bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40 text-[#2563eb] outline-none" 
                        value={displayName} 
                        onChange={e => setDisplayName(e.target.value)} 
                        placeholder="Your name (optional)"
                      />
                    </div>
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
                  </>
                )}
              </>
            ) : (
              // Step 2: Additional Information
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-[#2563eb] font-semibold">Age</label>
                  <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40">
                    <Calendar className="w-5 h-5 text-[#fbbf24] mr-2" />
                    <input 
                      type="number" 
                      className="flex-1 bg-transparent outline-none text-[#2563eb]" 
                      value={age} 
                      onChange={e => setAge(e.target.value)} 
                      placeholder="Your age (optional)"
                      min="13"
                      max="120"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[#2563eb] font-semibold">Gender</label>
                  <select 
                    className="bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40 text-[#2563eb] outline-none" 
                    value={gender} 
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[#2563eb] font-semibold">Location</label>
                  <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40">
                    <MapPin className="w-5 h-5 text-[#fbbf24] mr-2" />
                    <input 
                      type="text" 
                      className="flex-1 bg-transparent outline-none text-[#2563eb]" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                      placeholder="City/Region (optional)"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[#2563eb] font-semibold">Preferred Language</label>
                  <select 
                    className="bg-white rounded-lg px-3 py-2 border border-[#fbbf24]/40 text-[#2563eb] outline-none" 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Twi">Twi</option>
                    <option value="Pidgin">Pidgin</option>
                    <option value="Ga">Ga</option>
                    <option value="Ewe">Ewe</option>
                    <option value="Hausa">Hausa</option>
                  </select>
                </div>
              </>
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
        <div id="recaptcha-container" className="flex justify-center"></div>

        {(error || authError) && <div className="text-red-600 text-center text-sm">{error || authError}</div>}
        
        <Button type="submit" disabled={loading}>
          <MessageCircle className="w-5 h-5 mr-2" /> 
          {loading 
            ? 'Processing...' 
            : showOtp 
              ? 'Verify Code' 
              : step === 1 
                ? 'Continue' 
                : 'Sign Up'
          }
        </Button>
        
        {step === 2 && !showOtp && (
          <button 
            type="button" 
            onClick={() => setStep(1)} 
            className="text-center text-[#2563eb] hover:underline"
          >
            Back to previous step
          </button>
        )}
        
        <div className="text-center text-[#2563eb] text-sm mt-2">
          Already have an account?{' '}
          <button type="button" className="underline hover:text-[#fbbf24]" onClick={onSwitchToSignIn}>
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup; 