'use client';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Flame, Crown, Zap, Users, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/utils/api';
import { StaggerContainer, StaggerItem, ScrollReveal, AnimatedCounter } from '@/components/animations';

const categories = ['All Fields', 'Physics', 'Biology', 'Chemistry', 'Astronomy', 'Climate'];
const rankGradients = [
  'from-amber-400 via-yellow-300 to-amber-500',
  'from-slate-300 via-white to-slate-400',
  'from-amber-600 via-orange-400 to-amber-700',
];
const rankIcons = [Crown, Trophy, Medal];

export default function LeaderboardPage() {
  const [category, setCategory] = useState('All Fields');
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getLeaderboard(period);
      setProfiles(data);
      setLoading(false);
    }
    load();
  }, [period]);

  const topThree = profiles.slice(0, 3).map((p, i) => ({
    ...p,
    rank: i + 1,
    name: p.full_name,
    handle: `@${p.username}`,
    score: p.points,
    avatar: p.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2),
    field: p.field_of_study || 'Researcher',
    posts: p.points ? Math.floor(p.points / 300) : 0, 
    streak: Math.floor(Math.random() * 30 + 5) 
  }));

  const allOthers = profiles.slice(3).map((p, i) => ({
    ...p,
    rank: i + 4,
    name: p.full_name,
    handle: `@${p.username}`,
    score: p.points,
    field: p.field_of_study || 'Researcher',
    posts: p.points ? Math.floor(p.points / 300) : 0,
    streak: Math.floor(Math.random() * 30 + 5)
  }));

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10">

      {/* ─── Hero Header ─── */}
      <ScrollReveal>
        <div className="relative flex flex-col items-center text-center gap-4 py-6">
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="section-label z-10">Science Orbit Rankings</span>
          <motion.h1
            className="text-4xl md:text-5xl font-display font-black text-primary italic z-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Global Leaderboard
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-lg z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The brightest scientific minds ranked by engagement, contributions, and community impact.
          </motion.p>

          {/* Period toggle */}
          <motion.div
            className="flex items-center gap-1 p-1 glass rounded-full mt-2 z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {(['week', 'month', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  period === p ? 'text-white' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {period === p && (
                  <motion.span
                    layoutId="period-pill"
                    className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative">{p === 'all' ? 'All Time' : `This ${p.charAt(0).toUpperCase() + p.slice(1)}`}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>

      {/* ─── Category Filter ─── */}
      <ScrollReveal>
        <div className="flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                category === cat
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                  : 'bg-card border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {/* ─── Podium — Top 3 ─── */}
      <ScrollReveal>
        <div className="grid grid-cols-3 gap-4 mx-auto max-w-3xl items-end relative z-20">
          {topThree.length >= 2 && <PodiumCard user={topThree[1]} delay={0.1} />}
          {topThree.length >= 1 && <PodiumCard user={topThree[0]} delay={0} featured />}
          {topThree.length >= 3 && <PodiumCard user={topThree[2]} delay={0.2} />}
        </div>
      </ScrollReveal>

      {/* ─── Full Table ─── */}
      <ScrollReveal>
        <div className="glass-card rounded-3xl overflow-hidden border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-white/40">
            <h2 className="font-display font-bold text-primary text-lg">Rankings</h2>
            <span className="section-label">Updated live</span>
          </div>
          <StaggerContainer className="divide-y divide-border/60">
            {allOthers.map((user: any, i: number) => (
              <StaggerItem key={user.rank}>
                <motion.div
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <span className="w-8 text-center text-sm font-bold text-muted-foreground">{user.rank}</span>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-extrabold text-primary border border-border shadow-inner">
                    {user.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate flex items-center gap-2">
                       {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.field}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 rounded-full text-orange-600 border border-orange-500/20">
                    <Flame size={13} />
                    <span className="text-xs font-bold">{user.streak}d</span>
                  </div>

                  <div className="hidden md:block text-right w-20">
                    <p className="text-xs text-muted-foreground">Posts</p>
                    <p className="text-sm font-bold text-primary">{user.posts}</p>
                  </div>

                  <div className="text-right w-24">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-sm font-extrabold text-accent">{user.score.toLocaleString()}</p>
                  </div>

                  <div className="w-12 text-right">
                    <div className="flex justify-end items-center gap-1 text-emerald-500">
                      <ChevronUp size={14} />
                      <span className="text-xs font-bold">↑{Math.floor(Math.random() * 5 + 1)}</span>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </ScrollReveal>

      {/* ─── Stats Row ─── */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
          {[
            { label: 'Active Orbiters', value: 142800, icon: Users, suffix: '' },
            { label: 'Posts This Month', value: 38400, icon: Zap, suffix: '' },
            { label: 'Avg. Streak', value: 18, icon: Flame, suffix: 'd' },
            { label: 'Rising Stars', value: 240, icon: Star, suffix: '' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="glass-card rounded-2xl p-5 flex flex-col gap-2 border border-border"
              whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(12,49,103,0.12)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-extrabold text-primary">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  );
}

// ──────────────────────────────────────────────
// Podium Card
// ──────────────────────────────────────────────
function PodiumCard({ user, delay = 0, featured = false }: { user: any; delay?: number; featured?: boolean }) {
  const RankIcon = rankIcons[user.rank - 1];
  const gradient = rankGradients[user.rank - 1];

  return (
    <motion.div
      className={`relative flex flex-col items-center text-center gap-3 p-5 rounded-3xl border transition-all ${
        featured
          ? 'bg-gradient-to-b from-primary/10 via-white to-accent/5 border-accent/40 shadow-2xl shadow-accent/15 z-10 bottom-4'
          : 'bg-white border-border/60 shadow-lg shadow-primary/5'
      }`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: featured ? -8 : -4, boxShadow: '0 24px 60px rgba(12,49,103,0.15)' }}
    >
      {featured && (
        <motion.div
          className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-accent to-amber-300 rounded-full text-[11px] uppercase tracking-wider font-extrabold text-white shadow-lg"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown size={12} /> #1 This Month
        </motion.div>
      )}

      {/* Avatar */}
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradient} p-1 shadow-lg relative`}>
        <div className="absolute inset-0 rounded-full bg-white opacity-20" />
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xl font-extrabold text-primary shadow-inner">
          {user.avatar}
        </div>
      </div>

      {/* Rank badge */}
      <div className={`absolute ${featured ? 'top-16' : 'top-14'} right-0 flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-gradient-to-br ${gradient} text-white border-2 border-white`}>
        <RankIcon size={14} /> 
      </div>

      <div className="mt-2">
        <p className="font-display font-bold text-base text-primary leading-tight">{user.name}</p>
        <p className="text-xs font-semibold text-muted-foreground mt-0.5">{user.field}</p>
      </div>

      <div className="w-full pt-3 mt-1 border-t border-border flex justify-around text-center bg-muted/30 rounded-xl p-2">
        <div>
          <p className="text-sm font-black text-accent">{user.score.toLocaleString()}</p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Score</p>
        </div>
        <div className="w-px bg-border/80" />
        <div className="flex flex-col items-center">
          <p className="text-sm font-black text-orange-500 flex items-center gap-0.5 justify-center"><Flame size={12} strokeWidth={3}/>{user.streak}</p>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Streak</p>
        </div>
      </div>

      {featured && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-accent/20"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
