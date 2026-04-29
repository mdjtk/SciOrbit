'use client';
import { Heart, MessageCircle, Share2, Bookmark, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { StaggerContainer, StaggerItem, TypingText, FloatingElement, Marquee, ScrollReveal } from '@/components/animations';
import Link from '@/components/Link';
import { getPosts } from '@/utils/api';

interface Post {
  id: number;
  title: string;
  height: string;
  likes: string;
  user: string;
  category?: string;
  tags?: string[];
}

const TAGLINES = [
  'Where curiosity becomes discovery.',
  'Science shared is science amplified.',
  'Explore the universe, one post at a time.',
];

const TICKER_ITEMS = [
  'ASTRONOMY', 'BIOLOGY', 'QUANTUM PHYSICS', 'SPACE', 'NEUROSCIENCE',
  'CHEMISTRY', 'GEOLOGY', 'ASTROPHYSICS', 'DNA RESEARCH', 'CLIMATE',
];

export default function HomePage() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagline, setTagline] = useState(0);

  useEffect(() => {
    getPosts()
      .then(d => { setPosts(d); setLoading(false); })
      .catch(() => setLoading(false));

    const id = setInterval(() => setTagline(t => (t + 1) % TAGLINES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-20">

      {/* ══════════════════════════════════════
          HERO — asymmetric editorial layout
         ══════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col justify-center py-16 overflow-hidden">

        {/* Background decorative orbs */}
        <FloatingElement
          className="absolute -top-10 -right-20 w-[500px] h-[500px] rounded-full
                     bg-gradient-radial from-primary/6 via-primary/2 to-transparent
                     blur-3xl pointer-events-none"
          amplitude={18} duration={8}
        />
        <FloatingElement
          className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full
                     bg-gradient-radial from-accent/8 via-accent/2 to-transparent
                     blur-3xl pointer-events-none"
          amplitude={12} duration={11} delay={2}
        />

        {/* Grid overlay fades into content */}
        <div className="absolute inset-0 grid-overlay opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="section-label mb-6 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-accent inline-block" />
            SCIENCE ORBIT FEED
          </motion.div>

          {/* Giant display heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95] tracking-tight text-primary mb-6"
          >
            Discover the
            <br />
            <em className="not-italic animate-text-shimmer">extraordinary.</em>
          </motion.h1>

          {/* Rotating tagline */}
          <motion.div
            className="h-8 mb-10 text-lg text-muted-foreground font-light overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={tagline}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {TAGLINES[tagline]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTA row */}
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <Link
              href="/explore"
              className="btn-primary flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide"
            >
              Explore Discoveries <ArrowRight size={16} />
            </Link>
            <Link
              href="/create"
              className="btn-ghost flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide"
            >
              Contribute Research
            </Link>
          </motion.div>
        </div>

        {/* Floating stat badges — break the grid */}
        <motion.div
          className="absolute bottom-8 right-0 md:right-8 flex gap-3"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          {[
            { val: '12k+', label: 'Scientists' },
            { val: '84k', label: 'Discoveries' },
            { val: '99%', label: 'Accuracy' },
          ].map(s => (
            <div key={s.label} className="glass-card px-5 py-3 rounded-2xl text-center shadow-md">
              <div className="font-display font-black text-2xl text-primary">{s.val}</div>
              <div className="section-label mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          TICKER
         ══════════════════════════════════════ */}
      <div className="border-y border-border py-4 -mx-4 md:-mx-8 overflow-hidden">
        <Marquee items={TICKER_ITEMS} />
      </div>

      {/* ══════════════════════════════════════
          MASONRY FEED
         ══════════════════════════════════════ */}
      <section>
        <ScrollReveal direction="up">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-primary">
              Latest Posts
            </h2>
            <Link href="/explore" className="section-label flex items-center gap-2 hover:text-primary transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
        </ScrollReveal>

        {loading ? (
          /* Loading skeletons */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {[420, 280, 360, 300, 480, 260].map((h, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl bg-muted animate-shimmer"
                style={{ height: h }}
              />
            ))}
          </div>
        ) : (
          <StaggerContainer
            className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
            stagger={0.06}
          >
            {posts.map(post => (
              <StaggerItem key={post.id}>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </div>
  );
}

/* ──────────────────── POST CARD ──────────────────── */
function PostCard({ post }: { post: Post }) {
  const [liked,  setLiked]  = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [count,  setCount]  = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(v => !v);
    const current = parseFloat(count.replace('k', '')) * (count.includes('k') ? 1000 : 1);
    const next = liked ? current - 1 : current + 1;
    setCount(next >= 1000 ? `${(next / 1000).toFixed(1)}k` : String(next));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved(v => !v);
  };

  /* gradient colour based on category */
  const catGradient: Record<string, string> = {
    Astronomy:    'from-indigo-900/20 via-primary/10 to-blue-800/15',
    Biology:      'from-emerald-800/15 via-teal-700/10 to-primary/10',
    Physics:      'from-violet-900/15 via-primary/12 to-secondary/10',
    Space:        'from-slate-900/20 via-primary/15 to-indigo-900/10',
    Chemistry:    'from-amber-800/12 via-primary/10 to-secondary/8',
    Neuroscience: 'from-purple-900/15 via-primary/10 to-secondary/12',
  };
  const gradient = catGradient[post.category ?? ''] ?? 'from-primary/8 via-muted to-secondary/12';

  return (
    <Link href={`/post/${post.id}`}>
      <motion.article
        className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-card
                   border border-border card-lift cursor-pointer"
        whileHover={{ scale: 1.015 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Coloured image stand-in */}
        <div
          className={`w-full ${post.height} bg-gradient-to-br ${gradient}
                     transition-transform duration-700 group-hover:scale-[1.04]`}
        />

        {/* Top overlay controls */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-between items-start p-4
                     opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
                     transition-all duration-300"
        >
          {post.category && (
            <span className="section-label glass px-3 py-1.5 rounded-full shadow text-primary/80">
              {post.category}
            </span>
          )}
          <motion.button
            onClick={handleSave}
            whileTap={{ scale: 0.75 }}
            className={`p-2 rounded-full glass shadow transition-colors ml-auto
                       ${saved ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Bottom gradient content */}
        <div
          className="absolute bottom-0 w-full p-5
                     bg-gradient-to-t from-[#0c3167]/90 via-[#0c3167]/45 to-transparent
                     opacity-0 group-hover:opacity-100 transition-all duration-400"
        >
          <h3 className="font-display text-white font-bold text-base mb-1 leading-snug
                         translate-y-3 opacity-0 group-hover:translate-y-0
                         group-hover:opacity-100 transition-all duration-300">
            {post.title}
          </h3>

          <div
            className="flex items-center gap-4 text-white/75
                       translate-y-3 opacity-0 group-hover:translate-y-0
                       group-hover:opacity-100 transition-all duration-300 delay-75"
          >
            <motion.button onClick={handleLike} whileTap={{ scale: 1.4 }}
              className={`flex items-center gap-1 text-sm hover:text-white transition-colors ${liked ? 'text-red-400' : ''}`}
            >
              <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
              <span>{count}</span>
            </motion.button>
            <button className="flex items-center gap-1 text-sm hover:text-white transition-colors">
              <MessageCircle size={15} /> Chat
            </button>
            <button className="flex items-center gap-1 text-sm hover:text-white transition-colors ml-auto">
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
