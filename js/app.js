// app.js - Código seguro que solo se ejecuta donde corresponde

// ===== PARA HOME.HTML =====
if (window.location.pathname.includes('home.html')) {
  console.log("🏠 Ejecutando código para home.html");
  
  // Solo ejecutar si el elemento existe
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
// ===== EVENTOS PARA BOTONES =====
document.addEventListener('DOMContentLoaded', function() {
    // Botón "Agendar Paciente"
    const btnAgendar = document.getElementById('btn-agendar-paciente');
    if (btnAgendar) {
        btnAgendar.addEventListener('click', function() {
            console.log('Abriendo formulario de agendar paciente...');
            // Acá va la lógica para mostrar el formulario
            alert('Formulario de nuevo paciente pronto...');
        });
    }

    // Botón "Inicio" (ya debería funcionar por el href, pero por si acaso)
    const btnInicio = document.getElementById('btn-inicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }

    // Botón "Buscar" (ya tienes este, pero lo verificamos)
    const btnBuscar = document.getElementById('btn-buscar-paciente');
    if (btnBuscar) {
        btnBuscar.addEventListener('click', function() {
            console.log('Buscando pacientes...');
            // Acá va la lógica de búsqueda
            buscarPacientes();
        });
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

    const resultados = await buscarPacientes(termino); // Esta función está en database.js
    console.log('Resultados:', resultados);
    
    // Acá va la lógica para mostrar los resultados
    if (resultados.length > 0) {
        alert(`Encontrados ${resultados.length} pacientes. Pronto podrás verlos aquí.`);
    } else {
        alert('No se encontraron pacientes con ese criterio.');
    }
}
// ===== PARA PATIENT-PROFILE.HTML =====
if (window.location.pathname.includes('patient-profile.html')) {
  console.log("📋 Ejecutando código para patient-profile.html");
  
  // Solo ejecutar si estamos en la página correcta
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

// ===== CÓDIGO GENERAL QUE SE EJECUTA EN TODAS LAS PÁGINAS =====
console.log("✅ app.js cargado correctamente en:", window.location.pathname);
