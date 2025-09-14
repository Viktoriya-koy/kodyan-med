// js/app.js - Archivo principal de funcionalidades
// ==================================================

// ===== PARA HOME.HTML (DASHBOARD) =====
if (window.location.pathname.includes('home.html')) {
  
  // 1. FORMULARIO DE TURNOS
  document.getElementById('form-turno').addEventListener('submit', async function(e) {
    e.preventDefault();
    const turnoData = {
      fecha: document.getElementById('fecha-turno').value,
      hora: document.getElementById('hora-turno').value,
      dni: document.getElementById('dni-paciente').value
    };
    
    const result = await guardarTurno(turnoData);
    if (result) {
      alert('Turno guardado correctamente! ✅');
      document.getElementById('form-turno').reset();
    } else {
      alert('Error al guardar el turno ❌');
    }
  });

  // 2. BÚSQUEDA DE PACIENTES
  document.getElementById('btn-buscar-paciente').addEventListener('click', async function() {
    const dni = document.getElementById('buscar-dni').value;
    
    if (!dni) {
      alert('Por favor, ingresa un DNI');
      return;
    }
    
    const paciente = await buscarPaciente(dni);
    
    if (paciente && paciente.nombre) {
      const resultadosDiv = document.getElementById('resultados-busqueda');
      resultadosDiv.innerHTML = `
        <div class="card">
          <h3>👤 Paciente Encontrado</h3>
          <p><strong>Nombre:</strong> ${paciente.nombre}</p>
          <p><strong>DNI:</strong> ${paciente.dni}</p>
          <p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p>
          <p><strong>Email:</strong> ${paciente.email || 'No registrado'}</p>
          <button class="btn" onclick="verFichaPaciente('${paciente.dni}')">
            📋 Ver Ficha Completa
          </button>
        </div>
      `;
      resultadosDiv.classList.remove('hidden');
    } else {
      alert('Paciente no encontrado ❌');
    }
  });

  // 3. CARGAR TURNOS DEL DÍA
  async function cargarTurnosHoy() {
    try {
      const turnos = await callGAS('obtenerTurnosHoy');
      const tabla = document.getElementById('tabla-turnos-hoy');
      
      if (turnos && turnos.length > 0) {
        tabla.innerHTML = turnos.map(turno => `
          <tr>
            <td>${turno.fecha || 'Sin fecha'}</td>
            <td>${turno.hora || 'Sin hora'}</td>
            <td>${turno.paciente || 'Sin paciente'}</td>
            <td><span class="estado-badge">${turno.estado || 'Pendiente'}</span></td>
          </tr>
        `).join('');
      } else {
        tabla.innerHTML = '<tr><td colspan="4" class="text-center">No hay turnos para hoy 📅</td></tr>';
      }
    } catch (error) {
      console.error('Error cargando turnos:', error);
    }
  }

  // 4. FUNCIÓN PARA VER FICHA
  window.verFichaPaciente = function(dni) {
    window.location.href = `patient-profile.html?dni=${dni}`;
  };

  // Cargar turnos al iniciar la página
  cargarTurnosHoy();
}

