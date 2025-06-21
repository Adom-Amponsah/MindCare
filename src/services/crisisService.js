// crisisService.js - Handles crisis detection and resources

export const detectCrisisSituation = (message) => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'harm myself', 'hurt myself', 'self harm',
    'no reason to live', 'better off dead', "can't go on"
  ];
  
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

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
