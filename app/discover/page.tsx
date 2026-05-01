"use client";
import { useState, useCallback } from "react";
import { useApp } from "@/lib/store";
import { PROFILES } from "@/lib/data";
import SwipeCard from "@/components/SwipeCard";
import AppLayout from "@/components/AppLayout";

function ActionBtn({ onClick, size, bg, border, shadow, children }: {
  onClick: () => void; size: number;
  bg: string; border?: string; shadow?: string; children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: size, height: size, borderRadius: "50%", border: border || "none",
        background: bg, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: hov ? (shadow || "0 4px 20px rgba(255,77,109,0.3)") : "none",
        transform: hov ? "scale(1.1)" : "scale(1)",
        transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
        flexShrink: 0,
      }}>
      {children}
    </button>
  );
}

export default function DiscoverPage() {
  const { showMatchModal, showToast } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const advance = useCallback((dir: "left" | "right" | "super") => {
    const profile = PROFILES[currentIdx];
    if (!profile) return;
    if (dir === "right") {
      showToast("💚 Liked!");
      if (Math.random() > 0.45) setTimeout(() => showMatchModal(profile), 500);
    } else if (dir === "super") {
      showToast("⭐ Super Liked!");
      if (Math.random() > 0.3) setTimeout(() => showMatchModal(profile), 500);
    } else {
      showToast("✕ Passed");
    }
    setHistory(h => [...h, currentIdx]);
    setCurrentIdx(i => i + 1);
  }, [currentIdx, showMatchModal, showToast]);

  const rewind = () => {
    if (!history.length) { showToast("Nothing to rewind!"); return; }
    setCurrentIdx(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
    showToast("↩️ Rewound!");
  };

  const remaining = PROFILES.slice(currentIdx, currentIdx + 3);
  const done = currentIdx >= PROFILES.length;

  return (
    <AppLayout>
      <div style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.25rem 1rem 2rem", gap: "1.25rem", background: "#0d1117" }}>

        {/* Card stack */}
        <div style={{ position: "relative", width: "100%", maxWidth: 460, minHeight: 520 }}>
          {done ? (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", textAlign: "center", gap: 14,
              background: "#161b22", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)",
              padding: "2rem",
            }}>
              <div style={{ fontSize: "4rem" }}>🌍</div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>
                You&apos;ve seen everyone nearby!
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.5 }}>
                Expand your distance in settings or check back tomorrow for new profiles
              </p>
              <button
                onClick={() => { setCurrentIdx(0); setHistory([]); }}
                style={{ padding: "0.7rem 2rem", borderRadius: 50, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ff4d6d,#c91652)", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "0.9rem", marginTop: 4 }}
              >
                Start Over
              </button>
            </div>
          ) : (
            remaining.map((profile, i) => (
              <SwipeCard
                key={profile.id + "-" + currentIdx}
                profile={profile}
                position={(["top", "mid", "bot"] as const)[i]}
                onSwipe={i === 0 ? advance : undefined}
              />
            ))
          )}
        </div>

        {/* Action buttons */}
        {!done && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {/* Rewind */}
              <ActionBtn onClick={rewind} size={48} bg="rgba(245,158,11,0.12)" border="2px solid rgba(245,158,11,0.5)">
                <span style={{ fontSize: "1.1rem" }}>↩️</span>
              </ActionBtn>
              {/* Pass */}
              <ActionBtn onClick={() => advance("left")} size={60} bg="rgba(255,77,109,0.1)" border="2px solid rgba(255,77,109,0.5)">
                <span style={{ fontSize: "1.5rem", color: "#ff4d6d", fontWeight: 700 }}>✕</span>
              </ActionBtn>
              {/* Like — big center */}
              <ActionBtn onClick={() => advance("right")} size={78} bg="linear-gradient(135deg,#ff4d6d,#c91652)" shadow="0 10px 32px rgba(255,77,109,0.55)">
                <span style={{ fontSize: "1.9rem" }}>💖</span>
              </ActionBtn>
              {/* Super Like */}
              <ActionBtn onClick={() => advance("super")} size={60} bg="rgba(0,217,184,0.1)" border="2px solid rgba(0,217,184,0.5)">
                <span style={{ fontSize: "1.5rem" }}>⭐</span>
              </ActionBtn>
              {/* Boost */}
              <ActionBtn onClick={() => showToast("⚡ Profile boosted!")} size={48} bg="rgba(124,58,237,0.12)" border="2px solid rgba(124,58,237,0.5)">
                <span style={{ fontSize: "1.1rem" }}>⚡</span>
              </ActionBtn>
            </div>

            {/* Labels under buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {[
                { w: 48, label: "Rewind" },
                { w: 60, label: "Pass" },
                { w: 78, label: "Like" },
                { w: 60, label: "Super" },
                { w: 48, label: "Boost" },
              ].map(({ w, label }) => (
                <div key={label} style={{ width: w, textAlign: "center", fontSize: "0.6rem", color: "#4b5563", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" as const }}>
                  {label}
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.74rem", color: "#374151" }}>
              {PROFILES.length - currentIdx} of {PROFILES.length} profiles near you
            </p>
          </>
        )}
      </div>
    </AppLayout>
  );
}
