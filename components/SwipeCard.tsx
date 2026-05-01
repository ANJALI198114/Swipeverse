"use client";
import { useRef, useState, useCallback } from "react";
import { Profile } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  profile: Profile;
  position: "top" | "mid" | "bot";
  onSwipe?: (dir: "left" | "right" | "super") => void;
}

export default function SwipeCard({ profile, position, onSwipe }: Props) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const [likeOpacity, setLikeOpacity] = useState(0);
  const [nopeOpacity, setNopeOpacity] = useState(0);
  const [swipeClass, setSwipeClass] = useState("");

  const isTop = position === "top";
  const scaleMap: Record<string, string> = {
    top: "scale(1) translateY(0px)",
    mid: "scale(0.96) translateY(10px)",
    bot: "scale(0.92) translateY(20px)",
  };
  const zMap: Record<string, number> = { top: 3, mid: 2, bot: 1 };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isTop) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    isDragging.current = true;
    hasDragged.current = false;
    if (cardRef.current) cardRef.current.style.transition = "none";
    document.body.classList.add("dragging");
  }, [isTop]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !cardRef.current) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    if (Math.abs(dx) > 5) hasDragged.current = true;
    cardRef.current.style.transform = `translateX(${dx}px) translateY(${dy}px) rotate(${dx * 0.04}deg)`;
    setLikeOpacity(dx > 30 ? Math.min((dx - 30) / 100, 1) : 0);
    setNopeOpacity(dx < -30 ? Math.min((-dx - 30) / 100, 1) : 0);
  }, []);

  const triggerSwipe = useCallback((dir: "left" | "right") => {
    setSwipeClass(dir === "right" ? "swiping-right" : "swiping-left");
    setLikeOpacity(0);
    setNopeOpacity(0);
    setTimeout(() => onSwipe?.(dir), 450);
  }, [onSwipe]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.classList.remove("dragging");
    const dx = e.clientX - startXRef.current;
    if (cardRef.current) cardRef.current.style.transition = "";
    if (dx > 80) {
      triggerSwipe("right");
    } else if (dx < -80) {
      triggerSwipe("left");
    } else {
      if (cardRef.current) cardRef.current.style.transform = scaleMap[position];
      setLikeOpacity(0);
      setNopeOpacity(0);
    }
    setTimeout(() => { hasDragged.current = false; }, 50);
  }, [triggerSwipe, position, scaleMap]);

  const handleClick = () => {
    if (hasDragged.current || !isTop) return;
    router.push(`/profile/${profile.id}`);
  };

  return (
    <div
      ref={cardRef}
      className={`absolute w-full rounded-3xl overflow-hidden select-none ${swipeClass}`}
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border)",
        transform: scaleMap[position],
        zIndex: zMap[position],
        transformOrigin: "bottom center",
        transition: swipeClass ? undefined : "transform 0.3s ease",
        cursor: isTop ? "grab" : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={(e) => { if (isDragging.current) handleMouseUp(e); }}
      onClick={handleClick}
    >
      <div className="absolute top-5 left-5 z-10 px-4 py-1 rounded-xl font-black text-xl text-white pointer-events-none"
        style={{ opacity: likeOpacity, background: "rgba(0,217,184,0.92)", border: "3px solid #fff", transform: "rotate(-15deg)", letterSpacing: 2 }}>
        LIKE 💚
      </div>
      <div className="absolute top-5 right-5 z-10 px-4 py-1 rounded-xl font-black text-xl text-white pointer-events-none"
        style={{ opacity: nopeOpacity, background: "rgba(255,77,109,0.92)", border: "3px solid #fff", transform: "rotate(15deg)", letterSpacing: 2 }}>
        NOPE ✕
      </div>
      <div className="grid grid-cols-3 gap-1 p-1">
        {profile.photos.map((photo, i) => (
          <div key={i} className="rounded-xl flex items-center justify-center aspect-square"
            style={{ background: "var(--bg2)", fontSize: "3rem" }}>
            {photo}
          </div>
        ))}
      </div>
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {profile.name}, {profile.age}
        </h2>
        <p className="text-sm italic mb-3" style={{ color: "var(--text2)" }}>{profile.tagline}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {[{ icon: "📍", val: profile.city }, { icon: "📏", val: profile.height }, { icon: "🐾", val: profile.pets }, { icon: "🏃", val: `Exercise: ${profile.exercise}` }].map(({ icon, val }) => (
            <div key={val} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full"
              style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)" }}>
              <span>{icon}</span>{val}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(0,217,184,0.12)", color: "#00d9b8", border: "1px solid rgba(0,217,184,0.2)" }}>💼 {profile.job}</span>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(124,58,237,0.12)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>🎓 {profile.education}</span>
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: "rgba(255,77,109,0.12)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}>💘 {profile.intent}</span>
        </div>
        {isTop && <p className="text-xs mt-3" style={{ color: "var(--text3)" }}>Tap to view full profile · Drag to swipe</p>}
      </div>
    </div>
  );
}
