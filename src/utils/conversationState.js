// CONVERSATION STATE - Manages conversation context and state
const initialState = {
    emotionalTone: 'neutral',
    keyTopics: [],
    responseHistory: [],
    userMood: 'unknown',
    sessionDepth: 0
  };
  
  // Conversation state management
  export let conversationContext = { ...initialState };
  
  /**
   * Reset conversation context to initial state
   */
  export const resetContext = () => {
    conversationContext = { ...initialState };
  };
  
  /**
   * Update conversation context
   */
  export const updateContext = (updates) => {
    conversationContext = { ...conversationContext, ...updates };
  };
  
  /**
   * Get current conversation context
   */
  export const getContext = () => {
    return { ...conversationContext };
  };