"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "motion/react";

export default function ProfilePage() {
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const resetAll = useAppStore((s) => s.resetAll);
  const steps = useAppStore((s) => s.steps);

  const fields = [
    { key: "fullName" as const, label: "Full name (as on passport)", type: "text", placeholder: "John Smith" },
    { key: "email" as const, label: "Email address", type: "email", placeholder: "john@example.com" },
    { key: "nationality" as const, label: "Nationality", type: "text", placeholder: "e.g. British" },
    { key: "passportNumber" as const, label: "Passport number", type: "text", placeholder: "e.g. AB1234567" },
    { key: "dateOfBirth" as const, label: "Date of birth", type: "date", placeholder: "" },
    { key: "visaType" as const, label: "Visa type", type: "text", placeholder: "Australia Visitor Visa (Subclass 600)" },
    { key: "destination" as const, label: "Destination", type: "text", placeholder: "Australia" },
  ];

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const docsCount = steps.reduce((acc, s) => acc + s.documents.length, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Profile
        </h1>
        <p className="text-sm text-white/35 mb-8">
          Your personal details for the visa application
        </p>
      </motion.div>

      {/* Stats summary */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">{completedCount}</p>
          <p className="text-[10px] text-white/25 mt-0.5">Steps Done</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">{docsCount}</p>
          <p className="text-[10px] text-white/25 mt-0.5">Docs Uploaded</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">
            {Math.round((completedCount / steps.length) * 100)}%
          </p>
          <p className="text-[10px] text-white/25 mt-0.5">Progress</p>
        </div>
      </motion.div>

      {/* Form fields */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-xs text-white/30 font-medium mb-1.5 block">
              {field.label}
            </label>
            <input
              type={field.type}
              value={profile[field.key]}
              onChange={(e) => updateProfile({ [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white/70 placeholder:text-white/15 outline-none focus:border-brand-500/30 transition-colors"
            />
          </div>
        ))}
      </motion.div>

      {/* Danger zone */}
      <motion.div
        className="mt-12 pt-6 border-t border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-red-400/50 mb-3">
          Danger Zone
        </h2>
        <button
          onClick={() => {
            if (window.confirm("This will reset all your checklist progress, documents, and profile data. Are you sure?")) {
              resetAll();
            }
          }}
          className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl hover:bg-red-500/20 transition-colors"
        >
          Reset All Data
        </button>
        <p className="text-[11px] text-white/15 mt-2">
          This will clear all checklist progress, uploaded documents, and profile information.
        </p>
      </motion.div>
    </div>
  );
}
