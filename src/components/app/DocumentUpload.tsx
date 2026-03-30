"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { useAppStore, type UploadedDoc } from "@/lib/store";

interface DocumentUploadProps {
  stepId: string;
  documents: UploadedDoc[];
}

export function DocumentUpload({ stepId, documents }: DocumentUploadProps) {
  const addDocument = useAppStore((s) => s.addDocument);
  const removeDocument = useAppStore((s) => s.removeDocument);

  const handleFiles = useCallback(
    (files: FileList) => {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const doc: UploadedDoc = {
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            dataUrl: reader.result as string,
          };
          addDocument(stepId, doc);
        };
        reader.readAsDataURL(file);
      });
    },
    [stepId, addDocument]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label className="text-xs text-white/30 font-medium mb-1.5 block">
        Documents
      </label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border border-dashed border-white/10 rounded-lg p-4 text-center hover:border-brand-500/30 transition-colors cursor-pointer"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
          input.onchange = () => {
            if (input.files) handleFiles(input.files);
          };
          input.click();
        }}
      >
        <svg
          className="w-8 h-8 mx-auto mb-2 text-white/15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-xs text-white/30">
          Drop files here or <span className="text-brand-400">browse</span>
        </p>
        <p className="text-[10px] text-white/15 mt-1">
          PDF, JPG, PNG, DOC up to 10MB
        </p>
      </div>

      {/* Uploaded files */}
      {documents.length > 0 && (
        <div className="mt-3 space-y-2">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-2.5 bg-white/[0.03] rounded-lg"
            >
              <div className="w-8 h-8 rounded bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                {doc.type.includes("pdf") ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 truncate">{doc.name}</p>
                <p className="text-[10px] text-white/20">{formatSize(doc.size)}</p>
              </div>
              <button
                onClick={() => removeDocument(stepId, doc.id)}
                className="p-1 text-white/20 hover:text-red-400 transition-colors shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
