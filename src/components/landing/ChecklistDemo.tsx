"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useInView } from "motion/react";
import { CHECKLIST_ITEMS, AGENT_PROCESS_DELAY, SEQUENCE_RESTART_DELAY } from "@/lib/constants";
import { ChecklistItem } from "./ChecklistItem";
import { AgentAvatar } from "./AgentAvatar";

type ItemStatus = "pending" | "processing" | "completed";

export function ChecklistDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const [statuses, setStatuses] = useState<ItemStatus[]>(
    CHECKLIST_ITEMS.map(() => "pending")
  );
  const [currentAgent, setCurrentAgent] = useState(-1);
  const [showComplete, setShowComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const sequenceRef = useRef(false);

  const runSequence = useCallback(async () => {
    if (sequenceRef.current) return;
    sequenceRef.current = true;

    // Reset
    setStatuses(CHECKLIST_ITEMS.map(() => "pending"));
    setCurrentAgent(-1);
    setShowComplete(false);

    await delay(600);

    for (let i = 0; i < CHECKLIST_ITEMS.length; i++) {
      if (!sequenceRef.current) return;

      setCurrentAgent(i);
      setStatuses((prev) => {
        const next = [...prev];
        next[i] = "processing";
        return next;
      });

      await delay(AGENT_PROCESS_DELAY + Math.random() * 400);

      setStatuses((prev) => {
        const next = [...prev];
        next[i] = "completed";
        return next;
      });

      await delay(250);
    }

    setCurrentAgent(-1);
    setShowComplete(true);
    await delay(SEQUENCE_RESTART_DELAY);

    sequenceRef.current = false;
    setStarted(false);
  }, []);

  useEffect(() => {
    if (isInView && !started) {
      setStarted(true);
      runSequence();
    }
    if (!isInView) {
      sequenceRef.current = false;
    }
  }, [isInView, started, runSequence]);

  const completedCount = statuses.filter((s) => s === "completed").length;
  const progress = completedCount / CHECKLIST_ITEMS.length;

  return (
    <div ref={containerRef} className="w-full">
      {/* Browser window chrome */}
      <div className="browser-window rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-[10px] text-white/25 bg-white/5 px-3 py-0.5 rounded font-mono">
              visa-copilot.ai
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Content area */}
        <div className="p-3 sm:p-4">
          {/* Header row */}
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-white/5">
            <AgentAvatar processing={currentAgent >= 0} />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {currentAgent >= 0
                  ? "Agent working..."
                  : showComplete
                  ? "All tasks complete!"
                  : "Visa Copilot Agent"}
              </p>
              <p className="text-[11px] text-white/35 truncate">
                {currentAgent >= 0
                  ? `Step ${currentAgent + 1} of ${CHECKLIST_ITEMS.length}`
                  : showComplete
                  ? "Ready to submit"
                  : "Australia Visitor Visa (600)"}
              </p>
            </div>

            {/* Progress ring */}
            <div className="relative w-9 h-9 shrink-0">
              <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke={progress === 1 ? "#22c55e" : "#6366f1"}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 14}
                  animate={{
                    strokeDashoffset: 2 * Math.PI * 14 * (1 - progress),
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white/60">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Checklist items - always visible */}
          <div className="space-y-0.5">
            {CHECKLIST_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <ChecklistItem
                  label={item.label}
                  detail={item.detail}
                  icon={item.icon}
                  status={statuses[i]}
                  index={i}
                />
              </motion.div>
            ))}
          </div>

          {/* Completion banner */}
          {showComplete && (
            <motion.div
              className="mt-3 p-2.5 rounded-lg bg-success-500/10 border border-success-500/20 text-center"
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <p className="text-xs sm:text-sm font-semibold text-success-400">
                Application Ready to Submit
              </p>
              <p className="text-[11px] text-success-400/50 mt-0.5">
                All documents verified and forms completed
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
