import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronRight, Trophy, Lock, Unlock } from "lucide-react";

// ---------------- Audio Manager ----------------
function useAudio() {
  const song1 = useRef<HTMLAudioElement | null>(null);
  const song2 = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [active, setActive] = useState<1 | 2 | null>(null);

  useEffect(() => {
    song1.current = new Audio("/audio/music1.mp3");
    song2.current = new Audio("/audio/music2.mp3");
    [song1, song2].forEach((r) => {
      if (r.current) { r.current.loop = true; r.current.volume = 0.7; }
    });
    return () => {
      song1.current?.pause(); song2.current?.pause();
      song1.current = null; song2.current = null;
    };
  }, []);

  useEffect(() => {
    const v = muted ? 0 : volume;
    if (song1.current) song1.current.volume = v;
    if (song2.current) song2.current.volume = v;
  }, [muted, volume]);

  const playSong1 = () => {
    if (active === 1) return;
    song2.current?.pause();
    if (song2.current) song2.current.currentTime = 0;
    song1.current?.play().catch(() => {});
    setActive(1);
  };
  const playSong2 = () => {
    song1.current?.pause();
    if (song1.current) song1.current.currentTime = 0;
    if (song2.current) { song2.current.currentTime = 0; song2.current.play().catch(() => {}); }
    setActive(2);
  };
  return { muted, setMuted, volume, setVolume, playSong1, playSong2 };
}

// ---------------- Reusable bits ----------------
function PremiumButton({ children, onClick, variant = "gold" }: { children: ReactNode; onClick: () => void; variant?: "gold" | "ghost" }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
    onClick();
  };
  const base = "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold uppercase tracking-[0.18em] text-xs px-7 py-4 transition-all duration-300 active:scale-95";
  const gold = "text-[#081C35] bg-gradient-to-br from-[#FFE15C] via-[#FFD700] to-[#C9A227] shadow-[0_0_0_1px_rgba(255,215,0,0.4),0_10px_30px_-8px_rgba(255,215,0,0.55),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-110";
  const ghost = "text-[#FFD700] border border-[#FFD700]/40 hover:bg-[#FFD700]/10";
  return (
    <button onClick={handle} className={`${base} ${variant === "gold" ? gold : ghost}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "gold" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_3s_linear_infinite]" style={{ animation: "sweep 2.5s ease-in-out infinite" }} />
      )}
      {ripples.map((r) => (
        <span key={r.id} className="absolute rounded-full bg-white/40 pointer-events-none" style={{ left: r.x, top: r.y, width: 8, height: 8, transform: "translate(-50%,-50%)", animation: "ripple 0.7s ease-out forwards" }} />
      ))}
      <style>{`
        @keyframes ripple { to { width: 320px; height: 320px; opacity: 0; } }
        @keyframes sweep { 0%,100% { transform: translateX(-120%) skewX(-20deg);} 50% { transform: translateX(220%) skewX(-20deg);} }
      `}</style>
    </button>
  );
}

function Particles({ count = 30, color = "#FFD700" }: { count?: number; color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const size = 2 + Math.random() * 5;
        const dur = 6 + Math.random() * 10;
        const delay = Math.random() * 8;
        return (
          <span key={i} className="absolute rounded-full" style={{
            left: `${left}%`, bottom: `-10px`, width: size, height: size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            animation: `float-up ${dur}s linear ${delay}s infinite`,
            opacity: 0.6 + Math.random() * 0.4,
          }} />
        );
      })}
      <style>{`@keyframes float-up { 0%{transform:translateY(0) scale(.6);opacity:0} 10%{opacity:1} 100%{transform:translateY(-110vh) scale(1.2);opacity:0} }`}</style>
    </div>
  );
}

function StadiumBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 90% 55% at 50% 110%, rgba(60,130,80,0.45), transparent 60%),
          radial-gradient(ellipse 70% 40% at 50% -10%, rgba(255,215,0,0.22), transparent 65%),
          radial-gradient(circle at 15% 18%, rgba(255,255,255,0.08), transparent 35%),
          radial-gradient(circle at 85% 22%, rgba(255,255,255,0.07), transparent 35%),
          linear-gradient(180deg, #03070f 0%, #081C35 45%, #04101f 100%)
        `,
      }} />
      {/* Floodlight beams */}
      <div className="absolute -top-10 left-[15%] w-[40vw] h-[80vh] opacity-30 rotate-12" style={{ background: "linear-gradient(180deg, rgba(255,255,200,0.3), transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute -top-10 right-[15%] w-[40vw] h-[80vh] opacity-30 -rotate-12" style={{ background: "linear-gradient(180deg, rgba(255,255,200,0.3), transparent 70%)", filter: "blur(40px)" }} />
      {/* Crowd grain */}
      <div className="absolute bottom-0 inset-x-0 h-[30vh] opacity-40" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 1px)",
        backgroundSize: "4px 4px",
        maskImage: "linear-gradient(180deg, transparent, black 60%)",
      }} />
    </div>
  );
}

// ---------------- Scene wrapper ----------------
function SceneShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 w-full h-[100dvh] overflow-y-auto overflow-x-hidden"
      aria-label={label}
    >
      {children}
    </motion.section>
  );
}

// ---------------- Audio controls ----------------
function AudioBar({ audio }: { audio: ReturnType<typeof useAudio> }) {
  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-md border border-[#FFD700]/30">
      <button onClick={() => audio.setMuted(!audio.muted)} className="text-[#FFD700] hover:scale-110 transition-transform" aria-label={audio.muted ? "Unmute" : "Mute"}>
        {audio.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <input
        type="range" min={0} max={1} step={0.01} value={audio.volume}
        onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
        className="w-16 sm:w-24 accent-[#FFD700]"
        aria-label="Volume"
      />
    </div>
  );
}

// ---------------- Scenes ----------------
const HERO_PHOTO ="/audio/images/best.jpeg";
const MEMORIES = [
  { over: "OVER 1", title: "Childhood",img: "/audio/images/child.jpeg", text: "Where it all began — laughter, scraped knees, and a million little adventures." },
  { over: "OVER 2", title: "School Life", img: "/audio/images/school.jpeg", text: "Classroom legends, lunchbox swaps, and the friends who became family." },
  { over: "OVER 3", title: "College Life", img: "/audio/images/imageclg.jpeg", text: "Late nights, big dreams, and the chapters that shaped who you became." },
  { over: "OVER 4", title: "Cricket Journey", img: "/audio/images/cricket.jpeg", text: "Every six, every wicket, every roar — the innings that defined a legend." },
];
const GALLERY = [
  { img: "/audio/images/self1.jpeg", h: "tall" },
  { img:"/audio/images/self2.jpeg", h: "short" },
  { img:"/audio/images/self3.jpeg", h: "short" },
  { img: "/audio/images/self4.jpeg", h: "tall" },
  { img: "/audio/images/self5.jpeg", h: "short"},
  { img: "/audio/images/self6.jpeg", h: "tall" },
];
const LOCKERS = [
  "/audio/images/photo2.jpeg",
  "/audio/images/photo1.jpeg",
  "/audio/images/photo3.jpeg",
  "/audio/images/photo4.jpeg",
];

// -------- Scene 1 --------
function Scene1({ next }: { next: () => void }) {
  const lines = [
    "Ladies and Gentlemen...",
    "Today is not just a match...",
    "Today is not just a birthday...",
    "Today we celebrate a legend...",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= lines.length + 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 600 : 1400);
    return () => clearTimeout(t);
  }, [step]);
  const reveal = step > lines.length;
  return (
    <SceneShell label="Stadium Entry">
      <StadiumBg />
      <Particles count={25} />
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-md space-y-4">
          {lines.map((l, i) => (
            <AnimatePresence key={i}>
              {step > i && !reveal && step === i + 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-display text-xl sm:text-2xl text-white/90 tracking-wider"
                >
                  {l}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
          {reveal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-3 py-8"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-10 bg-[#FFD700]/20 blur-3xl rounded-full" />
                <h1 className="relative font-display text-6xl sm:text-7xl font-black text-shimmer">SURYA</h1>
              </div>
              <div className="font-display text-sm tracking-[0.4em] text-[#FFD700]/90">JERSEY #25</div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/50">The Last Ball</div>
            </motion.div>
          )}
        </div>
        {reveal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8">
            <PremiumButton onClick={next}>Enter The Stadium <ChevronRight size={16} /></PremiumButton>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}

// -------- Scene 2 --------
function Scene2({ next }: { next: () => void }) {
  return (
    <SceneShell label="Birthday Wish">
      <StadiumBg />
      <Particles count={20} />
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 py-10 text-center gap-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-xs uppercase tracking-[0.4em] text-[#FFD700]/80">A Personal Tribute</div>
          <h2 className="font-display text-3xl sm:text-4xl mt-2 text-shimmer">Happy Birthday</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22,1,0.36,1] }}
          className="relative w-[78vw] max-w-[340px] aspect-[3/4] floaty"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#FFD700]/60 via-[#FFD700]/10 to-[#FFD700]/40 blur-xl glow-pulse" />
          <div className="relative h-full w-full rounded-[1.5rem] p-[3px] bg-gradient-to-br from-[#FFE15C] via-[#FFD700] to-[#8a6a00]">
            <img src={HERO_PHOTO} alt="Birthday hero" className="h-full w-full object-cover rounded-[1.35rem]" />
            <div className="absolute inset-0 rounded-[1.5rem] ring-1 ring-white/20 pointer-events-none" />
          </div>
          {/* sparkles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="absolute w-1.5 h-1.5 bg-[#FFD700] rounded-full" style={{
              left: `${10 + Math.random()*80}%`, top: `${5 + Math.random()*90}%`,
              boxShadow: "0 0 12px #FFD700", animation: `twinkle ${2+Math.random()*2}s ${Math.random()*2}s infinite`,
            }} />
          ))}
          <style>{`@keyframes twinkle {0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1.2)}}`}</style>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="max-w-sm text-sm sm:text-base text-white/80 leading-relaxed">
          A captain. A friend. A legend in the making. Today, the stadium of our hearts stands for you.
        </motion.p>

        <PremiumButton onClick={next}>Begin The Innings <ChevronRight size={16} /></PremiumButton>
      </div>
    </SceneShell>
  );
}

// -------- Scene 3 --------
function Scene3({ next }: { next: () => void }) {
  const [i, setI] = useState(0);
  const m = MEMORIES[i];
  const last = i === MEMORIES.length - 1;
  return (
    <SceneShell label="Memory Innings">
      <StadiumBg />
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-start px-4 py-8 gap-4">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-[#FFD700]/80">
          <span>Memory Innings</span><span className="opacity-40">/</span><span>{i + 1} of {MEMORIES.length}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md flex flex-col items-center gap-4"
          >
            <div className="font-display text-2xl text-shimmer">{m.over}</div>
           <div className="relative w-full aspect-[4/5] golden-frame bg-black">
  <img
    src={m.img}
    alt={m.title}
    className="h-full w-full object-contain object-center rounded-[1.35rem]"
  />
</div>
            <div className="text-center px-2">
              <div className="font-display text-xl text-[#FFD700]">{m.title}</div>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">{m.text}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="pt-2">
          <PremiumButton onClick={() => last ? next() : setI(i + 1)}>
            {last ? "Next Innings" : "Next Over"} <ChevronRight size={16} />
          </PremiumButton>
        </div>
      </div>
    </SceneShell>
  );
}

// -------- Scene 4 --------
function Scene4({ next }: { next: () => void }) {
  const [lb, setLb] = useState<string | null>(null);
  return (
    <SceneShell label="Photo Gallery">
      <StadiumBg />
      <div className="relative min-h-[100dvh] px-4 py-8 flex flex-col items-center gap-5">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#FFD700]/80">Memory Board</div>
          <h2 className="font-display text-3xl text-shimmer mt-1">The Highlight Reel</h2>
          <p className="text-xs text-white/60 mt-1">Tap any moment to relive it</p>
        </div>
        <div className="w-full max-w-md columns-2 gap-3 [column-fill:_balance]">
          {GALLERY.map((g, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setLb(g.img)}
              className={`mb-3 block w-full overflow-hidden rounded-2xl golden-frame group ${g.h === "tall" ? "aspect-[3/4]" : "aspect-square"}`}
              style={{ breakInside: "avoid" }}
            >
              <img src={g.img} alt="" className="h-full w-full object-cover rounded-[1.35rem] transition-transform duration-500 group-hover:scale-110" />
            </motion.button>
          ))}
        </div>
        <PremiumButton onClick={next}>To The Scoreboard <ChevronRight size={16} /></PremiumButton>
      </div>
      <AnimatePresence>
        {lb && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLb(null)}>
            <motion.img initial={{scale:.9}} animate={{scale:1}} src={lb} alt="" className="max-h-[85vh] max-w-full rounded-2xl border border-[#FFD700]/40 shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}

// -------- Scene 5 --------
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now(); const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{n}{suffix}</span>;
}

function Scene5({ next }: { next: () => void }) {
  return (
    <SceneShell label="Scoreboard">
      <StadiumBg />
      <div className="relative min-h-[100dvh] px-4 py-8 flex flex-col items-center gap-5">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#FFD700]/80">Match Centre</div>
          <h2 className="font-display text-2xl sm:text-3xl text-shimmer mt-1">Tonight's Scoreboard</h2>
        </div>

        <div className="w-full max-w-md glass-panel p-4 space-y-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-[#FFD700]/80">TEAM</div>
              <div className="font-display text-sm sm:text-base">Memories XI</div>
              <div className="font-display text-3xl text-shimmer mt-1"><Counter to={287} />/4</div>
              <div className="text-[10px] text-white/60">20.0 ov</div>
            </div>
            <div className="font-display text-[#FFD700] text-xl">VS</div>
            <div>
              <div className="text-[10px] tracking-[0.3em] text-[#FFD700]/80">TEAM</div>
              <div className="font-display text-sm sm:text-base">Dream Chasers</div>
              <div className="font-display text-3xl text-shimmer mt-1"><Counter to={241} />/8</div>
              <div className="text-[10px] text-white/60">20.0 ov</div>
            </div>
          </div>
          <div className="text-center text-xs text-[#FFD700]/90 border-t border-[#FFD700]/20 pt-3">
            Memories XI won by <Counter to={46} /> runs
          </div>
        </div>

        <div className="w-full max-w-md grid grid-cols-2 gap-3">
          {[
            { k: "Runs", v: 287, s: "" },
            { k: "Sixes", v: 18, s: "" },
            { k: "Fours", v: 24, s: "" },
            { k: "Strike Rate", v: 187, s: "" },
          ].map((s) => (
            <div key={s.k} className="glass-panel p-3 text-center">
              <div className="text-[10px] tracking-[0.3em] text-[#FFD700]/80">{s.k.toUpperCase()}</div>
              <div className="font-display text-2xl text-shimmer mt-1"><Counter to={s.v} suffix={s.s} /></div>
            </div>
          ))}
        </div>

        <div className="w-full max-w-md glass-panel p-4">
          <div className="text-[10px] tracking-[0.3em] text-[#FFD700]/80 text-center">PLAYER OF THE MATCH</div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="font-display text-lg">Surya #25</div>
              <div className="text-xs text-white/60">142* (58) · 12×4 · 9×6</div>
            </div>
            <Trophy className="text-[#FFD700]" size={36} />
          </div>
        </div>

        <PremiumButton onClick={next}>To The Dressing Room <ChevronRight size={16} /></PremiumButton>
      </div>
    </SceneShell>
  );
}

// -------- Scene 6 --------
function Locker({ img, idx }: { img: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(true)} className="relative aspect-[3/4] w-full rounded-xl overflow-hidden golden-frame group" style={{ perspective: 800 }}>
      <div className="absolute inset-[3px] rounded-[0.85rem] overflow-hidden">
        <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* Door */}
        <motion.div
          initial={false}
          animate={open ? { rotateY: -110 } : { rotateY: 0 }}
          transition={{ duration: 1, ease: [0.22,1,0.36,1] }}
          style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a3458] via-[#0c1f3a] to-[#040b18] border-r border-[#FFD700]/40 flex flex-col items-center justify-center gap-2">
            <div className="text-[#FFD700]">{open ? <Unlock size={28} /> : <Lock size={28} />}</div>
            <div className="text-[10px] tracking-[0.3em] text-[#FFD700]/80">LOCKER #{String(idx+1).padStart(2,"0")}</div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFD700]/60 rounded-full" />
          </div>
        </motion.div>
      </div>
    </button>
  );
}

function Scene6({ next }: { next: () => void }) {
  return (
    <SceneShell label="Dressing Room">
      <StadiumBg />
      <div className="relative min-h-[100dvh] px-4 py-8 flex flex-col items-center gap-5">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[#FFD700]/80">The Dressing Room</div>
          <h2 className="font-display text-2xl sm:text-3xl text-shimmer mt-1">Unlock The Memories</h2>
          <p className="text-xs text-white/60 mt-1">Tap each locker to reveal</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {LOCKERS.map((img, i) => <Locker key={i} img={img} idx={i} />)}
        </div>
        <PremiumButton onClick={next}>To The Ceremony <ChevronRight size={16} /></PremiumButton>
      </div>
    </SceneShell>
  );
}

// -------- Scene 7 --------
function Scene7({ next }: { next: () => void }) {
  return (
    <SceneShell label="Trophy Ceremony">
      <div className="absolute inset-0 -z-10" style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(255,215,0,0.35), transparent 60%),
                     radial-gradient(ellipse at 50% 100%, rgba(255,170,0,0.25), transparent 60%),
                     linear-gradient(180deg, #1a0f00 0%, #2a1a00 50%, #100800 100%)`,
      }} />
      <Particles count={60} />
      {/* Fireworks bursts */}
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="absolute rounded-full pointer-events-none" style={{
          left: `${10 + i*15}%`, top: `${20 + (i%2)*30}%`,
          width: 4, height: 4, background: "#FFD700",
          boxShadow: "0 0 0 0 rgba(255,215,0,.8)",
          animation: `burst 2.${i}s ${i*0.3}s infinite`,
        }} />
      ))}
      <style>{`@keyframes burst {0%{box-shadow:0 0 0 0 rgba(255,215,0,.9)}80%,100%{box-shadow:0 0 0 80px rgba(255,215,0,0)}}`}</style>

      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center gap-6">
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="text-[10px] tracking-[0.45em] text-[#FFD700]">
          BCCI · 2026 SEASON
        </motion.div>
        <motion.div initial={{ scale: 0.6, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 1.2, ease: [0.22,1,0.36,1] }}>
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFD700]/40 blur-3xl rounded-full glow-pulse" />
            <Trophy size={140} className="relative text-[#FFD700] drop-shadow-[0_0_40px_rgba(255,215,0,0.6)]" />
          </div>
        </motion.div>
        <motion.h2 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="font-display text-sm tracking-[0.5em] text-white/80">
          PLAYER OF THE YEAR
        </motion.h2>
        <motion.h1 initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{delay:0.9}} className="font-display text-6xl sm:text-7xl text-shimmer">
          Surya
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}} className="font-display text-base text-[#FFD700]">
          Happy Birthday, Champion 🏆
        </motion.p>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.5}}>
          <PremiumButton onClick={next}>Final Surprise <ChevronRight size={16} /></PremiumButton>
        </motion.div>
      </div>
    </SceneShell>
  );
}

