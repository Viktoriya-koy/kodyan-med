// auth.js - Versión para Supabase
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
                console.log('🔐 Intentando login con Supabase:', { email, password });
                
                // CONSULTA DIRECTA A SUPABASE - ESTO ES LO NUEVO
                const { data, error } = await supabase
                    .from('profesionales')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password)
                    .single();
                
                console.log('📦 Respuesta de Supabase:', data, error);
                
                if (error) {
                    throw new Error(error.message);
                }
                
                if (data) {
                    // Login exitoso
                    localStorage.setItem('user', JSON.stringify(data));
                    mostrarExito('¡Login exitoso! Redirigiendo...');
                    
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 1000);
                } else {
                    mostrarError('Usuario o contraseña incorrectos');
                }
                
            } catch (error) {
                console.error('Error en login:', error);
                mostrarError('Error de conexión: ' + error.message);
            } finally {
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Las funciones mostrarError y mostrarExito se mantienen igual
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
        setTimeout(() => { messageDiv.classList.add('hidden'); }, 5000);
    } else { alert(mensaje); }
}

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
