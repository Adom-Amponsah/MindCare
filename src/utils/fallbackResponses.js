// FALLBACK RESPONSES - Generates responses when AI API is unavailable
import { analyzeConversation } from './conversationanalyzer.js';
import { conversationContext } from './conversationState.js';
import { RESPONSE_OPENERS, FOLLOW_UP_QUESTIONS, CONNECTORS } from '../data/responseTemplates.js';

/**
 * Generate contextually aware response starters
 */
const getContextualOpener = (analysis) => {
  const { emotion, intensity, needsValidation, topics } = analysis;
  const depth = conversationContext.sessionDepth;
  
  // Initialize response history if needed
  if (!conversationContext.responseHistory) {
    conversationContext.responseHistory = [];
  }
  
  let openers = [];
  
  // First response vs deeper conversation
  if (depth <= 2) {
    // Initial responses based on emotion
    openers = RESPONSE_OPENERS.initial[emotion] || RESPONSE_OPENERS.initial.default;
  } else {
    // Deeper conversation - more personal
    if (needsValidation) {
      openers = RESPONSE_OPENERS.validation;
    } else {
      openers = RESPONSE_OPENERS.deeper;
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
    return FOLLOW_UP_QUESTIONS.validationFamily[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.validationFamily.length)];
  }
  
  if (topics.includes('family') && emotion === 'sad') {
    return FOLLOW_UP_QUESTIONS.familySad[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.familySad.length)];
  }
  
  // Generic deep questions
  return FOLLOW_UP_QUESTIONS.generic[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.generic.length)];
};

/**
 * Advanced fallback response system
 */
export const getAdvancedFallbackResponse = (userMessage) => {
  const analysis = analyzeConversation(userMessage);
  const opener = getContextualOpener(analysis);
  const followUp = getFollowUpQuestion(analysis, userMessage);
  
  // Get random connector
  const connector = CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)];
  
  // Construct response naturally
  if (connector === "") {
    return `${opener} ${followUp}`;
  } else {
    return `${opener} ${connector} ${followUp}`;
  }
};