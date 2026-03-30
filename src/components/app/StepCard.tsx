"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore, type ChecklistStep, type StepStatus } from "@/lib/store";
import { DocumentUpload } from "./DocumentUpload";

export function StepCard({ step }: { step: ChecklistStep }) {
  const [expanded, setExpanded] = useState(false);
  const updateStepStatus = useAppStore((s) => s.updateStepStatus);
  const updateStepNotes = useAppStore((s) => s.updateStepNotes);

  const statusColors: Record<StepStatus, string> = {
    pending: "border-white/10 bg-white/[0.02]",
    in_progress: "border-brand-500/30 bg-brand-500/5",
    completed: "border-success-500/20 bg-success-500/5",
  };

  const statusLabels: Record<StepStatus, string> = {
    pending: "To Do",
    in_progress: "In Progress",
    completed: "Done",
  };

  const statusDotColors: Record<StepStatus, string> = {
    pending: "bg-white/20",
    in_progress: "bg-brand-400",
    completed: "bg-success-400",
  };

  const cycleStatus = () => {
    const order: StepStatus[] = ["pending", "in_progress", "completed"];
    const current = order.indexOf(step.status);
    const next = order[(current + 1) % order.length];
    updateStepStatus(step.id, next);
  };

  return (
    <div
      className={`border rounded-xl transition-all ${statusColors[step.status]}`}
    >
      {/* Header - always visible */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            cycleStatus();
          }}
          className="mt-0.5 shrink-0"
        >
          {step.status === "completed" ? (
            <motion.div
              className="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          ) : step.status === "in_progress" ? (
            <div className="w-6 h-6 rounded-full border-2 border-brand-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-white/15 hover:border-white/30 transition-colors" />
          )}
        </button>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              step.status === "completed"
                ? "text-white/40 line-through decoration-success-500/40"
                : "text-white/80"
            }`}
          >
            {step.label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider ${
                step.status === "completed"
                  ? "text-success-400"
                  : step.status === "in_progress"
                  ? "text-brand-300"
                  : "text-white/25"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[step.status]}`} />
              {statusLabels[step.status]}
            </span>
            {step.documents.length > 0 && (
              <span className="text-[10px] text-white/20">
                {step.documents.length} file{step.documents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Expand arrow */}
        <motion.div
          className="text-white/20 mt-1 shrink-0"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-4">
              <div className="border-t border-white/5 pt-4">
                <p className="text-sm text-white/40 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Status toggle buttons */}
              <div className="flex gap-2">
                {(["pending", "in_progress", "completed"] as StepStatus[]).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => updateStepStatus(step.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        step.status === status
                          ? status === "completed"
                            ? "bg-success-500/20 text-success-400"
                            : status === "in_progress"
                            ? "bg-brand-500/20 text-brand-300"
                            : "bg-white/10 text-white/60"
                          : "bg-white/[0.03] text-white/25 hover:text-white/40"
                      }`}
                    >
                      {statusLabels[status]}
                    </button>
                  )
                )}
              </div>

              {/* Document upload */}
              <DocumentUpload stepId={step.id} documents={step.documents} />

              {/* Notes */}
              <div>
                <label className="text-xs text-white/30 font-medium mb-1.5 block">
                  Notes
                </label>
                <textarea
                  value={step.notes}
                  onChange={(e) => updateStepNotes(step.id, e.target.value)}
                  placeholder="Add notes about this step..."
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 text-sm text-white/70 placeholder:text-white/15 outline-none focus:border-brand-500/30 transition-colors resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
