import { useState, useRef, useEffect } from 'react'

const API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { 
      type: 'user', 
      content: input,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Check for emergency keywords
    const emergencyKeywords = ['suicide', 'kill myself', 'end it all', 'no reason to live', 'tired of living']
    const hasEmergency = emergencyKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    )

    if (hasEmergency) {
      setShowEmergency(true)
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I'm concerned about what you're sharing. You're not alone, and help is available right now. Would you like to speak with a crisis counselor?",
        timestamp: new Date(),
      }])
      setIsLoading(false)
      return
    }

    if (!API_TOKEN) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "API token is missing. Please contact the administrator.",
        timestamp: new Date(),
      }])
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: input }),
      })

      const data = await response.json()
      
      // Add bot response
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.generated_text || "I'm here to listen. Could you tell me more?",
        timestamp: new Date(),
      }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }])
    }

    setIsLoading(false)
  }

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  return (
    <div className="flex flex-col h-[80vh] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-md rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">MindCare Assistant</h2>
            <p className="text-sm text-gray-500">Always here to listen</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col max-w-[70%]">
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                {message.content}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emergency Banner */}
      {showEmergency && (
        <div className="bg-red-50 border-t border-red-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Need Immediate Help?</h3>
                <p className="text-sm text-red-700">Call our 24/7 crisis hotline: +233 123 456 789</p>
              </div>
            </div>
            <button
              onClick={() => setShowEmergency(false)}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white/80 backdrop-blur-md rounded-b-2xl">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white rounded-full px-6 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <span>Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInterface 