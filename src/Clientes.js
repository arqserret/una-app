import React, { useState, useEffect } from 'react';

const P = { verde: '#2D6E5E', verdet: '#E8F2EF', malva: '#9B7BAE', malvat: '#F3EEF7', dorado: '#C4973A', doradot: '#FBF5E6', crema: '#F5F3EE', gris: '#8A8A8A', grisOs: '#2D2D2D' };

function Clientes({ onVolver }) {
  const [clientes, setClientes] = useState(() => { const g = localStorage.getItem('una_clientes'); return g ? JSON.parse(g) : []; });
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [proximaCita, setProximaCita] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => { localStorage.setItem('una_clientes', JSON.stringify(clientes)); }, [clientes]);

  const guardar = () => {
    if (!nombre) return;
    if (editandoId) {
      setClientes(clientes.map(c => c.id === editandoId ? { ...c, nombre, telefono, notas, proximaCita } : c));
      setEditandoId(null);
    } else {
      setClientes([{ id: Date.now(), nombre, telefono, notas, proximaCita, fechaAlta: new Date().toLocaleDateString('es-MX') }, ...clientes]);
    }
    setNombre(''); setTelefono(''); setNotas(''); setProximaCita(''); setMostrarForm(false);
  };

  const cancelar = () => { setEditandoId(null); setNombre(''); setTelefono(''); setNotas(''); setProximaCita(''); setMostrarForm(false); };
  const eliminar = (id) => setClientes(clientes.filter(c => c.id !== id));
  const editar = (c) => { setEditandoId(c.id); setNombre(c.nombre); setTelefono(c.telefono); setNotas(c.notas); setProximaCita(c.proximaCita); setMostrarForm(true); };

  const hoy = new Date().toISOString().split('T')[0];
  const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  const coloresAvatar = [P.verde, P.malva, P.dorado, '#5B9BD5', '#7A8C5E'];

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>👩‍👧 Mis Clientes</h2>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <div style={e.barra}>
          <input style={e.buscador} placeholder="🔍 Buscar clienta..." value={busqueda} onChange={ev => setBusqueda(ev.target.value)} />
          <button style={e.botonNuevo} onClick={() => setMostrarForm(true)}>+ Nueva</button>
        </div>

        {mostrarForm && (
          <div style={e.formulario}>
            <p style={e.formTitulo}>{editandoId ? '✏️ Editar clienta' : '➕ Nueva clienta'}</p>
            <input style={e.input} placeholder="Nombre completo *" value={nombre} onChange={ev => setNombre(ev.target.value)} />
            <input style={e.input} placeholder="Teléfono WhatsApp" type="tel" value={telefono} onChange={ev => setTelefono(ev.target.value)} />
            <input style={e.input} placeholder="Notas (ej: prefiere entregas en tarde)" value={notas} onChange={ev => setNotas(ev.target.value)} />
            <label style={e.labelInput}>📅 Próxima cita o seguimiento</label>
            <input style={e.input} type="date" value={proximaCita} min={hoy} onChange={ev => setProximaCita(ev.target.value)} />
            <div style={e.filaBotones}>
              <button style={e.botonCancelar} onClick={cancelar}>Cancelar</button>
              <button style={e.botonGuardar} onClick={guardar}>{editandoId ? 'Guardar' : '+ Agregar'}</button>
            </div>
          </div>
        )}

        {clientes.length > 0 && !mostrarForm && (
          <p style={e.contador}>{clientes.length} clienta{clientes.length !== 1 ? 's' : ''} registrada{clientes.length !== 1 ? 's' : ''}</p>
        )}

        {filtrados.length === 0 && clientes.length === 0 && (
          <div style={e.vacio}>
            <p style={{ fontSize: '48px', margin: 0 }}>👩‍👧</p>
            <p style={{ color: P.grisOs, fontWeight: 'bold' }}>Aún no tienes clientas</p>
            <p style={{ color: P.gris, fontSize: '13px' }}>Toca "+ Nueva" para comenzar</p>
          </div>
        )}

        {filtrados.map((c, idx) => {
          const tieneCita = c.proximaCita !== '';
          const citaVencida = tieneCita && c.proximaCita < hoy;
          const citaHoy = tieneCita && c.proximaCita === hoy;
          const colorAvatar = coloresAvatar[idx % coloresAvatar.length];
          return (
            <div key={c.id} style={e.tarjeta}>
              <div style={e.tarjetaTop}>
                <div style={{ ...e.avatar, backgroundColor: colorAvatar }}>{c.nombre.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <p style={e.clienteNombre}>{c.nombre}</p>
                  {c.notas && <p style={e.clienteNotas}>{c.notas}</p>}
                </div>
              </div>
              {tieneCita && (
                <div style={{ ...e.citaBadge, backgroundColor: citaHoy ? P.doradot : citaVencida ? P.malvat : P.verdet, color: citaHoy ? P.dorado : citaVencida ? P.malva : P.verde }}>
                  📅 {citaHoy ? '¡Cita HOY! ' : citaVencida ? 'Vencida: ' : 'Próxima: '}
                  {new Date(c.proximaCita + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                </div>
              )}
              <div style={e.acciones}>
                {c.telefono && <>
                  <a href={`tel:${c.telefono}`} style={{ ...e.botonAccion, backgroundColor: P.verdet, color: P.verde }}>📞 Llamar</a>
                  <a href={`https://wa.me/52${c.telefono}`} target="_blank" rel="noreferrer" style={{ ...e.botonAccion, backgroundColor: '#E8F5E9', color: '#388E3C' }}>💬 WhatsApp</a>
                </>}
                <button style={{ ...e.botonAccion, backgroundColor: P.doradot, color: P.dorado, border: 'none', cursor: 'pointer' }} onClick={() => editar(c)}>✏️</button>
                <button style={{ ...e.botonAccion, backgroundColor: P.malvat, color: P.malva, border: 'none', cursor: 'pointer' }} onClick={() => eliminar(c.id)}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const e = {
  contenedor: { backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  topBar: { background: 'linear-gradient(135deg, #9B7BAE, #2D6E5E)', padding: '20px 20px 24px', display: 'flex', alignItems: 'center', gap: '12px' },
  volver: { background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  titulo: { color: 'white', fontSize: '20px', margin: 0, fontWeight: 'normal', letterSpacing: '1px' },
  barra: { display: 'flex', gap: '10px', marginBottom: '16px' },
  buscador: { flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #EAE7E0', fontSize: '14px', backgroundColor: '#FAF9F7' },
  botonNuevo: { backgroundColor: P.verde, color: 'white', border: 'none', padding: '11px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' },
  formulario: { background: 'white', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #EAE7E0', marginBottom: '16px' },
  formTitulo: { fontWeight: 'bold', color: '#2D2D2D', fontSize: '14px', margin: '0 0 14px 0' },
  labelInput: { fontSize: '12px', color: '#8A8A8A', display: 'block', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #EAE7E0', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', backgroundColor: '#FAF9F7', color: '#2D2D2D' },
  filaBotones: { display: 'flex', gap: '10px' },
  botonCancelar: { flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #EAE7E0', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#8A8A8A' },
  botonGuardar: { flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: P.verde, color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  contador: { fontSize: '12px', color: '#8A8A8A', marginBottom: '12px', letterSpacing: '0.5px' },
  vacio: { textAlign: 'center', padding: '48px 20px' },
  tarjeta: { background: 'white', borderRadius: '14px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0' },
  tarjetaTop: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' },
  avatar: { width: '44px', height: '44px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 },
  clienteNombre: { fontWeight: 'bold', fontSize: '15px', margin: 0, color: '#2D2D2D' },
  clienteNotas: { fontSize: '12px', color: '#8A8A8A', margin: '3px 0 0 0' },
  citaBadge: { borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' },
  acciones: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  botonAccion: { padding: '8px 12px', borderRadius: '8px', fontSize: '12px', textDecoration: 'none', fontWeight: 'bold' },
};

export default Clientes;
