"use client";
import { useApp } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function MatchModal() {
  const { matchModal, closeMatchModal, addMatch, currentUser } = useApp();
  const router = useRouter();

  if (!matchModal) return null;

  const handleMessage = () => {
    addMatch(matchModal);
    closeMatchModal();
    router.push("/matches");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}>
      <div className="match-pop" style={{ textAlign: "center", padding: "2.5rem 2rem", margin: "1rem", maxWidth: 380, width: "100%", background: "var(--bg2)", border: "1px solid rgba(255,77,109,0.3)", borderRadius: 28, boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: "3rem", marginBottom: 4 }}>🎉</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2.2rem", color: "#ff4d6d", fontStyle: "italic", marginBottom: 6 }}>
          It&apos;s a Match!
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--text2)", marginBottom: "1.5rem" }}>
          You and <strong style={{ color: "var(--text)" }}>{matchModal.name}</strong> liked each other
        </p>

        {/* Avatars */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "linear-gradient(135deg,#ff4d6d,#c91652)", border: "3px solid #00d9b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1rem", color: "#fff" }}>
            {currentUser.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: "1.5rem" }}>💕</div>
          </div>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--bg3)", border: "3px solid #ff4d6d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
            {matchModal.emoji}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={handleMessage} style={{ width: "100%", padding: "0.95rem", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", background: "linear-gradient(135deg,#ff4d6d,#c91652)", boxShadow: "0 6px 20px rgba(255,77,109,0.4)" }}>
            💬 Send a Message
          </button>
          <button onClick={() => { addMatch(matchModal); closeMatchModal(); }} style={{ width: "100%", padding: "0.8rem", borderRadius: 14, border: "1px solid var(--border)", cursor: "pointer", background: "transparent", color: "var(--text2)", fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem" }}>
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}
