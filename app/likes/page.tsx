"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

const LIKED = [
  { emoji: "🎨", name: "Priya",  age: 25, city: "Delhi",     job: "UX Designer",       blurred: false },
  { emoji: "🌍", name: "Meera",  age: 24, city: "Hyderabad", job: "Travel Blogger",    blurred: true  },
  { emoji: "🎵", name: "Sarah",  age: 27, city: "Mumbai",    job: "Music Producer",    blurred: true  },
  { emoji: "📚", name: "Nadia",  age: 26, city: "Bengaluru", job: "Content Writer",    blurred: true  },
  { emoji: "💻", name: "Riya",   age: 22, city: "Bengaluru", job: "Software Engineer", blurred: true  },
  { emoji: "🧘", name: "Laila",  age: 23, city: "Noida",     job: "CA",               blurred: true  },
  { emoji: "🍳", name: "Aisha",  age: 25, city: "Mumbai",    job: "Chef",              blurred: true  },
  { emoji: "🎭", name: "Pooja",  age: 28, city: "Delhi",     job: "Actor",             blurred: true  },
];

function LikeCard({ item, onUnlock }: { item: typeof LIKED[0]; onUnlock: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={item.blurred ? onUnlock : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#161b22", borderRadius: 18, overflow: "hidden", cursor: item.blurred ? "pointer" : "default",
        border: hov ? "1px solid rgba(255,77,109,0.4)" : "1px solid rgba(255,255,255,0.06)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.2s", boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div style={{ height: 140, background: "#1c2330", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: "3.5rem", filter: item.blurred ? "blur(12px)" : "none", userSelect: "none" }}>
          {item.emoji}
        </span>
        {item.blurred && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,17,23,0.5)" }}>
            <div style={{ background: "rgba(0,0,0,0.7)", borderRadius: 50, padding: "6px 12px", fontSize: "0.75rem", color: "#fff", fontWeight: 600, border: "1px solid rgba(255,255,255,0.15)" }}>
              🔒 Gold Only
            </div>
          </div>
        )}
        <div style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#ff4d6d,#c91652)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>
          ❤
        </div>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Outfit',sans-serif", marginBottom: 2 }}>
          {item.blurred ? "???" : `${item.name}, ${item.age}`}
        </div>
        <div style={{ fontSize: "0.73rem", color: "#6b7280" }}>
          {item.blurred ? "Upgrade to reveal" : `${item.city} · ${item.job}`}
        </div>
      </div>
    </div>
  );
}

const PLANS = [
  { id: 0, label: "1 Month",   price: "₹599", per: "/mo", popular: false },
  { id: 1, label: "6 Months",  price: "₹349", per: "/mo", popular: true  },
  { id: 2, label: "12 Months", price: "₹249", per: "/mo", popular: false },
];

export default function LikesPage() {
  const [modal, setModal] = useState(false);
  const [sel, setSel] = useState(1);

  return (
    <AppLayout>
      <div style={{ height: "100%", overflowY: "auto", background: "#0d1117", padding: "1.25rem 1.25rem 2rem" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.2rem" }}>
              Likes You ❤️
            </h1>
            <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>8 people</span>
          </div>

          {/* Gold Banner */}
          <div style={{
            background: "linear-gradient(135deg,rgba(255,77,109,0.1),rgba(124,58,237,0.1))",
            border: "1px solid rgba(255,77,109,0.2)", borderRadius: 20,
            padding: "20px", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: "2.5rem" }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>
                8 people liked your profile
              </div>
              <div style={{ fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.5 }}>
                Upgrade to SwipeVerse Gold to see everyone and match instantly
              </div>
            </div>
            <button
              onClick={() => setModal(true)}
              style={{ padding: "10px 20px", borderRadius: 50, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000", fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "0.85rem", flexShrink: 0 }}
            >
              Unlock All ›
            </button>
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: "0.9rem" }}>
            {LIKED.map((item, i) => (
              <LikeCard key={i} item={item} onUnlock={() => setModal(true)} />
            ))}
          </div>
        </div>
      </div>

      {/* Gold Modal */}
      {modal && (
        <div onClick={() => setModal(false)} style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)" }}>
          <div onClick={e => e.stopPropagation()} className="match-pop"
            style={{ background: "#161b22", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 28, padding: "2rem 1.75rem", maxWidth: 380, width: "92%", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>⭐</div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.4rem", marginBottom: 6 }}>SwipeVerse Gold</h2>
            <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Unlock all likes · Unlimited swipes · Priority discovery · 5 Super Likes/day
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={() => setSel(p.id)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                  background: sel === p.id ? "rgba(245,158,11,0.1)" : "#1c2330",
                  border: sel === p.id ? "1.5px solid rgba(245,158,11,0.6)" : "1px solid rgba(255,255,255,0.07)",
                  transition: "all 0.18s",
                }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
                      {p.label}
                      {p.popular && <span style={{ fontSize: "0.6rem", padding: "2px 8px", borderRadius: 50, background: "#f59e0b", color: "#000", fontWeight: 800 }}>BEST VALUE</span>}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#f59e0b", fontFamily: "'Outfit',sans-serif" }}>
                    {p.price}<span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#6b7280" }}>{p.per}</span>
                  </div>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000", fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1rem", marginBottom: 10 }}>
              ⭐ Get Gold Now
            </button>
            <button onClick={() => setModal(false)} style={{ width: "100%", padding: "8px", borderRadius: 14, border: "none", cursor: "pointer", background: "transparent", color: "#4b5563", fontSize: "0.82rem", fontFamily: "'Outfit',sans-serif" }}>
              Maybe later
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
