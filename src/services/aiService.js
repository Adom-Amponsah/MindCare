// AI SERVICE - Handles API communication with Hugging Face
import { analyzeConversation } from '../utils/conversationanalyzer.js';
import { getAdvancedFallbackResponse } from '../utils/fallbackResponses.js';
import { conversationContext } from '../utils/conversationState.js';

// Model configuration
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

// Get API token from environment variables
const getApiToken = () => {
  return import.meta.env.VITE_HUGGINGFACE_API_TOKEN;
};

/**
 * Reset conversation context for new conversations
 */
export const resetConversationContext = () => {
  // Reset the conversation state
  if (conversationContext) {
    conversationContext.sessionDepth = 0;
    conversationContext.emotionalHistory = [];
    conversationContext.topicHistory = [];
    conversationContext.lastResponses = [];
    
    // Reset any other properties that might exist in conversationContext
    Object.keys(conversationContext).forEach(key => {
      if (Array.isArray(conversationContext[key])) {
        conversationContext[key] = [];
      } else if (typeof conversationContext[key] === 'number') {
        conversationContext[key] = 0;
      }
    });
  }
  
  console.log('Conversation context reset for new conversation');
};

/**
 * Build the prompt for the AI model
 */
const buildPrompt = (userMessage, conversationHistory, analysis) => {
  // Build context from conversation history
  let contextualHistory = "";
  if (conversationHistory.length > 0) {
    const lastFewMessages = conversationHistory.slice(-4); // Last 4 messages for context
    contextualHistory = lastFewMessages.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n');
  }

  return {
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
};

/**
 * Make API call to Hugging Face
 */
const callHuggingFaceAPI = async (prompt) => {
  const API_TOKEN = getApiToken();
  
  const response = await fetch(MODEL_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prompt),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Parse AI response from API data
 */
const parseAIResponse = (data) => {
  let aiResponse = "";
  
  if (Array.isArray(data) && data[0]?.generated_text) {
    aiResponse = data[0].generated_text;
  } else if (typeof data === 'object' && data.generated_text) {
    aiResponse = data.generated_text;
  } else {
    throw new Error("Unexpected response format");
  }
  
  return aiResponse.trim();
};

/**
 * Generate a response from the AI model with advanced context
 */
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const API_TOKEN = getApiToken();
    
    if (!API_TOKEN) {
      console.error("No API token found. Please set VITE_HUGGINGFACE_API_TOKEN in your .env file");
      return getAdvancedFallbackResponse(userMessage);
    }

    // Analyze the conversation
    const analysis = analyzeConversation(userMessage, conversationHistory);
    
    // Build and send prompt
    const prompt = buildPrompt(userMessage, conversationHistory, analysis);
    const data = await callHuggingFaceAPI(prompt);
    const aiResponse = parseAIResponse(data);
    
    return aiResponse;
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return getAdvancedFallbackResponse(userMessage);
  }
};