// auth.js - Versión CORRECTA para Supabase Auth
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay sesión activa
    verificarSesionActiva();
    
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
                console.log('🔐 Intentando login con Supabase Auth:', { email });
                
                // ✅ FORMA CORRECTA: Usar Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                console.log('📦 Respuesta de Supabase Auth:', data, error);
                
                if (error) {
                    throw new Error(error.message);
                }
                
                if (data.user) {
                    // Login exitoso - Supabase maneja la sesión automáticamente
                    mostrarExito('¡Login exitoso! Redirigiendo...');
                     // Vincular usuario de Auth con tu tabla 'profesionales'
    const { error: upsertError } = await supabase
    .from('profesionales')
    .upsert({
        email: data.user.email,
        auth_id: data.user.id,
        nombre: data.user.email.split('@')[0]
    }, {
        onConflict: 'email'
    });

if (upsertError) {
    console.error('Error al vincular profesional:', upsertError);
}

setTimeout(() => {
    window.location.href = 'home.html';
}, 1000);

} catch (error) {
    console.error('Error en login:', error);
    mostrarError('Error: ' + error.message);
} finally {
    // Restaurar botón
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}
        });
    }
});

// ✅ Verificar sesión activa al cargar la página
async function verificarSesionActiva() {
    const { data } = await supabase.auth.getSession();
    
    // Si hay sesión activa y está en login.html, redirigir a home
    if (data.session && window.location.pathname.includes('login.html')) {
        window.location.href = 'home.html';
    }
    
    // Si no hay sesión y está en una página protegida, redirigir a login
    if (!data.session && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// ✅ Cerrar sesión
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'login.html';
    }
}

// Las funciones de mensajes se mantienen
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
