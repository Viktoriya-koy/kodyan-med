// app.js - Versión definitiva sin duplicados

// ===== EVENTOS PARA BOTONES - SE EJECUTA EN TODAS LAS PÁGINAS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM cargado, registrando eventos...");
    
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
        
        // Procesar nuevo paciente desde localStorage
        const nuevoPacienteStr = localStorage.getItem('nuevoPaciente');
        if (nuevoPacienteStr) {
            const nuevoPaciente = JSON.parse(nuevoPacienteStr);
            console.log('Procesando nuevo paciente:', nuevoPaciente);
            alert('Paciente listo para guardar: ' + nuevoPaciente.nombre);
            localStorage.removeItem('nuevoPaciente');
        }

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
               const turnoData = {
    fecha: document.getElementById('fecha-turno').value,
    hora: document.getElementById('hora-turno').value,
    dni_paciente: document.getElementById('dni-paciente').value,  // ← COMA aquí
    profesional_id: 1  // ← SIN COMA aquí
};
                
                const result = await guardarTurno(turnoData);
                if (result) {
                    alert('Turno guardado!');
                    formTurno.reset();
                }
            });
        }
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
                    document.getElementById('paciente-nombre').textContent = paciente.nombre;
                    document.getElementById('paciente-dni').textContent = paciente.dni;
                    // ... completar los demás campos
                }
            }
        }
        
        cargarDatosPaciente();
    }
});

// ===== FUNCIÓN DE BÚSQUEDA (ÚNICA VERSIÓN) =====
async function ejecutarBusqueda() {
    const termino = document.getElementById('input-buscar-paciente').value;
    console.log('Buscando:', termino);
    
    if (!termino) {
        alert('Ingresá un DNI o nombre para buscar');
        return;
    }

    // CONSULTA DIRECTA A SUPABASE
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
    
    if (data.length > 0) {
        alert(`Encontrados ${data.length} pacientes. Pronto podrás verlos aquí.`);
    } else {
        alert('No se encontraron pacientes con ese criterio.');
    }
}

// ===== CONSOLA GENERAL =====
console.log("✅ app.js cargado correctamente en:", window.location.pathname);
