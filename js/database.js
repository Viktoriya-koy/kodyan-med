// js/database.js
import { supabase } from './supabase.js';

// ===== FUNCIONES DE AUTENTICACIÓN =====
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  return { success: !error, user: data.user };
}

// ===== FUNCIONES DE TURNOS =====
export async function guardarTurno(turnoData) {
  const { data, error } = await supabase
    .from('turnos')
    .insert([turnoData]);
  
  return { success: !error, data };
}

export async function obtenerTurnosHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('turnos')
    .select('*')
    .eq('fecha', hoy);
  
  return data;
}

// ===== FUNCIONES DE PACIENTES =====
export async function buscarPaciente(dni) {
  const { data, error } = await supabase
    .from('pacientes')
    .select('*')
    .eq('dni', dni)
    .single();
  
  return data;
}

export async function obtenerPaciente(dni) {
  return await buscarPaciente(dni);
}