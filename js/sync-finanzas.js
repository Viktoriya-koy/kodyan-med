// js/sync-finanzas.js
// ===== SINCRONIZADOR INTELIGENTE KODYANMED =====

class SincronizadorFinanzas {
    constructor() {
        this.ultimaSincronizacion = null;
        this.eventos = new EventTarget();
        this.inicializar();
    }

    inicializar() {
        console.log('🔄 Inicializando sincronizador financiero...');
        this.registrarEventosGlobales();
        this.iniciarSincronizacionAutomatica();
    }

    // 1. REGISTRAR EVENTOS GLOBALES
    registrarEventosGlobales() {
        // Evento cuando se guarda una factura
        this.eventos.addEventListener('facturaGuardada', (e) => {
            this.actualizarDashboard();
            this.actualizarReportes();
        });

        // Evento cuando se registra un pago
        this.eventos.addEventListener('pagoRegistrado', (e) => {
            this.actualizarObrasSociales();
            this.actualizarDashboard();
        });

        // Evento cuando se agrega un gasto
        this.eventos.addEventListener('gastoAgregado', (e) => {
            this.actualizarReportes();
            this.actualizarDashboard();
        });

        // Evento cuando cambian aranceles
        this.eventos.addEventListener('arancelesActualizados', (e) => {
            this.actualizarFacturacion();
        });
    }

    // 2. SINCRONIZACIÓN AUTOMÁTICA CADA 5 MINUTOS
    iniciarSincronizacionAutomatica() {
        setInterval(() => {
            this.sincronizarDatos();
        }, 5 * 60 * 1000); // 5 minutos
    }

    // 3. SINCRONIZAR DATOS ENTRE MÓDULOS
    async sincronizarDatos() {
        try {
            console.log('🔄 Sincronizando datos financieros...');
            
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Verificar cambios en cada módulo
            await this.verificarCambiosFacturas();
            await this.verificarCambiosPagos();
            await this.verificarCambiosGastos();
            
            this.ultimaSincronizacion = new Date();
            
            console.log('✅ Sincronización completada:', this.ultimaSincronizacion);
            
        } catch (error) {
            console.error('❌ Error en sincronización:', error);
        }
    }

    // 4. VERIFICAR CAMBIOS EN FACTURAS
    async verificarCambiosFacturas() {
        const { data: facturasRecientes, error } = await supabase
            .from('facturas')
            .select('updated_at')
            .order('updated_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (facturasRecientes && facturasRecientes.length > 0) {
            const ultimaActualizacion = new Date(facturasRecientes[0].updated_at);
            
            if (!this.ultimaSincronizacion || ultimaActualizacion > this.ultimaSincronizacion) {
                this.eventos.dispatchEvent(new CustomEvent('facturasActualizadas'));
                console.log('📊 Facturas actualizadas - sincronizando...');
            }
        }
    }

    // 5. VERIFICAR CAMBIOS EN PAGOS
    async verificarCambiosPagos() {
        const { data: pagosRecientes, error } = await supabase
            .from('pagos')
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (pagosRecientes && pagosRecientes.length > 0) {
            const ultimoPago = new Date(pagosRecientes[0].created_at);
            
            if (!this.ultimaSincronizacion || ultimoPago > this.ultimaSincronizacion) {
                this.eventos.dispatchEvent(new CustomEvent('pagosActualizados'));
                console.log('💳 Pagos actualizados - sincronizando...');
            }
        }
    }

    // 6. VERIFICAR CAMBIOS EN GASTOS
    async verificarCambiosGastos() {
        const { data: gastosRecientes, error } = await supabase
            .from('gastos')
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;

        if (gastosRecientes && gastosRecientes.length > 0) {
            const ultimoGasto = new Date(gastosRecientes[0].created_at);
            
            if (!this.ultimaSincronizacion || ultimoGasto > this.ultimaSincronizacion) {
                this.eventos.dispatchEvent(new CustomEvent('gastosActualizados'));
                console.log('💰 Gastos actualizados - sincronizando...');
            }
        }
    }

    // 7. ACTUALIZAR DASHBOARD
    async actualizarDashboard() {
        const dashboard = document.getElementById('agenda-hoy');
        if (dashboard) {
            // Recargar datos del dashboard
            if (typeof cargarAgendaHoy === 'function') {
                await cargarAgendaHoy();
            }
            if (typeof cargarProximosTurnos === 'function') {
                await cargarProximosTurnos();
            }
        }
    }

    // 8. ACTUALIZAR REPORTES
    async actualizarReportes() {
        if (window.location.pathname.includes('reportes.html')) {
            if (typeof generarReporte === 'function') {
                await generarReporte();
            }
        }
    }

    // 9. ACTUALIZAR OBRAS SOCIALES
    async actualizarObrasSociales() {
        if (window.location.pathname.includes('obras-sociales.html')) {
            if (typeof cargarFacturasPendientes === 'function') {
                await cargarFacturasPendientes();
            }
            if (typeof cargarEstadisticasOS === 'function') {
                await cargarEstadisticasOS();
            }
        }
    }

