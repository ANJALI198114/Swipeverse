"use client";
import { useApp } from "@/lib/store";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 z-50 px-6 py-3 rounded-full text-sm font-medium toast-in"
      style={{
        transform: "translateX(-50%)",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        color: "var(--text)",
        fontFamily: "'Outfit', sans-serif",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {toast}
    </div>
  );
}
