"use client";

import { motion } from "motion/react";

export function AgentAvatar({ processing }: { processing?: boolean }) {
  return (
    <motion.div
      className="relative flex items-center justify-center w-9 h-9 rounded-full shrink-0"
      style={{
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      }}
      animate={{
        scale: processing ? [1, 1.1, 1] : 1,
      }}
      transition={{
        duration: 1.5,
        repeat: processing ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {/* Bot icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27A7 7 0 0 1 7.27 19H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
        <circle cx="10" cy="13" r="1" fill="white" />
        <circle cx="14" cy="13" r="1" fill="white" />
        <path d="M9 17c.85.63 1.885 1 3 1s2.15-.37 3-1" />
      </svg>

      {/* Processing ring */}
      {processing && (
        <motion.div
          className="absolute inset-[-3px] rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "#a78bfa",
            borderRightColor: "rgba(167, 139, 250, 0.3)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Active dot */}
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success-400 rounded-full border-2 border-[#0a0118]" />
    </motion.div>
  );
}
