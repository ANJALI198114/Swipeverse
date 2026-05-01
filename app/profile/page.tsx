"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { useApp } from "@/lib/store";

/* ═══════════════════════════════════════════════════════════════
   All sub-components defined at module level — never inside render
   ═══════════════════════════════════════════════════════════════ */

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      role="switch"
      aria-checked={on}
      onClick={() => setOn(v => !v)}
      style={{
        width: 46, height: 26, borderRadius: 13, cursor: "pointer", flexShrink: 0,
        background: on ? "linear-gradient(135deg,#ff4d6d,#c91652)" : "#2d3748",
        border: on ? "none" : "1px solid #374151",
        position: "relative", transition: "background 0.25s",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 23 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

function Row({
  icon, iconBg, label, right, onClick, danger, last,
}: {
  icon: string; iconBg: string; label: string;
  right?: React.ReactNode; onClick?: () => void;
  danger?: boolean; last?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "13px 20px",
        borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)",
        cursor: onClick ? "pointer" : "default",
        background: hov && onClick ? "rgba(255,255,255,0.025)" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1rem",
      }}>
        {icon}
      </div>
      <div style={{
        flex: 1, fontSize: "0.88rem", fontWeight: 500,
        color: danger ? "#f87171" : "var(--text)",
        fontFamily: "'Outfit', sans-serif",
      }}>
        {label}
      </div>
      {right}
    </div>
  );
}

