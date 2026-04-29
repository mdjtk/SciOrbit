'use client';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

/* ────────────────────────────────────────────
   PAGE WRAPPER — staggered child reveal
──────────────────────────────────────────── */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   SCROLL REVEAL
──────────────────────────────────────────── */
export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-80px' });

  const initial: Record<string, number> = { opacity: 0 };
  if (direction === 'up') initial.y = 50;
  if (direction === 'down') initial.y = -50;
  if (direction === 'left') initial.x = 60;
  if (direction === 'right') initial.x = -60;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   STAGGER CONTAINER + ITEM
──────────────────────────────────────────── */
export function StaggerContainer({
  children,
  className = '',
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32, scale: 0.96 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   ANIMATED COUNTER
──────────────────────────────────────────── */
export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1.8,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const totalFrames = Math.round(duration * 60);
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (frame >= totalFrames) clearInterval(counter);
    }, 1000 / 60);
    return () => clearInterval(counter);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
  );
}

/* ────────────────────────────────────────────
   FLOATING ELEMENT
──────────────────────────────────────────── */
export function FloatingElement({
  children,
  className = '',
  amplitude = 14,
  duration = 5,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [-amplitude / 2, amplitude / 2, -amplitude / 2] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   TYPEWRITER TEXT
──────────────────────────────────────────── */
export function TypingText({
  text,
  className = '',
  speed = 35,
  showCursor = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setDisplayed('');
    setDone(false);
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {showCursor && !done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[0.9em] bg-current ml-0.5 align-text-bottom"
        />
      )}
    </span>
  );
}

/* ────────────────────────────────────────────
   PARTICLE FIELD — Science-themed rising dots
──────────────────────────────────────────── */
export function ParticleField({ count = 18 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    size: 2 + Math.random() * 3,
    duration: 10 + Math.random() * 18,
    delay: Math.random() * 12,
    color: Math.random() > 0.6 ? 'rgba(200,169,110,0.35)' : 'rgba(12,49,103,0.2)',
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-8px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   TOOLTIP
──────────────────────────────────────────── */
export function Tooltip({
  children,
  text,
  className = '',
  side = 'top',
}: {
  children: ReactNode;
  text: string;
  className?: string;
  side?: 'top' | 'bottom';
}) {
  const [show, setShow] = useState(false);
  const placement = side === 'top'
    ? { bottom: 'calc(100% + 8px)', top: 'auto' }
    : { top: 'calc(100% + 8px)', bottom: 'auto' };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === 'top' ? 6 : -6, scale: 0.9 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={placement}
            className="absolute left-1/2 -translate-x-1/2 z-[999] px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-xl"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAGNETIC BUTTON (cursor-follow repulsion)
──────────────────────────────────────────── */
export function MagneticButton({
  children,
  className = '',
  strength = 0.2,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   ORBIT LOGO ANIMATION
──────────────────────────────────────────── */
export function OrbitLogo({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ borderStyle: 'dashed' }}
      />
      <motion.div
        className="absolute inset-[5px] rounded-full border border-accent/40"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className="absolute inset-[11px] rounded-full bg-gradient-to-br from-primary to-secondary"
        style={{ boxShadow: '0 0 12px rgba(12,49,103,0.5)' }}
      />
      {/* orbit dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-accent"
        style={{ top: 0, left: '50%', marginLeft: -4, marginTop: -4, transformOrigin: `4px ${size / 2 + 4}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────
   MARQUEE TICKER
──────────────────────────────────────────── */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden>
      <div className="animate-marquee flex gap-12 w-max">
        {doubled.map((item, i) => (
          <span key={i} className="shrink-0 section-label tracking-widest opacity-50">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
