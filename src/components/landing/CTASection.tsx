"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-24 px-6" ref={ref}>
      <motion.div
        className="max-w-3xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900/80 to-brand-800/50 border border-brand-500/20 p-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-500/20 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to simplify your{" "}
            <span className="text-gradient">visa journey</span>?
          </h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto mb-8">
            Join thousands of applicants who let AI handle the paperwork. Get early access and be first in line.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-brand-500/50 transition-colors"
            />
            <motion.button
              className="glow-button px-8 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Join Waitlist
            </motion.button>
          </div>

          <p className="text-xs text-white/20 mt-4">
            Free during beta. No spam, unsubscribe anytime.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
