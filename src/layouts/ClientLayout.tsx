'use client';
import { Home, Compass, Plus, Bell, User, Menu, X, Trophy, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MagneticButton, OrbitLogo, ParticleField, Tooltip } from '@/components/animations';
import Link from '@/components/Link';

const navLinks = [
  { href: '/', icon: Home,    label: 'Home' },
  { href: '/explore', icon: Compass, label: 'Explore' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/campus-insights', icon: Building2, label: 'Campus Insights' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function ClientLayout({ children, currentPath = '/' }: { children: React.ReactNode, currentPath?: string }) {
  const [pathname, setPathname] = useState(currentPath);
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col bg-mesh">
      <ParticleField count={14} />

      {/* ──────────────────── TOP NAV ──────────────────── */}
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-lg shadow-primary/5 border-b border-white/40'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
          {/* Logo */}
          <MagneticButton strength={0.15}>
            <Link href="/" className="flex items-center gap-3 group">
              <OrbitLogo size={36} />
              <span
                className="font-display text-xl font-bold italic tracking-tight text-primary
                           group-hover:animate-text-shimmer transition-all"
              >
                Science Orbit
              </span>
            </Link>
          </MagneticButton>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6 relative group">
            <input
              type="search"
              placeholder="Search discoveries…"
              className="input-field pl-4 pr-10 py-2.5 text-sm rounded-xl"
            />
          </div>

          {/* Right side */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Tooltip key={href} text={label}>
                  <Link
                    href={href}
                    className={`relative p-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/8 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon size={20} className="relative" />
                  </Link>
                </Tooltip>
              );
            })}

            <div className="w-px h-5 bg-border mx-2" />

            <MagneticButton>
              <Link
                href="/create"
                className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
              >
                <Plus size={16} />
                Publish
              </Link>
            </MagneticButton>

            <Link href="/profile" className="ml-2">
              <div
                className="w-9 h-9 rounded-full bg-gradient-to-br from-primary via-secondary to-accent
                           p-[2px] hover:scale-110 transition-transform shadow-md shadow-primary/15"
              >
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center
                               text-xs font-bold text-primary font-display">
                  JD
                </div>
              </div>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* ──────────────────── MOBILE MENU ──────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-[72px] px-6 pb-8 md:hidden"
          >
            <nav className="flex flex-col gap-2 mt-6">
              {[...navLinks, { href: '/create', icon: Plus, label: 'Publish' }].map(({ href, icon: Icon, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-4 p-4 rounded-2xl font-display font-semibold text-lg
                               transition-all ${active
                                 ? 'bg-primary/8 text-primary'
                                 : 'text-muted-foreground hover:text-primary hover:bg-muted'}`}
                  >
                    <Icon size={22} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────── MAIN ──────────────────── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-[96px] pb-28 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ──────────────────── FLOATING DOCK ──────────────────── */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          className="glass flex items-center gap-1 px-3 py-2.5 rounded-full
                     shadow-2xl shadow-primary/12 border border-white/50"
        >
          {navLinks.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Tooltip key={href} text={label} side="top">
                <Link
                  href={href}
                  className={`relative p-3 rounded-full transition-all duration-200 ${
                    active ? 'text-white' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dock-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <Icon size={22} className="relative" />
                </Link>
              </Tooltip>
            );
          })}

          <div className="w-px h-6 bg-border mx-1" />

          <Tooltip text="Publish" side="top">
            <Link
              href="/create"
              className={`relative p-3 rounded-full transition-all duration-200 ${
                pathname === '/create'
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {pathname === '/create' && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/40"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}
              <Plus size={22} className="relative" />
            </Link>
          </Tooltip>
        </nav>
      </motion.div>
    </div>
  );
}
