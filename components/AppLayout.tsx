"use client";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import MatchModal from "@/components/MatchModal";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <Navbar />
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
      <Toast />
      <MatchModal />
    </div>
  );
}
