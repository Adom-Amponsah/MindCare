// ADVANCED HUMAN-LIKE AI COUNSELOR - CULTURALLY AWARE MENTAL HEALTH SUPPORT
// Built for Ghanaian context with medical and spiritual support integration

// Get API token from environment variables
const API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;

// Model configuration
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

// Enhanced conversation state management with cultural context
let conversationContext = {
  emotionalTone: 'neutral',
  keyTopics: [],
  responseHistory: [],
  userMood: 'unknown',
  engagementMetrics: {
    topicsExplored: new Set(),
    emotionalDepth: 0, // Tracks how deeply we've explored emotions
    userOpenness: 0, // Measures how much the user is sharing
    readinessForHelp: 0, // Tracks user's receptiveness to professional help
    crisisIndicators: [], // Tracks any concerning patterns
    lastTopicResolution: null, // Tracks if we've properly explored current topic
    spiritualContext: null, // Tracks spiritual beliefs/preferences
    culturalContext: {
      language: 'en', // Support for local languages
      region: null,  // Track user's region for local resource matching
      beliefs: []    // Understanding of cultural/spiritual beliefs
    },
    patternTracker: {
      loneliness: { count: 0, lastTriggered: null },
      sadness: { count: 0, lastTriggered: null },
      crisis: { count: 0, lastTriggered: null }
    }
  },
  sessionStage: 'initial', // initial, exploring, deepening, ready_for_referral
  sentimentHistory: [] // Track sentiment over time
};

