import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/cricsphere-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const comingSoon = (name) => {
    alert(`${name} is coming soon! 🚀`);
  };

  return (
    <footer className="relative border-t border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c]">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-gradient-to-b from-slate-50 via-white to-white dark:from-[#05070c] dark:via-[#05070c] dark:to-[#05070c]" />
        <div className="absolute inset-0 opacity-[0.18] dark:opacity-[0.10] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_55%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-black/10 dark:border-white/10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              to="/home"
              onClick={scrollToTop}
              className="flex items-center gap-3 w-fit"
            >
              <img src={Logo} alt="CricSphere" className="w-9 h-9" />
              <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                CricSphere
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
              Live cricket updates, match intelligence, and clean analytics —
              designed with a modern dashboard experience.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-3">
              <SocialIcon
                label="Twitter / X"
                onClick={() => comingSoon("Twitter / X")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
              />

              <SocialIcon
                label="Facebook"
                onClick={() => comingSoon("Facebook")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                }
              />

              <SocialIcon
                label="Instagram"
                onClick={() => comingSoon("Instagram")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                }
              />

              <SocialIcon
                label="YouTube"
                onClick={() => comingSoon("YouTube")}
                icon={
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Subscribe to updates
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Weekly match insights, product improvements, and feature drops.
              </p>

              <form
                className="mt-5 flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#05070c] px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <button className="rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold hover:bg-slate-800 transition">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {[
            {
              title: "Live Cricket",
              links: [
                { name: "Home", to: "/home" },
                { name: "Live Scores", to: "/live-scores" },
                { name: "Series Schedules", to: "/schedules" },
              ],
            },
            {
              title: "Stats & Analysis",
              links: [
                { name: "Teams", to: "/teams" },
                { name: "Rankings", to: "/stats" },
                { name: "Premium", to: "/premium" },
              ],
            },
            {
              title: "Support",
              links: [
                { name: "About", to: "/about" },
                { name: "Privacy Policy", to: "/privacy" },
                { name: "Terms of Service", to: "/terms" },
                { name: "Contact", to: "/contact" },
              ],
            },

          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              Get the App
            </h4>

            <div className="mt-4 space-y-3">
              <AppButton platform="iOS" sub="App Store" onClick={comingSoon} />
              <AppButton platform="Android" sub="Google Play" onClick={comingSoon} />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {currentYear} CricSphere. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition"
    >
      {icon}
    </button>
  );
};

const AppButton = ({ platform, sub, onClick }) => {
  return (
    <button
      onClick={() => onClick(`${platform} App`)}
      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/10 transition"
    >
      <p className="text-[11px] text-slate-500 dark:text-slate-400">{sub}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {platform}
      </p>
    </button>
  );
};

export default Footer;
