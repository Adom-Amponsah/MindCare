// emotionService.js - Handles emotional analysis and conversation context

export const getEmotionalIntensity = (message) => {
  const intensifiers = ['really', 'very', 'extremely', 'so', 'always', 'never', 'constantly'];
  const capsCount = (message.match(/[A-Z]/g) || []).length;
  const intensifierCount = intensifiers.filter(word => message.toLowerCase().includes(word)).length;
  
  if (capsCount > 5 || intensifierCount > 2) return 'high';
  if (intensifierCount > 0 || message.includes('!')) return 'medium';
  return 'low';
};

export const analyzeConversation = (userMessage, history = []) => {
  const message = userMessage.toLowerCase();
  
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
  
  const topics = [];
  if (message.includes('parent') || message.includes('mom') || message.includes('dad')) topics.push('family');
  if (message.includes('school') || message.includes('work')) topics.push('performance');
  if (message.includes('friend') || message.includes('relationship')) topics.push('social');
  if (message.includes('childish') || message.includes('immature')) topics.push('validation');
  
  return {
    emotion: dominantEmotion,
    topics: topics,
    intensity: getEmotionalIntensity(message),
    needsValidation: message.includes('childish') || message.includes('immature') || message.includes('stupid')
  };
};