// Expanded crisis detection patterns
const crisisDetectionPatterns = {
  immediate_risk: {
    keywords: [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'harm myself', 'hurt myself', 'self harm',
      'no reason to live', 'better off dead', 'can\'t go on',
      'i wish i could disappear', 'i want to disappear', 'i want to vanish',
      'i don\'t want to be here', 'i want to stop existing',
      'i want to go away forever', 'i want to sleep forever',
      'i want to never wake up', 'i want to be gone',
      'i want to leave this world', 'i want to check out',
      'i want to stop feeling', 'i want to stop hurting',
      'i want to stop the pain', 'i want to stop suffering',
      'i want to stop', 'i want to give up',
      'i want to disappear completely', 'i want to vanish completely',
      'i want to be invisible', 'i want to not be seen',
      'i want to not be found', 'i want to not be noticed',
      'i want to not be around', 'i want to not be alive',
      'i want to not exist anymore', 'i want to not feel anymore',
      'i want to not think anymore', 'i want to not remember',
      'i want to not care anymore', 'i want to not try anymore',
      'i want to not fight anymore', 'i want to not struggle anymore',
      'i want to not hurt anymore', 'i want to not cry anymore',
      'i want to not suffer anymore', 'i want to not be in pain anymore',
      'i want to not be sad anymore', 'i want to not be tired anymore',
      'i want to not be stressed anymore', 'i want to not be anxious anymore',
      'i want to not be depressed anymore', 'i want to not be lonely anymore',
      'i want to not be afraid anymore', 'i want to not be angry anymore',
      'i want to not be frustrated anymore', 'i want to not be overwhelmed anymore',
      'i want to not be hopeless anymore', 'i want to not be helpless anymore',
      'i want to not be worthless anymore', 'i want to not be useless anymore',
      'i want to not be a burden anymore', 'i want to not be a problem anymore',
      'i want to not be a failure anymore', 'i want to not be a disappointment anymore',
      'i want to not be a mistake anymore', 'i want to not be a regret anymore',
      'i want to not be a memory anymore', 'i want to not be a thought anymore',
      'i want to not be a feeling anymore', 'i want to not be a person anymore',
      'i want to not be a human anymore', 'i want to not be a soul anymore',
      'i want to not be a spirit anymore', 'i want to not be a being anymore',
      'i want to not be a life anymore', 'i want to not be a story anymore',
      'i want to not be a dream anymore', 'i want to not be a hope anymore',
      'i want to not be a wish anymore', 'i want to not be a desire anymore',
      'i want to not be a need anymore', 'i want to not be a want anymore',
      'i want to not be a goal anymore', 'i want to not be a plan anymore',
      'i want to not be a future anymore', 'i want to not be a past anymore',
      'i want to not be a present anymore', 'i want to not be a now anymore',
      'i want to not be a then anymore', 'i want to not be a when anymore',
      'i want to not be a where anymore', 'i want to not be a why anymore',
      'i want to not be a how anymore', 'i want to not be a what anymore',
      'i want to not be a who anymore', 'i want to not be a which anymore',
      'i want to not be a whose anymore', 'i want to not be a whom anymore',
      'i want to not be a whomever anymore', 'i want to not be a whoever anymore',
      'i want to not be a whatever anymore', 'i want to not be a whenever anymore',
      'i want to not be a wherever anymore', 'i want to not be a however anymore',
      'i want to not be a whenever anymore', 'i want to not be a wherever anymore',
      'i want to not be a however anymore',
    ],
    twi: [
      'me p? s? me wu', 'medi me ho awu',
      'menp? s? metena ase', 'mep? s? metena ase'
    ],
    pidgin: [
      'i wan die', 'i no wan live', 'i fit kill myself', 'i dey tire for life',
      'i wan disappear', 'i wan vanish', 'i no wan dey here', 'i wan commot',
      'i no wan exist', 'i wan sleep forever', 'i no wan wake up',
      'i wan go away', 'i wan end am', 'i wan stop to dey feel',
      'i wan stop to dey suffer', 'i wan stop to dey try',
      'i wan stop to dey struggle', 'i wan stop to dey hurt',
      'i wan stop to dey cry', 'i wan stop to dey pain',
      'i wan stop to dey sad', 'i wan stop to dey tired',
      'i wan stop to dey stressed', 'i wan stop to dey anxious',
      'i wan stop to dey depressed', 'i wan stop to dey lonely',
      'i wan stop to dey afraid', 'i wan stop to dey angry',
      'i wan stop to dey frustrated', 'i wan stop to dey overwhelmed',
      'i wan stop to dey hopeless', 'i wan stop to dey helpless',
      'i wan stop to dey worthless', 'i wan stop to dey useless',
      'i wan stop to dey burden', 'i wan stop to dey problem',
      'i wan stop to dey failure', 'i wan stop to dey disappointment',
      'i wan stop to dey mistake', 'i wan stop to dey regret',
      'i wan stop to dey memory', 'i wan stop to dey thought',
      'i wan stop to dey feeling', 'i wan stop to dey person',
      'i wan stop to dey human', 'i wan stop to dey soul',
      'i wan stop to dey spirit', 'i wan stop to dey being',
      'i wan stop to dey life', 'i wan stop to dey story',
      'i wan stop to dey dream', 'i wan stop to dey hope',
      'i wan stop to dey wish', 'i wan stop to dey desire',
      'i wan stop to dey need', 'i wan stop to dey want',
      'i wan stop to dey goal', 'i wan stop to dey plan',
      'i wan stop to dey future', 'i wan stop to dey past',
      'i wan stop to dey present', 'i wan stop to dey now',
      'i wan stop to dey then', 'i wan stop to dey when',
      'i wan stop to dey where', 'i wan stop to dey why',
      'i wan stop to dey how', 'i wan stop to dey what',
      'i wan stop to dey who', 'i wan stop to dey which',
      'i wan stop to dey whose', 'i wan stop to dey whom',
      'i wan stop to dey whomever', 'i wan stop to dey whoever',
      'i wan stop to dey whatever', 'i wan stop to dey whenever',
      'i wan stop to dey wherever', 'i wan stop to dey however',
    ],
    ga: [
      'mɛtsɔ mli', 'mɛtsɔ mli kɛ', 'mɛtsɔ mli gbɛ', 'mɛtsɔ mli wɔ',
      'mɛtsɔ mli yɛ', 'mɛtsɔ mli yɛ gbɛ', 'mɛtsɔ mli yɛ wɔ',
      'mɛtsɔ mli yɛ kɛ', 'mɛtsɔ mli yɛ yɛ', 'mɛtsɔ mli yɛ yɛ gbɛ',
      'mɛtsɔ mli yɛ yɛ wɔ', 'mɛtsɔ mli yɛ yɛ kɛ',
    ],
    contextual: [
      'spirits haunting me', 'cursed', 'no peace',
      'voices telling me', 'evil spirits'
    ]
  },
  spiritual_distress: {
    keywords: [
      'cursed', 'spiritual attack', 'witchcraft',
      'evil eye', 'bad spirit', 'haunted',
      'ancestral curse', 'spiritual problem'
    ]
  },
  cultural_pressure: {
    keywords: [
      'family name', 'bring shame', 'community will judge',
      'elders disapprove', 'against our culture',
      'what will people say'
    ]
  }
};

