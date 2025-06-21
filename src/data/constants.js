// CONSTANTS - All constant data used across the application

// Emotion detection keywords
export const EMOTIONS = {
    frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'pissed'],
    sad: ['sad', 'depressed', 'down', 'hurt', 'broken'],
    anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared'],
    lonely: ['alone', 'lonely', 'isolated', 'nobody', 'empty'],
    hopeless: ['hopeless', 'pointless', 'useless', 'worthless', 'give up']
  };
  
  // Topic extraction keywords
  export const TOPICS = {
    family: ['parent', 'mom', 'dad', 'mother', 'father', 'family'],
    performance: ['school', 'work', 'job', 'grade', 'test', 'exam'],
    social: ['friend', 'relationship', 'girlfriend', 'boyfriend', 'dating'],
    validation: ['childish', 'immature', 'stupid', 'worthless', 'useless']
  };
  
  // Crisis situation keywords
  export const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'harm myself', 'hurt myself', 'self harm',
    'no reason to live', 'better off dead', 'can\'t go on'
  ];
  
  // Crisis resources
  export const CRISIS_RESOURCES = [
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
  ];