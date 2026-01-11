import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, X, Sparkles, ChevronLeft, 
  ChevronRight, MessageSquare, Zap, Globe, Shield
} from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const chipsContainerRef = useRef(null);
  
  const [scrollState, setScrollState] = useState({ left: false, right: true });

  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Hello! I'm **CricSphere AI**. 🏏\n\nI can help you explore our **MIS Analytics**, technical architecture, or upcoming match schedules. What can I help you with today?`, 
      sender: 'bot' 
    }
  ]);

  const quickChips = [
    "Tech Stack? 🛠️", "What is MIS? 📈", "Live Center 📡", 
    "Contact Support 📞", "Privacy Policy 🔒", "Upcoming Tours 📅"
  ];

  // --- Scroll Logic for Chips ---
  const handleScroll = () => {
    if (chipsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsContainerRef.current;
      setScrollState({
        left: scrollLeft > 10,
        right: scrollLeft < scrollWidth - clientWidth - 10
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    // Simulated Thinking Delay
    setTimeout(() => {
      const response = generateLocalResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1000);
  };

  const generateLocalResponse = (input) => {
    const query = input.toLowerCase();
    
    if (query.includes('tech') || query.includes('stack')) {
      return "🛠 **System Architecture:**\n\n• **Frontend:** React 19 + Framer Motion\n• **Backend:** Spring Boot (Java 21)\n• **Database:** MySQL for structured stats\n• **Styling:** Tailwind CSS (Slate Palette)";
    }
    if (query.includes('mis') || query.includes('impact')) {
      return "📈 **Match Impact Score (MIS):**\n\nOur custom algorithm goes beyond basic stats. It calculates player value based on **Run Acceleration**, **Death Over Economy**, and **Wicket-taking Pressure**.";
    }
    if (query.includes('live') || query.includes('score')) {
      return "📡 **Real-time Data:**\n\nLive scores are fetched via our **Spring Boot API** every 30 seconds. Head over to the **Live Score** tab for the full Match Center experience!";
    }
    if (query.includes('contact') || query.includes('support')) {
      return "📞 **Support Hub:**\n\nFor technical queries or feedback, email us at **support@cricsphere.com**. Our team is available Mon-Fri (9AM - 6PM IST).";
    }
    if (query.includes('privacy') || query.includes('data')) {
      return "🔒 **Data Security:**\n\nCricSphere uses **JWT (JSON Web Tokens)** for secure sessions. Your data is encrypted and we do not share your browsing history with third parties.";
    }

    return "🏏 I'm currently in 'Core Mode'. For more info, try asking about our **MIS Scoring**, **Tech Stack**, or **Support** channels!";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="w-[360px] md:w-[400px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* --- HEADER --- */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                    CricSphere AI <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Insight</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* --- CHAT AREA --- */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50 dark:bg-[#0b101a] no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-auto text-[10px] font-black ${msg.sender === 'user' ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : 'bg-blue-600 text-white'}`}>
                    {msg.sender === 'user' ? 'YOU' : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i !== 0 ? 'mt-2' : ''}>
                        {line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="text-blue-600 dark:text-blue-400 font-bold">{part}</strong> : part)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-auto"><Bot size={16} /></div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* --- FOOTER & CHIPS --- */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative mb-4 flex items-center">
                <div 
                  ref={chipsContainerRef} onScroll={handleScroll}
                  className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1"
                >
                  {quickChips.map((chip, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => processMessage(chip)}
                      className="whitespace-nowrap px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-blue-500 text-[11px] font-bold text-slate-500 dark:text-slate-400 transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); processMessage(inputText); }} className="flex gap-2">
                <input
                  type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-5 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-medium"
                />
                <button 
                  disabled={!inputText.trim()}
                  className="p-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative p-4 rounded-[1.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-500/40 flex items-center gap-3"
      >
        {isOpen ? <X size={24} /> : (
            <>
                <MessageSquare size={24} />
                <span className="font-bold pr-2">Chat with AI</span>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;