// -------- Scene 8 --------
function Scene8() {
  const fullText = "Happiest Birthday Mahh Comfort Zone 💎. Have a wonderful birthday & an amazing year ahead ✨. I hope this year turns out even better than you imagine ❤️‍🩹. You've already been through enough hard days, so I hope the coming days bring you more happiness, peace & success 💙. I may not always be there for all your happy moments, but one thing is for sure — whenever you're going through a tough time, I'll always be wid you 🫂. U are my comfort zone... U are my supporter... U are my happiness... U are my well-wisher ♾️. Thank you for coming into my life Eattaaaaa 🧿. Thanks for everything 🤌. No one can replace your place eattaa 🔏. Everyone cannot be you — even if you have everything or not, I'll be wid you eattaawww 🫂.";
  const lines = fullText.split(". ").filter(Boolean).map((l) => l.trim().endsWith(".") ? l : l + ".");

  return (
    <SceneShell label="Final Surprise">
      <div className="absolute inset-0 -z-10" style={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.18), transparent 60%),
                     radial-gradient(ellipse at 50% 90%, rgba(120,80,200,0.18), transparent 70%),
                     linear-gradient(180deg, #050310 0%, #0a0820 50%, #050310 100%)`,
      }} />
      <Particles count={45} />
      <Particles count={20} color="#ffffff" />

      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6 py-12">
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:1.2}} className="text-center mb-6">
          <div className="text-[10px] tracking-[0.5em] text-[#FFD700]/80">A LETTER FROM THE HEART</div>
          <h2 className="font-display text-3xl sm:text-4xl text-shimmer mt-2">For You, Always</h2>
        </motion.div>

        <div className="w-full max-w-md glass-panel p-6 sm:p-8 space-y-4">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4 + i * 0.6, duration: 1.0, ease: "easeOut" }}
              className="font-display text-[15px] sm:text-base leading-relaxed text-white/90"
              style={{ textShadow: "0 0 18px rgba(255,215,0,0.15)" }}
            >
              {line}
            </motion.p>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + lines.length * 0.6 + 0.5, duration: 1.5 }}
            className="pt-4 text-right font-display text-sm text-[#FFD700]"
          >
            — Forever yours 💛
          </motion.div>
        </div>
      </div>
    </SceneShell>
  );
}

