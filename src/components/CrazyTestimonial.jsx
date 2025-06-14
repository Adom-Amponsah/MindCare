import React, { useState, useEffect } from 'react';
import { Star, Quote, Heart, MessageCircle, Sparkles } from 'lucide-react';

const CrazyTestimonial = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  const testimonials = [
    {
      text: "MindCare helps me feel better, no judgment. The AI connects me with people who understand me",
      author: "Kofi",
      age: 22,
      location: "Accra",
      avatar: "A",
      color: "from-[#fbbf24] to-[#f472b6]",
      bgColor: "bg-[#fbbf24]",
    //   lang: "🇬🇭"
    },
    {
      text: "I fit talk my heart out for here. E no go judge me at all!",
      author: "Adom",
      age: 28,
      location: "Kumasi",
      avatar: "K",
      color: "from-[#f472b6] to-[#2563eb]",
      bgColor: "bg-[#f472b6]",
    //   lang: "🇬🇭"
    },
    {
      text: "Finally, someone wey understand how we dey feel for here. Big ups!",
      author: "Yaw",
      age: 25,
      location: "Takoradi",
      avatar: "E",
      color: "from-[#2563eb] to-[#10b981]",
      bgColor: "bg-[#2563eb]",
    //   lang: "🇬🇭"
    }
  ];

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 10
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Auto-rotate testimonials - always active
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 20000); // Changes every 4 seconds
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const current = testimonials[currentTestimonial];

  return (
    <div className="mt-20 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-20 animate-float-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              background: `linear-gradient(45deg, #fbbf24, #f472b6, #2563eb)`
            }}
          />
        ))}
      </div>

      {/* Main testimonial container */}
      <div 
        className="relative z-10 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Morphing background blob */}
        <div className="absolute inset-0 -m-8 opacity-20 animate-morph-blob">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <path
              d="M47.1,-78.7C59.9,-69.2,68.5,-53.3,75.8,-36.6C83.1,-19.9,89.1,-2.4,86.8,14.3C84.5,31,74,47,60.8,59.7C47.6,72.4,31.8,81.8,14.2,83.9C-3.4,86,-22.8,80.8,-39.7,71.4C-56.6,62,-71,48.4,-78.9,31.4C-86.8,14.4,-88.2,-6,-83.1,-24.4C-78,-42.8,-66.4,-59.2,-51.4,-67.9C-36.4,-76.6,-18.2,-77.6,0.6,-78.5C19.4,-79.4,38.8,-80.2,47.1,-78.7Z"
              fill="url(#blobGradient)"
            />
          </svg>
        </div>

        {/* Glowing rings */}
        <div className="absolute inset-0 -m-4">
          <div className="w-full h-full rounded-full border-2 border-[#fbbf24]/30 animate-pulse-ring"></div>
          <div className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] rounded-full border border-[#f472b6]/40 animate-pulse-ring-delayed"></div>
        </div>

        {/* Main testimonial card */}
        <div className={`relative bg-gradient-to-br from-white/95 via-white/90 to-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl border border-white/50 transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 ${isHovered ? 'animate-float-intense' : 'animate-float-gentle'}`}>
          
          {/* Floating quote icon */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#fbbf24] to-[#f472b6] rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
            <Quote className="w-6 h-6 text-white" />
          </div>

          {/* Sparkle effects */}
          <div className="absolute top-4 right-4 animate-spin-slow">
            <Sparkles className="w-6 h-6 text-[#fbbf24]" />
          </div>
          <div className="absolute bottom-4 left-4 animate-spin-slow" style={{animationDelay: '1s'}}>
            <Sparkles className="w-4 h-4 text-[#f472b6]" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Stars rating */}
            <div className="flex items-center justify-center mb-6 space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-6 h-6 ${i < 5 ? 'text-[#fbbf24] fill-current' : 'text-gray-300'} animate-star-twinkle`}
                  style={{animationDelay: `${i * 0.1}s`}}
                />
              ))}
            </div>

            {/* Testimonial text with typewriter effect */}
            <div className="text-center mb-8">
              <p className="text-[#2563eb] font-inter text-xl leading-relaxed font-medium relative">
                <span className="inline-block animate-text-reveal">
                  "{current.text}"
                </span>
              </p>
            </div>

            {/* Author section */}
            <div className="flex items-center justify-center space-x-6">
              {/* Avatar with morphing border */}
              <div className="relative">
                <div className={`w-20 h-20 bg-gradient-to-br ${current.color} rounded-full flex items-center justify-center shadow-xl transform transition-all duration-500 group-hover:scale-110 animate-avatar-pulse`}>
                  <span className="text-white font-bold text-2xl">{current.avatar}</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-border-rotate"></div>
                {/* Floating hearts */}
                <Heart className="absolute -top-2 -right-2 w-5 h-5 text-[#f472b6] animate-heart-float" />
              </div>

              {/* Author info */}
              <div className="text-center">
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <h4 className="text-[#2563eb] font-bold text-xl">{current.author}</h4>
                  <span className="text-2xl animate-bounce" style={{animationDelay: '0.5s'}}></span>
                </div>
                <div className="text-[#2563eb]/80 text-sm space-y-1">
                  <p className="font-medium">Age {current.age}</p>
                  <p className="text-xs">{current.location}</p>
                </div>
              </div>
            </div>

            {/* Navigation dots - now just visual indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentTestimonial 
                      ? `${current.bgColor} shadow-lg scale-125 animate-pulse` 
                      : 'bg-gray-300/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-[#fbbf24] via-[#f472b6] to-[#2563eb] rounded-full filter blur-xl opacity-30 animate-glow-pulse"></div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px) rotate(90deg); opacity: 0.4; }
          50% { transform: translateY(-10px) translateX(-15px) rotate(180deg); opacity: 0.6; }
          75% { transform: translateY(-25px) translateX(5px) rotate(270deg); opacity: 0.3; }
        }

        @keyframes morph-blob {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(90deg); }
          50% { transform: scale(0.9) rotate(180deg); }
          75% { transform: scale(1.05) rotate(270deg); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(1.1); opacity: 0; }
        }

        @keyframes pulse-ring-delayed {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }

        @keyframes float-intense {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1.05); }
          25% { transform: translateY(-15px) rotate(2deg) scale(1.06); }
          50% { transform: translateY(-5px) rotate(-1deg) scale(1.07); }
          75% { transform: translateY(-20px) rotate(1deg) scale(1.05); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes star-twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        @keyframes text-reveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes avatar-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 0 20px rgba(251, 191, 36, 0); }
        }

        @keyframes border-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes heart-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.2); }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .animate-float-particle { animation: float-particle 15s infinite linear; }
        .animate-morph-blob { animation: morph-blob 20s infinite ease-in-out; }
        .animate-pulse-ring { animation: pulse-ring 3s infinite; }
        .animate-pulse-ring-delayed { animation: pulse-ring-delayed 3s infinite 0.5s; }
        .animate-float-gentle { animation: float-gentle 6s infinite ease-in-out; }
        .animate-float-intense { animation: float-intense 4s infinite ease-in-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s infinite linear; }
        .animate-star-twinkle { animation: star-twinkle 2s infinite ease-in-out; }
        .animate-text-reveal { animation: text-reveal 1s ease-out; }
        .animate-avatar-pulse { animation: avatar-pulse 2s infinite; }
        .animate-border-rotate { animation: border-rotate 10s infinite linear; }
        .animate-heart-float { animation: heart-float 2s infinite ease-in-out; }
        .animate-glow-pulse { animation: glow-pulse 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default CrazyTestimonial;