/**
 * Resource Service
 * Manages mental health resources and suggestion logic
 */

// Resource categories
const RESOURCE_TYPES = {
  ARTICLES: 'articles',
  COMMUNITY: 'community',
  PROFESSIONAL: 'professional',
  CRISIS: 'crisis'
};

// Resource database
const resources = {
  // Light resources - articles, self-help
  [RESOURCE_TYPES.ARTICLES]: [
    {
      id: 'art-1',
      title: 'Understanding Anxiety: A Beginner\'s Guide',
      description: 'Learn about the common symptoms and coping strategies for anxiety',
      url: 'https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/',
      tags: ['anxiety', 'stress', 'coping', 'beginners']
    },
    {
      id: 'art-2',
      title: 'Family Conflict Resolution Techniques',
      description: 'Practical ways to navigate difficult conversations with family members',
      url: 'https://www.apa.org/topics/families/family-conflict',
      tags: ['family', 'conflict', 'communication', 'relationships']
    },
    {
      id: 'art-3',
      title: 'The Power of Journaling for Mental Health',
      description: 'How writing can help process emotions and improve wellbeing',
      url: 'https://www.health.harvard.edu/healthbeat/writing-about-emotions-may-ease-stress-and-trauma',
      tags: ['journaling', 'self-care', 'emotions', 'stress']
    },
    {
      id: 'art-4',
      description: 'Understanding the signs of depression and when to seek help',
      title: 'Recognizing Depression',
      url: 'https://www.nimh.nih.gov/health/topics/depression',
      tags: ['depression', 'mood', 'symptoms', 'sadness']
    },
    {
      id: 'art-5',
      title: 'Building Healthy Boundaries',
      description: 'Learn how to set and maintain healthy boundaries in relationships',
      url: 'https://psychcentral.com/lib/10-way-to-build-and-preserve-better-boundaries',
      tags: ['boundaries', 'relationships', 'self-care', 'communication']
    }
  ],
  
  // Community support - groups, forums
  [RESOURCE_TYPES.COMMUNITY]: [
    {
      id: 'com-1',
      title: 'Anxiety Support Group - Ghana',
      description: 'A supportive community for Ghanaians dealing with anxiety',
      url: 'https://www.facebook.com/groups/anxietyghana/',
      location: 'Online',
      tags: ['anxiety', 'support group', 'community', 'ghana']
    },
    {
      id: 'com-2',
      title: 'Family Healing Circle',
      description: 'Weekly meetings for those navigating family challenges',
      location: 'Accra - Also available online',
      contact: '+233 20 123 4567',
      tags: ['family', 'healing', 'support group', 'weekly']
    },
    {
      id: 'com-3',
      title: 'MindWell Forum',
      description: 'Online community focused on mental wellness in West Africa',
      url: 'https://www.mindwellafrica.org/forum',
      location: 'Online',
      tags: ['forum', 'community', 'west africa', 'mental wellness']
    },
    {
      id: 'com-4',
      title: 'Young Adults Mental Health Network',
      description: 'Peer support for 18-30 year olds facing mental health challenges',
      location: 'Kumasi & Online',
      contact: '+233 30 567 8901',
      tags: ['young adults', 'peer support', 'youth', 'network']
    }
  ],
  
  // Professional help - therapists, counselors
  [RESOURCE_TYPES.PROFESSIONAL]: [
    {
      id: 'pro-1',
      name: 'Dr. Akosua Mensah',
      title: 'Clinical Psychologist',
      specialties: ['Anxiety', 'Depression', 'Family Therapy'],
      location: 'Accra Mental Wellness Center',
      contact: '+233 24 555 7890',
      languages: ['English', 'Twi'],
      tags: ['professional', 'psychologist', 'accra']
    },
    {
      id: 'pro-2',
      name: 'Kwame Owusu',
      title: 'Licensed Counselor',
      specialties: ['Youth Counseling', 'Relationship Issues', 'Grief'],
      location: 'Tema Community Health Center',
      contact: '+233 27 123 4567',
      languages: ['English', 'Ga', 'Twi'],
      tags: ['professional', 'counselor', 'tema', 'youth']
    },
    {
      id: 'pro-3',
      name: 'Mental Health Association Ghana',
      title: 'Professional Referral Service',
      description: 'Get matched with a mental health professional based on your needs',
      contact: '+233 30 222 6666',
      website: 'https://www.mentalhealthgh.org/find-help',
      tags: ['referral', 'matching', 'professional', 'nationwide']
    }
  ],
  
  // Crisis resources - immediate help
  [RESOURCE_TYPES.CRISIS]: [
    {
      id: 'cri-1',
      name: 'Ghana National Suicide Prevention Helpline',
      contact: '+233 50 626 3030',
      available: '24/7',
      description: 'Immediate support for those in crisis or having thoughts of self-harm',
      tags: ['crisis', 'suicide', 'emergency', 'hotline']
    },
    {
      id: 'cri-2',
      name: 'Mental Health Authority Ghana',
      contact: '+233 30 251 3100',
      available: 'Working hours',
      description: 'Official mental health emergency support',
      tags: ['crisis', 'emergency', 'official', 'support']
    },
    {
      id: 'cri-3',
      name: 'Emergency Services',
      contact: '112',
      available: '24/7',
      description: 'National emergency number for immediate danger',
      tags: ['emergency', 'police', 'ambulance', 'immediate']
    }
  ]
};

