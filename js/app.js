// app.js - Código corregido para botones

// ===== EVENTOS PARA BOTONES - SE EJECUTA EN TODAS LAS PÁGINAS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM cargado, registrando eventos...");

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
                buscarPacientes();
            });
        }

        // Formulario de turnos (ya existente)
        const formTurno = document.getElementById('form-turno');
        if (formTurno) {
            formTurno.addEventListener('submit', async function(e) {
                e.preventDefault();
                const turnoData = {
                    fecha: document.getElementById('fecha-turno').value,
                    hora: document.getElementById('hora-turno').value,
                    dni: document.getElementById('dni-paciente').value
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

// ===== FUNCIÓN DE BÚSQUEDA =====
async function buscarPacientes() {
    const termino = document.getElementById('input-buscar-paciente').value;
    console.log('Buscando:', termino);
    
    if (!termino) {
        alert('Ingresá un DNI o nombre para buscar');
        return;
    }

    const resultados = await buscarPacientes(termino);
    console.log('Resultados:', resultados);
    
    if (resultados.length > 0) {
        alert(`Encontrados ${resultados.length} pacientes. Pronto podrás verlos aquí.`);
    } else {
        alert('No se encontraron pacientes con ese criterio.');
    }
}

// ===== CONSOLA GENERAL =====
console.log("✅ app.js cargado correctamente en:", window.location.pathname);
