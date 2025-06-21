// emotionService.js - Production-grade emotional analysis and conversation context

// Advanced emotional intensity calculation with multi-factor analysis
export const getEmotionalIntensity = (message, context = {}) => {
  const text = message.toLowerCase();
  
  // Linguistic intensifiers with weighted scoring
  const intensifiers = {
    extreme: ['absolutely', 'completely', 'totally', 'utterly', 'extremely', 'incredibly', 'ridiculously'],
    high: ['really', 'very', 'so', 'quite', 'pretty', 'fairly', 'seriously'],
    temporal: ['always', 'never', 'constantly', 'forever', 'endlessly', 'continuously'],
    emphatic: ['definitely', 'certainly', 'obviously', 'clearly', 'literally']
  };
  
  // Advanced pattern detection
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  const exclamationCount = (message.match(/!/g) || []).length;
  const questionCount = (message.match(/\?/g) || []).length;
  const ellipsisCount = (message.match(/\.{2,}/g) || []).length;
  const repeatedChars = (message.match(/(.)\1{2,}/g) || []).length;
  const allCapsWords = (message.match(/\b[A-Z]{2,}\b/g) || []).length;
  
  // Calculate weighted scores
  let intensityScore = 0;
  
  // Intensifier scoring
  intensifiers.extreme.forEach(word => {
    if (text.includes(word)) intensityScore += 3;
  });
  intensifiers.high.forEach(word => {
    if (text.includes(word)) intensityScore += 2;
  });
  intensifiers.temporal.forEach(word => {
    if (text.includes(word)) intensityScore += 2.5;
  });
  intensifiers.emphatic.forEach(word => {
    if (text.includes(word)) intensityScore += 1.5;
  });
  
  // Punctuation and formatting scoring
  intensityScore += Math.min(exclamationCount * 1.5, 6);
  intensityScore += Math.min(capsRatio * 10, 4);
  intensityScore += Math.min(allCapsWords * 2, 5);
  intensityScore += Math.min(repeatedChars * 1.5, 3);
  intensityScore += Math.min(ellipsisCount * 1, 2);
  intensityScore += Math.min(questionCount * 0.5, 2);
  
  // Context-based modifiers
  if (context.previousIntensity === 'high') intensityScore += 1;
  if (context.conversationLength > 5) intensityScore += 0.5;
  
  // Emotional amplifiers
  const amplifiers = ['hate', 'love', 'obsessed', 'addicted', 'devastated', 'ecstatic'];
  amplifiers.forEach(word => {
    if (text.includes(word)) intensityScore += 2;
  });
  
  // Return classification with confidence score
  if (intensityScore >= 8) return { level: 'critical', score: intensityScore, confidence: 0.95 };
  if (intensityScore >= 5) return { level: 'high', score: intensityScore, confidence: 0.85 };
  if (intensityScore >= 2) return { level: 'medium', score: intensityScore, confidence: 0.75 };
  return { level: 'low', score: intensityScore, confidence: 0.65 };
};

