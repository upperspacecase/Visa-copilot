"use client";

import { useAppStore } from "@/lib/store";
import { StepCard } from "@/components/app/StepCard";
import { motion } from "motion/react";

const categories = [
  { key: "documents", label: "Documents", icon: "doc" },
  { key: "forms", label: "Forms & Applications", icon: "form" },
  { key: "appointments", label: "Appointments", icon: "calendar" },
  { key: "verification", label: "Verification", icon: "check" },
] as const;

export default function DashboardPage() {
  const steps = useAppStore((s) => s.steps);
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const inProgressCount = steps.filter((s) => s.status === "in_progress").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Your Visa Checklist
        </h1>
        <p className="text-sm text-white/35 mb-6">
          Australia Visitor Visa (Subclass 600)
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 sm:p-4">
          <p className="text-2xl sm:text-3xl font-bold text-white">{progress}%</p>
          <p className="text-[11px] text-white/30 mt-0.5">Complete</p>
          <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-success-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 sm:p-4">
          <p className="text-2xl sm:text-3xl font-bold text-brand-400">{inProgressCount}</p>
          <p className="text-[11px] text-white/30 mt-0.5">In Progress</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 sm:p-4">
          <p className="text-2xl sm:text-3xl font-bold text-success-400">{completedCount}</p>
          <p className="text-[11px] text-white/30 mt-0.5">Completed</p>
        </div>
      </motion.div>

      {/* Checklist by category */}
      {categories.map((cat, ci) => {
        const catSteps = steps.filter((s) => s.category === cat.key);
        if (catSteps.length === 0) return null;
        return (
          <motion.div
            key={cat.key}
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + ci * 0.05 }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">
              {cat.label}
            </h2>
            <div className="space-y-2">
              {catSteps.map((step) => (
                <StepCard key={step.id} step={step} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
