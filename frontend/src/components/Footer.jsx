import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/cricsphere-logo.png'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppClick = (platform) => {
    alert(`The CricSphere ${platform} app is Coming Soon! Stay tuned.`);
  };

  return (
    <footer className="relative bg-[#0b1220] text-slate-400 overflow-hidden font-sans border-t border-white/5">
      
      {/* --- Background Ambient Glows (Subtle Indigo/Blue for Dark Theme) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[10%] w-[30rem] h-[30rem] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-20 pb-10">
        
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-white/5 pb-12">
          
          {/* Brand Info - Cleaned up without container box */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/home" onClick={scrollToTop} className="flex items-center gap-3 group w-fit">
              <img 
                src={Logo} 
                alt="Logo" 
                className="w-10 h-10 object-contain transition-transform group-hover:scale-110" 
              />
              <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
                Cric<span className="text-blue-500">Sphere</span>
              </span>
            </Link>
            
            <p className="text-slate-500 leading-relaxed max-w-sm text-sm font-medium">
              Redefining the way you experience the game. Real-time telemetry, deep analytics, and global coverage in one seamless dashboard.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              {[
                { name: 'Twitter', path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { name: 'Facebook', path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                { name: 'Instagram', path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
                { name: 'YouTube', path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
              ].map((social) => (
                <a 
                  key={social.name} 
                  href={`#${social.name.toLowerCase()}`} 
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-white/[0.02] rounded-[2rem] p-8 border border-white/5 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight relative z-10">THE PULSE NEWSLETTER</h3>
              <p className="text-xs font-medium text-slate-500 mb-6 uppercase tracking-widest relative z-10">WEEKLY ANALYTICS & TRADE RUMORS.</p>
              
              <form className="flex flex-col sm:flex-row gap-3 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                />
                <button className="bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] px-8 py-3 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          
          {[
            { 
              title: "Live Cricket", 
              links: [
                { name: "Live Scores", to: "/live-scores", highlight: true },
                { name: "Upcoming Matches", to: "/schedules" },
                { name: "Series Archive", to: "/series" }
              ] 
            },
            { 
              title: "Stats & Analysis", 
              links: [
                { name: "Team Rankings", to: "/teams" },
                { name: "Player Records", to: "/stats" },
                { name: "MIS Scoreboard", to: "/stats" }
              ] 
            },
            { 
              title: "Support", 
              links: [
                { name: "About Us", to: "/about" },
                { name: "Privacy Policy", to: "/privacy" },
                { name: "Contact Us", to: "/contact" }
              ] 
            }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-8">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-sm font-bold text-slate-400 hover:text-blue-400 transition-all flex items-center gap-2 group">
                      {link.highlight && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Mobile App */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-8">Get the App</h4>
            <div className="space-y-3">
              <AppButton platform="iOS" sub="App Store" onClick={handleAppClick} />
              <AppButton platform="Android" sub="Google Play" onClick={handleAppClick} />
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: COPYRIGHT --- */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
            © {currentYear} CricSphere Engine. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-500">System Normal</span>
             </div>

             <button 
                onClick={scrollToTop} 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-blue-400 transition-colors"
             >
                Back to Top 
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- CLEAN HELPER COMPONENTS --- */

const AppButton = ({ platform, sub, onClick }) => (
  <button 
    onClick={() => onClick(platform)}
    className="w-full flex items-center gap-3 bg-white/5 border border-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all group"
  >
    <div className="w-6 h-6 flex items-center justify-center">
       {platform === 'iOS' ? (
         <svg className="w-full h-full fill-white" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.69-3.06 1.59-.69.82-1.27 2.1-1.09 3.19 1.19.09 2.38-.84 3.08-1.67z" /></svg>
       ) : (
         <svg className="w-full h-full fill-white" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>
       )}
    </div>
    <div className="text-left">
      <p className="text-[9px] font-black text-slate-600 uppercase leading-none mb-1">{sub}</p>
      <p className="text-xs font-black text-white uppercase">{platform}</p>
    </div>
  </button>
);

export default Footer;