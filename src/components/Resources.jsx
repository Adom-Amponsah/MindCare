import React from 'react';
import { Users, Phone, MapPin, Calendar, ExternalLink } from 'lucide-react';

const ResourceCard = ({ title, description, icon, link, linkText, tags }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-white hover:bg-white/20 transition-all shadow-glow-sm">
      <div className="flex items-start">
        <div className="bg-[#fbbf24]/20 p-3 rounded-full mr-4">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-white/80 mb-4">{description}</p>
          
          {tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-white/20 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-[#fbbf24] hover:underline"
            >
              {linkText || 'Learn more'} <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Resources = () => {
  const supportGroups = [
    {
      title: 'Accra Mental Health Support Group',
      description: 'Weekly meetings for anyone dealing with anxiety, depression, or stress.',
      icon: <Users className="w-6 h-6 text-[#fbbf24]" />,
      link: '#',
      linkText: 'Join group',
      tags: ['Anxiety', 'Depression', 'Weekly']
    },
    {
      title: 'Youth Wellness Circle',
      description: 'A safe space for young adults (18-25) to discuss mental health challenges.',
      icon: <Users className="w-6 h-6 text-[#fbbf24]" />,
      link: '#',
      linkText: 'Join group',
      tags: ['Youth', 'Bi-weekly']
    },
    {
      title: 'Professional Stress Management',
      description: 'For working professionals dealing with burnout and work-related stress.',
      icon: <Users className="w-6 h-6 text-[#fbbf24]" />,
      link: '#',
      linkText: 'Join group',
      tags: ['Burnout', 'Stress', 'Monthly']
    }
  ];

  const emergencyContacts = [
    {
      title: 'National Crisis Helpline',
      description: 'Available 24/7 for immediate mental health support.',
      icon: <Phone className="w-6 h-6 text-[#f472b6]" />,
      link: 'tel:+233000000000',
      linkText: 'Call now'
    },
    {
      title: 'Mental Health Authority',
      description: 'Government agency providing mental health resources and referrals.',
      icon: <Phone className="w-6 h-6 text-[#f472b6]" />,
      link: 'tel:+233000000000',
      linkText: 'Call for information'
    }
  ];

  const localClinics = [
    {
      title: 'Accra Community Mental Health Center',
      description: 'Affordable therapy and counseling services.',
      icon: <MapPin className="w-6 h-6 text-[#2563eb]" />,
      link: 'https://maps.google.com',
      linkText: 'Get directions'
    },
    {
      title: 'University of Ghana Counseling Center',
      description: 'Services for students and the general public.',
      icon: <MapPin className="w-6 h-6 text-[#2563eb]" />,
      link: 'https://maps.google.com',
      linkText: 'Get directions'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Mental Health Awareness Workshop',
      description: 'Free workshop on recognizing and managing anxiety.',
      icon: <Calendar className="w-6 h-6 text-[#2563eb]" />,
      link: '#',
      linkText: 'Register',
      tags: ['Free', 'Workshop']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">Mental Health Resources</h1>
        <p className="text-white/80 text-center max-w-2xl mx-auto mb-12">
          Connect with support groups, professional help, and crisis services in Ghana.
        </p>

        <div className="space-y-12">
          {/* Support Groups */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-[#fbbf24]" /> Support Groups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportGroups.map((group, index) => (
                <ResourceCard key={index} {...group} />
              ))}
            </div>
          </section>

          {/* Emergency Contacts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Phone className="w-6 h-6 mr-2 text-[#f472b6]" /> Crisis Support
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <ResourceCard key={index} {...contact} />
              ))}
            </div>
          </section>

          {/* Local Clinics */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-[#2563eb]" /> Local Clinics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localClinics.map((clinic, index) => (
                <ResourceCard key={index} {...clinic} />
              ))}
            </div>
          </section>

          {/* Upcoming Events */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-[#2563eb]" /> Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <ResourceCard key={index} {...event} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resources; 