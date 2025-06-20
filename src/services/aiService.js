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
    }
  },
  sessionStage: 'initial' // initial, exploring, deepening, ready_for_referral
};

// Enhanced crisis detection with cultural sensitivity
const crisisDetectionPatterns = {
  immediate_risk: {
    keywords: [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'harm myself', 'hurt myself', 'self harm',
      'no reason to live', 'better off dead', 'can\'t go on'
    ],
    twi: [ // Local language support
      'me p? s? me wu', 'medi me ho awu',
      'menp? s? me tra ase', 'mep? s? metena ase'
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
 * Generate a response from the AI model with advanced context
 */
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    if (!API_TOKEN) {
      console.error("No API token found. Please set VITE_HUGGINGFACE_API_TOKEN in your .env file");
      return getAdvancedFallbackResponse(userMessage);
    }

    // Analyze the conversation
    const analysis = analyzeConversation(userMessage, conversationHistory);
    
    // Build context from conversation history
    let contextualHistory = "";
    if (conversationHistory.length > 0) {
      const lastFewMessages = conversationHistory.slice(-4); // Last 4 messages for context
      contextualHistory = lastFewMessages.map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n');
    }

    const prompt = {
      inputs: `<s>[INST] You are an experienced human therapist having a natural conversation. The person has been talking to you and you need to respond naturally.

CONVERSATION CONTEXT:
${contextualHistory ? `Previous conversation:\n${contextualHistory}\n` : ''}

CURRENT EMOTIONAL STATE: ${analysis.emotion}
KEY TOPICS: ${analysis.topics.join(', ')}
CONVERSATION DEPTH: ${conversationContext.sessionDepth} exchanges

CRITICAL INSTRUCTIONS:
1. NEVER use the same opening phrases repeatedly (no "Oh man", "I hear", "That sounds" if used recently)
2. Respond like a real human therapist - varied, natural, genuine
3. Use different sentence structures and lengths
4. Show you're LISTENING by referencing what they said specifically
5. Ask ONE meaningful follow-up question that digs deeper
6. Match their emotional intensity appropriately
7. Be conversational, not clinical
8. Use natural speech patterns and contractions
9. VARY your response style - sometimes start with empathy, sometimes with a question, sometimes with reflection

Current message: "${userMessage}"

Respond as a skilled therapist would - naturally, with variety, and with genuine curiosity about their experience. [/INST]`,
      parameters: {
        max_new_tokens: 180,
        temperature: 0.85,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
        repetition_penalty: 1.2
      }
    };
    
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return getAdvancedFallbackResponse(userMessage);
    }

    const data = await response.json();
    let aiResponse = "";
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
      aiResponse = data.generated_text;
    } else {
      console.error("Unexpected response format:", data);
      return getAdvancedFallbackResponse(userMessage);
    }
    
    return aiResponse.trim();
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return getAdvancedFallbackResponse(userMessage);
  }
};

/**
 * Advanced fallback response system
 */
const getAdvancedFallbackResponse = (userMessage) => {
  const analysis = analyzeConversation(userMessage);
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
  
  // Construct response naturally
  if (connector === "") {
    return `${opener} ${followUp}`;
  } else {
    return `${opener} ${connector} ${followUp}`;
  }
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
      }
    },
    sessionStage: 'initial'
  };
};

/**
 * Get conversation insights (for debugging/analytics)
 */
export const getConversationInsights = () => {
  return conversationContext;
};

/**
 * Enhanced crisis detection with cultural context
 */
export const detectCrisisSituation = (message) => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  let crisisLevel = 0;
  let crisisType = null;
  
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
export const getCrisisResponse = (crisisAssessment) => {
  const { type, level } = crisisAssessment;
  
  // Immediate suicide risk response
  if (type === 'immediate_risk' && level === 'severe') {
    return {
      message: `I am deeply concerned about what you're sharing. Your life is precious and valuable. 
I need you to know that help is available right now. Can you please reach out to one of these support services immediately? 
They are here to help you 24/7 and understand what you're going through.`,
      resources: supportResources.immediate_crisis,
      priority: 'urgent'
    };
  }
  
  // Spiritual distress response
  if (type === 'spiritual_distress') {
    return {
      message: `I hear that you're experiencing spiritual challenges. This is a very real and valid concern. 
Would you like to connect with someone who understands both spiritual and emotional healing?`,
      resources: {
        ...supportResources.spiritual_support,
        ...supportResources.professional_help
      },
      priority: 'high'
    };
  }
  
  // Cultural pressure response
  if (type === 'cultural_pressure') {
    return {
      message: `I understand the weight of cultural expectations and community judgment. 
It's okay to seek help while respecting our cultural values. Would you like to speak with someone who understands these challenges?`,
      resources: supportResources.professional_help,
      priority: 'moderate'
    };
  }
  
  return {
    message: `I'm here to listen and support you. Would you like to tell me more about what you're experiencing?`,
    resources: null,
    priority: 'standard'
  };
};
con
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