// ===== PARA PATIENT-PROFILE.HTML (FICHA) =====
if (window.location.pathname.includes('patient-profile.html')) {
  
  const urlParams = new URLSearchParams(window.location.search);
  const dni = urlParams.get('dni');

  // 1. CARGAR DATOS DEL PACIENTE
  async function cargarDatosPaciente() {
    if (!dni) {
      alert('No se especificó un DNI de paciente');
      return;
    }
    
    try {
      const paciente = await obtenerPaciente(dni);
      
      if (paciente && paciente.nombre) {
        // Completar todos los campos
        document.getElementById('paciente-nombre').textContent = paciente.nombre;
        document.getElementById('paciente-dni').textContent = paciente.dni;
        document.getElementById('paciente-telefono').textContent = paciente.telefono || 'No registrado';
        document.getElementById('paciente-email').textContent = paciente.email || 'No registrado';
        document.getElementById('paciente-obra-social').textContent = paciente.obraSocial || 'No registrada';
        document.getElementById('paciente-historial').textContent = paciente.historial || 'Sin historial médico';
        
        // Actualizar título de la página
        document.title = `Paciente: ${paciente.nombre} - KodyanMED`;
      } else {
        alert('Paciente no encontrado');
        window.history.back();
      }
    } catch (error) {
      console.error('Error cargando paciente:', error);
      alert('Error al cargar los datos del paciente');
    }
  }

  // 2. FORMULARIO DE PROCEDIMIENTOS
  document.getElementById('form-procedimiento').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const procedimientoData = {
      dni: dni,
      fecha: document.getElementById('fecha-procedimiento').value || new Date().toISOString().split('T')[0],
      procedimiento: document.getElementById('tipo-procedimiento').value,
      detalles: document.getElementById('detalles-procedimiento').value,
      precio: document.getElementById('precio-procedimiento').value || '0'
    };
    
    // Validación básica
    if (!procedimientoData.procedimiento) {
      alert('Por favor, describe el procedimiento');
      return;
    }
    
    const result = await guardarProcedimiento(procedimientoData);
    if (result) {
      alert('Procedimiento guardado correctamente! ✅');
      document.getElementById('form-procedimiento').reset();
      cargarProcedimientos(); // Recargar la lista
    } else {
      alert('Error al guardar el procedimiento ❌');
    }
  });

  // 3. CARGAR PROCEDIMIENTOS EXISTENTES
  async function cargarProcedimientos() {
    try {
      const procedimientos = await callGAS('obtenerProcedimientos', { dni: dni });
      const tabla = document.getElementById('tabla-procedimientos');
      
      if (procedimientos && procedimientos.length > 0) {
        tabla.innerHTML = procedimientos.map(proc => `
          <tr>
            <td>${proc.fecha || 'Sin fecha'}</td>
            <td>${proc.procedimiento || 'Sin especificar'}</td>
            <td>${proc.detalles || 'Sin detalles'}</td>
            <td>$${proc.precio || '0'}</td>
          </tr>
        `).join('');
      } else {
        tabla.innerHTML = '<tr><td colspan="4" class="text-center">No hay procedimientos registrados 📝</td></tr>';
      }
    } catch (error) {
      console.error('Error cargando procedimientos:', error);
    }
  }

  // 4. CARGAR TURNOS DEL PACIENTE
  async function cargarTurnosPaciente() {
    try {
      const turnos = await callGAS('obtenerTurnosPaciente', { dni: dni });
      const tabla = document.getElementById('tabla-turnos-paciente');
      
      if (turnos && turnos.length > 0) {
        tabla.innerHTML = turnos.map(turno => `
          <tr>
            <td>${turno.fecha || 'Sin fecha'}</td>
            <td>${turno.hora || 'Sin hora'}</td>
            <td><span class="estado-badge">${turno.estado || 'Pendiente'}</span></td>
          </tr>
        `).join('');
      } else {
        tabla.innerHTML = '<tr><td colspan="3" class="text-center">No hay turnos registrados 📅</td></tr>';
      }
    } catch (error) {
      console.error('Error cargando turnos:', error);
    }
  }

  // Ejecutar todo al cargar la página
  cargarDatosPaciente();
  cargarProcedimientos();
  cargarTurnosPaciente();
}

// ===== FUNCIONES GLOBALES =====
// Función para cerrar sesión
window.cerrarSesion = function() {
  if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  }
};

// Verificar autenticación en páginas protegidas
if (window.location.pathname.includes('home.html') || 
    window.location.pathname.includes('patient-profile.html')) {
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    alert('Debés iniciar sesión primero 🔐');
    window.location.href = 'index.html';
  }
}