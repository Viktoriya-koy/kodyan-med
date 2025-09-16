// js/paciente.js
document.addEventListener('DOMContentLoaded', function() {
    // Obtener DNI de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const dniPaciente = urlParams.get('dni');

    if (dniPaciente) {
        cargarDatosPaciente(dniPaciente);
        configurarFormularioEdicion();
    } else {
        console.error('No se especificó DNI del paciente en la URL');
        alert('Error: No se especificó paciente');
    }
});

// Cargar datos del paciente
async function cargarDatosPaciente(dni) {
    console.log('Cargando datos para DNI:', dni);
    
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('dni', dni)
        .single();

    if (error) {
        console.error('Error cargando paciente:', error);
        alert('Error al cargar datos del paciente');
        return;
    }

    // Llenar formulario
    document.getElementById('paciente-nombre').value = paciente.nombre_completo || '';
    document.getElementById('paciente-dni').value = paciente.dni || '';
    document.getElementById('paciente-telefono').value = paciente.telefono || '';
    document.getElementById('paciente-email').value = paciente.email || '';
    document.getElementById('paciente-obra-social').value = paciente.obra_social || '';
    document.getElementById('paciente-historial').value = paciente.historial_medico || '';
}

// Configurar formulario de edición
function configurarFormularioEdicion() {
    const form = document.getElementById('form-editar-paciente');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;
        
        const datosActualizados = {
            nombre_completo: document.getElementById('paciente-nombre').value,
            telefono: document.getElementById('paciente-telefono').value,
            email: document.getElementById('paciente-email').value,
            obra_social: document.getElementById('paciente-obra-social').value,
            historial_medico: document.getElementById('paciente-historial').value
        };

        const dni = document.getElementById('paciente-dni').value;

        const { error } = await supabase
            .from('pacientes')
            .update(datosActualizados)
            .eq('dni', dni);

        if (error) {
            console.error('Error actualizando paciente:', error);
            alert('Error al guardar cambios: ' + error.message);
        } else {
            alert('✅ Datos actualizados correctamente');
        }
        
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}
