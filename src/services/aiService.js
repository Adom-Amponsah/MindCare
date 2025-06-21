// ADVANCED HUMAN-LIKE AI COUNSELOR - YC GRADE SOLUTION
// Built for seamless, natural conversations that feel genuinely human

// Get API token from environment variables
const API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;

// Import modular services
import { analyzeConversation } from './emotionService';
import { 
  getContextualOpener, 
  getFollowUpQuestion, 
  getAdvancedFallbackResponse 
} from './responseService';
import { 
  detectCrisisSituation, 
  getCrisisResponse ,
} from './crisisService';

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
 * Generate a response from the AI model with advanced context
 */
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Crisis detection - highest priority
    if (detectCrisisSituation(userMessage)) {
      return getCrisisResponse().message;
    }

    if (!API_TOKEN) {
      console.error("No API token found. Please set VITE_HUGGINGFACE_API_TOKEN in your .env file");
      return getAdvancedFallbackResponse(userMessage, conversationContext);
    }

    // Analyze the conversation
    const analysis = analyzeConversation(userMessage, conversationHistory);
    
    // Update context
    conversationContext.emotionalTone = analysis.emotion;
    conversationContext.keyTopics = [...new Set([...conversationContext.keyTopics, ...analysis.topics])];
    conversationContext.sessionDepth++;
    
    // Generate contextual components
    const contextualOpener = getContextualOpener(analysis, conversationContext);
    const followUpQuestion = getFollowUpQuestion(analysis, conversationContext);
    
    // Build context from conversation history
    let contextualHistory = "";
    if (conversationHistory.length > 0) {
      const lastFewMessages = conversationHistory.slice(-4);
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
1. Start your response with: "${contextualOpener}"
2. End your response with: "${followUpQuestion}"
3. NEVER use the same opening phrases repeatedly
4. Respond like a real human therapist - varied, natural, genuine
5. Use different sentence structures and lengths
6. Show you're LISTENING by referencing what they said specifically
7. Match their emotional intensity appropriately
8. Be conversational, not clinical

Current message: "${userMessage}"

Respond as a skilled therapist would - naturally, with variety, and with genuine curiosity about their experience. [/INST]>`,
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
      return getAdvancedFallbackResponse(userMessage, conversationContext);
    }

    const data = await response.json();
    let aiResponse = "";
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
      aiResponse = data.generated_text;
    } else {
      console.error("Unexpected response format:", data);
      return getAdvancedFallbackResponse(userMessage, conversationContext);
    }
    
    return aiResponse.trim();
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return getAdvancedFallbackResponse(userMessage, conversationContext);
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


export const getConversationInsights = () => {
  return conversationContext;
};