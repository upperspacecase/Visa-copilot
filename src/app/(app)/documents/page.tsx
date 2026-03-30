"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "motion/react";

export default function DocumentsPage() {
  const steps = useAppStore((s) => s.steps);
  const allDocs = steps.flatMap((step) =>
    step.documents.map((doc) => ({ ...doc, stepLabel: step.label, stepId: step.id }))
  );
  const removeDocument = useAppStore((s) => s.removeDocument);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Documents
        </h1>
        <p className="text-sm text-white/35 mb-6">
          {allDocs.length} file{allDocs.length !== 1 ? "s" : ""} uploaded across your application
        </p>
      </motion.div>

      {allDocs.length === 0 ? (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg
            className="w-16 h-16 mx-auto mb-4 text-white/10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-white/30 text-sm">No documents uploaded yet</p>
          <p className="text-white/15 text-xs mt-1">
            Go to the Dashboard and expand a checklist step to upload files
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {allDocs.map((doc, i) => (
            <motion.div
              key={doc.id}
              className="flex items-center gap-3 p-3 sm:p-4 bg-white/[0.02] border border-white/5 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {/* File icon */}
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                {doc.type.includes("pdf") ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                ) : doc.type.includes("image") ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 truncate font-medium">
                  {doc.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-white/25">
                    {formatSize(doc.size)}
                  </span>
                  <span className="text-white/10">|</span>
                  <span className="text-[11px] text-brand-400/50">
                    {doc.stepLabel}
                  </span>
                </div>
                <p className="text-[10px] text-white/15 mt-0.5">
                  {formatDate(doc.uploadedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {doc.dataUrl && (
                  <a
                    href={doc.dataUrl}
                    download={doc.name}
                    className="p-2 text-white/20 hover:text-white/50 transition-colors"
                    title="Download"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => removeDocument(doc.stepId, doc.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
