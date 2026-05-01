"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const heartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = heartsRef.current;
    if (!container) return;
    const emojis = ["💕", "💘", "💖", "💗", "💝", "✨", "🌸"];
    const hearts: HTMLSpanElement[] = [];

    for (let i = 0; i < 14; i++) {
      const h = document.createElement("span");
      h.className = "float-heart";
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = Math.random() * 100 + "%";
      h.style.fontSize = 1 + Math.random() * 1.2 + "rem";
      h.style.animationDuration = 4 + Math.random() * 5 + "s";
      h.style.animationDelay = Math.random() * 6 + "s";
      container.appendChild(h);
      hearts.push(h);
    }
    return () => hearts.forEach((h) => h.remove());
  }, []);

  return (
    <main
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* BG orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 420, height: 420,
          background: "#ff4d6d", filter: "blur(90px)",
          opacity: 0.13, top: -120, right: -100,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 380, height: 380,
          background: "#00d9b8", filter: "blur(90px)",
          opacity: 0.11, bottom: -100, left: -80,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220, height: 220,
          background: "#7c3aed", filter: "blur(80px)",
          opacity: 0.12, top: "40%", left: "20%",
        }}
      />

      {/* Floating hearts */}
      <div ref={heartsRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo */}
        <div className="mb-6" style={{ width: 120, height: 120 }}>
          <div
            className="logo-spin rounded-full p-[3px]"
            style={{
              width: 120, height: 120,
              background: "linear-gradient(135deg, #ff4d6d, #7c3aed, #00d9b8)",
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-5xl"
              style={{ background: "var(--bg)" }}
            >
              💘
            </div>
          </div>
        </div>

        {/* App name */}
        <h1
          className="font-outfit font-extrabold tracking-[4px] text-6xl mb-2"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          <span className="grad-text">SWIPEVERSE</span>
        </h1>
        <p
          className="tracking-[5px] uppercase text-sm mb-10"
          style={{ color: "var(--text2)" }}
        >
          Unbiased Dating App
        </p>

        {/* CTA buttons */}
        <div className="flex gap-4 items-center flex-wrap justify-center">
          <button
            onClick={() => router.push("/auth?tab=login")}
            className="font-outfit font-bold uppercase tracking-[2px] px-10 py-4 rounded-full border-0 text-white transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #ff4d6d, #c91652)",
              boxShadow: "0 8px 28px rgba(255,77,109,0.35)",
            }}
          >
            Let&apos;s Start
          </button>
          <button
            onClick={() => router.push("/auth?tab=signup")}
            className="font-outfit px-10 py-4 rounded-full text-sm transition-all duration-300"
            style={{
              background: "transparent",
              border: "1.5px solid var(--border)",
              color: "var(--text2)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "#ff4d6d";
              (e.target as HTMLButtonElement).style.color = "#ff4d6d";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.borderColor = "var(--border)";
              (e.target as HTMLButtonElement).style.color = "var(--text2)";
            }}
          >
            Create Account
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-10 mt-14 flex-wrap justify-center">
          {[
            { num: "2M+", label: "Active Users" },
            { num: "850K+", label: "Matches Made" },
            { num: "98%", label: "Unbiased AI" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold grad-text">{num}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text3)" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
