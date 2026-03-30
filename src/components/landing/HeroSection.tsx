"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChecklistDemo } from "./ChecklistDemo";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Copy */}
        <motion.div
          className="text-center lg:text-left order-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
            AI-Powered Visa Applications
          </motion.div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6">
            Your{" "}
            <span className="text-gradient">AI Copilot</span>
            <br />
            for Visa Applications
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-lg mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
            Stop juggling documents and deadlines. Visa Copilot&apos;s AI agent
            organizes, verifies, and completes your visa application steps -- so
            you don&apos;t miss a thing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link href="/dashboard">
              <motion.button
                className="glow-button w-full px-8 py-3 sm:py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Your Application
              </motion.button>
            </Link>
            <Link href="#how-it-works">
              <motion.button
                className="w-full px-8 py-3 sm:py-3.5 rounded-full border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-medium text-sm transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                See How It Works
              </motion.button>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-6 mt-10 justify-center lg:justify-start text-sm text-white/30">
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Bank-level encryption
            </span>
          </div>
        </motion.div>

        {/* Animated demo */}
        <motion.div
          className="order-2 w-full max-w-md mx-auto lg:max-w-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <ChecklistDemo />
        </motion.div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