// Resource categories with cultural sensitivity
const supportResources = {
  immediate_crisis: {
    hotlines: [
      {
        name: "Ghana National Suicide Prevention Helpline",
        contact: "+233 50 626 3030",
        available: "24/7",
        languages: ["English", "Twi"]
      }
    ],
    emergency: [
      {
        name: "Mental Health Authority Ghana",
        contact: "+233 30 251 3100",
        available: "24/7",
        type: "Emergency Response"
      }
    ]
  },
  spiritual_support: {
    christian: [
      {
        name: "Christian Counseling Network Ghana",
        contact: "+233 XX XXX XXXX",
        type: "Faith-based Counseling"
      }
    ],
    traditional: [
      {
        name: "Cultural Healing Center",
        contact: "+233 XX XXX XXXX",
        type: "Traditional Support"
      }
    ],
    islamic: [
      {
        name: "Islamic Counseling Services",
        contact: "+233 XX XXX XXXX",
        type: "Faith-based Counseling"
      }
    ]
  },
  professional_help: {
    medical: [
      {
        name: "Ghana Psychological Association",
        contact: "+233 XX XXX XXXX",
        type: "Professional Counseling"
      }
    ],
    community: [
      {
        name: "Community Mental Health Support",
        contact: "+233 XX XXX XXXX",
        type: "Community Support"
      }
    ]
  }
};

import { getSuggestedResources } from './resourceService';

/**
 * Advanced conversation analyzer to understand context and mood
 */
const analyzeConversation = (userMessage, history = []) => {
  const message = userMessage.toLowerCase();
  
  // Detect emotional state
  const emotions = {
    frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'pissed'],
    sad: ['sad', 'depressed', 'down', 'hurt', 'broken'],
    anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared'],
    lonely: ['alone', 'lonely', 'isolated', 'nobody', 'empty'],
    hopeless: ['hopeless', 'pointless', 'useless', 'worthless', 'give up']
  };
  
  let dominantEmotion = 'neutral';
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      dominantEmotion = emotion;
      break;
    }
  }
  
  // Enhanced topic extraction
  const topics = [];
  const topicKeywords = {
    family: ['parent', 'mom', 'dad', 'sister', 'brother', 'family'],
    relationships: ['friend', 'relationship', 'partner', 'boyfriend', 'girlfriend'],
    work: ['school', 'work', 'job', 'career', 'study'],
    selfEsteem: ['worthless', 'stupid', 'failure', 'cant do anything', 'not good enough'],
    trauma: ['abuse', 'hurt', 'traumatic', 'incident', 'happened to me'],
    identity: ['who am i', 'purpose', 'meaning', 'lost', 'direction']
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      topics.push(topic);
      conversationContext.engagementMetrics.topicsExplored.add(topic);
    }
  }

  // Measure user openness
  const opennessCues = [
    message.length > 100, // Longer messages
    message.includes('feel'),
    message.includes('think'),
    message.includes('because'),
    message.includes('remember'),
    topics.length > 0
  ];
  
  const opennessScore = opennessCues.filter(Boolean).length;
  conversationContext.engagementMetrics.userOpenness = 
    Math.min(10, conversationContext.engagementMetrics.userOpenness + opennessScore);

  // Assess emotional depth
  if (dominantEmotion !== 'neutral') {
    conversationContext.engagementMetrics.emotionalDepth += 1;
  }

  // Check readiness for professional help
  const helpReadinessCues = [
    message.includes('help'),
    message.includes('therapy'),
    message.includes('professional'),
    message.includes('advice'),
    message.includes('what should i do'),
    conversationContext.engagementMetrics.emotionalDepth > 5
  ];

  const readinessScore = helpReadinessCues.filter(Boolean).length;
  conversationContext.engagementMetrics.readinessForHelp = 
    Math.min(10, conversationContext.engagementMetrics.readinessForHelp + readinessScore);

  // Update session stage based on engagement
  updateSessionStage();
  
  return {
    emotion: dominantEmotion,
    topics: topics,
    intensity: getEmotionalIntensity(message),
    needsValidation: message.includes('childish') || message.includes('immature') || message.includes('stupid'),
    engagementLevel: {
      openness: conversationContext.engagementMetrics.userOpenness,
      emotionalDepth: conversationContext.engagementMetrics.emotionalDepth,
      readinessForHelp: conversationContext.engagementMetrics.readinessForHelp
    }
  };
};

/**
 * Update the session stage based on engagement metrics
 */
