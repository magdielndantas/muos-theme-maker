"use client";

import { CheckCircle2, XCircle } from "lucide-react";

export type ToastType = { message: string; kind: "success" | "error" } | null;

interface ToastNotificationProps {
  toast: ToastType;
}

export function ToastNotification({ toast }: ToastNotificationProps) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-xl text-sm font-bold transition-all animate-in fade-in slide-in-from-bottom-2 ${
        toast.kind === "success"
          ? "bg-green-950/90 border-green-500/30 text-green-400"
          : "bg-red-950/90 border-red-500/30 text-red-400"
      }`}
    >
      {toast.kind === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      {toast.message}
    </div>
  );
}
