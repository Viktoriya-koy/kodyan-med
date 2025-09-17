// js/email.js
async function enviarEmailConfirmacionTurno(datos) {
    try {
        const templateParams = {
            to_email: datos.email,
            to_name: datos.nombre,
            fecha: datos.fecha,
            hora: datos.hora,
            profesional: "Dra. Violeta",
            consultorio: "KodyanMED",
            telefono: "+54 266 440-7823"
        };

        const response = await emailjs.send(
            'service_7w8rk4g', // ← Tu Service ID
            'template_turno_confirmacion', // ← Lo creás después
            templateParams
        );
        
        console.log('✅ Email de confirmación enviado:', response);
        return { success: true, message: 'Email enviado correctamente' };
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return { success: false, message: error.text };
    }
}

// Función para recordatorio 24hs antes
async function enviarEmailRecordatorio(datos) {
    try {
        const templateParams = {
            to_email: datos.email,
            to_name: datos.nombre,
            fecha: datos.fecha,
            hora: datos.hora,
            profesional: "Dra. Violeta"
        };

        const response = await emailjs.send(
            'service_7w8rk4g',
            'template_recordatorio', // ← Template de recordatorio
            templateParams
        );
        
        console.log('✅ Email de recordatorio enviado:', response);
    } catch (error) {
        console.error('❌ Error enviando recordatorio:', error);
    }
}