const updateSessionStage = () => {
  const metrics = conversationContext.engagementMetrics;
  
  if (metrics.emotionalDepth > 7 && metrics.readinessForHelp > 7) {
    conversationContext.sessionStage = 'ready_for_referral';
  } else if (metrics.emotionalDepth > 4 && metrics.userOpenness > 6) {
    conversationContext.sessionStage = 'deepening';
  } else if (metrics.userOpenness > 3) {
    conversationContext.sessionStage = 'exploring';
  } else {
    conversationContext.sessionStage = 'initial';
  }
};

/**
 * Measure emotional intensity of the message
 */
const getEmotionalIntensity = (message) => {
  const intensifiers = ['really', 'very', 'extremely', 'so', 'always', 'never', 'constantly'];
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  const intensifierCount = intensifiers.filter(word => message.toLowerCase().includes(word)).length;
  
  if (capsCount > 5 || intensifierCount > 2) return 'high';
  if (intensifierCount > 0 || message.includes('!')) return 'medium';
  return 'low';
};

/**
 * Generate contextually aware response starters
 */
const getContextualOpener = (analysis) => {
  const { emotion, intensity, needsValidation } = analysis;
  const stage = conversationContext.sessionStage;
  
  // Avoid repetition - track what we've used
  if (!conversationContext.responseHistory) conversationContext.responseHistory = [];
  
  let openers = [];
  
  // Stage-appropriate responses
  switch(stage) {
    case 'initial':
      openers = [
        "I'm here to listen and understand what you're going through.",
        "Thank you for sharing that with me.",
        "I appreciate you opening up about this.",
        "I can tell this isn't easy to talk about."
      ];
      break;
    
    case 'exploring':
    switch (emotion) {
      case 'frustrated':
        openers = [
            "That level of frustration makes so much sense given what you're dealing with.",
            "I can really hear the frustration in what you're sharing.",
            "It's completely understandable to feel frustrated about this."
        ];
        break;
      case 'sad':
        openers = [
            "The sadness in your words really comes through.",
            "That sounds incredibly painful to deal with.",
            "I can feel how much this is affecting you."
        ];
        break;
      case 'lonely':
        openers = [
            "That sense of loneliness you're describing sounds really heavy.",
            "It must be so hard feeling this disconnected.",
            "Feeling alone like this can be really overwhelming."
        ];
        break;
      default:
        openers = [
            "I'm really trying to understand your experience.",
            "The way you describe this helps me understand better.",
            "Thank you for helping me understand what this is like for you."
          ];
      }
      break;
    
    case 'deepening':
    if (needsValidation) {
      openers = [
          "Your feelings about this are completely valid.",
          "I want you to know that your reaction makes perfect sense.",
          "Anyone in your situation would feel this way.",
          "These feelings you're having are so important to acknowledge."
      ];
    } else {
        openers = [
          "As we talk more, I'm understanding better how this affects you.",
          "The more you share, the more I see how complex this situation is.",
          "I'm noticing how many layers there are to what you're experiencing."
        ];
      }
      break;
    
    case 'ready_for_referral':
      openers = [
        "I really value how open you've been about all of this.",
        "You've shared so much about your experience.",
        "We've explored a lot together, and I'm wondering something.",
        "Given everything you've shared, I have a thought I'd like to offer."
      ];
      break;
  }
  
  // Filter out recently used openers
  const availableOpeners = openers.filter(opener => 
    !conversationContext.responseHistory.includes(opener)
  );
  
  const selectedOpener = availableOpeners.length > 0 
    ? availableOpeners[Math.floor(Math.random() * availableOpeners.length)]
    : openers[Math.floor(Math.random() * openers.length)];
  
  // Track usage
  conversationContext.responseHistory.push(selectedOpener);
  if (conversationContext.responseHistory.length > 5) {
    conversationContext.responseHistory.shift();
  }
  
  return selectedOpener;
};

/**
 * Generate follow-up questions that dig deeper
 */
