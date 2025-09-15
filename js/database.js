// database.js - Versión definitiva para GitHub Pages
// ===== FUNCIONES PARA PACIENTES =====
async function obtenerPaciente(dni) {
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('dni', dni)
        .single();
    
    if (error) {
        console.error('Error obteniendo paciente:', error);
        return null;
    }
    return data;
}

async function guardarPaciente(pacienteData) {
    const { data, error } = await supabase
        .from('pacientes')
        .insert([pacienteData])
        .select();
    
    if (error) {
        console.error('Error guardando paciente:', error);
        return null;
    }
    return data;
}

// ===== FUNCIONES PARA TURNOS =====
async function guardarTurno(turnoData) {
    const { data, error } = await supabase
        .from('turnos')
        .insert([turnoData])
        .select();
    
    if (error) {
        console.error('Error guardando turno:', error);
        return null;
    }
    return data;
}

// ===== FUNCIONES PARA PROCEDIMIENTOS =====
async function guardarProcedimiento(procData) {
    const { data, error } = await supabase
        .from('procedimientos')
        .insert([procData])
        .select();
    
    if (error) {
        console.error('Error guardando procedimiento:', error);
        return null;
    }
    return data;
// ===== BÚSQUEDA DE PACIENTES =====
async function buscarPacientes(termino) {
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`dni.ilike.%${termino}%,nombre.ilike.%${termino}%`);
    
    if (error) {
        console.error('Error buscando pacientes:', error);
        return [];
    }
    return data;
}
}
// ===== GUARDAR NUEVO PACIENTE =====
async function guardarNuevoPaciente(pacienteData) {
    console.log('Guardando paciente:', pacienteData);
    
    const { data, error } = await supabase
        .from('pacientes')
        .insert([pacienteData])
        .select();
    
    if (error) {
        console.error('Error guardando paciente:', error);
        throw new Error(error.message);
    }
    
    return data[0];
}
