"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Match, Profile, Message, User } from "@/types";
import { INITIAL_MATCHES, AUTO_REPLIES, CURRENT_USER } from "@/lib/data";

interface AppState {
  currentUser: User;
  matches: Match[];
  likedProfiles: string[];
  matchModal: Profile | null;
  toast: string;
  setCurrentUser: (user: User) => void;
  addMatch: (profile: Profile) => void;
  sendMessage: (matchId: string, text: string) => void;
  showMatchModal: (profile: Profile) => void;
  closeMatchModal: () => void;
  showToast: (msg: string) => void;
  markRead: (matchId: string) => void;
}

const AppContext = createContext<AppState | null>(null);
const USER_KEY = "swipeverse_user";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(CURRENT_USER);
  const [hydrated, setHydrated] = useState(false);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [matchModal, setMatchModal] = useState<Profile | null>(null);
  const [toast, setToast] = useState("");

  // Hydrate from localStorage only once on client mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        // Ensure all fields exist (backwards compat)
        setCurrentUserState({
          ...CURRENT_USER,
          ...parsed,
          username: parsed.username || parsed.name?.toLowerCase().replace(/\s+/g, "") || "user",
        });
      }
    } catch {}
    setHydrated(true);
  }, []);

  const setCurrentUser = useCallback((user: User) => {
    // Ensure username is always set
    const safeUser: User = {
      ...user,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, ""),
    };
    setCurrentUserState(safeUser);
    try { localStorage.setItem(USER_KEY, JSON.stringify(safeUser)); } catch {}
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const addMatch = useCallback((profile: Profile) => {
    setMatches((prev) => {
      if (prev.find((m) => m.profile.id === profile.id)) return prev;
      const nm: Match = {
        id: `match-${profile.id}`,
        profile,
        messages: [{ id: "1", senderId: profile.id, text: `Hey! We matched 🎉 How are you?`, timestamp: new Date() }],
        lastMessage: `Hey! We matched 🎉`,
        lastMessageTime: new Date(),
        unreadCount: 1,
        isOnline: Math.random() > 0.4,
      };
      return [nm, ...prev];
    });
    setLikedProfiles((prev) => [...prev, profile.id]);
  }, []);

  const sendMessage = useCallback((matchId: string, text: string) => {
    const msg: Message = { id: `${Date.now()}`, senderId: "me", text, timestamp: new Date() };
    setMatches((prev) =>
      prev.map((m) => m.id === matchId
        ? { ...m, messages: [...m.messages, msg], lastMessage: `You: ${text}`, lastMessageTime: new Date() }
        : m)
    );
    const delay = 1200 + Math.random() * 1200;
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const rm: Message = { id: `${Date.now() + 1}`, senderId: matchId, text: reply, timestamp: new Date() };
      setMatches((prev) =>
        prev.map((m) => m.id === matchId
          ? { ...m, messages: [...m.messages, rm], lastMessage: reply, lastMessageTime: new Date() }
          : m)
      );
    }, delay);
  }, []);

  const showMatchModal = useCallback((p: Profile) => setMatchModal(p), []);
  const closeMatchModal = useCallback(() => setMatchModal(null), []);
  const markRead = useCallback((id: string) => {
    setMatches((prev) => prev.map((m) => m.id === id ? { ...m, unreadCount: 0 } : m));
  }, []);

  // Don't render until hydrated so username never flashes as "@user"
  if (!hydrated) return <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontSize: "2rem" }}>💘</div>
  </div>;

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      matches, likedProfiles, matchModal, toast,
      addMatch, sendMessage,
      showMatchModal, closeMatchModal, showToast, markRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
