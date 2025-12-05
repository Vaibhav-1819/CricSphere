import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, MapPin, Send, MessageSquare, 
  User, ArrowRight, HelpCircle, Ticket,
  Globe, CheckCircle2, Headphones
} from 'lucide-react';

// --- Background Pattern (Subtle Pitch/Mesh Texture) ---
const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden opacity-20 pointer-events-none">
      <div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-0 right-0 top-0 h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent" />
    </div>
  );
};

// --- Live Support Badge ---
const SupportBadge = () => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 mb-8 shadow-sm backdrop-blur-md"
  >
    <div className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
      Support Team Active
    </span>
  </motion.div>
);

const Contact = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [category, setCategory] = useState('general');

  // Simulation of sending
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
        setIsSent(false);
        // Reset form logic here if needed
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden transition-colors duration-300">
      
      <BackgroundPattern />
      
      {/* Abstract Stadium Lights Blur */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LEFT: Context & Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative lg:sticky lg:top-28"
          >
            <SupportBadge />

            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
              We're Fielding <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Your Queries.
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mb-10">
              From bug reports to feature requests, our team is ready on the boundary line. We typically respond faster than a T20 timeout.
            </p>

            {/* Quick Stats / Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
               <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                     <MessageSquare size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Live Chat</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Available during live matches</p>
               </div>
               <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                     <Ticket size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Ticket System</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">24hr turnaround time</p>
               </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <a href="mailto:support@cricsphere.com" className="flex items-center gap-4 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Mail size={20} />
                <span className="font-medium">support@cricsphere.com</span>
              </a>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
                <MapPin size={20} />
                <span className="font-medium">Hyderabad, India (Global HQ)</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: User Friendly Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            {/* Form Card */}
            <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-slate-200 dark:border-slate-800 p-8 md:p-10 overflow-hidden">
              
              {/* Decorative Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Fill out the form below</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                   <Headphones size={24} />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Category Selector */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
                  {['General', 'Tech Support', 'Partnership'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat.toLowerCase())}
                      className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${
                        category === cat.toLowerCase() 
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      First Name
                    </label>
                    <div className={`flex items-center px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 transition-all ${focusedField === 'first' ? 'border-emerald-500 bg-white dark:bg-slate-800' : 'border-transparent'}`}>
                       <User size={18} className="text-slate-400 mr-3" />
                       <input 
                         type="text" 
                         onFocus={() => setFocusedField('first')}
                         onBlur={() => setFocusedField(null)}
                         className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                         placeholder="Virat" 
                       />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Last Name
                    </label>
                    <div className={`flex items-center px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 transition-all ${focusedField === 'last' ? 'border-emerald-500 bg-white dark:bg-slate-800' : 'border-transparent'}`}>
                       <input 
                         type="text" 
                         onFocus={() => setFocusedField('last')}
                         onBlur={() => setFocusedField(null)}
                         className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                         placeholder="Kohli" 
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className={`flex items-center px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 transition-all ${focusedField === 'email' ? 'border-emerald-500 bg-white dark:bg-slate-800' : 'border-transparent'}`}>
                     <Mail size={18} className="text-slate-400 mr-3" />
                     <input 
                       type="email" 
                       onFocus={() => setFocusedField('email')}
                       onBlur={() => setFocusedField(null)}
                       className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
                       placeholder="virat@rcb.com" 
                     />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Your Message
                  </label>
                  <div className={`flex items-start px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 transition-all ${focusedField === 'msg' ? 'border-emerald-500 bg-white dark:bg-slate-800' : 'border-transparent'}`}>
                     <MessageSquare size={18} className="text-slate-400 mr-3 mt-1" />
                     <textarea 
                       rows="4" 
                       onFocus={() => setFocusedField('msg')}
                       onBlur={() => setFocusedField(null)}
                       className="w-full bg-transparent outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400 resize-none"
                       placeholder="How can we help you today?"
                     ></textarea>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full group relative overflow-hidden flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all shadow-xl shadow-emerald-500/20 ${isSent ? 'bg-green-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}
                >
                  <AnimatePresence mode='wait'>
                    {isSent ? (
                      <motion.div 
                        key="sent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        <span>Message Sent!</span>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="send"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <span>Send Message</span>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

              </form>
            </div>
            
            {/* Card Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.2rem] -z-10 blur-xl opacity-20" />
            
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;