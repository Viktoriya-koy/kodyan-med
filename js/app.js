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
