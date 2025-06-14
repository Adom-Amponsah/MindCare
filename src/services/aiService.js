// ADVANCED HUMAN-LIKE AI COUNSELOR - YC GRADE SOLUTION
// Built for seamless, natural conversations that feel genuinely human

// Get API token from environment variables
const API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;

// Model configuration
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

// Conversation state management
let conversationContext = {
  emotionalTone: 'neutral',
  keyTopics: [],
  responseHistory: [],
  userMood: 'unknown',
  sessionDepth: 0
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
  
  // Extract key topics
  const topics = [];
  if (message.includes('parent') || message.includes('mom') || message.includes('dad')) topics.push('family');
  if (message.includes('school') || message.includes('work')) topics.push('performance');
  if (message.includes('friend') || message.includes('relationship')) topics.push('social');
  if (message.includes('childish') || message.includes('immature')) topics.push('validation');
  
  // Update context
  conversationContext.emotionalTone = dominantEmotion;
  conversationContext.keyTopics = [...new Set([...conversationContext.keyTopics, ...topics])];
  conversationContext.sessionDepth++;
  
  return {
    emotion: dominantEmotion,
    topics: topics,
    intensity: getEmotionalIntensity(message),
    needsValidation: message.includes('childish') || message.includes('immature') || message.includes('stupid')
  };
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
  const { emotion, intensity, needsValidation, topics } = analysis;
  const depth = conversationContext.sessionDepth;
  
  // Avoid repetition - track what we've used
  if (!conversationContext.responseHistory) conversationContext.responseHistory = [];
  
  let openers = [];
  
  // First response vs deeper conversation
  if (depth <= 2) {
    // Initial responses
    switch (emotion) {
      case 'frustrated':
        openers = [
          "That sounds incredibly frustrating.",
          "I can hear the frustration in what you're saying.",
          "Wow, that would really get to me too."
        ];
        break;
      case 'sad':
        openers = [
          "That's really painful to hear.",
          "I can feel how much this is hurting you.",
          "That sounds heartbreaking."
        ];
        break;
      case 'lonely':
        openers = [
          "That loneliness sounds overwhelming.",
          "Feeling disconnected like that is so hard.",
          "That isolation must be really difficult."
        ];
        break;
      default:
        openers = [
          "That sounds really tough.",
          "I hear you.",
          "That's a lot to deal with."
        ];
    }
  } else {
    // Deeper conversation - more personal
    if (needsValidation) {
      openers = [
        "Being called childish really stings, doesn't it?",
        "That must feel like such a dismissal of your feelings.",
        "When people label us like that, it's like they're not really seeing us."
      ];
    } else {
      openers = [
        "I'm still thinking about what you shared earlier...",
        "This is clearly something that's been weighing on you.",
        "There's so much more to this story, isn't there?"
      ];
    }
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
    conversationContext.responseHistory.shift(); // Keep only last 5
  }
  
  return selectedOpener;
};

/**
 * Generate follow-up questions that dig deeper
 */
const getFollowUpQuestion = (analysis, userMessage) => {
  const { emotion, topics, needsValidation } = analysis;
  
  if (needsValidation && topics.includes('family')) {
    const questions = [
      "What does 'childish' even mean to them? Like, what specific things trigger that response?",
      "How do you usually respond when they say that to you?",
      "Do they explain what they want you to do differently, or just... criticize?",
      "When did this pattern start? Has it always been like this?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  if (topics.includes('family') && emotion === 'sad') {
    const questions = [
      "What would it look like if they actually showed you love? Like, what would be different?",
      "Are there moments when you do feel their love, or is it pretty consistently like this?",
      "How does this affect how you see yourself?",
      "What do you think they're really trying to communicate when they react this way?"
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }
  
  // Generic deep questions
  const questions = [
    "What's the hardest part about all of this for you?",
    "How long has this been going on?",
    "What goes through your mind when this happens?",
    "How do you usually cope with these feelings?"
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
    sessionDepth: 0
  };
};

/**
 * Get conversation insights (for debugging/analytics)
 */
export const getConversationInsights = () => {
  return conversationContext;
};

/**
 * Detect if a message indicates a crisis situation
 */
export const detectCrisisSituation = (message) => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'harm myself', 'hurt myself', 'self harm',
    'no reason to live', 'better off dead', 'can\'t go on'
  ];
  
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Get crisis resources and response
 */
export const getCrisisResponse = () => {
  return {
    message: "I'm really worried about what you just shared. These feelings you're having - they're telling me you're in a lot of pain right now. I need you to know that there are people who can help you through this moment. Can you reach out to someone right now?",
    resources: [
      {
        name: "Ghana National Suicide Prevention Helpline",
        contact: "+233 50 626 3030",
        available: "24/7"
      },
      {
        name: "Mental Health Authority Ghana",
        contact: "+233 30 251 3100",
        available: "Working hours"
      }
    ]
  };
};