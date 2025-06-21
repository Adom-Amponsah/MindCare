// CONVERSATION ANALYZER - Analyzes user messages for context and emotion
import { conversationContext } from "./conversationState";
import { EMOTIONS, TOPICS } from '../data/constants.js';

/**
 * Detect emotional state from message
 */
const detectEmotion = (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [emotion, keywords] of Object.entries(EMOTIONS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return emotion;
    }
  }
  
  return 'neutral';
};

/**
 * Extract key topics from message
 */
const extractTopics = (message) => {
  const lowerMessage = message.toLowerCase();
  const topics = [];
  
  for (const [topic, keywords] of Object.entries(TOPICS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      topics.push(topic);
    }
  }
  
  return topics;
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
 * Check if message indicates need for validation
 */
const needsValidation = (message) => {
  const validationKeywords = ['childish', 'immature', 'stupid', 'worthless', 'useless'];
  return validationKeywords.some(keyword => message.toLowerCase().includes(keyword));
};

/**
 * Advanced conversation analyzer to understand context and mood
 */
export const analyzeConversation = (userMessage, history = []) => {
  const emotion = detectEmotion(userMessage);
  const topics = extractTopics(userMessage);
  const intensity = getEmotionalIntensity(userMessage);
  const needsVal = needsValidation(userMessage);
  
  // Update conversation context
  conversationContext.emotionalTone = emotion;
  conversationContext.keyTopics = [...new Set([...conversationContext.keyTopics, ...topics])];
  conversationContext.sessionDepth++;
  
  return {
    emotion,
    topics,
    intensity,
    needsValidation: needsVal
  };
};