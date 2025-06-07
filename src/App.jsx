import { useState } from 'react'
import './App.css'

// Components will be imported here
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChatInterface from './components/ChatInterface'
import Resources from './components/Resources'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* <Navbar /> */}
      <main className="">
        {!isChatOpen ? (
          <>
            <Hero onStartChat={() => setIsChatOpen(true)} />
            <Resources />
          </>
        ) : (
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        )}
      </main>
    </div>
  )
}

export default App