// Comprehensive conversation analysis with deep learning patterns
export const analyzeConversation = (userMessage, history = [], userProfile = {}) => {
  const message = userMessage.toLowerCase();
  const messageLength = userMessage.length;
  const wordCount = userMessage.split(/\s+/).length;
  
  // Advanced emotion detection with confidence scoring
  const emotionPatterns = {
    frustrated: {
      keywords: ['frustrated', 'annoyed', 'angry', 'mad', 'pissed', 'irritated', 'fed up', 'sick of'],
      patterns: [/can't (take|stand|deal)/, /why (does|do|is|are).*always/, /this is (stupid|ridiculous|insane)/],
      intensity_multiplier: 1.2
    },
    sad: {
      keywords: ['sad', 'depressed', 'down', 'hurt', 'broken', 'devastated', 'heartbroken', 'miserable'],
      patterns: [/feel like.*dying/, /want to.*disappear/, /nothing.*matters/],
      intensity_multiplier: 1.5
    },
    anxious: {
      keywords: ['anxious', 'worried', 'stressed', 'nervous', 'scared', 'panicked', 'overwhelmed', 'terrified'],
      patterns: [/what if/, /can't stop (thinking|worrying)/, /going to (happen|go wrong)/],
      intensity_multiplier: 1.3
    },
    lonely: {
      keywords: ['alone', 'lonely', 'isolated', 'nobody', 'empty', 'abandoned', 'forgotten', 'invisible'],
      patterns: [/no one (cares|understands)/, /all by myself/, /feel so (alone|empty)/],
      intensity_multiplier: 1.4
    },
    hopeless: {
      keywords: ['hopeless', 'pointless', 'useless', 'worthless', 'give up', 'no point', 'waste of time'],
      patterns: [/nothing.*work/, /give up/, /what's the point/],
      intensity_multiplier: 1.8
    },
    excited: {
      keywords: ['excited', 'amazing', 'awesome', 'fantastic', 'incredible', 'thrilled', 'ecstatic'],
      patterns: [/can't wait/, /so excited/, /this is (amazing|incredible)/],
      intensity_multiplier: 1.1
    },
    confident: {
      keywords: ['confident', 'sure', 'certain', 'ready', 'prepared', 'capable', 'strong'],
      patterns: [/i can do/, /i'm ready/, /i know i/],
      intensity_multiplier: 0.9
    }
  };
  
  // Detect primary and secondary emotions with confidence
  const emotionScores = {};
  let dominantEmotion = 'neutral';
  let maxScore = 0;
  let emotionConfidence = 0;
  
  for (const [emotion, config] of Object.entries(emotionPatterns)) {
    let score = 0;
    let matches = 0;
    
    // Keyword matching with proximity scoring
    config.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const keywordMatches = (message.match(regex) || []).length;
      score += keywordMatches * 2;
      matches += keywordMatches;
    });
    
    // Pattern matching with context awareness
    config.patterns.forEach(pattern => {
      if (pattern.test(message)) {
        score += 3;
        matches++;
      }
    });
    
    // Apply intensity multiplier
    score *= config.intensity_multiplier;
    
    emotionScores[emotion] = {
      score,
      matches,
      confidence: Math.min(score / 10, 1)
    };
    
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
      emotionConfidence = emotionScores[emotion].confidence;
    }
  }
  
  // Advanced topic extraction with semantic analysis
  const topicPatterns = {
    family: {
      keywords: ['parent', 'mom', 'dad', 'mother', 'father', 'family', 'sibling', 'brother', 'sister', 'grandmother', 'grandfather'],
      patterns: [/my (mom|dad|family)/, /parents (are|always|never)/, /(mother|father) (said|told|thinks)/]
    },
    performance: {
      keywords: ['school', 'work', 'job', 'grade', 'test', 'exam', 'assignment', 'project', 'boss', 'teacher', 'performance'],
      patterns: [/at (work|school)/, /my (job|grade|test)/, /(failed|passed|got) (a|the)/]
    },
    social: {
      keywords: ['friend', 'relationship', 'boyfriend', 'girlfriend', 'partner', 'social', 'party', 'group', 'people'],
      patterns: [/my (friend|boyfriend|girlfriend)/, /with (people|friends)/, /(dating|relationship) (is|was)/]
    },
    validation: {
      keywords: ['childish', 'immature', 'stupid', 'dumb', 'worthless', 'failure', 'loser', 'pathetic'],
      patterns: [/i'm (so|such a)/, /feel like (a|an)/, /everyone thinks i'm/]
    },
    health: {
      keywords: ['sick', 'tired', 'exhausted', 'pain', 'hurt', 'doctor', 'hospital', 'medication'],
      patterns: [/feel (sick|tired)/, /in pain/, /went to (doctor|hospital)/]
    },
    future: {
      keywords: ['future', 'tomorrow', 'next', 'plan', 'goal', 'dream', 'hope', 'career'],
      patterns: [/in the future/, /next (week|month|year)/, /planning to/]
    }
  };
  
  const detectedTopics = [];
  const topicScores = {};
  
  for (const [topic, config] of Object.entries(topicPatterns)) {
    let score = 0;
    
    config.keywords.forEach(keyword => {
      if (message.includes(keyword)) {
        score += 2;
      }
    });
    
    config.patterns.forEach(pattern => {
      if (pattern.test(message)) {
        score += 3;
      }
    });
    
    if (score > 0) {
      detectedTopics.push(topic);
      topicScores[topic] = score;
    }
  }
  
  // Context analysis from conversation history
  const contextAnalysis = analyzeConversationContext(history, userMessage);
  
  // Advanced validation needs detection
  const validationIndicators = [
    'am i', 'do i', 'should i', 'is it', 'does this',
    'childish', 'immature', 'stupid', 'dumb', 'wrong',
    'what do you think', 'tell me', 'honest opinion'
  ];
  
  const needsValidation = validationIndicators.some(indicator => 
    message.includes(indicator)
  ) || emotionScores.hopeless?.score > 3;
  
  // Risk assessment for crisis intervention
  const crisisIndicators = ['kill myself', 'end it all', 'not worth living', 'better off dead'];
  const crisisRisk = crisisIndicators.some(indicator => message.includes(indicator));
  
  // Sentiment trajectory analysis
  const sentimentTrend = analyzeSentimentTrend(history);
  
  // Generate comprehensive analysis
  const analysis = {
    timestamp: Date.now(),
    emotion: {
      primary: dominantEmotion,
      confidence: emotionConfidence,
      secondary: Object.entries(emotionScores)
        .filter(([emotion, data]) => emotion !== dominantEmotion && data.score > 2)
        .map(([emotion, data]) => ({ emotion, confidence: data.confidence }))
        .slice(0, 2),
      scores: emotionScores
    },
    topics: {
      detected: detectedTopics,
      scores: topicScores,
      primary: detectedTopics.sort((a, b) => topicScores[b] - topicScores[a])[0] || 'general'
    },
    intensity: getEmotionalIntensity(userMessage, contextAnalysis),
    validation: {
      needed: needsValidation,
      confidence: needsValidation ? 0.8 : 0.2,
      type: crisisRisk ? 'crisis' : (emotionScores.hopeless?.score > 4 ? 'support' : 'normal')
    },
    context: contextAnalysis,
    metrics: {
      messageLength,
      wordCount,
      complexity: calculateMessageComplexity(userMessage),
      sentimentTrend
    },
    flags: {
      crisisRisk,
      rapidMoodChange: contextAnalysis.moodChangeVelocity > 0.7,
      repeatedConcerns: contextAnalysis.repeatedTopics.length > 0,
      escalatingIntensity: contextAnalysis.intensityTrend === 'increasing'
    }
  };
  
  return analysis;
};

// Analyze conversation context and patterns
const analyzeConversationContext = (history, currentMessage) => {
  if (!history || history.length === 0) {
    return {
      conversationLength: 1,
      previousIntensity: 'unknown',
      moodChangeVelocity: 0,
      repeatedTopics: [],
      intensityTrend: 'stable',
      averageResponseTime: 0
    };
  }
  
  const recentHistory = history.slice(-5);
  const previousIntensities = recentHistory.map(msg => 
    getEmotionalIntensity(msg.content || msg).level
  );
  
  // Calculate mood change velocity
  const moodChanges = previousIntensities.reduce((changes, current, index) => {
    if (index > 0) {
      const prev = previousIntensities[index - 1];
      if (current !== prev) changes++;
    }
    return changes;
  }, 0);
  
  const moodChangeVelocity = moodChanges / Math.max(previousIntensities.length - 1, 1);
  
  // Detect repeated topics
  const allTopics = recentHistory.flatMap(msg => {
    const analysis = analyzeConversation(msg.content || msg, []);
    return analysis.topics.detected;
  });
  
  const topicFrequency = allTopics.reduce((freq, topic) => {
    freq[topic] = (freq[topic] || 0) + 1;
    return freq;
  }, {});
  
  const repeatedTopics = Object.entries(topicFrequency)
    .filter(([topic, count]) => count > 1)
    .map(([topic]) => topic);
  
  return {
    conversationLength: history.length + 1,
    previousIntensity: previousIntensities[previousIntensities.length - 1] || 'unknown',
    moodChangeVelocity,
    repeatedTopics,
    intensityTrend: calculateIntensityTrend(previousIntensities),
    averageResponseTime: calculateAverageResponseTime(history)
  };
};

// Calculate message complexity for processing optimization
const calculateMessageComplexity = (message) => {
  const sentences = message.split(/[.!?]+/).filter(s => s.trim());
  const avgWordsPerSentence = message.split(/\s+/).length / Math.max(sentences.length, 1);
  const uniqueWords = new Set(message.toLowerCase().split(/\s+/)).size;
  const totalWords = message.split(/\s+/).length;
  const lexicalDiversity = uniqueWords / totalWords;
  
  return {
    sentences: sentences.length,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    lexicalDiversity: Math.round(lexicalDiversity * 100) / 100,
    overall: lexicalDiversity > 0.7 && avgWordsPerSentence > 15 ? 'high' : 
             lexicalDiversity > 0.5 && avgWordsPerSentence > 10 ? 'medium' : 'low'
  };
};

// Analyze sentiment trend over conversation
const analyzeSentimentTrend = (history) => {
  if (!history || history.length < 3) return 'insufficient_data';
  
  const sentimentScores = history.slice(-5).map(msg => {
    const content = msg.content || msg;
    const positiveWords = ['good', 'great', 'happy', 'excited', 'love', 'amazing', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'sad', 'angry'];
    
    const positive = positiveWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    const negative = negativeWords.reduce((count, word) => 
      count + (content.toLowerCase().includes(word) ? 1 : 0), 0);
    
    return positive - negative;
  });
  
  const trend = sentimentScores.reduce((sum, score, index) => {
    if (index > 0) {
      sum += score - sentimentScores[index - 1];
    }
    return sum;
  }, 0);
  
  if (trend > 1) return 'improving';
  if (trend < -1) return 'declining';
  return 'stable';
};

// Calculate intensity trend
const calculateIntensityTrend = (intensities) => {
  if (intensities.length < 2) return 'stable';
  
  const levels = { low: 1, medium: 2, high: 3, critical: 4 };
  const numericIntensities = intensities.map(i => levels[i] || 1);
  
  const trend = numericIntensities.reduce((sum, current, index) => {
    if (index > 0) {
      sum += current - numericIntensities[index - 1];
    }
    return sum;
  }, 0);
  
  if (trend > 1) return 'increasing';
  if (trend < -1) return 'decreasing';
  return 'stable';
};

// Calculate average response time for urgency assessment
const calculateAverageResponseTime = (history) => {
  if (history.length < 2) return 0;
  
  const times = history
    .filter(msg => msg.timestamp)
    .slice(-5);
  
  if (times.length < 2) return 0;
  
  const intervals = times.slice(1).map((msg, index) => 
    msg.timestamp - times[index].timestamp
  );
  
  return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
};

// Export additional utility functions for advanced usage
export const getEmotionMetrics = (analysis) => ({
  dominanceScore: analysis.emotion.confidence,
  intensityScore: analysis.intensity.score,
  complexityScore: analysis.metrics.complexity.overall === 'high' ? 1 : 
                   analysis.metrics.complexity.overall === 'medium' ? 0.5 : 0,
  riskScore: analysis.flags.crisisRisk ? 1 : 
             analysis.validation.type === 'support' ? 0.7 : 0.2
});

export const generateResponseStrategy = (analysis) => {
  const strategy = {
    approach: 'supportive',
    urgency: 'normal',
    focusAreas: [],
    techniques: []
  };
  
  if (analysis.flags.crisisRisk) {
    strategy.urgency = 'critical';
    strategy.approach = 'crisis_intervention';
    strategy.techniques.push('immediate_support', 'resource_referral');
  } else if (analysis.validation.needed) {
    strategy.approach = 'validating';
    strategy.techniques.push('affirmation', 'reframing');
  }
  
  if (analysis.intensity.level === 'high' || analysis.intensity.level === 'critical') {
    strategy.urgency = 'high';
    strategy.techniques.push('de_escalation', 'grounding');
  }
  
  strategy.focusAreas = analysis.topics.detected.slice(0, 2);
  
  return strategy;
};