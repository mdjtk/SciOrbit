'use client';
import { Bell, Heart, UserPlus, Star, ChevronRight, Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getNotifications, markNotificationsRead } from '@/utils/api';
import { ScrollReveal } from '@/components/animations';

interface Notification {
  id: string; // Updated to string since Supabase uses UUIDs
  type: string;
  action_by: string; // Changed from user to action_by matches schema
  content: string;
  time?: string;
  icon?: React.ReactNode;
  color?: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // In production, you would fetch the current user's ID from session
      // For this static demo, we will pass a null or mock UUID if none exists
      // Wait, let's fetch 'all' or mock ID '123'
      const data = await getNotifications('mock-user-id-here'); 
      setNotifications(data.map((n: any) => ({
        ...n,
        icon: <Bell size={16} />, // Default icon
        color: "text-blue-500 bg-blue-50 border-blue-500/20"
      })));
      setLoading(false);
    }
    load();
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full">
      <ScrollReveal>
        <header className="flex justify-between items-center border-b border-border pb-4 mt-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-black text-primary italic">Activity Feed</h1>
            {unreadCount > 0 && (
              <motion.span 
                className="px-3 py-1 bg-gradient-to-r from-accent to-amber-400 text-white text-xs font-black uppercase tracking-wider rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                {unreadCount} new
              </motion.span>
            )}
          </div>
          <motion.button 
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors bg-white px-4 py-2 opacity-90 rounded-full shadow-sm hover:shadow-md border border-border"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check size={16} /> Mark all read
          </motion.button>
        </header>
      </ScrollReveal>

      <div className="flex flex-col gap-3 pb-12">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground animate-pulse">Loading notifications...</div>
        ) : (
          <>
            <AnimatePresence>
              {notifications.map((notif, i) => (
                <motion.div 
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`group flex items-center gap-4 p-5 transition-all cursor-pointer shadow-sm relative overflow-hidden ${
                    notif.read ? 'bg-white border-border border rounded-2xl hover:bg-muted/30' : 'bg-primary/[0.03] border border-primary/20 rounded-2xl'
                  }`}
                  whileHover={{ x: 4, boxShadow: '0 12px 40px rgba(12, 49, 103, 0.08)' }}
                >
                  {/* Unread indicator line */}
                  {!notif.read && (
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-accent"
                      layoutId={`unread-line-${notif.id}`}
                    />
                  )}

                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-inner ${notif.color}`}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                  >
                    {notif.icon}
                  </motion.div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <p className="text-foreground font-medium truncate text-[15px]">
                      <span className="font-extrabold font-display text-primary">{notif.action_by}</span>{' '}
                      <span className="text-muted-foreground">{notif.content}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-bold text-muted-foreground/60 tracking-wide uppercase">{notif.time || 'recently'}</span>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <motion.button 
                      onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id); }}
                      className="p-2.5 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-full text-muted-foreground hover:text-red-500 transition-all shadow-sm"
                      whileTap={{ scale: 0.8 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                    <div className="p-2 bg-white rounded-full border border-border shadow-sm">
                      <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length === 0 && (
              <motion.div 
                className="text-center py-24 glass-card rounded-3xl border border-border border-dashed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Bell size={32} className="text-muted-foreground/40" />
                </div>
                <p className="text-2xl font-display font-black text-primary italic mb-2">Caught up to Orbit</p>
                <p className="text-muted-foreground">You have zero unread activities in your network.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
