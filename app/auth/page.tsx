"use client";
import { useState, useRef, Suspense, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { User } from "@/types";

// ─── helpers ────────────────────────────────────────────────────────────────
function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function calcAge(dob: string) {
  if (!dob) return 22;
  const b = new Date(dob), t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  if (t.getMonth() - b.getMonth() < 0 || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) a--;
  return a;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
}

// ─── reusable field – defined OUTSIDE any component so it never remounts ────
interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}
function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: "0.78rem", color: "var(--text2)", fontWeight: 500, letterSpacing: "0.3px" }}>
        {label}
      </label>
      {children}
      {hint && !error && <p style={{ fontSize: "0.7rem", color: "var(--text3)", marginTop: 2 }}>{hint}</p>}
      {error && <p style={{ fontSize: "0.7rem", color: "#ff4d6d", marginTop: 2 }}>⚠ {error}</p>}
    </div>
  );
}

// ─── shared input style ──────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: "100%",
  background: "var(--bg3)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  padding: "0.8rem 1rem",
  borderRadius: 12,
  fontFamily: "'Outfit', sans-serif",
  fontSize: "0.9rem",
  outline: "none",
  transition: "border-color 0.2s",
};

// ─── eye icon for password visibility toggle ─────────────────────────────────
function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── password strength ───────────────────────────────────────────────────────
function pwStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map: Record<number, { label: string; color: string }> = {
    1: { label: "Weak", color: "#ef4444" },
    2: { label: "Fair", color: "#f59e0b" },
    3: { label: "Good", color: "#00d9b8" },
    4: { label: "Strong", color: "#22c55e" },
  };
  return { score: s, ...(map[s] || map[1]) };
}

