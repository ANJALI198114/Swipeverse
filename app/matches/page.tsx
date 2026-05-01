"use client";
import { useState } from "react";
import { useApp } from "@/lib/store";
import AppLayout from "@/components/AppLayout";
import { useRouter } from "next/navigation";
import { Match } from "@/types";

function timeAgo(d?: Date) {
  if (!d) return "";
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function MatchBubble({ m, onClick }: { m: Match; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", flexShrink: 0, transform: hov ? "translateY(-2px)" : "none", transition: "transform 0.18s" }}>
      <div style={{ position: "relative" }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg,#ff4d6d,#7c3aed)",
          padding: 2,
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1c2330", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem" }}>
            {m.profile.emoji}
          </div>
        </div>
        {m.isOnline && <div style={{ position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: "50%", background: "#00d9b8", border: "2.5px solid #0d1117" }} />}
      </div>
      <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500, maxWidth: 64, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {m.profile.name}
      </span>
    </button>
  );
}

function ConvRow({ m, onClick }: { m: Match; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16,
        background: hov ? "rgba(255,255,255,0.03)" : "#161b22",
        border: hov ? "1px solid rgba(255,77,109,0.3)" : "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer", transition: "all 0.18s",
      }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#1c2330", border: "2px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
          {m.profile.emoji}
        </div>
        {m.isOnline && <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: "#00d9b8", border: "2px solid #0d1117" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Outfit',sans-serif" }}>{m.profile.name}, {m.profile.age}</span>
          <span style={{ fontSize: "0.68rem", color: "#4b5563", flexShrink: 0 }}>{timeAgo(m.lastMessageTime)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: "0.8rem", color: m.unreadCount > 0 ? "#e6edf3" : "#6b7280", fontWeight: m.unreadCount > 0 ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {m.lastMessage || "Say hello! 👋"}
          </span>
          {m.unreadCount > 0 && (
            <span style={{ flexShrink: 0, minWidth: 20, height: 20, borderRadius: 50, background: "#ff4d6d", color: "#fff", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
              {m.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  const { matches } = useApp();
  const router = useRouter();
  const go = (id: string) => router.push(`/chat/${id}`);

  const newMatches = matches.filter(m => m.unreadCount > 0 && m.messages.length <= 1);
  const conversations = matches.filter(m => !(m.unreadCount > 0 && m.messages.length <= 1));

  return (
    <AppLayout>
      <div style={{ height: "100%", overflowY: "auto", background: "#0d1117", padding: "1.25rem 1.25rem 2rem" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {newMatches.length > 0 && (
            <section style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#9ca3af", marginBottom: "1rem", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
                🎉 New Matches — {newMatches.length}
              </h2>
              <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
                {newMatches.map(m => <MatchBubble key={m.id} m={m} onClick={() => go(m.id)} />)}
              </div>
            </section>
          )}

          <section>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#9ca3af", marginBottom: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "1px" }}>
              💬 Messages — {matches.length}
            </h2>

            {matches.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem", textAlign: "center", gap: 14, background: "#161b22", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: "3rem" }}>💬</div>
                <p style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "'Outfit',sans-serif" }}>No matches yet</p>
                <p style={{ fontSize: "0.84rem", color: "#6b7280", lineHeight: 1.5 }}>Start swiping to find people who like you back!</p>
                <button onClick={() => router.push("/discover")} style={{ padding: "0.7rem 1.75rem", borderRadius: 50, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ff4d6d,#c91652)", color: "#fff", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "0.88rem", marginTop: 4 }}>
                  🔥 Start Swiping
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...conversations, ...newMatches].map(m => <ConvRow key={m.id} m={m} onClick={() => go(m.id)} />)}
              </div>
            )}
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
