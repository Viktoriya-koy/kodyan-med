// alertas.js - Sistema profesional de notificaciones

class SistemaAlertas {
    constructor() {
        this.inicializar();
    }

    async inicializar() {
        console.log('✅ Sistema de alertas inicializado');
    }

    // ===== RECORDATORIOS PACIENTES =====
    async enviarRecordatoriosPacientes() {
        try {
            this.mostrarEstado('⏰ Buscando turnos de mañana...');
            
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
            
            if (error) throw error;

            this.mostrarEstado(`📋 Encontrados ${turnos.length} turnos para mañana`);
            
            let alertasCreadas = 0;
            for (const turno of turnos) {
                if (!turno.pacientes?.email) continue;
                
                const { error: alertaError } = await supabase
                    .from('alertas')
                    .insert([{
                        tipo: 'recordatorio_paciente',
                        destinatario_email: turno.pacientes.email,
                        asunto: 'Recordatorio de turno odontológico',
                        mensaje: this.generarMensajePaciente(turno),
                        turno_id: turno.id,
                        estado: 'pendiente'
                    }]);
                
                if (!alertaError) alertasCreadas++;
            }
            
            this.mostrarEstado(`✅ ${alertasCreadas} recordatorios creados en la base de datos`, 'exito');
            
        } catch (error) {
            console.error('Error en recordatorios:', error);
            this.mostrarEstado('❌ Error: ' + error.message, 'error');
        }
    }

    // ===== RESUMEN MÉDICO =====
    async enviarResumenMedico() {
        try {
            this.mostrarEstado('📊 Generando resumen diario...');
            
            const hoy = new Date().toISOString().split('T')[0];
            const { data: turnos, error } = await supabase
                .from('turnos')
                .select(`
                    *,
                    pacientes!dni_paciente (nombre_completo, telefono)
                `)
                .eq('fecha', hoy)
                .order('hora', { ascending: true });
            
            if (error) throw error;

            const mensaje = this.generarMensajeMedico(turnos, hoy);
            
            const { error: alertaError } = await supabase
                .from('alertas')
                .insert([{
                    tipo: 'resumen_medico',
                    destinatario_email: 'vico.ambiente@gmail.com',
                    asunto: `Resumen diario - ${hoy}`,
                    mensaje: mensaje,
                    estado: 'pendiente'
                }]);
            
            if (alertaError) throw alertaError;
            
            this.mostrarEstado('✅ Resumen médico creado en la base de datos', 'exito');
            
        } catch (error) {
            console.error('Error en resumen médico:', error);
            this.mostrarEstado('❌ Error: ' + error.message, 'error');
        }
    }

    // ===== GENERADORES DE MENSAJES =====
    generarMensajePaciente(turno) {
        return `
Hola ${turno.pacientes.nombre_completo},

Te recordamos que tenés turno para mañana:
📅 Fecha: ${turno.fecha}
⏰ Hora: ${turno.hora}

Por favor confirmar asistencia.

Saludos,
Consultorio Odontológico Violeta
        `.trim();
    }

    generarMensajeMedico(turnos, fecha) {
        let mensaje = `📅 Agenda para el ${fecha}:\n\n`;
        
        if (turnos.length === 0) {
            mensaje += 'No hay turnos programados para hoy.';
        } else {
            turnos.forEach((turno, index) => {
                mensaje += `${index + 1}. ⏰ ${turno.hora} - ${turno.pacientes.nombre_completo}\n`;
                mensaje += `   📞 ${turno.pacientes.telefono || 'Sin teléfono'}\n`;
                mensaje += `   📝 Estado: ${turno.estado}\n\n`;
            });
        }
        
        return mensaje;
    }

    // ===== UI HELPER =====
    mostrarEstado(mensaje, tipo = 'info') {
        const contenedor = document.getElementById('estado-alertas');
        if (!contenedor) return;
        
        const clases = {
            info: 'estado-info',
            exito: 'estado-exito',
            error: 'estado-error'
        };
        
        contenedor.innerHTML = `
            <div class="${clases[tipo]}" style="padding: 10px; border-radius: 5px; margin: 5px 0;">
                ${mensaje}
            </div>
        `;
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    window.sistemaAlertas = new SistemaAlertas();
});

// ===== FUNCIONES GLOBALES PARA LOS BOTONES =====
function probarRecordatorios() {
    if (window.sistemaAlertas) {
        window.sistemaAlertas.enviarRecordatoriosPacientes();
    }
}

function probarResumen() {
    if (window.sistemaAlertas) {
        window.sistemaAlertas.enviarResumenMedico();
    }
}
// Funcionalidad para el modal de alertas
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal-alertas');
    const btn = document.getElementById('btn-alertas-sidebar');
    const span = document.querySelector('.close-modal');

    // Abrir modal al hacer clic en "Alertas"
    btn.onclick = function(event) {
        event.preventDefault(); // Evita que el link recargue la página
        modal.style.display = 'block';
    }

    // Cerrar modal al hacer clic en la X
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Cerrar modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
