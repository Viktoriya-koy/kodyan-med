document.addEventListener('DOMContentLoaded', function() {
    const sidebar = `
        <div class="sidebar">
            <h2>KodyanMED</h2>
            <ul>
                <li><a href="home.html">Inicio</a></li>
                <li><a href="agenda.html">Agenda</a></li>
                <li><a href="nuevo-paciente.html">Nuevo Paciente</a></li>
                <li><a href="#" id="logout-btn">Cerrar Sesión</a></li>
            </ul>
        </div>
        <div class="content">
            <!-- Tu contenido específico de cada página va aquí -->
        </div>
    `;
    
    document.body.innerHTML = sidebar + document.body.innerHTML;
});
