"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore, type ChatMessage } from "@/lib/store";

export default function AgentPage() {
  const chatHistory = useAppStore((s) => s.chatHistory);
  const addMessage = useAppStore((s) => s.addMessage);
  const clearChat = useAppStore((s) => s.clearChat);
  const steps = useAppStore((s) => s.steps);
  const profile = useAppStore((s) => s.profile);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          history: chatHistory.slice(-10),
          context: {
            steps: steps.map((s) => ({
              label: s.label,
              status: s.status,
              docsCount: s.documents.length,
            })),
            profile: {
              visaType: profile.visaType,
              destination: profile.destination,
              nationality: profile.nationality,
            },
          },
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date().toISOString(),
      };
      addMessage(assistantMsg);
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I'm running in offline mode right now. To enable AI responses, add your ANTHROPIC_API_KEY to a `.env.local` file. In the meantime, I can still help you track your checklist - head to the Dashboard!",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What documents do I need for an Australian visitor visa?",
    "What are the photo requirements?",
    "How long does processing usually take?",
    "What should I bring to my biometrics appointment?",
  ];

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            AI Agent
          </h1>
          <p className="text-xs text-white/30">
            Ask anything about your visa application
          </p>
        </div>
        {chatHistory.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs text-white/20 hover:text-white/40 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.03]"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400">
                <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Visa Copilot Agent
            </h2>
            <p className="text-sm text-white/30 max-w-sm mb-8">
              I can help with your Australia Visitor Visa application. Ask me about requirements, documents, or next steps.
            </p>

            {/* Suggestions */}
            <div className="grid gap-2 w-full max-w-md">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                  }}
                  className="text-left text-sm text-white/40 hover:text-white/60 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-white/[0.05] border border-white/5 text-white/70"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/[0.05] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white/40">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Thinking...
                  </motion.span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 py-4 border-t border-white/5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your visa application..."
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-500/40 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-brand-600 hover:bg-brand-500 disabled:opacity-30 disabled:hover:bg-brand-600 text-white rounded-xl transition-colors shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
