import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  MessageSquare,
  Sparkles,
  Activity,
} from "lucide-react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi 👋 I’m CricSphere Assistant.\nAsk me about live scores, schedules, stats, or how the app works.",
    },
  ]);

  const quickChips = ["Live Scores", "Schedules", "Stats", "Data Source", "Privacy"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const processMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text },
    ]);

    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: response },
      ]);
      setIsTyping(false);
    }, 850);
  };

  const generateResponse = (input) => {
    const q = input.toLowerCase();

    if (q.includes("live")) {
      return "CricSphere shows live match updates with a clean scoreboard view.\nWe refresh match data frequently to keep it accurate.";
    }
    if (q.includes("schedule")) {
      return "You can browse upcoming matches by series and date.\nThe schedule UI is designed to be simple and fast.";
    }
    if (q.includes("stat")) {
      return "Stats include team + player insights where available.\nWe keep it minimal so important numbers stand out.";
    }
    if (q.includes("source") || q.includes("api")) {
      return "We use trusted cricket data APIs to fetch match info.\nCaching is used to reduce repeated calls and improve speed.";
    }
    if (q.includes("privacy")) {
      return "We don’t sell your data.\nWe only store what’s needed for app functionality (like preferences).";
    }

    return "Got it ✅\nTry: Live Scores, Schedules, Stats, Data Source, or Privacy.";
  };

  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col items-end gap-3 max-w-[92vw]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] max-w-[340px] h-[440px] rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/10 flex items-center justify-center">
                  <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                </div>

                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      CricSphere Assistant
                    </p>
                    <Sparkles size={13} className="text-slate-400" />
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
                aria-label="Close chat"
              >
                <X size={18} className="text-slate-700 dark:text-slate-200" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 border-black/10 dark:border-white/10"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className={i !== 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-3 text-sm border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center gap-2">
                    <Activity
                      size={16}
                      className="text-blue-600 dark:text-blue-400 animate-pulse"
                    />
                    <span className="text-slate-500 dark:text-slate-400">
                      Typing...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chips + Input */}
            <div className="px-4 py-3 border-t border-black/10 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                {quickChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => processMessage(chip)}
                    className="whitespace-nowrap px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  processMessage(inputText);
                }}
                className="flex gap-2"
              >
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask something..."
                  className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="rounded-xl px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen((s) => !s)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-2xl px-4 py-3 border border-black/10 dark:border-white/10 bg-slate-900 text-white shadow-lg flex items-center gap-2"
      >
        {isOpen ? (
          <>
            <X size={18} />
            <span className="text-xs font-semibold">Close</span>
          </>
        ) : (
          <>
            <MessageSquare size={18} />
            <span className="text-xs font-semibold">Chat</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
