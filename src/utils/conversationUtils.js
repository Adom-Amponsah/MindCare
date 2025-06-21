// CONVERSATION UTILITIES - Crisis detection and session management
import { conversationContext, resetContext } from '../data/conversationState.js';
import { CRISIS_KEYWORDS, CRISIS_RESOURCES } from '../data/constants.js';

/**
 * Detect if a message indicates a crisis situation
 */
export const detectCrisisSituation = (message) => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Get crisis resources and response
 */
export const getCrisisResponse = () => {
  return {
    message: "I'm really worried about what you just shared. These feelings you're having - they're telling me you're in a lot of pain right now. I need you to know that there are people who can help you through this moment. Can you reach out to someone right now?",
    resources: CRISIS_RESOURCES,
    isCrisis: true
  };
};

/**
 * Reset conversation context (for new sessions)
 */
export const resetConversationContext = () => {
  resetContext();
};

/**
 * Get conversation insights (for debugging/analytics)
 */
export const getConversationInsights = () => {
  return { ...conversationContext };
};