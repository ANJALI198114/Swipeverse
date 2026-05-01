"use client";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

const NAV = [
  { href: "/discover", label: "Find Love",  icon: "🔥" },
  { href: "/matches",  label: "Matches",    icon: "💬", badge: "matches" },
  { href: "/likes",    label: "Likes You",  icon: "❤️", badge: "likes"   },
  { href: "/profile",  label: "Profile",    icon: "👤" },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { matches, currentUser } = useApp();

  const unread   = matches.reduce((s, m) => s + m.unreadCount, 0);
  const username = currentUser.username || currentUser.name?.toLowerCase().replace(/\s+/g, "") || "user";

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 1.5rem", height: 56,
      background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)",
      flexShrink: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div onClick={() => router.push("/discover")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <span style={{ fontSize: "1.4rem" }}>💘</span>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "0.92rem", letterSpacing: "2.5px", background: "linear-gradient(135deg,#ff4d6d,#ff758c,#00d9b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SWIPEVERSE
          </div>
          <div style={{ fontSize: "0.48rem", color: "#374151", letterSpacing: "2px", lineHeight: 1.2 }}>UNBIASED DATING</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2 }}>
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const badgeNum = item.badge === "matches" ? (unread > 0 ? unread : null) : item.badge === "likes" ? 8 : null;
          return (
            <button key={item.href} onClick={() => router.push(item.href)} style={{
              position: "relative", display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 50, border: "none", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: "0.82rem", fontWeight: 600,
              background: active ? "rgba(255,77,109,0.14)" : "transparent",
              color: active ? "#ff4d6d" : "#6b7280",
              transition: "all 0.18s",
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#e6edf3"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; } }}
            >
              <span style={{ fontSize: "0.88rem" }}>{item.icon}</span>
              <span>{item.label}</span>
              {badgeNum !== null && (
                <span style={{ position: "absolute", top: 1, right: 2, minWidth: 17, height: 17, borderRadius: 50, background: "#ff4d6d", color: "#fff", fontSize: "0.58rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  {badgeNum}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e6edf3", lineHeight: 1.2 }}>{currentUser.name}</div>
          <div style={{ fontSize: "0.67rem", color: "#4b5563" }}>@{username}</div>
        </div>
        <div style={{ position: "relative" }}>
          <div onClick={() => router.push("/profile")} style={{
            width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
            background: "linear-gradient(135deg,#ff4d6d,#c91652)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.8rem", color: "#fff",
            border: "2px solid rgba(255,77,109,0.3)", transition: "transform 0.18s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {currentUser.initials}
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#00d9b8", border: "2px solid #161b22" }} />
        </div>
      </div>
    </nav>
  );
}
