// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// === REEMPLAZÁ CON TUS CREDENCIALES ===
const SUPABASE_URL = 'https://qpylzzjxbldtemrgqlja.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFweWx6emp4YmxkdGVtcmdxbGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NTU4OTIsImV4cCI6MjA3MzQzMTg5Mn0.eZhPYRdS8Ptx2wS2Tt4QgRyP8ZGyTlObRe5V0VRQHiU';

// Crear cliente de Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
