"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import AppLayout from "@/components/AppLayout";

const EMOJIS = ["😊","😂","❤️","🔥","👍","✨","🧘","☕","🎉","😍","💕","🥰","🙌","😄","🫶"];

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const router = useRouter();
  const { matches, sendMessage, markRead } = useApp();
  const match = matches.find(m => m.id === matchId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (matchId) markRead(matchId); }, [matchId, markRead]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [match?.messages.length]);

  if (!match) return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 14, background: "#0d1117" }}>
        <div style={{ fontSize: "3rem" }}>💬</div>
        <p style={{ color: "#6b7280" }}>Conversation not found</p>
        <button onClick={() => router.push("/matches")} style={{ color: "#ff4d6d", background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>
          ← Back to Matches
        </button>
      </div>
    </AppLayout>
  );

  const send = () => {
    const t = input.trim();
    if (!t) return;
    sendMessage(matchId, t);
    setInput("");
  };

  const fmt = (d: Date) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#0d1117" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <button onClick={() => router.push("/matches")} style={{ fontSize: "1.2rem", background: "none", border: "none", cursor: "pointer", color: "#6b7280", padding: "4px 8px", borderRadius: 8 }}>
            ←
          </button>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1c2330", border: "2px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
            {match.profile.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Outfit',sans-serif" }}>
              {match.profile.name}, {match.profile.age}
            </div>
            <div style={{ fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 5, color: match.isOnline ? "#00d9b8" : "#4b5563" }}>
              {match.isOnline && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00d9b8", display: "inline-block" }} />}
              {match.isOnline ? "Active now" : "Offline"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["📹","📞","⋯"].map(ic => (
              <button key={ic} onClick={() => {}} style={{ width: 36, height: 36, borderRadius: 10, background: "none", border: "none", cursor: "pointer", fontSize: "1.05rem", color: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1c2330"; e.currentTarget.style.color = "#ff4d6d"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#6b7280"; }}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* ── Messages ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {/* Match banner */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "1.5rem 0 0.75rem", textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#1c2330", border: "2px solid rgba(255,77,109,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
              {match.profile.emoji}
            </div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>You matched with {match.profile.name}!</div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {match.profile.job} · {match.profile.city}
            </div>
            <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.08)", marginTop: 6 }} />
          </div>

          {match.messages.map(msg => {
            const mine = msg.senderId === "me";
            return (
              <div key={msg.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
                {!mine && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1c2330", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0, marginBottom: 2 }}>
                    {match.profile.emoji}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: "68%" }}>
                  <div style={{
                    padding: "10px 14px", fontSize: "0.875rem", lineHeight: 1.5, borderRadius: 18,
                    ...(mine
                      ? { background: "linear-gradient(135deg,#ff4d6d,#c91652)", color: "#fff", borderBottomRightRadius: 4 }
                      : { background: "#1c2330", color: "#e6edf3", border: "1px solid rgba(255,255,255,0.07)", borderBottomLeftRadius: 4 }),
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "#374151", textAlign: mine ? "right" : "left", padding: "0 4px" }}>
                    {fmt(msg.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* ── Emoji quick row ── */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "6px 14px", background: "#161b22", borderTop: "1px solid rgba(255,255,255,0.05)", scrollbarWidth: "none", flexShrink: 0 }}>
          {EMOJIS.map(em => (
            <button key={em} onClick={() => setInput(v => v + em)}
              style={{ flexShrink: 0, fontSize: "1.15rem", background: "none", border: "none", cursor: "pointer", borderRadius: 8, padding: "3px 5px", transition: "transform 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.35)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              {em}
            </button>
          ))}
        </div>

        {/* ── Input bar ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#161b22", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={`Message ${match.profile.name}...`}
            style={{ flex: 1, background: "#1c2330", border: "1px solid rgba(255,255,255,0.08)", color: "#e6edf3", padding: "10px 16px", borderRadius: 50, fontFamily: "'Outfit',sans-serif", fontSize: "0.875rem", outline: "none" }}
            onFocus={e => (e.target.style.borderColor = "rgba(255,77,109,0.5)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
          <button onClick={send} style={{
            width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0,
            background: input.trim() ? "linear-gradient(135deg,#ff4d6d,#c91652)" : "#1c2330",
            color: input.trim() ? "#fff" : "#4b5563",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
            transition: "all 0.2s",
          }}>
            ↗
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
