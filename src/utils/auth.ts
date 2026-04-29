import { createClient } from './supabase/client';

export async function login(email: string, password: string, role: string, campusCode?: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error('Could not authenticate user');
  }

  // Custom Role Redirection Logic
  if (role === 'admin') {
      window.location.href = '/admin'; // Existing System Admin
      return;
  }
  if (role === 'student') {
      window.location.href = '/student-centre'; // New Student Hub
      return;
  }
  if (role === 'campus') {
      window.location.href = '/campus-portal'; // New Campus Administration Portal
      return;
  }

  // Normal User
  window.location.href = '/';
}

export async function signup(email: string, password: string, role: string, campusCode?: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        campus_code: campusCode,
      }
    }
  });

  if (error) {
    throw new Error('Could not create user');
  }

  return 'Check email to continue sign in process';
}

export async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error('Could not logout');
  }

  window.location.href = '/login';
}
