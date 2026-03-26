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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 18c0-2.76 2.24-5 5-5s5 2.24 5 5" />
    </svg>
  ),
  camera: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  form: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  folder: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  payment: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  index,
}: ChecklistItemProps) {
  return (
    <motion.div
      className="checklist-item relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
      initial={{ opacity: 0, y: 20 }}
      style={{
        background:
          status === "processing"
            ? "rgba(99, 102, 241, 0.1)"
            : status === "completed"
            ? "rgba(34, 197, 94, 0.05)"
            : "transparent",
      }}
      data-index={index}
    >
      {/* Checkbox */}
      <div className="relative w-6 h-6 shrink-0">
        {status === "completed" ? (
          <motion.div
            className="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
        ) : status === "processing" ? (
          <motion.div
            className="w-6 h-6 rounded-full border-2 border-brand-400"
            animate={{
              borderColor: ["#818cf8", "#a78bfa", "#818cf8"],
              boxShadow: [
                "0 0 0px rgba(99,102,241,0)",
                "0 0 12px rgba(99,102,241,0.5)",
                "0 0 0px rgba(99,102,241,0)",
              ],
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-white/20" />
        )}
      </div>

      {/* Icon */}
      <span
        className={`shrink-0 ${
          status === "completed"
            ? "text-success-400"
            : status === "processing"
            ? "text-brand-300"
            : "text-white/40"
        }`}
      >
        {icons[icon]}
      </span>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            status === "completed"
              ? "text-white"
              : status === "processing"
              ? "text-brand-200"
              : "text-white/50"
          }`}
        >
          {label}
        </p>
        {status === "completed" && (
          <motion.p
            className="text-xs text-success-400/70 mt-0.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {detail}
          </motion.p>
        )}
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        {status === "completed" ? (
          <motion.span
            className="text-[10px] font-semibold uppercase tracking-wider text-success-400 bg-success-400/10 px-2 py-0.5 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Done
          </motion.span>
        ) : status === "processing" ? (
          <motion.span
            className="text-[10px] font-semibold uppercase tracking-wider text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-full"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Working...
          </motion.span>
        ) : (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/25 px-2 py-0.5">
            Pending
          </span>
        )}
      </div>

      {/* Processing glow effect */}
      {status === "processing" && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-brand-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
