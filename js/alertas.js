// alertas.js - Sistema de recordatorios por email

// ===== FUNCIÓN: ENVIAR RECORDATORIOS A PACIENTES =====
async function enviarRecordatoriosPacientes() {
    console.log('⏰ Enviando recordatorios a pacientes...');
    
    // 1. Obtener turnos de mañana
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaManana = manana.toISOString().split('T')[0];
    
    const { data: turnos, error } = await supabase
        .from('turnos')
        .select(`
            *,
            pacientes!dni_paciente (nombre_completo, email, telefono)
        `)
        .eq('fecha', fechaManana)
        .eq('estado', 'programado');
    
    if (error) {
        console.error('Error obteniendo turnos:', error);
        return;
    }
    
    console.log(`📋 ${turnos.length} turnos encontrados para mañana`);
    
    // 2. Crear alertas para cada turno
    for (const turno of turnos) {
        if (!turno.pacientes?.email) {
            console.log('⚠️ Paciente sin email, saltando:', turno.pacientes?.nombre_completo);
            continue;
        }
        
        const { error: alertaError } = await supabase
            .from('alertas')
            .insert([{
                tipo: 'recordatorio_paciente',
                destinatario_email: turno.pacientes.email,
                asunto: 'Recordatorio de turno odontológico',
                mensaje: `
Hola ${turno.pacientes.nombre_completo},

Te recordamos que tenés turno para mañana:
📅 Fecha: ${turno.fecha}
⏰ Hora: ${turno.hora}

Por favor confirmar asistencia.

Saludos,
Consultorio Odontológico Violeta
                `.trim(),
                turno_id: turno.id,
                estado: 'pendiente'
            }]);
        
        if (alertaError) {
            console.error('Error creando alerta:', alertaError);
        } else {
            console.log('✅ Alerta creada para:', turno.pacientes.email);
        }
    }
}

// ===== FUNCIÓN: ENVIAR RESUMEN A MÉDICO =====
async function enviarResumenMedico() {
    console.log('📊 Enviando resumen a médico...');
    
    // 1. Obtener turnos de hoy
    const hoy = new Date().toISOString().split('T')[0];
    
    const { data: turnos, error } = await supabase
        .from('turnos')
        .select(`
            *,
            pacientes!dni_paciente (nombre_completo, telefono)
        `)
        .eq('fecha', hoy)
        .order('hora', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo turnos:', error);
        return;
    }
    
    // 2. Construir mensaje
    let mensaje = `📅 Agenda para hoy (${hoy}):\n\n`;
    
    if (turnos.length === 0) {
        mensaje += 'No hay turnos programados para hoy.';
    } else {
        turnos.forEach((turno, index) => {
            mensaje += `${index + 1}. ⏰ ${turno.hora} - ${turno.pacientes.nombre_completo}\n`;
            mensaje += `   📞 ${turno.pacientes.telefono || 'Sin teléfono'}\n\n`;
        });
    }
    
    // 3. Crear alerta para médico
    const { error: alertaError } = await supabase
        .from('alertas')
        .insert([{
            tipo: 'resumen_medico',
            destinatario_email: 'vico.ambiente@gmail.com', // Email de Violeta
            asunto: `Resumen diario - ${hoy}`,
            mensaje: mensaje,
            estado: 'pendiente'
        }]);
    
    if (alertaError) {
        console.error('Error creando resumen:', alertaError);
    } else {
        console.log('✅ Resumen creado para médico');
    }
}

// ===== HACER FUNCIONES GLOBALES =====
window.enviarRecordatoriosPacientes = enviarRecordatoriosPacientes;
window.enviarResumenMedico = enviarResumenMedico;

// ===== EJECUTAR AL INICIAR (PARA PRUEBAS) =====
document.addEventListener('DOMContentLoaded', function() {
    // Crear botones de prueba en home.html
    if (window.location.pathname.includes('home.html')) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';
        buttonContainer.innerHTML = `
            <button class="btn" onclick="enviarRecordatoriosPacientes()">
                ⏰ Probar Recordatorios
            </button>
            <button class="btn" onclick="enviarResumenMedico()">
                📊 Probar Resumen
            </button>
        `;
        document.querySelector('.main-content').appendChild(buttonContainer);
    }
});