    // 10. ACTUALIZAR FACTURACIÓN
    async actualizarFacturacion() {
        if (window.location.pathname.includes('nueva-factura.html')) {
            if (typeof cargarTratamientosModal === 'function') {
                await cargarTratamientosModal();
            }
        }
    }

    // 11. FORZAR SINCRONIZACIÓN MANUAL
    async forzarSincronizacion() {
        console.log('🔄 Forzando sincronización manual...');
        await this.sincronizarDatos();
        alert('✅ Sincronización manual completada');
    }

    // 12. OBTENER ESTADO DEL SISTEMA
    obtenerEstado() {
        return {
            ultimaSincronizacion: this.ultimaSincronizacion,
            moduloActivo: this.obtenerModuloActivo(),
            datosCargados: this.verificarDatosCargados()
        };
    }

    obtenerModuloActivo() {
        const path = window.location.pathname;
        if (path.includes('finanzas.html')) return 'dashboard';
        if (path.includes('obras-sociales.html')) return 'obras-sociales';
        if (path.includes('reportes.html')) return 'reportes';
        if (path.includes('aranceles.html')) return 'aranceles';
        if (path.includes('nueva-factura.html')) return 'facturacion';
        return 'otro';
    }

    verificarDatosCargados() {
        // Verificar qué datos están cargados en la página actual
        const elementos = {
            facturas: document.getElementById('lista-facturas-pendientes'),
            gastos: document.getElementById('lista-ultimos-gastos'),
            reportes: document.getElementById('reporte-detallado'),
            aranceles: document.getElementById('cuerpo-tabla-aranceles')
        };

        return Object.entries(elementos).reduce((acc, [key, element]) => {
            acc[key] = element && element.innerHTML !== 'Cargando...';
            return acc;
        }, {});
    }
}

// ===== INICIALIZACIÓN GLOBAL =====
let sincronizadorGlobal = null;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sincronizador solo en páginas de finanzas
    if (window.location.pathname.includes('finanzas') ||
        window.location.pathname.includes('obras-sociales') ||
        window.location.pathname.includes('reportes') ||
        window.location.pathname.includes('aranceles') ||
        window.location.pathname.includes('nueva-factura')) {
        
        sincronizadorGlobal = new SincronizadorFinanzas();
        
        // Agregar botón de sincronización manual si no existe
        setTimeout(() => {
            agregarBotonSincronizacion();
        }, 2000);
    }
});

// ===== BOTÓN DE SINCRONIZACIÓN MANUAL =====
function agregarBotonSincronizacion() {
    // Verificar si ya existe el botón
    if (document.getElementById('btn-sincronizar-manual')) return;

    // Crear botón flotante
    const boton = document.createElement('button');
    boton.id = 'btn-sincronizar-manual';
    boton.innerHTML = '🔄';
    boton.title = 'Sincronizar datos';
    boton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--violeta-acento);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;

    boton.addEventListener('click', async () => {
        if (sincronizadorGlobal) {
            boton.innerHTML = '⏳';
            boton.style.background = '#f39c12';
            await sincronizadorGlobal.forzarSincronizacion();
            boton.innerHTML = '🔄';
            boton.style.background = 'var(--violeta-acento)';
        }
    });

    boton.addEventListener('mouseenter', () => {
        boton.style.transform = 'scale(1.1)';
    });

    boton.addEventListener('mouseleave', () => {
        boton.style.transform = 'scale(1)';
    });

    document.body.appendChild(boton);
}

// ===== FUNCIONES GLOBALES PARA USO EN OTROS ARCHIVOS =====
window.sincronizarFinanzas = {
    notificarFacturaGuardada: function() {
        if (sincronizadorGlobal) {
            sincronizadorGlobal.eventos.dispatchEvent(new CustomEvent('facturaGuardada'));
        }
    },

    notificarPagoRegistrado: function() {
        if (sincronizadorGlobal) {
            sincronizadorGlobal.eventos.dispatchEvent(new CustomEvent('pagoRegistrado'));
        }
    },

    notificarGastoAgregado: function() {
        if (sincronizadorGlobal) {
            sincronizadorGlobal.eventos.dispatchEvent(new CustomEvent('gastoAgregado'));
        }
    },

    notificarArancelesActualizados: function() {
        if (sincronizadorGlobal) {
            sincronizadorGlobal.eventos.dispatchEvent(new CustomEvent('arancelesActualizados'));
        }
    },

    obtenerEstadoSistema: function() {
        if (sincronizadorGlobal) {
            return sincronizadorGlobal.obtenerEstado();
        }
        return { error: 'Sincronizador no inicializado' };
    }
};

console.log('✅ Sincronizador financiero cargado - KodyanMED');
