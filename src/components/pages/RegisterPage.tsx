'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  User, GraduationCap, Building2, Eye, EyeOff, ArrowRight,
  AtSign, Lock, ChevronLeft, Shield
} from 'lucide-react';
import { ParticleField, OrbitLogo } from '@/components/animations';
import { signup } from '@/utils/auth';
import Link from '@/components/Link';

const roles = [
  {
    key: 'user',
    label: 'Science Explorer',
    description: 'General account to explore, follow, and share discoveries.',
    icon: User,
    gradient: 'from-primary via-secondary to-primary',
    bg: 'from-primary/10 to-secondary/5',
    border: 'border-primary/30',
    accent: 'text-primary'
  },
  {
    key: 'student',
    label: 'Campus Member',
    description: 'Student account to access campus feeds and peer research.',
    icon: GraduationCap,
    gradient: 'from-emerald-500 via-teal-400 to-emerald-500',
    bg: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-600'
  },
  {
    key: 'campus',
    label: 'Institution Admin',
    description: "Manage your university's presence on Science Orbit.",
    icon: Building2,
    gradient: 'from-accent via-amber-300 to-accent',
    bg: 'from-accent/10 to-amber-400/5',
    border: 'border-accent/30',
    accent: 'text-amber-600'
  }
];

export default function RegisterPage() {
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campusCode, setCampusCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function handleRoleSelect(role: typeof roles[0]) {
    setSelectedRole(role);
    setStep('form');
  }

  function handleBack() {
    setStep('select');
    setSelectedRole(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || isLoading) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await signup(email, password, selectedRole.key, campusCode);
      setStep('success');
    } catch (err: any) {
      setMessage(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <ParticleField count={20} />

      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(12,49,103,0.05) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.06) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header logo - Mobile */}
      <div className="absolute top-6 left-6 z-50 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <OrbitLogo size={28} />
          <span className="font-display text-xl font-bold italic text-primary">Science Orbit</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-2xl border border-border/60 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(12,49,103,0.1)] flex overflow-hidden min-h-[600px]">
          
          {/* ─── Left Side: Registration Steps ─── */}
          <div className="flex-1 p-10 md:p-16 relative flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT ROLE */}
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col h-full justify-center"
                >
                  <div className="mb-10">
                    <span className="section-label bg-white shadow-sm">Join the network</span>
                    <h1 className="font-display text-4xl font-black text-primary italic mt-3 mb-2">Create an account</h1>
                    <p className="text-muted-foreground leading-relaxed">Choose your profile type to customize your Science Orbit experience.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {roles.map((role, i) => (
                      <motion.button
                        key={role.key}
                        onClick={() => handleRoleSelect(role)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative flex items-center gap-5 p-5 rounded-3xl border bg-white shadow-sm text-left transition-all duration-300 hover:shadow-md hover:border-primary/40`}
                      >
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <role.icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-display font-black text-lg ${role.accent} mb-1 leading-none`}>{role.label}</p>
                          <p className="text-[13px] text-muted-foreground/80 leading-snug pr-4">{role.description}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors`}>
                          <ArrowRight size={14} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  
                  <div className="mt-10 text-center text-sm font-semibold text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: FORM */}
              {step === 'form' && selectedRole && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col h-full justify-center"
                >
                  <button onClick={handleBack} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-8 w-fit uppercase tracking-wider bg-muted/40 px-3 py-1.5 rounded-full">
                    <ChevronLeft size={14} /> Back to roles
                  </button>

                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/60">
                    <div className={`w-12 h-12 rounded-[1rem] bg-gradient-to-br ${selectedRole.gradient} flex items-center justify-center shadow-lg`}>
                      <selectedRole.icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-display font-black text-2xl text-primary">{selectedRole.label}</h2>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Free Account setup</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {message && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                         <Shield className="text-red-500" size={18} /> {message}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                       <label className="text-[11px] font-black uppercase tracking-widest text-primary">Email Address</label>
                       <div className="relative">
                         <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-border/80 input-focus pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed" placeholder="name@institution.edu" />
                       </div>
                    </div>

                    {(selectedRole.key === 'student' || selectedRole.key === 'campus') && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-2">
                         <label className="text-[11px] font-black uppercase tracking-widest text-primary">{selectedRole.key === 'student' ? 'Student ID / Reg Code' : 'Institution Registration Key'}</label>
                         <div className="relative">
                           <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                           <input type="text" required value={campusCode} onChange={e => setCampusCode(e.target.value)} className="w-full bg-white border border-border/80 input-focus pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed" placeholder={selectedRole.key === 'student' ? "e.g. STU-MIT-2026" : "e.g. ORBIT-ADMIN-MIT"} />
                         </div>
                      </motion.div>
                    )}

                    <div className="flex flex-col gap-2">
                       <label className="text-[11px] font-black uppercase tracking-widest text-primary">Secure Password</label>
                       <div className="relative">
                         <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-border/80 input-focus pl-11 pr-12 py-3.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed" placeholder="Min 8 characters" />
                         <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                           {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                         </button>
                       </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed my-2">By clicking create, you agree to the Science Orbit Terms of Service and Privacy Policy. All research data undergoes moderation.</p>

                    <motion.button 
                      type="submit" 
                      disabled={isLoading}
                      className={`w-full py-4 rounded-full font-bold text-[15px] shadow-[0_8px_30px_-5px_rgba(12,49,103,0.3)] bg-gradient-to-r ${selectedRole.gradient} text-white flex items-center justify-center gap-2`}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Create Account <ArrowRight size={18} /></>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-green-500/20 mb-8 border-[6px] border-green-50">
                    ✓
                  </div>
                  <h2 className="font-display font-black text-3xl text-primary mb-4">Registration Successful!</h2>
                  <p className="text-muted-foreground max-w-xs mb-10 leading-relaxed font-medium">We've sent a verification link to your email address. Please click it to complete standard orbit verification.</p>
                  
                  <Link href="/login" className="w-full max-w-[280px]">
                    <motion.button 
                      className="w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Return to Login
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Right Side: Brand Banner ─── */}
          <div className="hidden lg:flex w-[400px] bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden flex-col p-12 text-white">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            
            <motion.div
              className="absolute -top-32 -left-32 w-96 h-96 border-[40px] border-white/5 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 w-80 h-80 border-[30px] border-white/5 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />

            <Link href="/" className="relative z-10 flex items-center gap-3 mb-auto">
              <div className="bg-white p-2 rounded-xl text-primary shadow-lg"><OrbitLogo size={24} /></div>
              <span className="font-display text-2xl font-bold italic tracking-tight">Science Orbit</span>
            </Link>

            <div className="relative z-10 mb-10">
              <h3 className="font-display text-4xl font-black italic leading-[1.1] mb-6">Join the global research network.</h3>
              
              <div className="space-y-6">
                 {[
                   { t: "Verified institutional access" },
                   { t: "Peer-reviewed micro-discoveries" },
                   { t: "Cross-campus leaderboards" }
                 ].map((i, idx) => (
                   <div key={idx} className="flex items-center gap-3 text-white/90 font-medium">
                     <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">✓</div>
                     {i.t}
                   </div>
                 ))}
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/60 uppercase tracking-widest">
              <span>SSL SECURED</span>
              <span>EST. 2024</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
