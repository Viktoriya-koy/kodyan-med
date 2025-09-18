// app.js - Versión definitiva
// ===== EVENTOS PARA BOTONES - SE EJECUTA EN TODAS LAS PÁGINAS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM cargado, registrando eventos...");
     if (window.location.pathname.includes('patient-profile.html')) {
    console.log('🩺 Detectada página de perfil de paciente - configurando...');
         
    // ===== DEBUG: VERIFICAR QUE LOS ELEMENTOS EXISTAN =====
    console.log("🔍 Buscando elementos...");
    console.log("btn-agendar-paciente:", document.getElementById('btn-agendar-paciente'));
    console.log("btn-inicio:", document.getElementById('btn-inicio'));
    console.log("btn-buscar-paciente:", document.getElementById('btn-buscar-paciente'));
    console.log("input-buscar-paciente:", document.getElementById('input-buscar-paciente'));
    console.log("form-turno:", document.getElementById('form-turno'));
    console.log("fecha-turno:", document.getElementById('fecha-turno'));
    console.log("hora-turno:", document.getElementById('hora-turno'));
    console.log("dni-paciente:", document.getElementById('dni-paciente'));
    
    // ===== PARA HOME.HTML =====
    if (window.location.pathname.includes('home.html')) {
        console.log("🏠 Configurando home.html...");

        // Botón "Agendar Paciente"
        const btnAgendar = document.getElementById('btn-agendar-paciente');
        if (btnAgendar) {
            btnAgendar.addEventListener('click', function() {
                console.log('Abriendo formulario de agendar paciente...');
                alert('Formulario de nuevo paciente pronto...');
            });
        }

        // Botón "Inicio"
        const btnInicio = document.getElementById('btn-inicio');
        if (btnInicio) {
            btnInicio.addEventListener('click', function() {
                window.location.href = 'home.html';
            });
        }

        // Botón "Buscar"
        const btnBuscar = document.getElementById('btn-buscar-paciente');
        if (btnBuscar) {
            btnBuscar.addEventListener('click', function() {
                console.log('Buscando pacientes...');
                ejecutarBusqueda();
            });
        }

       // Formulario de turnos
const formTurno = document.getElementById('form-turno');
if (formTurno) {
    formTurno.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 👇 OBTENER SESIÓN PRIMERO
        const { data: { session } } = await supabase.auth.getSession();
        
        // 👇 VALIDAR QUE HAY SESIÓN ACTIVA
        if (!session) {
            alert('❌ No hay usuario logueado. Volvé a iniciar sesión.');
            return;
        }

        const turnoData = {
            fecha: document.getElementById('fecha-turno').value,
            hora: document.getElementById('hora-turno').value,
            dni_paciente: document.getElementById('dni-paciente').value,
            profesional_id: session.user.id // ✅ UUID del usuario logueado
        };
        
        const result = await guardarTurno(turnoData);
        if (result) {
            alert('Turno guardado!');
            formTurno.reset();
        }
    });
}

   // ===== PARA PATIENT-PROFILE.HTML =====
if (window.location.pathname.includes('patient-profile.html')) {
    console.log("📋 Configurando patient-profile.html...");
    
    // Cargar datos del paciente
    async function cargarDatosPaciente() {
        const urlParams = new URLSearchParams(window.location.search);
        const dni = urlParams.get('dni');
        
        if (dni) {
            const paciente = await obtenerPaciente(dni);
            if (paciente) {
                document.getElementById('paciente-nombre').textContent = paciente.nombre_completo;
                document.getElementById('paciente-dni').textContent = paciente.dni;
                // ... completar los demás campos
            }
        }
    }
    
    cargarDatosPaciente();
} // ← ✅ Solo esta llave de cierre del if

