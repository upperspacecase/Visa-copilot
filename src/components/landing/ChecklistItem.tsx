"use client";

import { motion } from "motion/react";

type ChecklistItemProps = {
  label: string;
  detail: string;
  icon: string;
  status: "pending" | "processing" | "completed";
  index: number;
};

const icons: Record<string, React.ReactNode> = {
  passport: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5" />
    </svg>
  ),
  camera: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  form: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  folder: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  payment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  health: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

export function ChecklistItem({
  label,
  detail,
  icon,
  status,
}: ChecklistItemProps) {
  const isCompleted = status === "completed";
  const isProcessing = status === "processing";

  return (
    <div
      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
        isProcessing
          ? "bg-brand-500/10"
          : isCompleted
          ? "bg-success-500/5"
          : "bg-transparent"
      }`}
    >
      {/* Checkbox */}
      <div className="relative w-5 h-5 shrink-0">
        {isCompleted ? (
          <motion.div
            className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        ) : isProcessing ? (
          <motion.div
            className="w-5 h-5 rounded-full border-2 border-brand-400"
            animate={{
              boxShadow: [
                "0 0 0px rgba(99,102,241,0)",
                "0 0 10px rgba(99,102,241,0.5)",
                "0 0 0px rgba(99,102,241,0)",
              ],
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-white/15" />
        )}
      </div>

      {/* Icon */}
      <span
        className={`shrink-0 ${
          isCompleted
            ? "text-success-400/60"
            : isProcessing
            ? "text-brand-300"
            : "text-white/25"
        }`}
      >
        {icons[icon]}
      </span>

      {/* Label & detail */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] leading-tight font-medium ${
            isCompleted
              ? "text-white/40 line-through decoration-success-500/40"
              : isProcessing
              ? "text-brand-200"
              : "text-white/50"
          }`}
        >
          {label}
        </p>
        {isCompleted && (
          <motion.p
            className="text-[11px] text-success-400/60 mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {detail}
          </motion.p>
        )}
        {isProcessing && (
          <motion.p
            className="text-[11px] text-brand-400/50 mt-0.5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Processing...
          </motion.p>
        )}
      </div>

      {/* Status */}
      <div className="shrink-0">
        {isCompleted && (
          <motion.span
            className="text-[10px] font-semibold text-success-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Done
          </motion.span>
        )}
      </div>

      {/* Processing glow border */}
      {isProcessing && (
        <motion.div
          className="absolute inset-0 rounded-lg border border-brand-500/20 pointer-events-none"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}
