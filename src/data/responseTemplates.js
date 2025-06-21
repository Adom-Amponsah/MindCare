// RESPONSE TEMPLATES - Template responses for different scenarios

// Response openers for different situations
export const RESPONSE_OPENERS = {
    initial: {
      frustrated: [
        "That sounds incredibly frustrating.",
        "I can hear the frustration in what you're saying.",
        "Wow, that would really get to me too."
      ],
      sad: [
        "That's really painful to hear.",
        "I can feel how much this is hurting you.",
        "That sounds heartbreaking."
      ],
      anxious: [
        "That anxiety sounds overwhelming.",
        "I can sense how worried you are about this.",
        "That's a lot of stress to carry."
      ],
      lonely: [
        "That loneliness sounds overwhelming.",
        "Feeling disconnected like that is so hard.",
        "That isolation must be really difficult."
      ],
      hopeless: [
        "That hopelessness feels so heavy.",
        "I can hear how exhausted you are.",
        "That's such a dark place to be in."
      ],
      default: [
        "That sounds really tough.",
        "I hear you.",
        "That's a lot to deal with."
      ]
    },
    validation: [
      "Being called childish really stings, doesn't it?",
      "That must feel like such a dismissal of your feelings.",
      "When people label us like that, it's like they're not really seeing us."
    ],
    deeper: [
      "I'm still thinking about what you shared earlier...",
      "This is clearly something that's been weighing on you.",
      "There's so much more to this story, isn't there?"
    ]
  };
  
  // Follow-up questions for different scenarios
  export const FOLLOW_UP_QUESTIONS = {
    validationFamily: [
      "What does 'childish' even mean to them? Like, what specific things trigger that response?",
      "How do you usually respond when they say that to you?",
      "Do they explain what they want you to do differently, or just... criticize?",
      "When did this pattern start? Has it always been like this?"
    ],
    familySad: [
      "What would it look like if they actually showed you love? Like, what would be different?",
      "Are there moments when you do feel their love, or is it pretty consistently like this?",
      "How does this affect how you see yourself?",
      "What do you think they're really trying to communicate when they react this way?"
    ],
    generic: [
      "What's the hardest part about all of this for you?",
      "How long has this been going on?",
      "What goes through your mind when this happens?",
      "How do you usually cope with these feelings?"
    ]
  };
  
  // Natural connectors for responses
  export const CONNECTORS = [
    "I'm curious -",
    "Tell me more about this:",
    "Something I'm wondering:",
    "Can I ask you something?",
    "What I'm hearing is... but",
    "Help me understand:",
    ""  // Sometimes no connector needed
  ];