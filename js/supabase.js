// supabase.js - Versión CORRECTA para GitHub Pages
const SUPABASE_URL = 'https://qpylzzjxbldtemrgqlja.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweWx6emp4YmxkdGVtcmdxbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTU4OTIsImV4cCI6MjA3MzQzMTg5Mn0.eZhPYRdS8Ptx2wS2Tt4QgRyP8ZGyTlObRe5V0VRQHiU';

// Crear cliente de Supabase GLOBAL con persistencia de sesión
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,    // ← ¡ESTA LÍNEA ES CLAVE!
    storage: localStorage,   // ← Guarda la sesión en el navegador
    autoRefreshToken: true   // ← Mantiene el token activo
  }
});
