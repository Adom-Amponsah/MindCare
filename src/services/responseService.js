// responseService.js - Handles response generation and conversation flow

export const getContextualOpener = (analysis, context) => {
  const { emotion, intensity, needsValidation } = analysis;
  const depth = context.sessionDepth;
  
  let openers = [];
  
  if (depth <= 2) {
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
  
  const availableOpeners = openers.filter(opener => 
    !context.responseHistory.includes(opener)
  );
  
  const selectedOpener = availableOpeners.length > 0 
    ? availableOpeners[Math.floor(Math.random() * availableOpeners.length)]
    : openers[Math.floor(Math.random() * openers.length)];
  
  context.responseHistory.push(selectedOpener);
  if (context.responseHistory.length > 5) {
    context.responseHistory.shift();
  }
  
  return selectedOpener;
};

export const getFollowUpQuestion = (analysis, userMessage) => {
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
  
  const questions = [
    "What's the hardest part about all of this for you?",
    "How long has this been going on?",
    "What goes through your mind when this happens?",
    "How do you usually cope with these feelings?"
  ];
  
  return questions[Math.floor(Math.random() * questions.length)];
};

export const getAdvancedFallbackResponse = (userMessage, context) => {
  const analysis = analyzeConversation(userMessage);
  const opener = getContextualOpener(analysis, context);
  const followUp = getFollowUpQuestion(analysis, userMessage);
  
  const connectors = [
    "I'm curious -",
    "Tell me more about this:",
    "Something I'm wondering:",
    "Can I ask you something?",
    "What I'm hearing is... but",
    "Help me understand:",
    ""
  ];
  
  const connector = connectors[Math.floor(Math.random() * connectors.length)];
  
  return connector === "" 
    ? `${opener} ${followUp}`
    : `${opener} ${connector} ${followUp}`;
};
