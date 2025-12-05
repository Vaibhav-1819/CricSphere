import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icons ---
const BotIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);
const SendIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);
const XIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const SparklesIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const ChevronUpIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m18 15-6-6-6 6"/></svg>
);
const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRightIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Refs & State for Chips Scrolling
  const messagesEndRef = useRef(null);
  const chipsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
  };

  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `${getGreeting()} I'm CricSphere AI. 🏏\nI can help you with live scores, tech stack details, privacy questions, or contacting support.`, 
      sender: 'bot' 
    }
  ]);

  const quickChips = [
    "Tech Stack? 🛠️",
    "Contact Support 📞",
    "How does MIS work? 🔥",
    "Privacy Policy 🔒",
    "Live Scores 📡",
    "Upcoming Matches 📅",
    "Player Stats 📊"
  ];

  // --- Scroll Logic for Chips ---
  const checkScroll = () => {
    if (chipsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipsContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [isOpen]);

  const scrollChips = (direction) => {
    if (chipsContainerRef.current) {
      const scrollAmount = 150;
      chipsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processMessage(inputText);
  };

  const processMessage = (text) => {
    const userMsg = { id: Date.now(), text: text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
      setIsTyping(false);
    }, 800);
  };

  const generateResponse = (input) => {
    const lower = input.toLowerCase();
    if (lower.includes('tech') || lower.includes('stack')) return "🛠 **Under the Hood:**\nCricSphere is built with:\n• **Frontend:** React.js + Tailwind CSS\n• **Backend:** Spring Boot (Java)\n• **Database:** MySQL\n• **Auth:** JWT Security";
    if (lower.includes('contact') || lower.includes('email')) return "📞 **Get in Touch:**\n• **Email:** support@cricsphere.com\n• **HQ:** Hyderabad, India\n\nVisit the Contact page for more!";
    if (lower.includes('privacy') || lower.includes('data')) return "🔒 **Data Security:**\nWe use **Spring Security** and **JWT** to protect your session. We only collect essential usage data.";
    if (lower.includes('mis') || lower.includes('impact')) return "🔥 **Match Impact Score (MIS):**\nOur signature metric! It weighs Runs, Strike Rate, Wickets, Economy, and Pressure to determine true player value.";
    if (lower.includes('live') || lower.includes('score')) return "📡 **Live Actions:**\nCheck the **'Live Scores'** tab for real-time updates powered by our Spring Boot backend.";
    if (lower.includes('hi') || lower.includes('hello')) return "Hello! 👋 Ask me about our Tech Stack or MIS Scoring.";
    return "🏏 I'm still learning! Try asking about:\n• Tech Stack\n• Contact Info\n• MIS Scores";
  };

  const hideScrollbarStyle = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans flex flex-col items-end">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[360px] md:w-[400px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* --- HEADER (Updated to Match Slate Theme) --- */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center relative shrink-0">
              <div className="flex items-center gap-3 relative z-10">
                {/* Bot Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <BotIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  {/* Title with Gradient Text to match About Us */}
                  <h3 className="font-bold text-lg leading-tight flex items-center gap-1 text-slate-900 dark:text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">
                      CricSphere AI
                    </span> 
                    <SparklesIcon className="w-3 h-3 text-amber-400 animate-pulse" />
                  </h3>
                  <div className="flex items-center gap-1.5 opacity-90">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* --- MESSAGES --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50 dark:bg-slate-950">
              <div className="text-center text-xs text-slate-400 font-medium opacity-60">
                Powered by CricSphere Intelligence
              </div>
              
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300' 
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                  }`}>
                    {msg.sender === 'user' ? <span className="text-xs font-bold">You</span> : <BotIcon className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center flex-shrink-0 mt-auto">
                    <BotIcon className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* --- QUICK CHIPS WITH ARROWS --- */}
            <div className="relative border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              {/* Left Arrow */}
              <AnimatePresence>
                {showLeftArrow && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => scrollChips('left')}
                    className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-slate-50 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900 flex items-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400">
                      <ChevronLeftIcon className="w-3 h-3" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Scrollable Container */}
              <div 
                ref={chipsContainerRef}
                onScroll={checkScroll}
                className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth"
                style={hideScrollbarStyle}
              >
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => processMessage(chip.replace(/[\u{1F300}-\u{1F6FF}]/gu, ''))} 
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm flex-shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <AnimatePresence>
                {showRightArrow && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={() => scrollChips('right')}
                    className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-slate-50 via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-900 flex items-center"
                  >
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400">
                      <ChevronRightIcon className="w-3 h-3" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* --- INPUT --- */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about stats..."
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-90' 
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/40'
        }`}
      >
        {isOpen ? <ChevronUpIcon className="w-6 h-6" /> : <BotIcon className="w-7 h-7" />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;