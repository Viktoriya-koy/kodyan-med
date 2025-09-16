document.addEventListener('DOMContentLoaded', function() {
    const sidebarHTML = `
        <nav class="navbar">
            <div class="navbar-brand">
                <h1>KodyanMED</h1>
            </div>
            <ul class="navbar-menu">
                <li class="navbar-item"><a href="home.html"><i class="fas fa-home"></i> Inicio</a></li>
                <li class="navbar-item"><a href="agenda.html"><i class="fas fa-calendar-alt"></i> Agenda</a></li>
                <li class="navbar-item"><a href="#pacientes"><i class="fas fa-user-injured"></i> Pacientes</a></li>
                <li class="navbar-item"><a href="#"><i class="fas fa-cog"></i> Configuración</a></li>
            </ul>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
});
