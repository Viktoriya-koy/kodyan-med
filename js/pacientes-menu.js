// js/pacientes-menu.js
document.addEventListener('DOMContentLoaded', function() {
    const btnPacientes = document.getElementById('btn-menu-pacientes');
    
    if (btnPacientes) {
        btnPacientes.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarMenuPacientes();
        });
    }
});

function mostrarMenuPacientes() {
    // Crear modal/menú
    const modalHTML = `
        <div class="modal-pacientes" style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 250px;
        ">
            <h3 style="margin-bottom: 15px; color: var(--violeta-acento);">
                <i class="fas fa-user-injured"></i> Gestión de Pacientes
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn" onclick="buscarPaciente()" style="justify-content: center;">
                    <i class="fas fa-search"></i> Buscar Paciente
                </button>
                
                <button class="btn" onclick="nuevoPaciente()" style="justify-content: center;">
                    <i class="fas fa-plus-circle"></i> Nuevo Paciente
                </button>
            </div>
            
            <button onclick="cerrarMenu()" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
            ">×</button>
        </div>
        
        <div class="modal-backdrop" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        " onclick="cerrarMenu()"></div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function buscarPaciente() {
    cerrarMenu();
    // Enfocar el input de búsqueda en la página actual
    const inputBusqueda = document.getElementById('input-buscar-paciente');
    if (inputBusqueda) {
        inputBusqueda.focus();
    } else {
        // O redirigir a la página de búsqueda
        window.location.href = 'home.html#pacientes';
    }
}

function nuevoPaciente() {
    cerrarMenu();
    window.location.href = 'nuevo-paciente.html';
}

function cerrarMenu() {
    const modal = document.querySelector('.modal-pacientes');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (modal) modal.remove();
    if (backdrop) backdrop.remove();
}