/**
 * Conversation stage tracking
 * Used to determine appropriate resource suggestions
 */
const CONVERSATION_STAGES = {
  INITIAL: 'initial',           // 1-2 exchanges
  EXPLORING: 'exploring',       // 3-5 exchanges
  DEVELOPING: 'developing',     // 6-8 exchanges
  ESTABLISHED: 'established'    // 9+ exchanges
};

/**
 * Track conversation metrics to determine suggestion timing
 * @param {Array} chatHistory - Array of message objects
 * @returns {Object} - Conversation metrics
 */
export const analyzeConversationStage = (chatHistory) => {
  // Count user messages to determine conversation depth
  const userMessageCount = chatHistory.filter(msg => msg.role === 'user').length;
  
  // Determine conversation stage based on depth
  let stage = CONVERSATION_STAGES.INITIAL;
  if (userMessageCount >= 9) {
    stage = CONVERSATION_STAGES.ESTABLISHED;
  } else if (userMessageCount >= 6) {
    stage = CONVERSATION_STAGES.DEVELOPING;
  } else if (userMessageCount >= 3) {
    stage = CONVERSATION_STAGES.EXPLORING;
  }
  
  // Extract topics from conversation
  const allText = chatHistory.map(msg => msg.content.toLowerCase()).join(' ');
  const detectedTopics = detectTopics(allText);
  
  // Check for emotional indicators
  const emotionalIntensity = calculateEmotionalIntensity(chatHistory);
  
  return {
    stage,
    messageCount: userMessageCount,
    topics: detectedTopics,
    emotionalIntensity,
    shouldSuggestResources: determineSuggestionTiming(stage, emotionalIntensity, detectedTopics)
  };
};

/**
 * Detect topics in conversation text
 * @param {string} text - Conversation text
 * @returns {Array} - Detected topics
 */
const detectTopics = (text) => {
  const topics = [];
  
  // Topic detection logic
  const topicKeywords = {
    'anxiety': ['anxious', 'worry', 'nervous', 'panic', 'stress', 'anxiousness'],
    'depression': ['sad', 'depressed', 'hopeless', 'empty', 'worthless', 'tired'],
    'family': ['parent', 'mother', 'father', 'brother', 'sister', 'family', 'home'],
    'relationships': ['friend', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'relationship'],
    'self-esteem': ['confidence', 'self-worth', 'value', 'ugly', 'failure', 'not enough'],
    'trauma': ['trauma', 'abuse', 'incident', 'accident', 'attack', 'terrible'],
    'loneliness': ['alone', 'lonely', 'isolated', 'no friends', 'nobody', 'by myself']
  };
  
  // Check for topic keywords in text
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
};

/**
 * Calculate emotional intensity from chat history
 * @param {Array} chatHistory - Array of message objects
 * @returns {string} - Emotional intensity level
 */
const calculateEmotionalIntensity = (chatHistory) => {
  // Only consider user messages
  const userMessages = chatHistory.filter(msg => msg.role === 'user');
  if (userMessages.length === 0) return 'low';
  
  // Look at the last 3 messages or all if fewer
  const recentMessages = userMessages.slice(-3);
  const combinedText = recentMessages.map(msg => msg.content.toLowerCase()).join(' ');
  
  // Check for intensity indicators
  const highIntensityWords = ['always', 'never', 'terrible', 'horrible', 'unbearable', 'can\'t stand', 'hate', 'desperate'];
  const capsCount = (combinedText.match(/[A-Z]{3,}/g) || []).length;
  const exclamationCount = (combinedText.match(/!/g) || []).length;
  const highIntensityWordCount = highIntensityWords.filter(word => combinedText.includes(word)).length;
  
  // Calculate intensity score
  const intensityScore = capsCount * 2 + exclamationCount + highIntensityWordCount * 1.5;
  
  // Determine intensity level
  if (intensityScore > 5) return 'high';
  if (intensityScore > 2) return 'medium';
  return 'low';
};

/**
 * Determine if resources should be suggested based on conversation state
 * @param {string} stage - Conversation stage
 * @param {string} emotionalIntensity - Emotional intensity level
 * @param {Array} topics - Detected topics
 * @returns {Object} - Suggestion decision and type
 */
