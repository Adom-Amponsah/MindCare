import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, PlusCircle, Edit, MessageSquare, MoreVertical, Loader, Menu, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { 
  getUserConversations, 
  getConversationMessages, 
  createNewConversation,
  addMessageToConversation,
  updateConversationTitle,
  getConversationContext,
  updateConversationContext
} from '../firebase/userService';
import { generateAIResponse, detectCrisisSituation, getCrisisResponse, getConversationInsights, resetConversationContext, importConversationContext, exportConversationContext } from '../services/aiService';
import { getSuggestedResources } from '../services/resourceService';
import ResourceSuggestion from './ResourceSuggestion';

const Chat = ({ onClose }) => {
  const { currentUser, userData } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const chatContainerRef = useRef(null);
  const [conversationContext, setConversationContext] = useState(null);

  // Detect if mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowDrawer(false); // Hide drawer on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Load conversations on component mount
  useEffect(() => {
    const loadConversations = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const userConversations = await getUserConversations(currentUser.uid);
          
          if (userConversations.length === 0) {
            // Create a new conversation ONLY if none exist
            const newConversationId = await createNewConversation(
              currentUser.uid, 
              "New Conversation"
            );
            
            // Add welcome message
            await addMessageToConversation(
              currentUser.uid,
              newConversationId,
              { 
                role: 'assistant', 
                content: `Hello ${currentUser?.displayName || userData?.displayName || 'there'}! How are you feeling today? I'm here to listen and help.`,
                timestamp: new Date()
              }
            );
            
            // Reload conversations
            const freshConversations = await getUserConversations(currentUser.uid);
            setConversations(freshConversations);
            setActiveConversationId(newConversationId);
          } else {
            // Use existing conversations
            setConversations(userConversations);
            setActiveConversationId(userConversations[0].id);
          }
        } catch (error) {
          console.error('Error loading conversations:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadConversations();
  }, [currentUser, userData]);

  // Load messages and context for active conversation
  useEffect(() => {
    const loadMessagesAndContext = async () => {
      if (currentUser && activeConversationId) {
        try {
          setLoading(true);
          const messages = await getConversationMessages(currentUser.uid, activeConversationId);
          setChatHistory(messages);
          // Load context
          let ctx = await getConversationContext(currentUser.uid, activeConversationId);
          if (!ctx) {
            // If context does not exist, create and save it
            ctx = resetConversationContext();
            await updateConversationContext(currentUser.uid, activeConversationId, exportConversationContext());
          } else {
            importConversationContext(ctx);
          }
          setConversationContext(getConversationInsights());
        } catch (error) {
          console.error('Error loading messages/context:', error);
          setChatHistory([]);
          setConversationContext(null);
        } finally {
          setLoading(false);
        }
      }
    };
    if (activeConversationId) {
      loadMessagesAndContext();
    }
  }, [currentUser, activeConversationId]);

  // Scroll to bottom when chat history changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !activeConversationId) return;
    const userMessage = { 
      role: 'user', 
      content: message,
      timestamp: new Date()
    };
    setChatHistory(prevHistory => [...prevHistory, userMessage]);
    setMessage('');
    await addMessageToConversation(currentUser.uid, activeConversationId, userMessage);
    setIsTyping(true);
    try {
      // Crisis detection
      const crisisAssessment = detectCrisisSituation(message);
      if (crisisAssessment && crisisAssessment.isActive) {
        const crisisResponse = getCrisisResponse(crisisAssessment);
        const assistantMessage = { 
          role: 'assistant', 
          content: crisisResponse.message,
          timestamp: new Date(),
          isEmergency: true,
          resources: crisisResponse.resources
        };
        setChatHistory(prevHistory => [...prevHistory, assistantMessage]);
        await addMessageToConversation(currentUser.uid, activeConversationId, assistantMessage);
      } else {
        // Pass context to AI (if needed, you can set aiService.js context here)
        const aiResponse = await generateAIResponse(
          message, 
          chatHistory.slice(-10)
        );
        // Get updated context from aiService
        const updatedContext = exportConversationContext();
        setConversationContext(updatedContext);
        await updateConversationContext(currentUser.uid, activeConversationId, updatedContext);
        // Get resource suggestions
        const updatedChatHistory = [...chatHistory, userMessage];
        const resourceSuggestion = getSuggestedResources(updatedChatHistory);
        const assistantMessage = { 
          role: 'assistant', 
          content: aiResponse,
          timestamp: new Date(),
          resourceSuggestion: resourceSuggestion.shouldSuggest ? resourceSuggestion : null
        };
        setChatHistory(prevHistory => [...prevHistory, assistantMessage]);
        await addMessageToConversation(currentUser.uid, activeConversationId, assistantMessage);
      }
      // Refresh conversations list
      const updatedConversations = await getUserConversations(currentUser.uid);
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error generating response:', error);
      const fallbackMessage = { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Can we try again in a moment?",
        timestamp: new Date()
      };
      setChatHistory(prevHistory => [...prevHistory, fallbackMessage]);
      await addMessageToConversation(currentUser.uid, activeConversationId, fallbackMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = async () => {
    if (!currentUser) return;
    
    try {
      // Create new conversation
      const newConversationId = await createNewConversation(
        currentUser.uid, 
        "New Conversation"
      );
      
      // Add welcome message
      await addMessageToConversation(
        currentUser.uid,
        newConversationId,
        { 
          role: 'assistant', 
          content: `Hello again! How can I help you today?`,
          timestamp: new Date()
        }
      );
      
      // Refresh conversations and set active
      const updatedConversations = await getUserConversations(currentUser.uid);
      setConversations(updatedConversations);
      setActiveConversationId(newConversationId);
      
      // Close drawer on mobile
      if (isMobile) {
        setShowDrawer(false);
      }
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  const handleEditTitle = async (conversationId, title) => {
    setEditingTitle(conversationId);
    setNewTitle(title);
  };

  const handleSaveTitle = async (conversationId) => {
    if (!newTitle.trim()) return;
    
    try {
      await updateConversationTitle(currentUser.uid, conversationId, newTitle);
      
      // Refresh conversations
      const updatedConversations = await getUserConversations(currentUser.uid);
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error updating title:', error);
    } finally {
      setEditingTitle(null);
      setNewTitle('');
    }
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    if (isMobile) {
      setShowDrawer(false);
    }
  };

  const formatTimestamp = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date instanceof Date ? date : date.toDate());
  };

  // Get active conversation title
  const activeConversationTitle = conversations.find(conv => conv.id === activeConversationId)?.title || 'Chat';

  if (loading && conversations.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 items-center justify-center">
        <div className="text-white text-lg">Loading your conversations...</div>
        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500">
      {/* Mobile drawer overlay */}
      {isMobile && showDrawer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Conversations sidebar - responsive */}
      <div 
        className={`${
          isMobile 
            ? `fixed left-0 top-0 bottom-0 z-30 w-80 transform ${showDrawer ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out` 
            : 'w-80'
        } bg-gray-900/30 backdrop-blur-md border-r border-white/10 flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Conversations</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleNewConversation}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              title="New conversation"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            {isMobile && (
              <button 
                onClick={() => setShowDrawer(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <div 
              key={conversation.id}
              className={`p-3 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                activeConversationId === conversation.id ? 'bg-white/10' : ''
              }`}
              onClick={() => handleSelectConversation(conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="text-white/70 w-5 h-5" />
                  
                  {editingTitle === conversation.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(conversation.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(conversation.id)}
                      className="bg-white/20 text-white rounded px-2 py-1 text-sm w-full"
                      autoFocus
                    />
                  ) : (
                    <h3 
                      className="text-white font-medium truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTitle(conversation.id, conversation.title);
                      }}
                    >
                      {conversation.title}
                    </h3>
                  )}
                </div>
                
                {!editingTitle && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTitle(conversation.id, conversation.title);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/10 text-white/70 transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              {conversation.lastMessage && (
                <div className="mt-1 flex justify-between">
                  <p className="text-white/50 text-xs truncate max-w-[180px]">
                    {conversation.lastMessageRole === 'user' ? 'You: ' : ''}
                    {conversation.lastMessage}
                  </p>
                  <span className="text-white/30 text-xs">
                    {conversation.updatedAt && formatTimestamp(conversation.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Chat header */}
        <div className="bg-white/10 backdrop-blur-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile ? (
              <button 
                onClick={() => setShowDrawer(true)}
                className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Menu className="text-white w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={onClose} 
                className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="text-white w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-white font-bold text-lg">{activeConversationTitle}</h2>
              <p className="text-white/70 text-sm">MindCare Assistant</p>
            </div>
          </div>
          
          {isMobile && (
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="text-white w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Chat messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          ) : (
            <>
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-[#fbbf24] text-white rounded-tr-none' 
                        : 'bg-white/20 backdrop-blur-sm text-white rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                    
                    {/* Display crisis resources if available */}
                    {msg.isEmergency && msg.resources && (
                      <div className="mt-3 border-t border-white/30 pt-2">
                        <p className="font-semibold mb-1">Emergency Resources:</p>
                        <ul className="space-y-1">
                          {msg.resources.map((resource, idx) => (
                            <li key={idx} className="text-sm">
                              <span className="font-medium">{resource.name}:</span> {resource.contact} ({resource.available})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Display resource suggestions if available */}
                    {msg.resourceSuggestion && (
                      <div className="mt-4">
                        <ResourceSuggestion suggestion={msg.resourceSuggestion} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/20 backdrop-blur-sm text-white rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Message input */}
        <div className="p-4 bg-white/10 backdrop-blur-md">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/20 backdrop-blur-sm text-white placeholder-white/50 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              disabled={!activeConversationId || isTyping}
            />
            <button 
              type="submit"
              className="bg-[#fbbf24] p-3 rounded-full text-white hover:bg-[#f59e0b] transition-colors"
              disabled={!message.trim() || isTyping || !activeConversationId}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-white/50 text-xs text-center mt-2">
            Your conversations are private and secure
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 