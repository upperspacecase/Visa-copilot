"use client";

import { motion } from "motion/react";

export function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-[#0a0118]/70 border-b border-white/5"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-lg font-bold text-white">
          Visa<span className="text-brand-400">Copilot</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
      </div>

      <motion.button
        className="px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-colors"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Join Waitlist
      </motion.button>
    </motion.nav>
  );
}
