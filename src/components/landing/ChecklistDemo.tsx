"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useInView } from "motion/react";
import { CHECKLIST_ITEMS, AGENT_PROCESS_DELAY, SEQUENCE_RESTART_DELAY } from "@/lib/constants";
import { ChecklistItem } from "./ChecklistItem";
import { AgentAvatar } from "./AgentAvatar";

type ItemStatus = "pending" | "processing" | "completed";

export function ChecklistDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
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

    // Wait for items to appear
    await delay(800);

    // Process each item
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

      await delay(300);
    }

    // Show completion
    setCurrentAgent(-1);
    setShowComplete(true);

    await delay(SEQUENCE_RESTART_DELAY);

    // Restart
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

  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto">
      {/* Browser window chrome */}
      <div className="browser-window rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/10">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-[11px] text-white/30 bg-white/5 px-4 py-1 rounded-md font-mono">
              visa-copilot.ai/dashboard
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* Content area */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <AgentAvatar processing={currentAgent >= 0} />
            <div>
              <p className="text-sm font-semibold text-white">
                {currentAgent >= 0
                  ? "Agent working..."
                  : showComplete
                  ? "All tasks complete!"
                  : "Visa Copilot Agent"}
              </p>
              <p className="text-xs text-white/40">
                {currentAgent >= 0
                  ? `Processing step ${currentAgent + 1} of ${CHECKLIST_ITEMS.length}`
                  : showComplete
                  ? "Your application is ready to submit"
                  : "US B1/B2 Visa Application"}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="ml-auto">
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="rgba(255,255,255,0.07)"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="url(#progressGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 15}`}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 15 -
                        (statuses.filter((s) => s === "completed").length /
                          CHECKLIST_ITEMS.length) *
                          2 *
                          Math.PI *
                          15,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient
                      id="progressGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/70">
                  {Math.round(
                    (statuses.filter((s) => s === "completed").length /
                      CHECKLIST_ITEMS.length) *
                      100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1">
            {CHECKLIST_ITEMS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
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
              className="mt-4 p-3 rounded-xl bg-success-500/10 border border-success-500/20 text-center"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <p className="text-sm font-semibold text-success-400">
                Application Ready to Submit
              </p>
              <p className="text-xs text-success-400/60 mt-1">
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
