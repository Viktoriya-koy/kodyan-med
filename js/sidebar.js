document.addEventListener('DOMContentLoaded', function() {
    // Crear la estructura HTML de la barra lateral
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

    // Insertar la barra lateral al principio del body
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // Asegurarse de que el contenido principal tenga el margen izquierdo correcto
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.marginLeft = '250px'; // Ajusta según el ancho de tu navbar
    }
});