function Chevron() {
  return <span style={{ fontSize: "0.85rem", color: "#4b5563" }}>›</span>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#161b22", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16, overflow: "hidden",
    }}>
      <div style={{
        padding: "10px 20px",
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.8px",
        textTransform: "uppercase" as const, color: "#4b5563",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatBox({ num, label, icon }: { num: number; label: string; icon: string }) {
  return (
    <div style={{
      flex: 1, textAlign: "center", padding: "14px 8px",
      background: "#1c2330", borderRadius: 12,
    }}>
      <div style={{
        fontSize: "1.6rem", fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
        background: "linear-gradient(135deg,#ff4d6d,#00d9b8)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {num}
      </div>
      <div style={{ fontSize: "0.62rem", color: "#6b7280", marginTop: 3 }}>{icon} {label}</div>
    </div>
  );
}

function Chip({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{
      fontSize: "0.73rem", fontWeight: 600, padding: "4px 12px",
      borderRadius: 50, background: bg, color,
      border: `1px solid ${color}33`,
    }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const router = useRouter();
  const { currentUser } = useApp();

  const name     = currentUser.name    || "User";
  const username = currentUser.username || name.toLowerCase().replace(/\s+/g, "");
  const age      = currentUser.age;
  const city     = currentUser.city    || "India";
  const job      = currentUser.job     || "Professional";
  const bio      = currentUser.bio     || "Hey there! I'm using SwipeVerse 💘";
  const gender   = currentUser.gender  || "";
  const intent   = currentUser.lookingFor || "";
  const initials = currentUser.initials || name.slice(0,2).toUpperCase();

  return (
    <AppLayout>
      <div style={{
        height: "100%", overflowY: "auto",
        background: "#0d1117",
        padding: "0 0 2rem",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.25rem 1.25rem 0" }}>

          {/* ─── PROFILE HERO ─────────────────────────────────────── */}
          <div style={{
            background: "#161b22", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 20, overflow: "hidden", marginBottom: "1rem",
          }}>
            {/* Banner */}
            <div style={{
              height: 120,
              background: "linear-gradient(135deg, #ff4d6d 0%, #7c3aed 50%, #00d9b8 100%)",
              position: "relative",
            }}>
              {/* Edit button top-right */}
              <button
                style={{
                  position: "absolute", top: 12, right: 12,
                  padding: "6px 14px", borderRadius: 50,
                  background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff", fontSize: "0.75rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  backdropFilter: "blur(8px)",
                }}
              >
                ✏️ Edit
              </button>
            </div>

            {/* Avatar — sits BELOW banner, NOT inside it */}
            <div style={{ padding: "0 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: -44, marginBottom: 16 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: "linear-gradient(135deg,#ff4d6d,#c91652)",
                  border: "4px solid #161b22",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.9rem", fontWeight: 800, color: "#fff",
                  flexShrink: 0,
                }}>
                  {initials}
                </div>
                {/* Completeness badge */}
                <div style={{
                  background: "rgba(0,217,184,0.12)", border: "1px solid rgba(0,217,184,0.3)",
                  borderRadius: 50, padding: "5px 12px",
                  fontSize: "0.72rem", color: "#00d9b8", fontWeight: 600,
                }}>
                  ✅ Profile 80%
                </div>
              </div>

              {/* Name + username */}
              <h2 style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                fontSize: "1.45rem", margin: "0 0 2px",
              }}>
                {name}{age ? `, ${age}` : ""}
              </h2>
              <div style={{ fontSize: "0.8rem", color: "#ff758c", fontWeight: 600, marginBottom: 6 }}>
                @{username}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#6b7280", marginBottom: 12 }}>
                📍 {city} &nbsp;·&nbsp; 💼 {job}
              </div>

              {/* Bio */}
              <p style={{
                fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic",
                lineHeight: 1.6, margin: "0 0 14px",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
              }}>
                &ldquo;{bio}&rdquo;
              </p>

              {/* Tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                {intent && <Chip label={`💘 ${intent}`} color="#ff758c" bg="rgba(255,77,109,0.1)" />}
                {gender && <Chip label={`👤 ${gender}`} color="#00d9b8" bg="rgba(0,217,184,0.1)" />}
                <Chip label="🌟 Active" color="#a78bfa" bg="rgba(124,58,237,0.1)" />
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 10 }}>
                <StatBox num={currentUser.profileViews} label="Profile Views"   icon="👁️" />
                <StatBox num={currentUser.likesReceived} label="Likes Received" icon="❤️" />
                <StatBox num={currentUser.matchesCount}  label="Matches"        icon="✨" />
              </div>
            </div>
          </div>

          {/* ─── GOLD BANNER ──────────────────────────────────────── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 18px", borderRadius: 16, marginBottom: "1rem",
            background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(217,119,6,0.06))",
            border: "1px solid rgba(245,158,11,0.28)",
          }}>
            <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>⭐</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", fontFamily: "'Outfit', sans-serif", marginBottom: 2 }}>
                Upgrade to SwipeVerse Gold
              </div>
              <div style={{ fontSize: "0.76rem", color: "#9ca3af" }}>
                See who liked you · Unlimited swipes · Priority matching
              </div>
            </div>
            <button style={{
              padding: "8px 16px", borderRadius: 50, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              color: "#000", fontWeight: 800, fontSize: "0.8rem",
              fontFamily: "'Outfit', sans-serif", flexShrink: 0,
            }}>
              Upgrade ›
            </button>
          </div>

          {/* ─── ACCOUNT ──────────────────────────────────────────── */}
          <div style={{ marginBottom: "1rem" }}>
            <Section title="Account">
              <Row icon="👤" iconBg="rgba(255,77,109,0.15)"   label="Edit Profile"         right={<Chevron />} onClick={() => {}} />
              <Row icon="📸" iconBg="rgba(0,217,184,0.15)"    label="Manage Photos"         right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>3 photos ›</span>} onClick={() => {}} />
              <Row icon="✏️" iconBg="rgba(124,58,237,0.15)"   label="Edit Bio & Interests"  right={<Chevron />} onClick={() => {}} />
              <Row icon="🔗" iconBg="rgba(245,158,11,0.15)"   label="Linked Accounts"       right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>None ›</span>} onClick={() => {}} last />
            </Section>
          </div>

          {/* ─── DISCOVERY PREFERENCES ────────────────────────────── */}
          <div style={{ marginBottom: "1rem" }}>
            <Section title="Discovery Preferences">
              <Row icon="📍" iconBg="rgba(124,58,237,0.15)"   label="Location"              right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{city} ›</span>} onClick={() => {}} />
              <Row icon="📏" iconBg="rgba(255,77,109,0.15)"   label="Distance Radius"       right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>50 km ›</span>} onClick={() => {}} />
              <Row icon="🎂" iconBg="rgba(0,217,184,0.15)"    label="Age Range"             right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>21–30 ›</span>} onClick={() => {}} />
              <Row icon="🎯" iconBg="rgba(245,158,11,0.15)"   label="Interested In"         right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{gender === "Man" ? "Women" : "Men"} ›</span>} onClick={() => {}} />
              <Row icon="🌐" iconBg="rgba(107,114,128,0.15)"  label="Show Me on SwipeVerse" right={<Toggle defaultOn={true} />} last />
            </Section>
          </div>

          {/* ─── NOTIFICATIONS ────────────────────────────────────── */}
          <div style={{ marginBottom: "1rem" }}>
            <Section title="Notifications">
              <Row icon="💬" iconBg="rgba(0,217,184,0.15)"    label="New Messages"          right={<Toggle defaultOn={true}  />} />
              <Row icon="❤️" iconBg="rgba(255,77,109,0.15)"   label="New Likes"             right={<Toggle defaultOn={true}  />} />
              <Row icon="✨" iconBg="rgba(124,58,237,0.15)"   label="New Matches"           right={<Toggle defaultOn={true}  />} />
              <Row icon="📣" iconBg="rgba(245,158,11,0.15)"   label="App Updates & Tips"    right={<Toggle defaultOn={false} />} last />
            </Section>
          </div>

          {/* ─── SAFETY & PRIVACY ─────────────────────────────────── */}
          <div style={{ marginBottom: "1rem" }}>
            <Section title="Safety & Privacy">
              <Row icon="🔒" iconBg="rgba(239,68,68,0.12)"    label="Privacy Settings"      right={<Chevron />} onClick={() => {}} />
              <Row icon="🛡️" iconBg="rgba(107,114,128,0.12)"  label="Block List"            right={<span style={{ fontSize: "0.78rem", color: "#6b7280" }}>0 ›</span>} onClick={() => {}} />
              <Row icon="🚩" iconBg="rgba(245,158,11,0.12)"   label="Report a Problem"      right={<Chevron />} onClick={() => {}} last />
            </Section>
          </div>

          {/* ─── MORE ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <Section title="More">
              <Row icon="📋" iconBg="rgba(107,114,128,0.12)"  label="Help & Support"        right={<Chevron />} onClick={() => {}} />
              <Row icon="⭐" iconBg="rgba(245,158,11,0.12)"   label="Rate SwipeVerse"       right={<Chevron />} onClick={() => {}} />
              <Row icon="📄" iconBg="rgba(107,114,128,0.12)"  label="Terms & Privacy Policy" right={<Chevron />} onClick={() => {}} />
              <Row
                icon="🚪" iconBg="rgba(239,68,68,0.12)"
                label="Sign Out" danger last
                onClick={() => {
                  try { localStorage.removeItem("swipeverse_user"); } catch {}
                  router.push("/");
                }}
              />
            </Section>
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "0.66rem", color: "#374151", paddingBottom: "0.5rem" }}>
            SwipeVerse v1.0.0 · Made with 💘 in India
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
