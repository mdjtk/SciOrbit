'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, GraduationCap, FlaskConical, TrendingUp, Globe, BarChart3, MapPin, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCampuses } from '@/utils/api';
import { StaggerContainer, StaggerItem, ScrollReveal, AnimatedCounter } from '@/components/animations';

const fieldBreakdown = [
  { field: 'Physics', share: 28, color: 'bg-primary' },
  { field: 'Biology', share: 22, color: 'bg-accent' },
  { field: 'Chemistry', share: 18, color: 'bg-secondary' },
  { field: 'Astronomy', share: 14, color: 'bg-orange-400' },
  { field: 'Engineering', share: 12, color: 'bg-emerald-500' },
  { field: 'Other', share: 6, color: 'bg-muted-foreground' },
];

const recentHighlights = [
  { campus: 'MIT', event: 'Quantum supremacy paper', engagement: '94.2K', time: '2h ago' },
  { campus: 'Oxford', event: 'Gene therapy breakthrough', engagement: '87.1K', time: '5h ago' },
  { campus: 'IIT Bombay', event: 'AI climate model release', engagement: '76.8K', time: '8h ago' },
  { campus: 'Caltech', event: 'Exoplanet discovery post', engagement: '71.3K', time: '12h ago' },
];

export default function CampusInsightsPage() {
  const [view, setView] = useState<'ranking' | 'analytics'>('ranking');
  const [selected, setSelected] = useState<string | null>(null);
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getCampuses();
      // Map global rank based on current DB sorting
      setCampuses(data.map((c: any, i: number) => ({ ...c, rank: i + 1 })));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 w-full pb-10">

      {/* ─── Hero Header ─── */}
      <ScrollReveal>
        <div className="relative flex flex-col items-center text-center gap-4 py-8">
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="section-label z-10">Global Campus Intelligence</span>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-primary italic z-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Campus Insights
          </motion.h1>
          <motion.p
            className="text-muted-foreground max-w-lg z-10 text-lg leading-relaxed mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover how universities and research institutions are shaping the future of science globally.
          </motion.p>

          <motion.div
            className="flex items-center gap-1 p-1 bg-white border border-border shadow-md rounded-full mt-6 z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
          >
            {[
              { key: 'ranking', label: 'Rankings', icon: Building2 },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setView(key as 'ranking' | 'analytics')}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] uppercase tracking-wider font-bold transition-all ${
                  view === key ? 'text-white' : 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                }`}
              >
                {view === key && (
                  <motion.span
                    layoutId="view-pill"
                    className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <Icon size={16} className="relative" />
                <span className="relative">{label}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>

      {/* ─── Global Stats ─── */}
      <ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Partner Campuses', value: 1240, icon: Building2, suffix: '+' },
            { label: 'Student Orbiters', value: 248000, icon: GraduationCap, suffix: '' },
            { label: 'Research Posts', value: 182000, icon: FlaskConical, suffix: '' },
            { label: 'Countries', value: 86, icon: Globe, suffix: '' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-white rounded-[2rem] p-6 flex flex-col gap-3 border border-border shadow-sm"
              whileHover={{ y: -6, boxShadow: '0 20px 40px -15px rgba(12,49,103,0.1)' }}
            >
              <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <stat.icon size={22} className="opacity-80" />
              </div>
              <div>
                <p className="text-3xl font-display font-black text-primary leading-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ─── Campus Rankings with Demographics ─── */}
      {view === 'ranking' && (
        <ScrollReveal>
          <div className="bg-white rounded-[2rem] overflow-hidden border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border/60 bg-muted/20">
              <h2 className="font-display font-bold text-primary text-xl flex items-center gap-2">
                <Building2 size={24} className="text-accent" /> Top Institutions
              </h2>
              <span className="section-label bg-white shadow-sm">By Orbit Score</span>
            </div>
            <StaggerContainer className="divide-y divide-border/60">
              {campuses.map((campus, i) => (
                <StaggerItem key={campus.rank}>
                  <div className={`transition-all ${selected === campus.rank ? 'bg-primary/[0.02]' : ''}`}>
                    <motion.div
                      className="flex items-center gap-4 px-8 py-6 cursor-pointer group"
                      onClick={() => setSelected(selected === campus.rank ? null : campus.rank)}
                      whileHover={{ x: 6 }}
                    >
                      <span className="w-8 text-center text-lg font-black text-primary/40 group-hover:text-primary transition-colors">#{campus.rank}</span>

                      {/* Color dot */}
                      <div className={`w-12 h-12 rounded-[1rem] bg-gradient-to-br ${campus.color} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                        {campus.name.slice(0, 2)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-bold text-base text-primary">{campus.name}</p>
                          <span className="text-[10px] uppercase font-black text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">{campus.trend}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mt-0.5">
                          <MapPin size={12} className="opacity-70" />
                          {campus.location}, {campus.country}
                        </div>
                      </div>

                      <div className="hidden sm:block text-right pr-4">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Total Students</p>
                        <p className="text-[15px] font-black text-primary">{campus.students.toLocaleString()}</p>
                      </div>

                      <div className="hidden md:block text-right pr-4">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Specialty</p>
                        <p className="text-[13px] font-bold text-foreground">{campus.specialty}</p>
                      </div>

                      <div className="text-right border-l border-border/80 pl-6 h-full flex flex-col justify-center">
                        <p className="text-[10px] uppercase tracking-wider font-black text-muted-foreground">Score</p>
                        <p className="text-xl font-black text-accent">{campus.score.toLocaleString()}</p>
                      </div>
                    </motion.div>

                    {/* ─── Expanded Demographics Dropdown ─── */}
                    <AnimatePresence>
                      {selected === campus.rank && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mx-8 pb-6 pt-2">
                            <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                              
                              {/* Demographics Card */}
                              <div className="flex-1 flex flex-col gap-4">
                                <h4 className="text-xs uppercase tracking-wider font-black text-primary flex items-center gap-2">
                                  <Users size={14} /> Student Demographics Breakdown
                                </h4>
                                
                                <div className="flex items-center gap-6">
                                  <div className="flex-1 bg-muted/40 rounded-xl p-4 border border-border/60 text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide relative">Seniors</p>
                                    <p className="text-2xl font-black text-primary relative">{campus.seniors.toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground font-semibold mt-1 relative">{Math.round((campus.seniors/campus.students)*100)}% of orbiters</p>
                                  </div>
                                  
                                  <div className="flex-1 bg-muted/40 rounded-xl p-4 border border-border/60 text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-accent/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide relative">Juniors</p>
                                    <p className="text-2xl font-black text-accent relative">{campus.juniors.toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground font-semibold mt-1 relative">{Math.round((campus.juniors/campus.students)*100)}% of orbiters</p>
                                  </div>
                                </div>
                              </div>

                              <div className="w-px bg-border my-2 hidden md:block" />

                              {/* Orbit Stats Card */}
                              <div className="flex-1 flex flex-col gap-4">
                                <h4 className="text-xs uppercase tracking-wider font-black text-primary flex items-center gap-2">
                                  <Zap size={14} /> Global Impact
                                </h4>
                                <div className="grid grid-cols-2 gap-4 h-full">
                                  <div className="flex flex-col justify-center">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Total Posts</p>
                                    <p className="text-xl font-black text-primary leading-none">{campus.posts.toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-col justify-center">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Monthly Growth</p>
                                    <p className="text-xl font-black text-green-600 leading-none">{campus.trend}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                                      <motion.div 
                                        className="h-full bg-primary" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(campus.score / 100000) * 100}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                      />
                                    </div>
                                    <p className="text-[10px] font-semibold text-muted-foreground mt-1 text-right">{campus.score} Global Index</p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </ScrollReveal>
      )}

      {/* ─── Analytics View ─── */}
      {view === 'analytics' && (
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Field Distribution */}
            <div className="bg-white rounded-[2xl] p-8 border border-border shadow-sm">
              <h3 className="font-display font-bold text-primary mb-6 flex items-center gap-2 text-lg">
                <FlaskConical size={20} className="text-secondary" /> Field Distribution
              </h3>
              <div className="flex flex-col gap-4">
                {fieldBreakdown.map((f, i) => (
                  <motion.div
                    key={f.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-bold text-foreground">{f.field}</span>
                      <span className="font-black text-primary">{f.share}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                         // Using arbitrary Tailwind colors as a fallback for the raw bg- classes map
                        className={`h-full rounded-full ${f.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${f.share}%` }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Highlights */}
            <div className="bg-white rounded-[2xl] p-8 border border-border shadow-sm">
              <h3 className="font-display font-bold text-primary mb-6 flex items-center gap-2 text-lg">
                <Zap size={20} className="text-amber-500" /> Trending Posts
              </h3>
              <div className="flex flex-col gap-3">
                {recentHighlights.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4, scale: 1.01 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary text-xs font-black flex-shrink-0 border border-border">
                      {h.campus.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-primary">{h.campus}</p>
                      <p className="text-xs font-semibold text-muted-foreground truncate leading-relaxed">{h.event}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-accent">{h.engagement}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">{h.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}

function Users(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
