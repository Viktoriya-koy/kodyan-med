// database.js - Versión DEFINITIVA y CORRECTA
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

// ===== FUNCIÓN NUEVA PACIENTE CON VERIFICACIÓN =====
async function guardarNuevoPaciente(pacienteData) {
    console.log('Guardando paciente:', pacienteData);
    
    // VERIFICAR SI YA EXISTE
    const { data: existe } = await supabase
        .from('pacientes')
        .select('dni')
        .eq('dni', pacienteData.dni)
        .single();

    if (existe) {
        throw new Error('El paciente ya existe en el sistema');
    }

    delete pacienteData.id;
    
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

// ===== FUNCIONES PARA TURNOS =====
async function guardarTurno(turnoData) {
    console.log('Datos a guardar:', turnoData);
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
}

// ===== BÚSQUEDA DE PACIENTES =====
async function buscarPacientes(termino) {
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`dni.ilike.%${termino}%,nombre_completo.ilike.%${termino}%`);
    
    if (error) {
        console.error('Error buscando pacientes:', error);
        return [];
    }
    return data;
}

// ===== EXPORTAR TODAS LAS FUNCIONES PARA USO GLOBAL =====
window.guardarNuevoPaciente = guardarNuevoPaciente;
window.obtenerPaciente = obtenerPaciente;
window.guardarTurno = guardarTurno;
window.guardarProcedimiento = guardarProcedimiento;
window.buscarPacientes = buscarPacientes;
