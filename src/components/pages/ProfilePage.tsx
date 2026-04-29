'use client';
import { MapPin, Link as LinkIcon, Calendar, Grid, Bookmark, Users, Heart, Settings, Share2, Award, Medal, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getUserProfile } from '@/utils/api';
import { StaggerContainer, StaggerItem, ScrollReveal, AnimatedCounter } from '@/components/animations';
import Link from '@/components/Link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'orbits' | 'achievements'>('posts');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // In reality, get the logged in user ID or ID from URL
        const data = await getUserProfile('mock-uuid-here');
        setProfileData(data);
      } catch (err) {
        // Fallback for this demo test if user not found since we didn't insert a specific auth profile UUID
        setProfileData({
          profile: {
            full_name: "Dr. Sarah Chen",
            username: "sarah_chen",
            role: "user",
            points: 12450,
            avatar_url: null,
            created_at: new Date().toISOString()
          },
          orbits: [],
          achievements: []
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading Profile...</div>;
  }

  const userProfile = {
    name: profileData.profile.full_name || 'Anonymous',
    handle: `@${profileData.profile.username || 'unknown'}`,
    role: profileData.profile.role === 'campus' ? 'Institution' : profileData.profile.role === 'student' ? 'Student Researcher' : 'Science Explorer',
    bio: profileData.profile.field_of_study ? `Exploring ${profileData.profile.field_of_study}` : "Passionate about making complex science accessible.",
    location: "Cambridge, MA", // Mock static UI field
    institution: "MIT", // Mock static UI field
    orbitScore: profileData.profile.points,
    followers: 1240, // Mock static
    following: 342, // Mock static
    posts: profileData.orbits.length,
    avatar: profileData.profile.avatar_url || null,
  };

  const userPosts = profileData.orbits.map((o: any, i: number) => ({
    id: o.id,
    image: o.media_url || `https://via.placeholder.com/300?text=Post+${i+1}`,
    likes: o.likes_count,
    comments: o.comments_count
  }));

  const tabs = [
    { key: 'posts' as const, label: 'POSTS', icon: Grid, count: 124 },
    { key: 'orbits' as const, label: 'ORBITS', icon: Users, count: 42 },
    { key: 'achievements' as const, label: 'ACHIEVEMENTS', icon: Trophy, count: 14 },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 w-full pt-6">
      {/* ─── Profile Header ─── */}
      <ScrollReveal>
        <div className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/5 via-secondary/5 to-transparent rounded-full -mr-40 -mt-40 pointer-events-none" />
          
          <section className="flex flex-col md:flex-row gap-10 md:items-center relative z-10">
            <motion.div 
              className="w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-tr from-primary via-secondary to-accent p-1.5 shadow-[0_20px_40px_-15px_rgba(12,49,103,0.3)] relative shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Orbiting ring */}
              <motion.div 
                className="absolute inset-[-20px] rounded-full border border-primary/20 border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(200,169,110,0.8)]" />
              </motion.div>
              
              <div className="w-full h-full rounded-full bg-white border-4 border-white flex items-center justify-center text-5xl font-black text-primary shadow-inner">
                JD
              </div>
            </motion.div>

            <div className="flex-1 flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <motion.h1 
                    className="text-4xl form-display font-black text-primary tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    John Doe Science
                  </motion.h1>
                  <motion.p 
                    className="text-sm font-bold text-muted-foreground uppercase tracking-wider mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    @johndoe_quantum
                  </motion.p>
                </div>
                
                <motion.div 
                  className="flex gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button 
                    className="px-8 py-3 bg-primary text-white rounded-full font-bold text-[13px] shadow-lg shadow-primary/20 btn-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Follow
                  </motion.button>
                  <motion.button 
                    className="p-3 bg-white border border-border shadow-sm rounded-full hover:border-primary hover:text-primary transition-all text-muted-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 size={18} />
                  </motion.button>
                  <motion.button 
                    className="p-3 bg-white border border-border shadow-sm rounded-full hover:border-primary hover:text-primary transition-all text-muted-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings size={18} />
                  </motion.button>
                </motion.div>
              </div>

              <motion.div 
                className="flex gap-8 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-black text-primary leading-none"><AnimatedCounter target={124} /></span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Posts</span>
                </div>
                <div className="flex flex-col gap-0.5 cursor-pointer hover:scale-105 transition-transform">
                  <span className="text-2xl font-black text-primary leading-none"><AnimatedCounter target={12500} suffix="" /></span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Orbiters</span>
                </div>
                <div className="flex flex-col gap-0.5 cursor-pointer hover:scale-105 transition-transform">
                  <span className="text-2xl font-black text-primary leading-none"><AnimatedCounter target={842} /></span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Following</span>
                </div>
              </motion.div>

              <motion.p 
                className="text-foreground max-w-2xl leading-relaxed text-[15px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Quantum physicist exploring the depths of space and time. Passionate about bringing science to life through visual storytelling. 🌠🧬 Current research: Entanglement in macrosystems.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary/70" /> New York, NY</div>
                <Link href="#" className="flex items-center gap-1.5 hover:text-primary transition-colors"><LinkIcon size={14} className="text-primary/70" /> scienceorbit.com</Link>
                <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary/70" /> Joined May 2024</div>
              </motion.div>
            </div>
          </section>
        </div>
      </ScrollReveal>

      {/* ─── Tabs ─── */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-center gap-2 border-b border-border/80">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 py-4 px-8 font-black text-[13px] tracking-wider transition-all uppercase ${
                activeTab === tab.key ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
              whileHover={{ y: -2 }}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon size={16} />
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.key ? 'bg-primary/10' : 'bg-muted'} ml-1`}>{tab.count}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Post Tab */}
          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-10">
                {userPosts.map((p: any, i: number) => (
                  <StaggerItem key={p.id}>
                    <Link href={`/post/${p.id}`}>
                      <motion.div 
                        className="aspect-square bg-white border border-border p-2 rounded-[2rem] overflow-hidden cursor-pointer relative group shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                        whileHover={{ scale: 1.02, y: -4 }}
                      >
                        <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-muted to-accent/20 overflow-hidden relative">
                          <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white transition-all duration-300 backdrop-blur-md">
                            <div className="flex flex-col items-center gap-1 font-black">
                              <Heart size={24} fill="white" /> 
                              <span>{p.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 font-black">
                              <Grid size={24} /> 
                              <span>{p.comments}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8 pb-10"
            >
              
              <div className="grid md:grid-cols-3 gap-6">

                {/* HSS Results */}
                <div className="bg-white rounded-[2rem] p-8 border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-8 -mt-8" />
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <Award size={28} />
                  </div>
                  <h3 className="font-display font-black text-xl text-primary mb-2 tracking-tight">HSS Results</h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                    Higher Secondary School achievements and board examination percentiles.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/60">
                      <span className="text-xs font-bold text-foreground">AISSCE 2023 (CBSE)</span>
                      <span className="text-sm font-black text-blue-600">98.2%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/60">
                      <span className="text-xs font-bold text-foreground">Science Subject Avg</span>
                      <span className="text-sm font-black text-blue-600">99.5%</span>
                    </div>
                  </div>
                </div>

                {/* Entrance Results */}
                <div className="bg-white rounded-[2rem] p-8 border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-8 -mt-8" />
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                    <Medal size={28} />
                  </div>
                  <h3 className="font-display font-black text-xl text-primary mb-2 tracking-tight">Entrance Results</h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                    Competitive university and college entrance exam qualifications.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/60 border-orange-500/20 bg-orange-50">
                      <span className="text-xs font-bold text-foreground">JEE Advanced</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">AIR</span>
                        <span className="text-sm font-black text-orange-600">421</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/60 border-orange-500/20 bg-orange-50">
                      <span className="text-xs font-bold text-foreground">NEET UG</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
                        <span className="text-sm font-black text-orange-600">705/720</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Achievements */}
                <div className="bg-white rounded-[2rem] p-8 border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-8 -mt-8" />
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                    <Star size={28} />
                  </div>
                  <h3 className="font-display font-black text-xl text-primary mb-2 tracking-tight">Other Milestones</h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                    General science awards, olympiads, and community contributions.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/60">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-xs font-bold text-foreground">National Physics Olympiad Gold</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/60">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-xs font-bold text-foreground">Published in Youth Science Journal</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/60 border-purple-500/20 bg-purple-50">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span className="text-xs font-bold text-purple-900">Orbit 'Rising Star' Badge 2024</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Empty State for Orbits */}
          {activeTab === 'orbits' && (
            <motion.div
              key="orbits"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-20 text-center"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={36} className="text-muted-foreground/40" />
              </div>
              <h3 className="text-2xl font-display font-black text-primary italic mb-2">Network expanding...</h3>
              <p className="text-muted-foreground">Orbit spheres and peer groups will appear here.</p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