const determineSuggestionTiming = (stage, emotionalIntensity, topics) => {
  // Crisis topics that should trigger immediate resources
  const crisisTopics = ['suicide', 'self-harm', 'harm', 'kill'];
  
  // Check for crisis topics
  const hasCrisisTopic = topics.some(topic => crisisTopics.includes(topic));
  if (hasCrisisTopic) {
    return { suggest: true, type: RESOURCE_TYPES.CRISIS };
  }
  
  // Suggestion logic based on conversation stage
  switch (stage) {
    case CONVERSATION_STAGES.INITIAL:
      // Too early for most suggestions
      return { suggest: false };
      
    case CONVERSATION_STAGES.EXPLORING:
      // Light resources if emotional intensity is medium or high
      if (emotionalIntensity === 'high' || topics.length >= 2) {
        return { suggest: true, type: RESOURCE_TYPES.ARTICLES };
      }
      return { suggest: false };
      
    case CONVERSATION_STAGES.DEVELOPING:
      // Community resources if topics are present
      if (topics.length > 0) {
        return { suggest: true, type: RESOURCE_TYPES.COMMUNITY };
      }
      return { suggest: false };
      
    case CONVERSATION_STAGES.ESTABLISHED:
      // Professional help for established conversations
      if (emotionalIntensity === 'high' || topics.length >= 2) {
        return { suggest: true, type: RESOURCE_TYPES.PROFESSIONAL };
      }
      // Community resources otherwise
      return { suggest: true, type: RESOURCE_TYPES.COMMUNITY };
      
    default:
      return { suggest: false };
  }
};

/**
 * Get appropriate resources based on conversation analysis
 * @param {Array} chatHistory - Array of message objects
 * @returns {Object} - Suggested resources and presentation format
 */
export const getSuggestedResources = (chatHistory) => {
  // Analyze conversation to determine appropriate resources
  const analysis = analyzeConversationStage(chatHistory);
  
  // If no suggestion needed, return empty
  if (!analysis.shouldSuggestResources.suggest) {
    return { shouldSuggest: false };
  }
  
  // Get resource type to suggest
  const resourceType = analysis.shouldSuggestResources.type;
  
  // Get resources of that type
  let suggestedResources = resources[resourceType] || [];
  
  // Filter resources by relevant topics if possible
  if (analysis.topics.length > 0 && suggestedResources.length > 3) {
    suggestedResources = suggestedResources.filter(resource => {
      // Check if resource tags match any detected topics
      return resource.tags && 
        resource.tags.some(tag => 
          analysis.topics.some(topic => tag.includes(topic) || topic.includes(tag))
        );
    });
  }
  
  // Limit to 3 resources maximum
  suggestedResources = suggestedResources.slice(0, 3);
  
  // Generate appropriate introduction based on resource type
  let introduction = '';
  switch (resourceType) {
    case RESOURCE_TYPES.ARTICLES:
      introduction = "I've noticed we've been talking about this for a bit. Some people find these resources helpful:";
      break;
    case RESOURCE_TYPES.COMMUNITY:
      introduction = "It can help to connect with others who understand what you're going through. Here are some communities that might be supportive:";
      break;
    case RESOURCE_TYPES.PROFESSIONAL:
      introduction = "Given what you've shared, you might benefit from speaking with a professional who specializes in this area:";
      break;
    case RESOURCE_TYPES.CRISIS:
      introduction = "I'm concerned about what you're sharing. It's really important to talk to someone who can help right away:";
      break;
  }
  
  return {
    shouldSuggest: true,
    introduction,
    resources: suggestedResources,
    type: resourceType
  };
};

/**
 * Format resources for display in chat
 * @param {Array} resources - Resources to format
 * @param {string} resourceType - Type of resources
 * @returns {string} - Formatted resource text
 */
export const formatResourcesForDisplay = (resources, resourceType) => {
  if (!resources || resources.length === 0) return '';
  
  let formattedText = '';
  
  switch (resourceType) {
    case RESOURCE_TYPES.ARTICLES:
      formattedText = resources.map(resource => 
        `• ${resource.title}: ${resource.description} [${resource.url}]`
      ).join('\n\n');
      break;
      
    case RESOURCE_TYPES.COMMUNITY:
      formattedText = resources.map(resource => 
        `• ${resource.title}: ${resource.description} ${resource.location ? `(${resource.location})` : ''} ${resource.contact ? `- Contact: ${resource.contact}` : ''} ${resource.url ? `[${resource.url}]` : ''}`
      ).join('\n\n');
      break;
      
    case RESOURCE_TYPES.PROFESSIONAL:
      formattedText = resources.map(resource => 
        `• ${resource.name}, ${resource.title}: ${resource.specialties ? resource.specialties.join(', ') : ''} ${resource.location ? `(${resource.location})` : ''} - Contact: ${resource.contact}`
      ).join('\n\n');
      break;
      
    case RESOURCE_TYPES.CRISIS:
      formattedText = resources.map(resource => 
        `• ${resource.name}: ${resource.contact} (${resource.available})`
      ).join('\n\n');
      break;
  }
  
  return formattedText;
};

// Export resource types for use elsewhere
export const RESOURCE_CATEGORIES = RESOURCE_TYPES;