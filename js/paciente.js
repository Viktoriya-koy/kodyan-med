// js/paciente.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script de paciente cargado');
    
    // Obtener DNI de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const dniPaciente = urlParams.get('dni');

    if (dniPaciente) {
        console.log('Buscando paciente con DNI:', dniPaciente);
        cargarDatosPaciente(dniPaciente);
        configurarFormularioEdicion();
    } else {
        console.error('❌ No se especificó DNI del paciente en la URL');
        alert('Error: No se especificó paciente. Volvé a la lista de pacientes.');
    }
});

// Cargar datos del paciente
async function cargarDatosPaciente(dni) {
    console.log('📥 Cargando datos para DNI:', dni);
    
    const { data: paciente, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('dni', dni)
        .single();

    if (error) {
        console.error('❌ Error cargando paciente:', error);
        alert('Error al cargar datos del paciente: ' + error.message);
        return;
    }

    if (!paciente) {
        alert('⚠️ No se encontró paciente con DNI: ' + dni);
        return;
    }

   // Llenar formulario PERO hacer los campos readonly inicialmente
document.getElementById('paciente-nombre').value = paciente.nombre_completo || '';
document.getElementById('paciente-dni').value = paciente.dni || '';
document.getElementById('paciente-telefono').value = paciente.telefono || '';
document.getElementById('paciente-email').value = paciente.email || '';
document.getElementById('paciente-obra-social').value = paciente.obra_social || '';
document.getElementById('paciente-historial').value = paciente.historial_medico || '';

// Hacer todos los campos readonly inicialmente (excepto DNI)
const campos = ['nombre', 'telefono', 'email', 'obra-social', 'historial'];
campos.forEach(campo => {
    const element = document.getElementById('paciente-' + campo);
    if (element) {
        element.readOnly = true;
    }
});

// Agregar botón de editar
agregarBotonEditar();
    
    console.log('✅ Datos del paciente cargados');
}
function agregarBotonEditar() {
    const form = document.getElementById('form-editar-paciente');
    
    // Crear botón de editar
    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.className = 'btn';
    btnEditar.innerHTML = '<i class="fas fa-edit"></i> Habilitar Edición';
    btnEditar.style.marginTop = '15px';
    
    btnEditar.onclick = function() {
        // Campos a habilitar/deshabilitar
        const campos = ['nombre', 'telefono', 'email', 'obra-social', 'historial'];
        const estaEditando = btnEditar.innerHTML.includes('Habilitar');
        
        campos.forEach(campo => {
            const element = document.getElementById('paciente-' + campo);
            if (element) {
                element.readOnly = !estaEditando;
            }
        });
        
        // Cambiar texto del botón
        if (estaEditando) {
            btnEditar.innerHTML = '<i class="fas fa-lock"></i> Bloquear Edición';
            btnEditar.style.background = '#ff4757';
        } else {
            btnEditar.innerHTML = '<i class="fas fa-edit"></i> Habilitar Edición';
            btnEditar.style.background = '';
        }
    };
    
    // Agregar botón al formulario
    form.appendChild(btnEditar);
}
function configurarFormularioEdicion() {
    const form = document.getElementById('form-editar-paciente');
    
    if (!form) {
        console.error('❌ No se encontró el formulario de edición');
        return;
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;
        
        try {
            const datosActualizados = {
                nombre_completo: document.getElementById('paciente-nombre').value,
                telefono: document.getElementById('paciente-telefono').value,
                email: document.getElementById('paciente-email').value,
                obra_social: document.getElementById('paciente-obra-social').value,
                historial_medico: document.getElementById('paciente-historial').value,
                updated_at: new Date().toISOString()
            }; // ✅ Llave cerrada

            const dni = document.getElementById('paciente-dni').value;

            console.log('💾 Guardando cambios para DNI:', dni, datosActualizados);
            
            const { error } = await supabase
                .from('pacientes')
                .update(datosActualizados)
                .eq('dni', dni);

            if (error) {
                console.error('❌ Error actualizando paciente:', error);
                alert('Error al guardar cambios: ' + error.message);
            } else {
                console.log('✅ Paciente actualizado correctamente');
                alert('✅ Datos actualizados correctamente');
                
                // 👇 Volver a modo lectura después de guardar
                const campos = ['nombre', 'telefono', 'email', 'obra-social', 'historial'];
                campos.forEach(campo => {
                    const element = document.getElementById('paciente-' + campo);
                    if (element) {
                        element.readOnly = true;
                    }
                });
                
                // Resetear botón de edición
                const btnEditar = document.querySelector('#form-editar-paciente button[type="button"]');
                if (btnEditar) {
                    btnEditar.innerHTML = '<i class="fas fa-edit"></i> Habilitar Edición';
                    btnEditar.style.background = '';
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }); // ← Cierre del addEventListener
    // ===== FUNCIONES PARA MEDICAMENTOS =====
async function cargarMedicamentos(dniPaciente) {
    try {
        const { data: medicamentos, error } = await supabase
            .from('medicamentos')
            .select('*')
            .eq('dni_paciente', dniPaciente)
            .order('fecha_inicio', { ascending: false });

        if (error) {
            console.error('❌ Error cargando medicamentos:', error);
            return;
        }

        const tabla = document.getElementById('tabla-medicamentos');
        if (!tabla) return;

        if (medicamentos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5">No hay medicamentos registrados</td></tr>';
            return;
        }

        tabla.innerHTML = '';
        medicamentos.forEach(med => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${med.nombre}</td>
                <td>${med.dosis}</td>
                <td>${med.frecuencia}</td>
                <td>${med.fecha_inicio}</td>
                <td>${med.fecha_fin || 'Continúa'}</td>
            `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error('Error en cargarMedicamentos:', error);
    }
}

function configurarFormularioMedicamentos() {
    const form = document.getElementById('form-medicamento');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        btn.disabled = true;

        try {
            const dniPaciente = document.getElementById('paciente-dni').value;
            const medicamentoData = {
                dni_paciente: dniPaciente,
                nombre: document.getElementById('nombre-medicamento').value,
                dosis: document.getElementById('dosis-medicamento').value,
                frecuencia: document.getElementById('frecuencia-medicamento').value,
                fecha_inicio: document.getElementById('inicio-medicamento').value,
                fecha_fin: document.getElementById('fin-medicamento').value || null
            };

            const { error } = await supabase
                .from('medicamentos')
                .insert([medicamentoData]);

            if (error) {
                console.error('❌ Error guardando medicamento:', error);
                alert('Error al guardar medicamento: ' + error.message);
            } else {
                alert('✅ Medicamento guardado correctamente');
                form.reset();
                cargarMedicamentos(dniPaciente); // Recargar la tabla
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

// ===== INICIALIZAR TODO AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Script de paciente cargado');
    
    // Obtener DNI de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const dniPaciente = urlParams.get('dni');

    if (dniPaciente) {
        console.log('Buscando paciente con DNI:', dniPaciente);
        cargarDatosPaciente(dniPaciente);
        configurarFormularioEdicion();
        cargarMedicamentos(dniPaciente); // ← ¡NUEVA LÍNEA!
        configurarFormularioMedicamentos(); // ← ¡NUEVA LÍNEA!
    } else {
        console.error('❌ No se especificó DNI del paciente en la URL');
        alert('Error: No se especificó paciente. Volvé a la lista de pacientes.');
    }
});
    console.log('✅ Formulario de edición configurado');
} // ← Cierre de la función