const getFollowUpQuestion = (analysis, userMessage) => {
  const { emotion, topics, needsValidation } = analysis;
  const stage = conversationContext.sessionStage;
  const metrics = conversationContext.engagementMetrics;
  
  // Stage-appropriate questions
  if (stage === 'initial') {
    const questions = [
      "Could you tell me more about what brought this up for you?",
      "What made you want to talk about this today?",
      "How long have you been feeling this way?",
      "What's on your mind as you share this with me?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  if (stage === 'exploring') {
  if (needsValidation && topics.includes('family')) {
      const questions = [
        "How do those words make you feel when they say that to you?",
        "What would you want them to understand about how this affects you?",
        "What kind of support would be most helpful right now?",
        "How do you usually cope when this happens?"
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
    
    if (topics.includes('family') && emotion === 'sad') {
      const questions = [
        "What would feeling supported by them look like to you?",
        "How has this affected your relationship with them?",
        "What do you think they might not understand about your experience?",
        "When did you first notice this pattern in your relationship?"
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  }
  
  if (stage === 'deepening') {
    const questions = [
      "As you reflect on this, what feelings come up for you?",
      "What do you think is at the core of these feelings?",
      "How has this experience shaped how you see yourself?",
      "What would healing or resolution look like for you?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  if (stage === 'ready_for_referral' && metrics.readinessForHelp > 7) {
    const questions = [
      "Have you ever thought about talking to someone professionally about this?",
      "Would you be open to exploring some additional support options?",
      "What are your thoughts about getting some extra support with this?",
      "How would you feel about talking with someone who specializes in these kinds of situations?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  // Default deep questions
  const questions = [
    "What's the hardest part about this for you?",
    "How do these feelings show up in your daily life?",
    "What helps you cope when things get really difficult?",
    "What would be most helpful for you right now?"
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
};

/**
 * Helper: Should suggest professional help?
 */
const shouldSuggestProfessionalHelp = (analysis, chatHistory = []) => {
  // Suggest if emotional intensity is high, or if user has already been offered a support group, or if they ask for more help
  const highIntensity = analysis.intensity === 'high';
  const directRequest = /therapist|counselor|professional|doctor|see someone|need more help|need real help|need a specialist|need a psychologist|need a psychiatrist|need to talk to someone/i.test(
    chatHistory.map(m => m.content).join(' ')
  );
  // If support group was already suggested in the last 3 messages
  const recentSupportGroupSuggestion = chatHistory.slice(-3).some(m =>
    m.role === 'assistant' && m.content && m.content.toLowerCase().includes('support group')
  );
  return highIntensity || directRequest || recentSupportGroupSuggestion;
};

/**
 * Helper: Should suggest support group based on pattern (not just first mention)
 */
const shouldSuggestSupportGroup = (analysis, chatHistory = []) => {
  // Look for at least 2 separate user messages with sadness/loneliness/anxiety
  const supportEmotions = ['sad', 'lonely', 'anxious'];
  let count = 0;
  for (const msg of chatHistory) {
    if (msg.role === 'user') {
      const lower = msg.content.toLowerCase();
      if (supportEmotions.some(e => lower.includes(e))) {
        count++;
      }
    }
  }
  // Also check the current message
  if (supportEmotions.includes(analysis.emotion)) {
    count++;
  }
  // Suggest only if pattern (2+ mentions)
  return count >= 2 && analysis.intensity !== 'high';
};

/**
 * Generate a response from the AI model with advanced context
 */
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  const isFirstMessage = conversationHistory.length === 0;
  
  // For first messages, always generate a listening response
  if (isFirstMessage) {
    return generateListeningResponse(userMessage);
  }
  
  // Calculate sentiment score
  const sentimentScore = calculateSentimentScore(userMessage);
  
  // Update sentiment history
  updateSentimentHistory(sentimentScore);
  
  // Thresholds (only apply after first message)
  const supportThreshold = 3;
  const professionalThreshold = 4;
  const crisisThreshold = 4; // Always 4 for immediate escalation
  
  // Crisis escalation - if we detected a crisis, handle immediately
  const crisisAssessment = detectCrisisSituation(userMessage);
  if (crisisAssessment.isActive || sentimentScore >= crisisThreshold) {
    return getCrisisResponse(crisisAssessment);
  }
  
  // Check for professional help suggestion
  if (sentimentScore >= professionalThreshold) {
    return {
      response: "I'm concerned about what you're sharing. " +
               "Would you like me to connect you with a professional?",
      type: 'PROFESSIONAL_HELP_SUGGESTION'
    };
  }
  
  // Check for support group suggestion
  if (sentimentScore >= supportThreshold) {
    return {
      response: "It sounds like you might benefit from talking with others " +
               "who understand. Would you like me to suggest some support groups?",
      type: 'SUPPORT_GROUP_SUGGESTION',
      pattern: 'sadness'
    };
  }
  
  // For normal responses, use the AI model
  try {
    const response = await queryAI({
      inputs: `[CONTEXT] ${JSON.stringify(conversationContext)}\n[USER] ${userMessage}\n[ASSISTANT]`,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.15
      }
    });
    
    return {
      response: response,
      type: 'GENERATED_RESPONSE'
    };
  } catch (error) {
    return getAdvancedFallbackResponse(userMessage, conversationHistory);
  }
};

/**
 * Generate a listening response for the first message
 */
const generateListeningResponse = async (message) => {
  try {
    const response = await queryAI({
      inputs: `[USER FIRST MESSAGE] ${message}\n[ASSISTANT should respond with empathy and invite sharing]`,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.8,
        top_p: 0.95,
        repetition_penalty: 1.1
      }
    });
    return {
      response: response,
      type: 'GENERATED_RESPONSE'
    };
  } catch {
    return {
      response: "I'm really sorry to hear that. Would you like to talk more about what's been going on?",
      type: 'CONVERSATIONAL_RESPONSE'
    };
  }
};

/**
 * Enhanced keyword lists with cultural weighting
 */
const sentimentKeywords = {
  loneliness: [
    'lonely', 'alone', 'isolated', 'no one to talk to', 'no friends',
    'feeling disconnected', 'socially awkward', 'shunned', 'ostracized',
    'unwanted', 'unloved', 'ignored', 'left out', 'friendless', 'by myself',
    // Ghanaian phrases
    'me ho ye', 'me nni obiara', 'me nni adamfo', 'me nni kasa',
    'me nni nkurofo', 'me nni nipa', 'me nni nipa biara',
    'me nni nipa biara nkasa', 'me nni nipa biara nka me ho',
    // Pidgin phrases
    'i dey alone', 'i no get person', 'i dey by myself'
  ],
  sadness: [
    'sad', 'depressed', 'unhappy', 'miserable', 'down', 'low',
    'gloomy', 'heartbroken', 'disheartened', 'dejected', 'despondent',
    'melancholy', 'despair', 'hopeless', 'tearful', 'weepy', 'grief',
    'sorrow', 'regret', 'dismal', 'blue', 'heavy-hearted',
    // Ghanaian phrases
    'me haw', 'me haw paa', 'me ho ye yaw', 'me ho ye hu',
    'me ho ye awer?how', 'me ho ye den', 'me ho ye nk?n?',
    // Pidgin phrases
    'i dey sad', 'my heart dey pain', 'i dey down', 'i dey low'
  ],
  crisis: [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'harm myself', 'hurt myself', 'self harm',
    'no reason to live', 'better off dead', 'can\'t go on',
    // Ghanaian phrases
    'me p? s? me wu', 'medi me ho awu',
    'menp? s? metena ase', 'mep? s? metena ase',
    'me p? s? me k? me ho', 'me p? s? me k? me ho awu',
    // Pidgin phrases
    'i wan die', 'i no wan live', 'i fit kill myself', 'i dey tire for life',
    'i wan end am', 'i wan commot', 'i no wan exist again'
  ]
};

/**
 * Enhanced calculateSentimentScore with contextual weighting
 */
const calculateSentimentScore = (message, isFirstMessage = false) => {
  let score = 0;
  const lowerMessage = message.toLowerCase();
  
  // Check for sentiment keywords with weighting
  for (const [emotion, keywords] of Object.entries(sentimentKeywords)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        // Apply higher weight for Ghanaian phrases
        const weight = keyword.includes(' ') ? 2 : 1;
        
        // Increase weight for first-person phrases
        const personalWeight = (keyword.includes('me ') || keyword.includes('i ')) ? 2 : 1;
        
        // Apply score
        score += emotion === 'crisis' ? 3 * weight * personalWeight : 1 * weight * personalWeight;
      }
    }
  }
  
  // Add additional scoring based on sentiment indicators
  if (message.includes('😭') || message.includes('💔')) score += 2;
  if (message.includes('😢') || message.includes('😞')) score += 1;
  
  // Add score for repeated phrases
  const repeatedPhrases = message.match(/(\b\w+\b)(?:\s+\1)+/gi) || [];
  score += repeatedPhrases.length * 0.5;
  
  // Cap scores for first messages
  if (isFirstMessage) {
    score = Math.min(score, 3.5);
  }
  
  return score;
};

/**
 * Enhanced crisis detection with cultural context
 */
const detectCrisisSituation = (message) => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  let crisisLevel = 0;
  let crisisType = null;
  
  // Calculate sentiment score
  const sentimentScore = calculateSentimentScore(message);
  
  // Update pattern tracker based on score
  if (sentimentScore >= 3) {
    conversationContext.engagementMetrics.patternTracker.crisis.count++;
  } else if (sentimentScore >= 2) {
    conversationContext.engagementMetrics.patternTracker.sadness.count++;
  } else if (sentimentScore >= 1) {
    conversationContext.engagementMetrics.patternTracker.loneliness.count++;
  }
  
  // Check immediate risk patterns
  for (const [type, patterns] of Object.entries(crisisDetectionPatterns)) {
    for (const category in patterns) {
      const matches = patterns[category].filter(keyword => 
        lowerMessage.includes(keyword.toLowerCase())
      );
      
      if (matches.length > 0) {
        crisisLevel += matches.length;
        crisisType = type;
        
        // Immediate response for suicide-related crisis
        if (type === 'immediate_risk') {
          return {
            isActive: true,
            level: 'severe',
            type: crisisType,
            requiresImmediate: true
          };
        }
      }
    }
  }
  
  return {
    isActive: crisisLevel > 0,
    level: crisisLevel > 2 ? 'high' : crisisLevel > 0 ? 'moderate' : 'none',
    type: crisisType,
    requiresImmediate: false
  };
};

/**
 * Get culturally appropriate crisis response
 */
const getCrisisResponse = async (message) => {
  const lowerMessage = message.toLowerCase();
  let response;

  // Check for suicidal intent first - highest priority
  if (
    lowerMessage.includes('suicide') ||
    lowerMessage.includes('kill myself') ||
    lowerMessage.includes('end my life') ||
    lowerMessage.includes('don\'t want to live') ||
    lowerMessage.includes('want to die')
  ) {
    response = {
      type: 'crisis',
      message: "I'm so sorry you're feeling this way. I want to help. Please call this suicide prevention hotline immediately: 1-800-273-8255 (National Suicide Prevention Lifeline). They are available 24/7 and can provide support. You are not alone.",
      resources: [
        {
          name: 'National Suicide Prevention Lifeline',
          phone: '1-800-273-8255',
          website: 'https://suicidepreventionlifeline.org/'
        }
      ]
    };
  } 
  // Check for depression or serious mental health concerns
  else if (
    lowerMessage.includes('depressed') ||
    lowerMessage.includes('depression') ||
    lowerMessage.includes('hopeless') ||
    lowerMessage.includes('no hope') ||
    lowerMessage.includes('can\'t go on')
  ) {
    response = {
      type: 'serious',
      message: "I hear you, and I know how heavy this can feel. I've struggled too, and I'm here to talk. Can you share more about what's been weighing on you?",
      resources: [
        {
          name: 'Psychology Today - Find a Therapist',
          website: 'https://www.psychologytoday.com/us/therapists'
        },
        {
          name: 'National Alliance on Mental Illness',
          phone: '1-800-950-6264',
          website: 'https://www.nami.org/'
        }
      ]
    };
  } 
  // Check for sadness or loneliness - initial response without resources
  else if (
    lowerMessage.includes('sad') ||
    lowerMessage.includes('lonely') ||
    lowerMessage.includes('alone') ||
    lowerMessage.includes('unhappy')
  ) {
    response = {
      type: 'supportive',
      message: "I'm really sorry you're feeling this way. I'm here as a friend to chat with you. Can you tell me more about what's on your mind? I’d love to listen.",
      resources: []  // Resources delayed until further confirmation
    };
  } 
  // Default response for other crisis-related messages
  else {
    response = {
      type: 'general',
      message: "I'm here for you. Can you tell me more about how you're feeling? I want to understand and provide the best support I can.",
      resources: []
    };
  }

  return response;
};

/**
 * Update fallback response to suggest support group if appropriate
 */
const getAdvancedFallbackResponse = (userMessage, chatHistory = []) => {
  const analysis = analyzeConversation(userMessage, chatHistory);
  const opener = getContextualOpener(analysis);
  const followUp = getFollowUpQuestion(analysis, userMessage);
  
  // Natural connectors
  const connectors = [
    "I'm curious -",
    "Tell me more about this:",
    "Something I'm wondering:",
    "Can I ask you something?",
    "What I'm hearing is... but",
    "Help me understand:",
    ""  // Sometimes no connector needed
  ];
  
  const connector = connectors[Math.floor(Math.random() * connectors.length)];
  
  // Suggest support group if appropriate (pattern-based)
  if (shouldSuggestSupportGroup(analysis, chatHistory)) {
    const resourceSuggestion = getSuggestedResources([...chatHistory, { role: 'user', content: userMessage }]);
    const supportGroups = resourceSuggestion.resources?.filter(r => r.tags?.includes('support group')) || [];
    if (supportGroups.length > 0) {
      const group = supportGroups[0];
      return `${opener} ${connector} ${followUp}\n\nBy the way, sometimes it helps to talk to others who understand what you're going through. Would you be interested in joining a support group like "${group.title}"? ${group.description}${group.url ? ` You can join here: ${group.url}` : ''}`;
    } else {
      return `${opener} ${connector} ${followUp}\n\nBy the way, sometimes it helps to talk to others who understand what you're going through. Would you be interested in joining a support group? I can suggest some options if you'd like.`;
    }
  }
  
  // Escalate to professional help if needed
  if (shouldSuggestProfessionalHelp(analysis, chatHistory)) {
    const resourceSuggestion = getSuggestedResources([...chatHistory, { role: 'user', content: userMessage }]);
    const professionals = resourceSuggestion.resources?.filter(r => r.tags?.includes('professional') || r.tags?.includes('psychologist') || r.tags?.includes('counselor')) || [];
    if (professionals.length > 0) {
      const pro = professionals[0];
      return `${opener} ${connector} ${followUp}\n\nGiven what you've shared, you might benefit from speaking with a mental health professional like "${pro.name}\" (${pro.title}). ${pro.description ? pro.description : ''} You can contact them at: ${pro.contact}${pro.website ? ` or visit: ${pro.website}` : ''}`;
    } else {
      return `${opener} ${connector} ${followUp}\n\nGiven what you've shared, you might benefit from speaking with a mental health professional. I can suggest some options if you'd like.`;
    }
  }
  
  // Construct response naturally
  if (connector === "") {
    return `${opener} ${followUp}`;
  } else {
    return `${opener} ${connector} ${followUp}`;
  }
};

/**
 * Track sentiment over time
 */
const updateSentimentHistory = (score) => {
  if (!conversationContext.sentimentHistory) {
    conversationContext.sentimentHistory = [];
  }
  
  conversationContext.sentimentHistory.push({
    timestamp: new Date(),
    score: score
  });
  
  // Keep only the last 10 entries
  if (conversationContext.sentimentHistory.length > 10) {
    conversationContext.sentimentHistory.shift();
  }
};

/**
 * Detect escalating distress
 */
const detectEscalatingDistress = () => {
  if (!conversationContext.sentimentHistory || conversationContext.sentimentHistory.length < 3) {
    return false;
  }
  
  const lastThree = conversationContext.sentimentHistory.slice(-3);
  const trend = lastThree.map(entry => entry.score);
  
  // Check for increasing scores
  if (trend[0] < trend[1] && trend[1] < trend[2]) {
    return true;
  }
  
  return false;
};

/**
 * Export the current conversation context as a plain object (for Firestore)
 */
export const exportConversationContext = () => {
  // Convert Set to Array for Firestore compatibility
  const ctx = JSON.parse(JSON.stringify(conversationContext));
  if (ctx.engagementMetrics && ctx.engagementMetrics.topicsExplored instanceof Set) {
    ctx.engagementMetrics.topicsExplored = Array.from(ctx.engagementMetrics.topicsExplored);
  }
  return ctx;
};

/**
 * Import a conversation context object (from Firestore) and set it as the current context
 */
export const importConversationContext = (ctx) => {
  if (!ctx) return;
  // Convert topicsExplored back to Set if it's an array
  if (ctx.engagementMetrics && Array.isArray(ctx.engagementMetrics.topicsExplored)) {
    ctx.engagementMetrics.topicsExplored = new Set(ctx.engagementMetrics.topicsExplored);
  }
  conversationContext = ctx;
};

/**
 * Reset conversation context (for new sessions)
 */
export const resetConversationContext = () => {
  conversationContext = {
    emotionalTone: 'neutral',
    keyTopics: [],
    responseHistory: [],
    userMood: 'unknown',
    engagementMetrics: {
      topicsExplored: new Set(),
      emotionalDepth: 0,
      userOpenness: 0,
      readinessForHelp: 0,
      crisisIndicators: [],
      lastTopicResolution: null,
      spiritualContext: null,
      culturalContext: {
        language: 'en',
        region: null,
        beliefs: []
      },
      patternTracker: {
        loneliness: { count: 0, lastTriggered: null },
        sadness: { count: 0, lastTriggered: null },
        crisis: { count: 0, lastTriggered: null }
      }
    },
    sessionStage: 'initial',
    sentimentHistory: []
  };
};

/**
 * Get conversation insights (for debugging/analytics)
 */
export const getConversationInsights = () => {
  return conversationContext;
};