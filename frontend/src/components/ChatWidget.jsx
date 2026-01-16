import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, X, Sparkles, MessageSquare, 
  Zap, Globe, Shield, Activity, Terminal
} from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const chipsContainerRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `Welcome to **CricSphere Intelligence**. 🏏\n\nI am your technical guide. I can explain our **MIS Analytics**, the **Spring Boot** telemetry engine, or our **React 19** architecture. How shall we begin?`, 
      sender: 'bot' 
    }
  ]);

  const quickChips = [
    "Architecture? 🛠️", "What is MIS? 📈", "Security 🔒", 
    "Data Source 📡", "API Status 🟢"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processMessage = (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    // Simulated Backend Processing Delay
    setTimeout(() => {
      const response = generateTechnicalResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 1200);
  };

  const generateTechnicalResponse = (input) => {
    const query = input.toLowerCase();
    
    if (query.includes('arch') || query.includes('tech') || query.includes('stack')) {
      return "🛠 **CricSphere Tech Stack:**\n\n• **Core:** Java 21 + Spring Boot 3.2\n• **Security:** Stateless JWT Authentication\n• **State:** React Context API + Axios Interceptors\n• **Animations:** Framer Motion (60fps targets)";
    }
    if (query.includes('mis') || query.includes('impact') || query.includes('scoring')) {
      return "📈 **Impact Analysis (MIS):**\n\nOur engine calculates value using a **Weight-Based Algorithm**. We normalize player performance against **Match Phase**, **Pressure Index**, and **Venue difficulty** to provide a true impact score.";
    }
    if (query.includes('source') || query.includes('data') || query.includes('api')) {
      return "📡 **Data Telemetry:**\n\nWe aggregate data from multiple cricket feeds. The **Spring Boot** scheduler polls these sources, normalizes the DTOs, and serves them via our REST endpoints.";
    }
    if (query.includes('security') || query.includes('privacy') || query.includes('jwt')) {
      return "🔒 **Enterprise Security:**\n\nSessions are handled via **HttpOnly cookies** and **JWT**. We implement **Bcrypt** for password hashing and follow strict **CORS** policies to prevent unauthorized data access.";
    }

    return "🏏 I am focused on **CricSphere Technicals**. Try asking about our **MIS Logic**, **Spring Boot Backend**, or **JWT Security** protocols!";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-[360px] md:w-[420px] h-[600px] bg-[#080a0f] rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden"
          >
            {/* --- HEADER --- */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Terminal className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm flex items-center gap-2 uppercase tracking-tight">
                    Intelligence Bot <Sparkles className="w-3 h-3 text-blue-400 fill-blue-400" />
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* --- CHAT ENGINE --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-auto text-[9px] font-black ${msg.sender === 'user' ? 'bg-white/10 text-slate-400' : 'bg-blue-600 text-white'}`}>
                    {msg.sender === 'user' ? 'USR' : 'CS'}
                  </div>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none font-bold' 
                    : 'bg-white/5 text-slate-300 rounded-bl-none border border-white/5'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i !== 0 ? 'mt-3' : ''}>
                        {line.split('**').map((part, j) => j % 2 === 1 ? <span key={j} className="text-white font-black">{part}</span> : part)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-auto"><Activity size={14} className="animate-pulse" /></div>
                  <div className="bg-white/5 px-5 py-4 rounded-3xl rounded-bl-none border border-white/5 flex gap-1.5 items-center">
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT & CHIPS --- */}
            <div className="p-6 bg-black/40 border-t border-white/5">
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 px-1">
                {quickChips.map((chip, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => processMessage(chip)}
                    className="whitespace-nowrap px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-wider"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); processMessage(inputText); }} className="flex gap-3">
                <input
                  type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inquire about system..."
                  className="flex-1 px-6 py-4 bg-white/5 text-white rounded-2xl border border-white/5 focus:outline-none focus:border-blue-500 transition-all text-xs font-bold"
                />
                <button 
                  disabled={!inputText.trim()}
                  className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 disabled:opacity-30 transition-all shadow-xl shadow-blue-500/20"
                >
                  <Send size={18} />
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
        className="group relative p-5 rounded-[2rem] bg-blue-600 text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center gap-4 transition-all"
      >
        {isOpen ? <X size={24} /> : (
            <>
                <MessageSquare size={24} className="fill-white/20" />
                <span className="font-black uppercase text-[10px] tracking-[0.2em] pr-2">System Intel</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#080a0f] rounded-full" />
            </>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;