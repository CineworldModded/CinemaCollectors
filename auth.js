import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = "https://tmjwmxgzdwhqgysvvjrz.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtandteGd6ZHdocWd5c3Z2anJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzE3MDUsImV4cCI6MjA3MjMwNzcwNX0.vfBArYNc_Q_DJQGogWCaGuAl-YLYZkhTGI5zwEsfo7Y";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth Functions
export async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Check your email to confirm your account!");
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else window.location.href = "index.html";
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// Navigation
export function goToCollection() {
  window.location.href = "collection.html";
}

export function goToHome() {
  window.location.href = "index.html";
}

// Session check
export async function requireAuth() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) window.location.href = "login.html";
  return user;
}
