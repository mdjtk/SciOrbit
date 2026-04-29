'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  User, GraduationCap, Building2, Eye, EyeOff, ArrowRight,
  AtSign, Lock, ChevronLeft, Orbit, Sparkles, Shield,
} from 'lucide-react';
import { OrbitLogo } from '@/components/animations';
import { login } from '@/utils/auth';
import Link from '@/components/Link';

// ──────────────────────────────────────────────
// Role definitions
// ──────────────────────────────────────────────
const roles = [
  {
    key: 'user',
    label: 'User',
    description: 'Join the scientific community. Explore, follow, and share discoveries.',
    icon: User,
    gradient: 'from-primary via-secondary to-primary',
    bg: 'from-primary/10 to-secondary/5',
    border: 'border-primary/30',
    accent: 'text-primary',
    ring: 'ring-primary/30',
    badge: 'Science Explorer',
  },
  {
    key: 'student',
    label: 'Student',
    description: 'Access your campus feed, peer research, and academic orbit network.',
    icon: GraduationCap,
    gradient: 'from-emerald-600 via-teal-500 to-emerald-600',
    bg: 'from-emerald-500/10 to-teal-500/5',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-600',
    ring: 'ring-emerald-500/30',
    badge: 'Campus Member',
  },
  {
    key: 'campus',
    label: 'Campus Admin',
    description: "Manage your institution's presence, students, and academic publications.",
    icon: Building2,
    gradient: 'from-accent via-amber-400 to-accent',
    bg: 'from-accent/10 to-amber-400/5',
    border: 'border-accent/30',
    accent: 'text-amber-600',
    ring: 'ring-accent/30',
    badge: 'Admin Portal',
  },
  {
    key: 'admin',
    label: 'System Admin',
    description: 'Universal oversight. Manage global users, system reports, and platform health.',
    icon: Shield,
    gradient: 'from-red-600 via-orange-500 to-red-600',
    bg: 'from-red-500/10 to-orange-500/5',
    border: 'border-red-500/30',
    accent: 'text-red-600',
    ring: 'ring-red-500/30',
    badge: 'Superuser Only',
  },
];

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'login'>('select');
  const [selectedRole, setSelectedRole] = useState<typeof roles[0] | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campusCode, setCampusCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setMessage(params.get('message'));
    }
  }, []);

  function handleRoleSelect(role: typeof roles[0]) {
    setSelectedRole(role);
    setStep('login');
  }

  function handleBack() {
    setStep('select');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole || isLoading) return;
    setIsLoading(true);
    setMessage(null);
    try {
      await login(email, password, selectedRole.key, campusCode || (email.includes('@') ? '' : 'PENDING'));
    } catch (err: any) {
      setMessage(err.message || 'Login failed');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* ─── Atmospheric background ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(12,49,103,0.07) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
            style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* ─── Left panel — Brand ─── */}
      <motion.div
        className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <OrbitLogo size={40} />
          <span className="font-display text-2xl font-bold italic text-primary tracking-tight">Science Orbit</span>
        </Link>

        {/* Center illustrations */}
        <div className="flex flex-col gap-8 my-auto">
          {/* Animated orbit diagram */}
          <div className="relative w-72 h-72 mx-auto">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-accent/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-16 rounded-full border border-secondary/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />

            {/* Orbiting dots */}
            {[0, 120, 240].map((deg, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/30"
                style={{ transformOrigin: `${i === 0 ? 136 : i === 1 ? 104 : 72}px 0` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Center core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-xl shadow-primary/30 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={24} className="text-white" />
              </motion.div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-display text-3xl font-black text-primary italic mb-3 leading-tight">
              Where Science<br />Comes Alive
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
              Join 240,000+ researchers, students, and institutions sharing discoveries that shape our world.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex justify-center gap-6">
            {[{ val: '1,240+', label: 'Campuses' }, { val: '240K', label: 'Scientists' }, { val: '182K', label: 'Papers' }].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-black text-xl text-primary">{stat.val}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center">
          Trusted by leading research institutions worldwide · SSL secured
        </p>
      </motion.div>

      {/* ─── Right panel — Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Role Selection ── */}
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-8"
              >
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 lg:hidden mb-2">
                    <OrbitLogo size={28} />
                    <span className="font-display text-lg font-bold italic text-primary">Science Orbit</span>
                  </div>
                  <span className="section-label">Welcome back</span>
                  <h1 className="font-display text-3xl font-black text-primary italic leading-snug">Sign in to your<br />Orbit</h1>
                  <p className="text-muted-foreground text-sm">Select how you'd like to continue.</p>
                </div>

                {/* Role cards */}
                <div className="flex flex-col gap-3">
                  {roles.map((role, i) => (
                    <motion.button
                      key={role.key}
                      id={`login-role-${role.key}`}
                      onClick={() => handleRoleSelect(role)}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ x: 6, boxShadow: '0 12px 40px rgba(12,49,103,0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex items-center gap-4 p-5 rounded-2xl border bg-gradient-to-r ${role.bg} ${role.border} text-left transition-all duration-200 overflow-hidden`}
                    >
                      {/* Shimmer on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none rounded-2xl" />

                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <role.icon size={22} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`font-display font-bold text-base ${role.accent}`}>
                            Login as {role.label}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${role.border} ${role.accent} bg-white/50`}>
                            {role.badge}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
                      </div>

                      <ArrowRight size={18} className={`flex-shrink-0 ${role.accent} group-hover:translate-x-1 transition-transform`} />
                    </motion.button>
                  ))}
                </div>

                <motion.p
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  New to Science Orbit?{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Create an account
                  </Link>
                </motion.p>
              </motion.div>
            )}

            {/* ── STEP 2: Login Form ── */}
            {step === 'login' && selectedRole && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-7"
              >
                {/* Back button */}
                <motion.button
                  onClick={handleBack}
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                >
                  <ChevronLeft size={16} /> Choose a different role
                </motion.button>

                {/* Role badge */}
                <div className="flex flex-col gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedRole.gradient} flex items-center justify-center shadow-xl shadow-primary/20`}>
                    <selectedRole.icon size={26} className="text-white" />
                  </div>
                  <div>
                    <span className="section-label">{selectedRole.badge}</span>
                    <h1 className="font-display text-3xl font-black text-primary italic mt-1">
                      Login as {selectedRole.label}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">{selectedRole.description}</p>
                  </div>
                </div>

                {/* Form */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  {message && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl text-center">
                      {message}
                    </div>
                  )}

                  {/* Email / ID */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {selectedRole.key === 'campus' ? 'Institution Email or Admin ID' : selectedRole.key === 'student' ? 'Student Email or College ID' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={selectedRole.key === 'campus' ? 'admin@university.edu' : selectedRole.key === 'student' ? 'student@college.edu' : 'you@email.com'}
                        className="input-field pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Campus code for student/admin */}
                  {(selectedRole.key === 'student' || selectedRole.key === 'campus') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex flex-col gap-1.5"
                    >
                      <label className="text-xs font-semibold text-foreground">
                        {selectedRole.key === 'student' ? 'Campus / Institution Code' : 'Admin Campus Code'}
                      </label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="login-campus-code"
                          type="text"
                          value={campusCode}
                          onChange={(e) => setCampusCode(e.target.value)}
                          placeholder={selectedRole.key === 'student' ? 'e.g. MIT-2025' : 'e.g. ADMIN-MIT'}
                          className="input-field pl-10"
                          disabled={isLoading}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-foreground">Password</label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="login-password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="input-field pl-10 pr-12"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        tabIndex={-1}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Campus Admin 2FA hint */}
                  {selectedRole.key === 'campus' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-xl"
                    >
                      <Shield size={14} className="text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">Admin accounts have two-factor authentication enabled for security.</p>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    id="login-submit"
                    type="submit"
                    disabled={isLoading}
                    className={`relative overflow-hidden flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all bg-gradient-to-r ${selectedRole.gradient} ${isLoading ? 'opacity-80' : ''}`}
                    whileHover={!isLoading ? { y: -2, boxShadow: '0 12px 40px rgba(12,49,103,0.3)' } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    {/* Shimmer */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                    <selectedRole.icon size={18} className="relative" />
                    <span className="relative">{isLoading ? 'Loading...' : `Continue as ${selectedRole.label}`}</span>
                    <ArrowRight size={16} className="relative" />
                  </motion.button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-semibold text-primary hover:underline">
                    Sign up free
                  </Link>
                </p>

                {/* Security note */}
                <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                  <Shield size={11} /> Secured with 256-bit SSL encryption
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