// ═══════════════════════════════════════════════════════════════════════════════
function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setCurrentUser } = useApp();

  const [tab, setTab] = useState<"login" | "signup">(
    (params.get("tab") as "login" | "signup") || "login"
  );

  // ── login state ──
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // ── signup state ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Woman");
  const [lookingFor, setLookingFor] = useState("Long-term relationship");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1); // 2-step signup

  const [loading, setLoading] = useState(false);

  const strength = pwStrength(pw);

  // auto-generate username from name
  const handleFirstNameChange = (v: string) => {
    setFirstName(v);
    if (!usernameEdited) setUsername(slugify(v + lastName));
  };
  const handleLastNameChange = (v: string) => {
    setLastName(v);
    if (!usernameEdited) setUsername(slugify(firstName + v));
  };

  // ── login submit ──
  const handleLogin = () => {
    const errs: Record<string, string> = {};
    if (!loginEmail.trim()) errs.email = "Email is required";
    if (!loginPw) errs.password = "Password is required";
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }

    setLoading(true);
    const saved = typeof window !== "undefined" ? localStorage.getItem("swipeverse_user") : null;
    if (!saved) {
      const emailName = loginEmail.split("@")[0];
      const parts = emailName.split(/[._-]/);
      const fn = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "User";
      const ln = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : "";
      const user: User = {
        id: "me", name: ln ? `${fn} ${ln}` : fn,
        username: slugify(fn + ln), initials: initials(fn, ln || "U"),
        age: 25, city: "India", job: "Professional",
        bio: "Hey there! I am using SwipeVerse 💘",
        gender: "Prefer not to say", lookingFor: "Long-term relationship",
        profileViews: 142, likesReceived: 8, matchesCount: 4,
      };
      setCurrentUser(user);
    }
    setTimeout(() => router.push("/discover"), 700);
  };

  // ── signup step 1 validation ──
  const handleStep1 = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "Required";
    if (!lastName.trim()) errs.lastName = "Required";
    if (!username.trim()) errs.username = "Choose a username";
    else if (username.length < 3) errs.username = "At least 3 characters";
    if (!email.trim()) errs.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email";
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setSignupErrors({});
    setStep(2);
  };

  // ── signup final submit ──
  const handleSignup = () => {
    const errs: Record<string, string> = {};
    if (!pw || pw.length < 6) errs.pw = "Min 6 characters";
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }

    setLoading(true);
    const user: User = {
      id: "me",
      name: `${firstName.trim()} ${lastName.trim()}`,
      username: username.trim(),
      initials: initials(firstName.trim(), lastName.trim()),
      age: calcAge(dob),
      city: "India", job: "Professional",
      bio: "Hey there! I am using SwipeVerse 💘",
      gender, lookingFor,
      profileViews: 0, likesReceived: 0, matchesCount: 0,
    };
    setCurrentUser(user);
    setTimeout(() => router.push("/discover"), 700);
  };

  const switchTab = (t: "login" | "signup") => {
    setTab(t); setLoginErrors({}); setSignupErrors({}); setStep(1);
  };

  // ── shared input focus handlers ──
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#ff4d6d";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,77,109,0.12)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <main style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* bg orbs */}
      <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "#ff4d6d", filter: "blur(100px)", opacity: 0.07, top: -130, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "#00d9b8", filter: "blur(100px)", opacity: 0.06, bottom: -100, left: -80, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "#7c3aed", filter: "blur(80px)", opacity: 0.07, top: "45%", left: "15%", pointerEvents: "none" }} />

      {/* card */}
      <div className="screen-enter" style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 460,
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: 28, padding: "2.5rem 2.5rem 2rem",
        margin: "1rem", boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: 6 }}>💘</div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "3px", background: "linear-gradient(135deg,#ff4d6d,#ff758c,#00d9b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            SWIPEVERSE
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text3)", letterSpacing: "2px", marginTop: 2 }}>UNBIASED DATING APP</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "var(--bg3)", borderRadius: 50, padding: 4, marginBottom: "1.75rem" }}>
          {(["login", "signup"] as const).map((t) => (
            <button key={t} onClick={() => switchTab(t)} style={{
              flex: 1, padding: "0.65rem", borderRadius: 50, border: "none", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontSize: "0.88rem", fontWeight: 600,
              background: tab === t ? "linear-gradient(135deg,#ff4d6d,#c91652)" : "transparent",
              color: tab === t ? "#fff" : "var(--text2)",
              transition: "all 0.25s",
            }}>
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {tab === "login" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="Email Address" error={loginErrors.email}>
              <input
                style={{ ...INPUT, borderColor: loginErrors.email ? "#ff4d6d" : "var(--border)" }}
                type="email" placeholder="you@example.com"
                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                onFocus={onFocus} onBlur={onBlur}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </Field>

            <Field label="Password" error={loginErrors.password}>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...INPUT, borderColor: loginErrors.password ? "#ff4d6d" : "var(--border)", paddingRight: "2.8rem" }}
                  type={showLoginPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginPw} onChange={(e) => setLoginPw(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPw((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", padding: 0 }}
                >
                  <EyeIcon show={showLoginPw} />
                </button>
              </div>
            </Field>

            <div style={{ textAlign: "right", marginTop: -4 }}>
              <a href="#" style={{ fontSize: "0.78rem", color: "#ff4d6d", textDecoration: "none" }}>Forgot password?</a>
            </div>

            <button onClick={handleLogin} disabled={loading} style={{
              width: "100%", padding: "0.95rem", borderRadius: 14, border: "none", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff",
              background: "linear-gradient(135deg,#ff4d6d,#c91652)",
              boxShadow: "0 6px 20px rgba(255,77,109,0.35)",
              opacity: loading ? 0.75 : 1, transition: "opacity 0.2s, transform 0.1s",
            }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text3)", fontSize: "0.78rem" }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              or continue with
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["🌐", "Google"], ["🍎", "Apple"]].map(([icon, name]) => (
                <button key={name} onClick={handleLogin} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "0.7rem", borderRadius: 12, cursor: "pointer",
                  background: "var(--bg3)", border: "1px solid var(--border)",
                  color: "var(--text)", fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", fontWeight: 500,
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#ff4d6d")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  {icon} {name}
                </button>
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text2)", marginTop: 4 }}>
              Don&apos;t have an account?{" "}
              <span onClick={() => switchTab("signup")} style={{ color: "#ff4d6d", cursor: "pointer", fontWeight: 600 }}>
                Sign up free
              </span>
            </p>
          </div>
        )}

        {/* ── SIGNUP STEP 1 ── */}
        {tab === "signup" && step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {/* step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#ff4d6d" }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: "var(--border)" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Step 1 of 2</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="First Name" error={signupErrors.firstName}>
                <input
                  style={{ ...INPUT, borderColor: signupErrors.firstName ? "#ff4d6d" : "var(--border)" }}
                  placeholder="Anjali"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </Field>
              <Field label="Last Name" error={signupErrors.lastName}>
                <input
                  style={{ ...INPUT, borderColor: signupErrors.lastName ? "#ff4d6d" : "var(--border)" }}
                  placeholder="Aggarwal"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </Field>
            </div>

            <Field label="Username" error={signupErrors.username} hint="This will be shown on your profile · unique & lowercase">
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: "0.9rem", pointerEvents: "none" }}>@</span>
                <input
                  style={{ ...INPUT, borderColor: signupErrors.username ? "#ff4d6d" : "var(--border)", paddingLeft: "1.8rem" }}
                  placeholder="anjaliaggarwal"
                  value={username}
                  onChange={(e) => { setUsernameEdited(true); setUsername(slugify(e.target.value)); }}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </Field>

            <Field label="Email Address" error={signupErrors.email}>
              <input
                style={{ ...INPUT, borderColor: signupErrors.email ? "#ff4d6d" : "var(--border)" }}
                type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onFocus={onFocus} onBlur={onBlur}
              />
            </Field>

            <button onClick={handleStep1} style={{
              width: "100%", padding: "0.95rem", borderRadius: 14, border: "none", cursor: "pointer",
              fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff",
              background: "linear-gradient(135deg,#ff4d6d,#c91652)",
              boxShadow: "0 6px 20px rgba(255,77,109,0.35)", marginTop: 4,
            }}>
              Continue →
            </button>

            <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text2)" }}>
              Already have an account?{" "}
              <span onClick={() => switchTab("login")} style={{ color: "#ff4d6d", cursor: "pointer", fontWeight: 600 }}>Sign in</span>
            </p>
          </div>
        )}

        {/* ── SIGNUP STEP 2 ── */}
        {tab === "signup" && step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {/* step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#ff4d6d" }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#ff4d6d" }} />
              <span style={{ fontSize: "0.72rem", color: "var(--text3)" }}>Step 2 of 2</span>
            </div>

            {/* welcome chip */}
            <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.25)", borderRadius: 12, padding: "0.6rem 1rem", fontSize: "0.82rem", color: "var(--text2)" }}>
              👋 Hi <strong style={{ color: "var(--text)" }}>{firstName}</strong>! Just a few more details.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Date of Birth">
                <input
                  style={INPUT} type="date" value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </Field>
              <Field label="Gender">
                <select style={{ ...INPUT, appearance: "none" }} value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}>
                  {["Woman", "Man", "Non-binary", "Other", "Prefer not to say"].map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Looking For">
              <select style={{ ...INPUT, appearance: "none" }} value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                onFocus={onFocus} onBlur={onBlur}>
                {["Long-term relationship", "Casual dating", "Friendship", "Marriage", "Not sure yet"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Create Password" error={signupErrors.pw}>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...INPUT, borderColor: signupErrors.pw ? "#ff4d6d" : "var(--border)", paddingRight: "2.8rem" }}
                  type={showPw ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onFocus={onFocus} onBlur={onBlur}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text2)", display: "flex", alignItems: "center", padding: 0 }}
                >
                  <EyeIcon show={showPw} />
                </button>
              </div>
              {/* strength bar */}
              {pw && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : "var(--border)", transition: "background 0.3s" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </Field>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep(1); setSignupErrors({}); }} style={{
                flex: 1, padding: "0.9rem", borderRadius: 14, cursor: "pointer",
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text2)", fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: "0.9rem",
              }}>
                ← Back
              </button>
              <button onClick={handleSignup} disabled={loading} style={{
                flex: 2, padding: "0.9rem", borderRadius: 14, border: "none", cursor: "pointer",
                fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff",
                background: "linear-gradient(135deg,#ff4d6d,#c91652)",
                boxShadow: "0 6px 20px rgba(255,77,109,0.35)",
                opacity: loading ? 0.75 : 1,
              }}>
                {loading ? "Creating account..." : "Create Account 💘"}
              </button>
            </div>

            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text3)", lineHeight: 1.5 }}>
              By signing up you agree to our{" "}
              <a href="#" style={{ color: "#ff4d6d", textDecoration: "none" }}>Terms</a> &amp;{" "}
              <a href="#" style={{ color: "#ff4d6d", textDecoration: "none" }}>Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--bg)", minHeight: "100vh" }} />}>
      <AuthForm />
    </Suspense>
  );
}
