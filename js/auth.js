// js/app.js
// ===== PARA HOME.HTML =====
if (window.location.pathname.includes('home.html')) {
  // Código específico del dashboard
  document.getElementById('form-turno').addEventListener('submit', async function(e) {
    e.preventDefault();
    const turnoData = {
      fecha: document.getElementById('fecha-turno').value,
      hora: document.getElementById('hora-turno').value,
      dni: document.getElementById('dni-paciente').value
    };// js/auth.js - Manejo de autenticación
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzH_SHTghxiNfcjM05ixSEr6n51jCoOkkNSpttY0wmK2NT75_ymZ5AW4vfjtccNYq0cug/exec';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        mostrarError('Por favor, completá todos los campos');
        return;
      }
      
      // Mostrar loading
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ingresando...';
      submitBtn.disabled = true;
      
      try {
        console.log('Intentando login con:', { email, password });
        
        const response = await fetch(GAS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'login',
            email: email,
            password: password
          })
        });
        
        console.log('Respuesta recibida:', response);
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Resultado parseado:', result);
        
        if (result.success) {
          // Login exitoso
          localStorage.setItem('user', JSON.stringify(result.user));
          mostrarExito('¡Login exitoso! Redirigiendo...');
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            window.location.href = 'home.html';
          }, 1000);
          
        } else {
          // Login fallido
          mostrarError('Usuario o contraseña incorrectos');
        }
        
      } catch (error) {
        console.error('Error en login:', error);
        mostrarError('Error de conexión. Verificá tu internet e intentá nuevamente.');
      } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});

// Función para mostrar errores
function mostrarError(mensaje) {
  const messageDiv = document.getElementById('login-message');
  if (messageDiv) {
    messageDiv.innerHTML = `
      <div style="padding: 10px; background: #ffebee; color: #c62828; 
                  border-radius: 5px; margin: 10px 0; border: 1px solid #ffcdd2;">
        <i class="fas fa-exclamation-circle"></i> ${mensaje}
      </div>
    `;
    messageDiv.classList.remove('hidden');
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      messageDiv.classList.add('hidden');
    }, 5000);
  } else {
    alert(mensaje); // Fallback por si no existe el div
  }
}

// Función para mostrar éxito
function mostrarExito(mensaje) {
  const messageDiv = document.getElementById('login-message');
  if (messageDiv) {
    messageDiv.innerHTML = `
      <div style="padding: 10px; background: #e8f5e8; color: #2e7d32; 
                  border-radius: 5px; margin: 10px 0; border: 1px solid #c8e6c9;">
        <i class="fas fa-check-circle"></i> ${mensaje}
      </div>
    `;
    messageDiv.classList.remove('hidden');
  }
}

// Verificar si ya está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && window.location.pathname.endsWith('index.html')) {
    // Si ya está logueado y está en login, redirigir a home
    window.location.href = 'home.html';
  }
});

// Función para probar la conexión con GAS (opcional)
window.probarConexionGAS = async function() {
  try {
    console.log('Probando conexión con GAS...');
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'test',
        message: 'Test de conexión'
      })
    });
    
    const result = await response.text();
    console.log('Conexión exitosa:', result);
    return true;
  } catch (error) {
    console.error('Error de conexión:', error);
    return false;
  }
};
    
    const result = await guardarTurno(turnoData);
    if (result) {
      alert('Turno guardado!');
      document.getElementById('form-turno').reset();
    }
  });
}

// ===== PARA PATIENT-PROFILE.HTML =====
if (window.location.pathname.includes('patient-profile.html')) {
  // Código específico de la ficha
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