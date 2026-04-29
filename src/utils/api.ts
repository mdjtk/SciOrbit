import { createClient } from './supabase/client';

export async function getPosts() {
  const supabase = createClient();
  const { data: orbits, error } = await supabase
    .from('orbits')
    .select('*, author:profiles(username, full_name, avatar_url, role)')
    .order('created_at', { ascending: false });

  if (error || !orbits || orbits.length === 0) return [];

  return orbits.map((o: any) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    height: 'h-[380px]', // Dynamic UI sizing
    likes: o.likes_count > 1000 ? `${(o.likes_count / 1000).toFixed(1)}k` : String(o.likes_count),
    user: o.author?.username || 'scientist',
    category: o.category,
    tags: o.tags || [],
    media: o.media_url,
  }));
}

export async function getLeaderboard(period: 'week' | 'month' | 'all' = 'month') {
  // In a real production app, 'period' would filter by date.
  // We'll just sort the global points here.
  const supabase = createClient();
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('points', { ascending: false })
    .limit(50);

  if (error || !profiles) return [];
  return profiles;
}

export async function getCampuses() {
  const supabase = createClient();
  const { data: campuses, error } = await supabase
    .from('campuses')
    .select('*')
    .order('score', { ascending: false });

  if (error || !campuses) return [];
  return campuses;
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  
  // 1. Get Profile
  const { data: profile, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (pErr || !profile) throw new Error('Profile not found');

  // 2. Get User Orbits (Posts)
  const { data: orbits } = await supabase
    .from('orbits')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  // 3. Get User Achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // 4. Get User Orbits Count 
  // (We could do a separate count query or just use orbits.length)
  
  return {
    profile,
    orbits: orbits || [],
    achievements: achievements || []
  };
}

export async function getNotifications(userId: string) {
  const supabase = createClient();
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !notifications) return [];
  return notifications;
}

export async function markNotificationsRead(userId: string) {
  const supabase = createClient();
  return await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId);
}
