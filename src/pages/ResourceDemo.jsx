import React, { useState } from 'react';
import { getSuggestedResources, RESOURCE_CATEGORIES } from '../services/resourceService';
import ResourceSuggestion from '../components/ResourceSuggestion';

/**
 * Demo page to showcase the resource suggestion system
 */
const ResourceDemo = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How are you feeling today? I\'m here to listen and help.' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [resourceSuggestion, setResourceSuggestion] = useState(null);
  const [conversationStage, setConversationStage] = useState('initial');
  const [emotionalIntensity, setEmotionalIntensity] = useState('low');
  const [detectedTopics, setDetectedTopics] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message
    const newUserMessage = { role: 'user', content: userInput };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    // Get resource suggestions
    const suggestion = getSuggestedResources(updatedMessages);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { 
        role: 'assistant', 
        content: getSimulatedResponse(userInput),
        resourceSuggestion: suggestion.shouldSuggest ? suggestion : null
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setResourceSuggestion(suggestion);
      
      // Update demo state
      const analysis = suggestion.analysis || {};
      setConversationStage(analysis.stage || getStageFromMessageCount(updatedMessages.length));
      setEmotionalIntensity(analysis.emotionalIntensity || emotionalIntensity);
      setDetectedTopics(analysis.topics || detectTopicsFromMessage(userInput));
    }, 1000);
    
    setUserInput('');
  };

  const getSimulatedResponse = (message) => {
    const responses = [
      "Thank you for sharing that with me. Can you tell me more about how that made you feel?",
      "I understand this is difficult. What do you think would help in this situation?",
      "That sounds really challenging. How long have you been feeling this way?",
      "I appreciate you opening up about this. Have you talked to anyone else about it?",
      "I'm here to listen. What would be most helpful for you right now?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getStageFromMessageCount = (count) => {
    const userMessageCount = Math.floor(count / 2);
    if (userMessageCount >= 9) return 'established';
    if (userMessageCount >= 6) return 'developing';
    if (userMessageCount >= 3) return 'exploring';
    return 'initial';
  };

  const detectTopicsFromMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    const topics = [];
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('stress')) {
      topics.push('anxiety');
    }
    if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('down')) {
      topics.push('depression');
    }
    if (lowerMessage.includes('family') || lowerMessage.includes('parent') || lowerMessage.includes('mom') || lowerMessage.includes('dad')) {
      topics.push('family');
    }
    if (lowerMessage.includes('friend') || lowerMessage.includes('relationship') || lowerMessage.includes('partner')) {
      topics.push('relationships');
    }
    
    return topics;
  };

  const handleForceResourceType = (type) => {
    const forcedSuggestion = {
      shouldSuggest: true,
      introduction: `This is a demonstration of ${type} resources:`,
      resources: getSampleResources(type),
      type: type
    };
    
    setResourceSuggestion(forcedSuggestion);
  };

  const getSampleResources = (type) => {
    switch (type) {
      case RESOURCE_CATEGORIES.ARTICLES:
        return [
          {
            id: 'art-demo-1',
            title: 'Understanding Anxiety: A Beginner\'s Guide',
            description: 'Learn about the common symptoms and coping strategies for anxiety',
            url: '#demo-link'
          },
          {
            id: 'art-demo-2',
            title: 'Family Conflict Resolution Techniques',
            description: 'Practical ways to navigate difficult conversations with family members',
            url: '#demo-link'
          }
        ];
      case RESOURCE_CATEGORIES.COMMUNITY:
        return [
          {
            id: 'com-demo-1',
            title: 'Anxiety Support Group - Ghana',
            description: 'A supportive community for Ghanaians dealing with anxiety',
            url: '#demo-link',
            location: 'Online'
          },
          {
            id: 'com-demo-2',
            title: 'Family Healing Circle',
            description: 'Weekly meetings for those navigating family challenges',
            location: 'Accra - Also available online',
            contact: '+233 20 123 4567'
          }
        ];
      case RESOURCE_CATEGORIES.PROFESSIONAL:
        return [
          {
            id: 'pro-demo-1',
            name: 'Dr. Akosua Mensah',
            title: 'Clinical Psychologist',
            specialties: ['Anxiety', 'Depression', 'Family Therapy'],
            location: 'Accra Mental Wellness Center',
            contact: '+233 24 555 7890',
            languages: ['English', 'Twi']
          },
          {
            id: 'pro-demo-2',
            name: 'Kwame Owusu',
            title: 'Licensed Counselor',
            specialties: ['Youth Counseling', 'Relationship Issues', 'Grief'],
            location: 'Tema Community Health Center',
            contact: '+233 27 123 4567'
          }
        ];
      case RESOURCE_CATEGORIES.CRISIS:
        return [
          {
            id: 'cri-demo-1',
            name: 'Ghana National Suicide Prevention Helpline',
            contact: '+233 50 626 3030',
            available: '24/7',
            description: 'Immediate support for those in crisis or having thoughts of self-harm'
          },
          {
            id: 'cri-demo-2',
            name: 'Mental Health Authority Ghana',
            contact: '+233 30 251 3100',
            available: 'Working hours',
            description: 'Official mental health emergency support'
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 bg-blue-800 text-white">
          <h1 className="text-2xl font-bold">MindCare Resource Suggestion Demo</h1>
          <p>Test how the system suggests different resources based on conversation context</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Chat Area */}
          <div className="md:col-span-2 p-4">
            <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                    
                    {msg.resourceSuggestion && (
                      <div className="mt-3">
                        <ResourceSuggestion suggestion={msg.resourceSuggestion} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
          
          {/* Control Panel */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Resource Demo Controls</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Conversation Stage:</h3>
              <div className="text-sm bg-white p-2 rounded border mt-1">
                {conversationStage} (Messages: {messages.filter(m => m.role === 'user').length})
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Emotional Intensity:</h3>
              <select 
                value={emotionalIntensity}
                onChange={(e) => setEmotionalIntensity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Detected Topics:</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {detectedTopics.length > 0 ? (
                  detectedTopics.map((topic, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No topics detected</span>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Force Resource Type:</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button 
                  onClick={() => handleForceResourceType(RESOURCE_CATEGORIES.ARTICLES)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  Articles
                </button>
                <button 
                  onClick={() => handleForceResourceType(RESOURCE_CATEGORIES.COMMUNITY)}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded text-sm"
                >
                  Community
                </button>
                <button 
                  onClick={() => handleForceResourceType(RESOURCE_CATEGORIES.PROFESSIONAL)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm"
                >
                  Professional
                </button>
                <button 
                  onClick={() => handleForceResourceType(RESOURCE_CATEGORIES.CRISIS)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded text-sm"
                >
                  Crisis
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Suggestion Tips:</h3>
              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                <li>• Use words like "anxious", "worried", or "stressed" to trigger anxiety topics</li>
                <li>• Mention "family", "parents", etc. for family-related resources</li>
                <li>• Send multiple messages to advance conversation stages</li>
                <li>• Use ALL CAPS and exclamation marks!!! for high intensity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDemo;