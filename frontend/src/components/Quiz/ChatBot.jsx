import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBot = ({ onQuestionGenerated, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: "Bot Papi",
      message: "Hello! I'll help you generate quiz questions. Just tell me the topic and difficulty level (easy, medium, hard)!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = {
      sender: "You",
      message: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('https://cc-blog-backend.onrender.com/generate-question', {
        prompt: input,
      });

      const botMessage = {
        sender: "Bot Papi",
        message: res.data.result,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);

      // Call the callback only after we've shown the message
      if (onQuestionGenerated) {
        onQuestionGenerated(res.data.result);
      }
    } catch (error) {
      console.error("Error generating question:", error.message);
      const errorMessage = {
        sender: "Bot Papi",
        message: "⚠️ Oops! Something went wrong. Try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          className="bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] text-white p-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center">
            <span className="text-xl mr-2">🤖</span>
            <span>Ask Bot Papi</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md">
      <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden transform transition-all">
        {/* Chat header */}
        <div className="bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] p-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">🤖 Bot Papi</h2>
            <p className="text-xs opacity-80">Quiz Question Generator</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              title="Minimize"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              title="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.isUser
                    ? "bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-sm font-bold mb-1">{msg.sender}</div>
                <div className="whitespace-pre-wrap">{msg.message}</div>
                <div className="text-xs mt-1 opacity-70">{msg.time}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg max-w-[80%] bg-gray-100 text-gray-800">
                <div className="text-sm font-bold mb-1">Bot Papi</div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col space-y-2">
            <textarea
              ref={textareaRef}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4f5bd5] resize-none"
              placeholder="Type your request (e.g., 'Generate 5 medium difficulty questions about React')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '150px' }}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center justify-center"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;