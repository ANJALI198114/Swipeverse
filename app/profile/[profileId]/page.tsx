"use client";
import { useParams, useRouter } from "next/navigation";
import { PROFILES } from "@/lib/data";
import { useApp } from "@/lib/store";
import AppLayout from "@/components/AppLayout";

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showMatchModal, showToast } = useApp();

  const profile = PROFILES.find((p) => p.id === params.profileId);

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-4xl mb-3">👤</div>
            <p style={{ color: "var(--text2)" }}>Profile not found</p>
            <button onClick={() => router.back()} className="mt-4 text-sm" style={{ color: "#ff4d6d", background: "none", border: "none", cursor: "pointer" }}>
              ← Go Back
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleLike = () => {
    showToast("💚 Liked!");
    if (Math.random() > 0.4) {
      setTimeout(() => showMatchModal(profile), 400);
    }
    router.push("/discover");
  };

  const handlePass = () => {
    showToast("✕ Passed");
    router.push("/discover");
  };

  const infoItems = [
    { icon: "👤", val: profile.gender },
    { icon: "💕", val: profile.orientation },
    { icon: "📍", val: profile.city },
    { icon: "📏", val: profile.height },
    { icon: "🥂", val: `Drinks: ${profile.drinks}` },
    { icon: "🏃", val: `Exercise: ${profile.exercise}` },
    { icon: "🌿", val: `Marijuana: ${profile.marijuana}` },
    { icon: "🐾", val: `Pets: ${profile.pets}` },
    { icon: "👶", val: `Kids: ${profile.children}` },
  ];

  const tags = [
    { label: `💼 ${profile.job}`, style: { background: "rgba(0,217,184,0.12)", color: "#00d9b8", border: "1px solid rgba(0,217,184,0.2)" } },
    { label: `🎓 ${profile.education}`, style: { background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" } },
    { label: `💘 ${profile.intent}`, style: { background: "rgba(255,77,109,0.12)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" } },
    { label: `🙏 ${profile.religion}`, style: { background: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)" } },
    { label: `🗣️ ${profile.languages}`, style: { background: "rgba(107,114,128,0.12)", color: "var(--text2)", border: "1px solid var(--border)" } },
  ];

  return (
    <AppLayout>
      <div className="h-full overflow-y-auto screen-enter">
        <div className="max-w-2xl mx-auto px-5 py-4 pb-28">

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-4 bg-transparent border-none cursor-pointer transition-colors"
            style={{ color: "var(--text2)", fontFamily: "'Outfit', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff4d6d")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text2)")}
          >
            ← Back to Discover
          </button>

          {/* Main card */}
          <div
            className="rounded-3xl p-6 mb-4"
            style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
          >
            {/* Name & tagline */}
            <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {profile.name}, {profile.age}
            </h1>
            <p className="text-sm italic mb-5" style={{ color: "var(--text2)" }}>{profile.tagline}</p>

            {/* Info chips grid */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {infoItems.map(({ icon, val }) => (
                <div
                  key={val}
                  className="flex flex-col items-center text-center gap-1 p-3 rounded-xl text-xs"
                  style={{ background: "var(--bg3)", color: "var(--text2)" }}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>

            {/* Photos with quotes */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {profile.photos.map((photo, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: "var(--bg3)" }}
                >
                  <div
                    className="px-2 pt-3 pb-1 text-xs italic"
                    style={{ color: "var(--text2)" }}
                  >
                    &ldquo;{profile.quotes[i]}&rdquo;
                  </div>
                  <div
                    className="flex items-center justify-center flex-1 py-4"
                    style={{ fontSize: "3.5rem" }}
                  >
                    {photo}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map(({ label, style }) => (
                <span
                  key={label}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={style}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky action buttons */}
        <div
          className="fixed bottom-0 left-0 right-0 flex gap-4 px-5 py-4"
          style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={handlePass}
            className="flex-1 py-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:text-white"
            style={{
              background: "rgba(255,77,109,0.12)",
              border: "1.5px solid #ff4d6d",
              color: "#ff4d6d",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ff4d6d"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,77,109,0.12)"; e.currentTarget.style.color = "#ff4d6d"; }}
          >
            ✕ Pass
          </button>
          <button
            onClick={handleLike}
            className="flex-[2] py-4 rounded-xl font-bold text-white text-base border-none cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg,#ff4d6d,#c91652)",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 6px 20px rgba(255,77,109,0.4)",
            }}
          >
            💖 Like
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