// ===== FUNCIÓN DE BÚSQUEDA =====
async function ejecutarBusqueda() {
    const termino = document.getElementById('input-buscar-paciente').value;
    console.log('Buscando:', termino);
    
    if (!termino) {
        alert('Ingresá un DNI o nombre para buscar');
        return;
    }

    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .or(`dni.ilike.%${termino}%,nombre_completo.ilike.%${termino}%`);
    
    if (error) {
        console.error('Error buscando:', error);
        alert('Error en la búsqueda: ' + error.message);
        return;
    }

    console.log('Resultados:', data);
    
    // ===== MOSTRAR RESULTADOS EN PANTALLA =====
    if (data.length > 0) {
        let html = '<div class="resultados-busqueda" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">';
        html += '<h4>📋 Resultados de búsqueda:</h4>';
        
        data.forEach(paciente => {
            html += `
                <div class="paciente-item" style="padding: 10px; margin: 10px 0; background: white; border-radius: 5px; cursor: pointer; border: 1px solid #ddd;" 
                     onclick="window.location.href='patient-profile.html?dni=${paciente.dni}'">
                    <strong>👤 ${paciente.nombre_completo}</strong><br>
                    <small>📄 DNI: ${paciente.dni}</small>
                </div>
            `;
        });
        
        html += '</div>';
        
         // Insertar después del botón de búsqueda
        const buscarCard = document.querySelector('.card:has(#btn-buscar-paciente)');
        if (buscarCard) {
            const oldResults = buscarCard.querySelector('.resultados-busqueda');
            if (oldResults) oldResults.remove();
            buscarCard.insertAdjacentHTML('beforeend', html);
        }
        
    } else {
        alert('No se encontraron pacientes con ese criterio.');
    }
}

// ===== AGENDA DEL DÍA (NUEVO CÓDIGO) =====
async function cargarAgendaHoy() {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;

        const { data: turnos, error } = await supabase
            .from('turnos')
            .select(`
                *,
                pacientes:dni_paciente (nombre_completo, telefono)
            `)
            .eq('profesional_id', session.user.id)
            .eq('fecha', hoy)
            .order('hora', { ascending: true });

        if (error) {
            console.error('Error cargando agenda:', error);
            return;
        }

        const container = document.getElementById('agenda-hoy');
        if (!container) return;

        if (turnos.length === 0) {
            container.innerHTML = '<p>🎉 No hay turnos para hoy</p>';
            // Actualizar estadísticas
            document.querySelectorAll('#estadisticas-hoy h4').forEach(h4 => h4.textContent = '0');
            return;
        }

        let html = '';
        turnos.forEach(turno => {
            html += `
                <div style="padding: 10px; margin: 5px 0; background: var(--violeta-secundario); 
                            border-radius: 8px; border-left: 4px solid var(--violeta-acento);">
                    <strong>⏰ ${turno.hora}</strong>
                    <br>
                    <span>👤 ${turno.pacientes?.nombre_completo || 'N/A'}</span>
                    <br>
                    <small>📞 ${turno.pacientes?.telefono || 'Sin teléfono'}</small>
                </div>
            `;
        });

        container.innerHTML = html;
        
        // Actualizar estadísticas
        const statsContainer = document.getElementById('estadisticas-hoy');
        if (statsContainer) {
            const statsElements = statsContainer.querySelectorAll('h4');
            if (statsElements.length >= 3) {
                statsElements[0].textContent = turnos.length;
                statsElements[1].textContent = 
                    turnos.filter(t => t.estado === 'confirmado').length;
                statsElements[2].textContent = 
                    turnos.filter(t => t.estado === 'pendiente' || !t.estado).length;
            }
        }
            
    } catch (error) {
        console.error('Error en cargarAgendaHoy:', error);
    }
}
// ===== PRÓXIMOS TURNOS (mañana en adelante) =====
async function cargarProximosTurnos() {
    try {
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        const fechaManana = manana.toISOString().split('T')[0];
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: turnos, error } = await supabase
            .from('turnos')
            .select(`
                *,
                pacientes:dni_paciente (nombre_completo)
            `)
            .eq('profesional_id', session.user.id)
            .gte('fecha', fechaManana)
            .order('fecha', { ascending: true })
            .order('hora', { ascending: true })
            .limit(5); // Solo 5 próximos turnos
 if (error) {
            console.error('Error cargando próximos turnos:', error);
            return;
        }

        const container = document.getElementById('proximos-turnos');
        if (!container) return;

        if (turnos.length === 0) {
            container.innerHTML = '<p>🎉 No hay próximos turnos</p>';
            return;
        }

        let html = '';
        turnos.forEach(turno => {
            const fechaFormateada = new Date(turno.fecha).toLocaleDateString('es-AR');
            html += `
                <div style="padding: 8px; margin: 4px 0; background: var(--violeta-secundario); 
                            border-radius: 6px; font-size: 14px;">
                    <strong>📅 ${fechaFormateada}</strong> 
                    <strong>⏰ ${turno.hora}</strong>
                    <br>
                    <span>👤 ${turno.pacientes?.nombre_completo || 'N/A'}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    } catch (error) {
        console.error('Error en cargarProximosTurnos:', error);
    }
}

// ===== CONSOLA GENERAL =====
console.log("✅ app.js cargado correctamente en:", window.location.pathname);
