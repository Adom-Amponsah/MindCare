import React from 'react';
import { Heart, MessageCircle, Users, Shield, Phone } from 'lucide-react';
import CrazyTestimonial from './CrazyTestimonial';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Simple creative Button component
const Button = ({ children, variant = 'primary', ...props }) => {
  const base =
    'inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'bg-gradient-to-r from-[#fbbf24] via-[#f472b6] to-[#2563eb] text-white hover:from-[#f59e42] hover:to-[#a78bfa] focus:ring-[#fbbf24]',
    outline:
      'bg-white/20 border-2 border-white text-white hover:bg-white/40 focus:ring-[#fbbf24]',
  };
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

const trustIndicators = [
  {
    icon: <Shield className="w-5 h-5 text-[#fbbf24]" />,
    label: '100% Private & Secure',
  },
  {
    icon: <Heart className="w-5 h-5 text-[#f472b6]" />,
    label: 'Licensed Professionals',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-[#2563eb]" />,
    label: '24/7 AI Support',
  },
];

const Hero = ({ onStartChat }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Handle Start Chat button click with authentication logic
  const handleStartChat = () => {
    if (currentUser) {
      // If user is authenticated, call the original onStartChat function
      onStartChat();
    } else {
      // If not authenticated, navigate to signup page
      navigate('/signup');
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500">
      {/* Sunset Oval Glow Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main oval sunset glow */}
        <svg
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[1200px]"
          width="1200"
          height="700"
          viewBox="0 0 1200 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ zIndex: 1 }}
        >
          <ellipse
            cx="600"
            cy="700"
            rx="600"
            ry="320"
            fill="url(#sunsetGradient)"
            fillOpacity="0.95"
          />
          <defs>
            <radialGradient id="sunsetGradient" cx="0.5" cy="1" r="1" gradientTransform="rotate(0) scale(1 0.7)">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="40%" stopColor="#f472b6" />
              <stop offset="70%" stopColor="#2563eb" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        {/* Blurred blobs for extra depth */}
        <div className="absolute left-1/4 bottom-32 w-40 sm:w-72 h-40 bg-pink-400 rounded-full filter blur-3xl opacity-30 animate-blob" style={{animationDelay: '1s'}}></div>
        <div className="absolute right-1/4 bottom-20 w-32 sm:w-60 h-32 bg-yellow-300 rounded-full filter blur-2xl opacity-20 animate-blob" style={{animationDelay: '2s'}}></div>
        <div className="absolute left-1/2 top-24 w-40 sm:w-80 h-32 bg-blue-300 rounded-full filter blur-2xl opacity-20 animate-blob" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Floating Trust Indicators - Responsive */}
      {trustIndicators.map((item, i) => (
        <div
          key={item.label}
          className={`absolute z-20 backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 text-white font-semibold text-sm sm:text-base drop-shadow-lg animate-float-${i + 1} ${
            i === 0 ? 'top-[25%] left-[15%] hidden sm:flex' : 
            i === 1 ? 'top-[25%] right-[10%] hidden sm:flex' : 
            'top-[60%] left-[8%] hidden sm:flex'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
      
      {/* Additional floating pills for more coverage */}
      <div className="absolute top-[15%] right-[15%] z-20 backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-white font-medium text-sm drop-shadow-lg animate-float-extra-1 hidden sm:flex">
        <div className="w-3 h-3 bg-[#fbbf24] rounded-full"></div>
        <span>Trusted</span>
      </div>
      
      <div className="absolute top-[60%] right-[20%] z-20 backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-white font-medium text-sm drop-shadow-lg animate-float-extra-2 hidden sm:flex">
        <div className="w-3 h-3 bg-[#f472b6] rounded-full"></div>
        <span>Safe Space</span>
      </div>
      
      <div className="absolute top-[45%] left-[80%] z-20 backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-white font-medium text-sm drop-shadow-lg animate-float-extra-3 hidden sm:flex">
        <div className="w-3 h-3 bg-[#2563eb] rounded-full"></div>
        <span>Anonymous</span>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 sm:mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#fbbf24] to-[#f472b6] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-poppins font-bold text-white">MindCare</span>
          </div>
          {/* Crisis support - always visible but subtle */}
          <div className="text-right">
            <div className="flex items-center space-x-1 text-xs text-white/80 mb-1">
              <Phone className="w-3 h-3" />
              <span className="hidden xs:inline">Crisis support</span>
            </div>
            <a href="tel:+233123456789" className="text-xs font-medium text-[#fbbf24] hover:text-[#f472b6] transition-colors">
              +233 123 456 789
            </a>
          </div>
        </header>

        {/* Hero Content */}
        <div className="text-center space-y-6 sm:space-y-8 animate-fade-in-up">
          {/* Main Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-poppins font-bold text-white leading-tight drop-shadow-xl">
              Your Mind Matters,{' '}
              <span className="text-[#fbbf24] inline-block breathe">Chale!</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 font-inter max-w-2xl mx-auto leading-relaxed px-4">
              Chat in Twi, Pidgin, or English like you dey talk with your paddy. 
              <br className="hidden md:block" />
              <span className="font-medium text-white">No shame, just help.</span>
            </p>
          </div>

          {/* Mobile Trust Indicators - Horizontal scroll for mobile only */}
          <div className="sm:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-3 w-max">
              {trustIndicators.map((item) => (
                <div
                  key={item.label}
                  className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-full px-4 py-2 flex items-center gap-2 text-white font-semibold text-sm"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
              <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-white font-medium text-sm">
                <div className="w-3 h-3 bg-[#fbbf24] rounded-full"></div>
                <span>Trusted</span>
              </div>
              <div className="backdrop-blur-md bg-white/20 border border-white/30 shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-white font-medium text-sm">
                <div className="w-3 h-3 bg-[#f472b6] rounded-full"></div>
                <span>Safe Space</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-scale-in" style={{animationDelay: '0.3s'}}>
            <Button onClick={handleStartChat}>
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {currentUser ? 'Continue Chatting' : 'Start Chatting Free'}
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Find Support Groups
            </Button>
          </div>
        </div>

        {/* Social Proof Testimonial */}
        <div className="mt-10 sm:mt-20 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <CrazyTestimonial />
        </div>

        {/* Bottom messaging */}
        <div className="text-center mt-8 sm:mt-16 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
          <p className="text-white/80 text-xs sm:text-sm font-inter">
            Join thousands of Ghanaians taking care of their mental health
          </p>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white ${
                    i % 3 === 0 ? 'bg-[#fbbf24]' : i % 3 === 1 ? 'bg-[#f472b6]' : 'bg-[#2563eb]'
                  }`}
                ></div>
              ))}
            </div>
            <span className="text-xs text-white/80 ml-2">2,000+ active users</span>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        /* Blob animations */
        .animate-blob {
          animation: blob 8s infinite ease-in-out alternate;
        }
        @keyframes blob {
          0%, 100% { transform: scale(1) translateY(0); }
          33% { transform: scale(1.1, 0.9) translateY(-10px); }
          66% { transform: scale(0.95, 1.05) translateY(10px); }
        }

        /* Floating animations for trust indicators */
        .animate-float-1 {
          animation: float1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float2 7s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: float3 8s ease-in-out infinite;
        }

        @keyframes float1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% { 
            transform: translateY(-20px) translateX(15px) rotate(2deg);
          }
          66% { 
            transform: translateY(10px) translateX(-10px) rotate(-1deg);
          }
        }

        @keyframes float2 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(15px) translateX(-20px) rotate(-2deg);
          }
          50% { 
            transform: translateY(-25px) translateX(10px) rotate(1deg);
          }
          75% { 
            transform: translateY(5px) translateX(12px) rotate(-1deg);
          }
        }

        @keyframes float3 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          40% { 
            transform: translateY(-18px) translateX(-15px) rotate(2deg);
          }
          80% { 
            transform: translateY(12px) translateX(18px) rotate(-2deg);
          }
        }

        /* Extra floating animations */
        .animate-float-extra-1 {
          animation: floatExtra1 9s ease-in-out infinite;
        }
        .animate-float-extra-2 {
          animation: floatExtra2 11s ease-in-out infinite;
        }
        .animate-float-extra-3 {
          animation: floatExtra3 10s ease-in-out infinite;
        }

        @keyframes floatExtra1 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-25px) translateX(20px) rotate(3deg);
          }
        }

        @keyframes floatExtra2 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          30% { 
            transform: translateY(20px) translateX(-15px) rotate(-2deg);
          }
          70% { 
            transform: translateY(-15px) translateX(25px) rotate(2deg);
          }
        }

        @keyframes floatExtra3 {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          25% { 
            transform: translateY(-10px) translateX(-20px) rotate(-3deg);
          }
          75% { 
            transform: translateY(15px) translateX(10px) rotate(1deg);
          }
        }

        /* Original animations */
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
          transform: scale(0.9);
        }

        .breathe {
          animation: breathe 3s ease-in-out infinite;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default Hero;