// ---------------- Root ----------------
export default function LastBallExperience() {
  const audio = useAudio();
  const [scene, setScene] = useState(1);

  const goto = (n: number) => setScene(n);

  return (
    <div className="fixed inset-0 w-screen h-[100dvh] bg-[#03070f] text-white overflow-hidden">
      <AudioBar audio={audio} />
      {/* Scene counter */}
      <div className="fixed top-3 left-3 z-50 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#FFD700]/30 text-[10px] tracking-[0.3em] text-[#FFD700]">
        SCENE {scene} / 8
      </div>

      <AnimatePresence mode="wait">
        {scene === 1 && <div key="s1" className="absolute inset-0"><Scene1 next={() => { audio.playSong1(); goto(2); }} /></div>}
        {scene === 2 && <div key="s2" className="absolute inset-0"><Scene2 next={() => goto(3)} /></div>}
        {scene === 3 && <div key="s3" className="absolute inset-0"><Scene3 next={() => goto(4)} /></div>}
        {scene === 4 && <div key="s4" className="absolute inset-0"><Scene4 next={() => goto(5)} /></div>}
        {scene === 5 && <div key="s5" className="absolute inset-0"><Scene5 next={() => goto(6)} /></div>}
        {scene === 6 && <div key="s6" className="absolute inset-0"><Scene6 next={() => goto(7)} /></div>}
        {scene === 7 && <div key="s7" className="absolute inset-0"><Scene7 next={() => { audio.playSong2(); goto(8); }} /></div>}
        {scene === 8 && <div key="s8" className="absolute inset-0"><Scene8 /></div>}
      </AnimatePresence>
    </div>
  );
}
