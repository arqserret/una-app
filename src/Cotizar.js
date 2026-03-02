import React, { useState, useEffect } from 'react';

const P = { verde: '#2D6E5E', verdet: '#E8F2EF', malva: '#9B7BAE', malvat: '#F3EEF7', dorado: '#C4973A', doradot: '#FBF5E6', crema: '#F5F3EE', gris: '#8A8A8A', grisOs: '#2D2D2D' };

function Cotizar({ onVolver }) {
  const [cotizaciones, setCotizaciones] = useState(() => { const g = localStorage.getItem('una_cotizaciones'); return g ? JSON.parse(g) : []; });
  const [clientes, setClientes] = useState(() => { const g = localStorage.getItem('una_clientes'); return g ? JSON.parse(g) : []; });
  const [vista, setVista] = useState('nueva');
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [notaCotizacion, setNotaCotizacion] = useState('');
  const [partidas, setPartidas] = useState([{ descripcion: '', cantidad: 1, precioUnitario: '' }]);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarSelectorCliente, setMostrarSelectorCliente] = useState(false);

  useEffect(() => { localStorage.setItem('una_cotizaciones', JSON.stringify(cotizaciones)); }, [cotizaciones]);

  // Refrescar clientes cada vez que se abre la vista nueva
  useEffect(() => {
    if (vista === 'nueva') {
      const g = localStorage.getItem('una_clientes');
      if (g) setClientes(JSON.parse(g));
    }
  }, [vista]);

  const seleccionarCliente = (c) => {
    setNombreCliente(c.nombre);
    setTelefonoCliente(c.telefono || '');
    setMostrarSelectorCliente(false);
  };

  const agregarPartida = () => setPartidas([...partidas, { descripcion: '', cantidad: 1, precioUnitario: '' }]);
  const actualizarPartida = (i, campo, valor) => setPartidas(partidas.map((p, idx) => idx === i ? { ...p, [campo]: valor } : p));
  const eliminarPartida = (i) => { if (partidas.length > 1) setPartidas(partidas.filter((_, idx) => idx !== i)); };
  const calcularTotal = (lista) => lista.reduce((a, p) => a + (parseFloat(p.cantidad) || 0) * (parseFloat(p.precioUnitario) || 0), 0);
  const totalActual = calcularTotal(partidas);

  const guardar = () => {
    if (!nombreCliente || partidas.every(p => !p.descripcion)) return;
    const cot = { id: editandoId || Date.now(), nombreCliente, telefonoCliente, notaCotizacion, partidas: partidas.filter(p => p.descripcion), total: calcularTotal(partidas.filter(p => p.descripcion)), fecha: new Date().toLocaleDateString('es-MX') };
    if (editandoId) { setCotizaciones(cotizaciones.map(c => c.id === editandoId ? cot : c)); setEditandoId(null); }
    else setCotizaciones([cot, ...cotizaciones]);
    resetFormulario(); setVista('historial');
  };

  const resetFormulario = () => { setNombreCliente(''); setTelefonoCliente(''); setNotaCotizacion(''); setPartidas([{ descripcion: '', cantidad: 1, precioUnitario: '' }]); setEditandoId(null); setMostrarSelectorCliente(false); };
  const editar = (c) => { setEditandoId(c.id); setNombreCliente(c.nombreCliente); setTelefonoCliente(c.telefonoCliente); setNotaCotizacion(c.notaCotizacion || ''); setPartidas(c.partidas); setVista('nueva'); };
  const eliminar = (id) => setCotizaciones(cotizaciones.filter(c => c.id !== id));

  const abrirWhatsApp = (c) => {
    const lineas = c.partidas.map(p => `• ${p.descripcion} (${p.cantidad} x $${parseFloat(p.precioUnitario).toLocaleString('es-MX')}) = $${(parseFloat(p.cantidad) * parseFloat(p.precioUnitario)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
    const msg = [`Hola ${c.nombreCliente} 😊`, ``, `Te comparto mi cotización del ${c.fecha}:`, ``, ...lineas, ``, `*Total: $${c.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}*`, c.notaCotizacion ? `\n📝 ${c.notaCotizacion}` : ``, ``, `Quedamos en contacto 🌿`].join('\n');
    window.open(`https://wa.me/${c.telefonoCliente ? '52' + c.telefonoCliente : ''}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>💼 Cotizar</h2>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <div style={e.selectorVista}>
          <button style={vista === 'nueva' ? { ...e.vistaBton, backgroundColor: P.verde, color: 'white', border: 'none', fontWeight: 'bold' } : e.vistaBton} onClick={() => setVista('nueva')}>➕ {editandoId ? 'Editando' : 'Nueva'}</button>
          <button style={vista === 'historial' ? { ...e.vistaBton, backgroundColor: P.verde, color: 'white', border: 'none', fontWeight: 'bold' } : e.vistaBton} onClick={() => { setVista('historial'); if (!editandoId) resetFormulario(); }}>📋 Historial ({cotizaciones.length})</button>
        </div>

        {vista === 'nueva' && (
          <>
            <div style={e.seccion}>
              <p style={e.seccionTitulo}>👩‍👧 Cliente</p>

              {/* Selector de cliente guardado */}
              {clientes.length > 0 && (
                <button style={e.botonSeleccionarCliente} onClick={() => setMostrarSelectorCliente(!mostrarSelectorCliente)}>
                  👥 {mostrarSelectorCliente ? 'Cancelar' : 'Elegir de Mis Clientes'}
                </button>
              )}

              {/* Lista desplegable de clientes */}
              {mostrarSelectorCliente && (
                <div style={e.listaClientes}>
                  {clientes.map(c => (
                    <div key={c.id} style={e.clienteOpcion} onClick={() => seleccionarCliente(c)}>
                      <div style={{ ...e.avatarMini, backgroundColor: P.verde }}>{c.nombre.charAt(0).toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <p style={e.clienteOpcionNombre}>{c.nombre}</p>
                        {c.telefono && <p style={e.clienteOpcionTel}>{c.telefono}</p>}
                      </div>
                      <span style={e.clienteOpcionCheck}>✓ Seleccionar</span>
                    </div>
                  ))}
                </div>
              )}

              <input style={e.input} placeholder="Nombre del cliente *" value={nombreCliente} onChange={ev => setNombreCliente(ev.target.value)} />
              <input style={e.input} placeholder="Teléfono WhatsApp (ej: 5512345678)" type="tel" value={telefonoCliente} onChange={ev => setTelefonoCliente(ev.target.value)} />
            </div>

            <div style={e.seccion}>
              <p style={e.seccionTitulo}>📦 Productos o servicios</p>
              <div style={e.encabezadoGrid}>
                {['Descripción','Cant.','Precio','Subtotal'].map(h => <p key={h} style={e.encHeader}>{h}</p>)}
              </div>
              {partidas.map((p, i) => {
                const sub = (parseFloat(p.cantidad) || 0) * (parseFloat(p.precioUnitario) || 0);
                return (
                  <div key={i} style={e.partidaFila}>
                    <input style={e.inputPeq} placeholder="Descripción" value={p.descripcion} onChange={ev => actualizarPartida(i, 'descripcion', ev.target.value)} />
                    <input style={{ ...e.inputPeq, textAlign: 'center' }} type="number" min="1" value={p.cantidad} onChange={ev => actualizarPartida(i, 'cantidad', ev.target.value)} />
                    <input style={{ ...e.inputPeq, textAlign: 'center' }} type="number" placeholder="$0" value={p.precioUnitario} onChange={ev => actualizarPartida(i, 'precioUnitario', ev.target.value)} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <p style={{ fontSize: '13px', fontWeight: 'bold', color: P.verde, margin: 0 }}>${sub.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                      {partidas.length > 1 && <button style={{ background: 'none', border: 'none', color: P.gris, cursor: 'pointer', fontSize: '11px' }} onClick={() => eliminarPartida(i)}>✕</button>}
                    </div>
                  </div>
                );
              })}
              <button style={e.botonAgregarLinea} onClick={agregarPartida}>+ Agregar línea</button>
            </div>

            <div style={e.totalBox}>
              <p style={e.totalLabel}>Total estimado</p>
              <p style={e.totalMonto}>${totalActual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            </div>

            <div style={{ ...e.seccion, marginBottom: '12px' }}>
              <input style={{ ...e.input, marginBottom: 0 }} placeholder="📝 Nota (ej: Incluye envío · Válido 15 días)" value={notaCotizacion} onChange={ev => setNotaCotizacion(ev.target.value)} />
            </div>

            <div style={e.filaBotones}>
              <button style={e.botonCancelar} onClick={() => { resetFormulario(); setVista('historial'); }}>Cancelar</button>
              <button style={{ ...e.botonGuardar, opacity: nombreCliente ? 1 : 0.5 }} onClick={guardar}>{editandoId ? '💾 Guardar cambios' : '💾 Guardar cotización'}</button>
            </div>
          </>
        )}

        {vista === 'historial' && (
          <>
            {cotizaciones.length === 0 && (
              <div style={e.vacio}>
                <p style={{ fontSize: '48px', margin: 0 }}>💼</p>
                <p style={{ color: P.grisOs, fontWeight: 'bold' }}>Sin cotizaciones aún</p>
                <p style={{ color: P.gris, fontSize: '13px' }}>Toca "+ Nueva" para crear la primera</p>
              </div>
            )}
            {cotizaciones.map(c => (
              <div key={c.id} style={e.tarjeta}>
                <div style={e.tarjetaTop}>
                  <div style={e.tarjetaIcono}><span style={{ fontSize: '20px' }}>💼</span></div>
                  <div style={{ flex: 1 }}>
                    <p style={e.tarjetaNombre}>{c.nombreCliente}</p>
                    <p style={e.tarjetaFecha}>{c.fecha} · {c.partidas.length} concepto{c.partidas.length !== 1 ? 's' : ''}</p>
                  </div>
                  <p style={e.tarjetaTotal}>${c.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                </div>
                <div style={e.partidasDetalle}>
                  {c.partidas.map((p, i) => (
                    <div key={i} style={e.detalleItem}>
                      <span style={e.detalleDesc}>{p.descripcion}</span>
                      <span style={e.detalleInfo}>{p.cantidad} × ${parseFloat(p.precioUnitario).toLocaleString('es-MX')}</span>
                      <span style={{ ...e.detalleDesc, color: P.verde, textAlign: 'right' }}>${(parseFloat(p.cantidad) * parseFloat(p.precioUnitario)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
                {c.notaCotizacion && <p style={e.tarjetaNota}>📝 {c.notaCotizacion}</p>}
                <div style={e.acciones}>
                  <button style={e.botonWhats} onClick={() => abrirWhatsApp(c)}>💬 Enviar por WhatsApp</button>
                  <button style={{ ...e.botonAcc, backgroundColor: P.doradot, color: P.dorado }} onClick={() => editar(c)}>✏️</button>
                  <button style={{ ...e.botonAcc, backgroundColor: P.malvat, color: P.malva }} onClick={() => eliminar(c.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const e = {
  contenedor: { backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  topBar: { background: 'linear-gradient(135deg, #2D6E5E, #9B7BAE)', padding: '20px 20px 24px', display: 'flex', alignItems: 'center', gap: '12px' },
  volver: { background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  titulo: { color: 'white', fontSize: '20px', margin: 0, fontWeight: 'normal', letterSpacing: '1px' },
  selectorVista: { display: 'flex', gap: '8px', marginBottom: '16px' },
  vistaBton: { flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #EAE7E0', background: '#FAF9F7', cursor: 'pointer', fontSize: '13px', textAlign: 'center', color: P.gris },
  seccion: { background: 'white', borderRadius: '14px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0' },
  seccionTitulo: { fontWeight: 'bold', color: P.grisOs, fontSize: '13px', margin: '0 0 12px 0' },
  botonSeleccionarCliente: { width: '100%', padding: '10px', borderRadius: '10px', border: `1.5px solid ${P.verde}`, background: P.verdet, color: P.verde, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' },
  listaClientes: { background: '#FAF9F7', borderRadius: '10px', border: '1.5px solid #EAE7E0', marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' },
  clienteOpcion: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderBottom: '1px solid #EAE7E0', cursor: 'pointer' },
  avatarMini: { width: '32px', height: '32px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 },
  clienteOpcionNombre: { fontWeight: 'bold', fontSize: '13px', margin: 0, color: P.grisOs },
  clienteOpcionTel: { fontSize: '11px', color: P.gris, margin: '2px 0 0 0' },
  clienteOpcionCheck: { fontSize: '11px', color: P.verde, fontWeight: 'bold', whiteSpace: 'nowrap' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #EAE7E0', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', backgroundColor: '#FAF9F7', color: P.grisOs },
  encabezadoGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr', gap: '4px', marginBottom: '6px' },
  encHeader: { fontSize: '10px', color: '#B0A898', fontWeight: 'bold', margin: 0, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' },
  partidaFila: { display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr', gap: '4px', marginBottom: '6px', alignItems: 'center' },
  inputPeq: { padding: '9px 6px', borderRadius: '8px', border: '1.5px solid #EAE7E0', fontSize: '12px', width: '100%', boxSizing: 'border-box', backgroundColor: '#FAF9F7' },
  botonAgregarLinea: { width: '100%', marginTop: '8px', padding: '10px', borderRadius: '10px', border: `1.5px dashed ${P.verde}`, background: 'white', color: P.verde, cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  totalBox: { background: `linear-gradient(135deg, ${P.verdet}, ${P.doradot})`, borderRadius: '14px', padding: '16px 20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #EAE7E0' },
  totalLabel: { fontWeight: 'bold', fontSize: '14px', color: P.grisOs, margin: 0 },
  totalMonto: { fontWeight: 'bold', fontSize: '26px', color: P.verde, margin: 0 },
  filaBotones: { display: 'flex', gap: '10px', marginBottom: '20px' },
  botonCancelar: { flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #EAE7E0', background: 'white', cursor: 'pointer', fontSize: '14px', color: P.gris },
  botonGuardar: { flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: P.verde, color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  vacio: { textAlign: 'center', padding: '48px 20px' },
  tarjeta: { background: 'white', borderRadius: '14px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0' },
  tarjetaTop: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' },
  tarjetaIcono: { width: '40px', height: '40px', borderRadius: '10px', backgroundColor: P.verdet, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tarjetaNombre: { fontWeight: 'bold', fontSize: '15px', margin: 0, color: P.grisOs },
  tarjetaFecha: { fontSize: '12px', color: P.gris, margin: '2px 0 0 0' },
  tarjetaTotal: { fontWeight: 'bold', fontSize: '20px', color: P.verde, margin: 0 },
  partidasDetalle: { borderTop: '1px solid #F5F3EE', borderBottom: '1px solid #F5F3EE', padding: '8px 0', marginBottom: '10px' },
  detalleItem: { display: 'flex', justifyContent: 'space-between', padding: '4px 0' },
  detalleDesc: { flex: 2, fontSize: '12px', color: P.grisOs },
  detalleInfo: { flex: 1, fontSize: '11px', color: P.gris, textAlign: 'center' },
  tarjetaNota: { fontSize: '12px', color: P.gris, marginBottom: '10px' },
  acciones: { display: 'flex', gap: '8px' },
  botonWhats: { flex: 1, padding: '10px', borderRadius: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  botonAcc: { padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px' },
};

export default Cotizar;

