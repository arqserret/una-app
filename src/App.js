import React, { useState, useEffect } from 'react';
import Finanzas from './Finanzas';
import Clientes from './Clientes';
import Calendario from './Calendario';
import Ciclo from './Ciclo';
import Cotizar from './Cotizar';
import logo from './logo.png';

const P = {
  verde: '#2D6E5E',
  verdet: '#E8F2EF',
  malva: '#9B7BAE',
  malvat: '#F3EEF7',
  dorado: '#C4973A',
  doradot: '#FBF5E6',
  crema: '#F5F3EE',
  blanco: '#FFFFFF',
  gris: '#8A8A8A',
  grisOs: '#2D2D2D',
};

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [eventos, setEventos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const evs = localStorage.getItem('una_eventos');
    const cls = localStorage.getItem('una_clientes');
    if (evs) setEventos(JSON.parse(evs));
    if (cls) setClientes(JSON.parse(cls));
  }, [pantalla]);

  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0];

  const fechaEfectiva = (ev) => {
    if (!ev.repetirAnual) return ev.fecha;
    const [, mes, dia] = ev.fecha.split('-');
    const esteAnio = `${ahora.getFullYear()}-${mes}-${dia}`;
    return esteAnio >= hoy ? esteAnio : `${ahora.getFullYear() + 1}-${mes}-${dia}`;
  };

  const diasRestantes = (ev) => {
    const fe = new Date(fechaEfectiva(ev) + 'T12:00:00');
    const hoyDate = new Date(hoy + 'T12:00:00');
    return Math.round((fe - hoyDate) / (1000 * 60 * 60 * 24));
  };

  const CATEGORIAS = [
    { id: 'cumpleanos', label: '🎂', color: P.malva   },
    { id: 'pago',       label: '💡', color: P.dorado  },
    { id: 'tarjeta',    label: '💳', color: P.verde   },
    { id: 'escolar',    label: '🎒', color: P.malva   },
    { id: 'salud',      label: '🩺', color: P.verde   },
    { id: 'tramite',    label: '📋', color: P.gris    },
    { id: 'auto',       label: '🚗', color: P.verde   },
    { id: 'fiscal',     label: '🏛️', color: P.dorado },
    { id: 'bienestar',  label: '🌸', color: P.malva   },
    { id: 'belleza',    label: '💅', color: P.malva   },
  ];

  const getCat = (id) => CATEGORIAS.find(c => c.id === id);

  const proximosEventos = eventos
    .filter(ev => { const d = diasRestantes(ev); return d >= 0 && d <= 30; })
    .sort((a, b) => diasRestantes(a) - diasRestantes(b))
    .slice(0, 5);

  const citasHoy = clientes.filter(c => c.proximaCita === hoy);
  const citasProximas = clientes.filter(c => {
    if (!c.proximaCita) return false;
    const diff = Math.round((new Date(c.proximaCita + 'T12:00:00') - new Date(hoy + 'T12:00:00')) / (1000 * 60 * 60 * 24));
    return diff > 0 && diff <= 7;
  });

  const etiqueta = (dias) => {
    if (dias === 0) return { texto: '¡Hoy!',   color: P.malva  };
    if (dias === 1) return { texto: 'Mañana',   color: P.dorado };
    if (dias <= 7)  return { texto: `${dias}d`, color: P.dorado };
    return               { texto: `${dias}d`, color: P.verde  };
  };

  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const formatFechaCorta = (fechaStr) => {
    const [, mes, dia] = fechaStr.split('-');
    return `${dia} ${MESES[parseInt(mes) - 1]}`;
  };

  const MODULOS = [
    { id: 'finanzas',   emoji: '💰', label: 'Mis Finanzas',         desc: 'Hogar y negocio separados',   color: P.verde,  fondo: P.verdet  },
    { id: 'clientes',   emoji: '👩‍👧', label: 'Mis Clientes',         desc: 'Cartera y seguimiento',       color: P.malva,  fondo: P.malvat  },
    { id: 'calendario', emoji: '📅', label: 'Calendario Vital',      desc: 'Pagos, citas y fechas clave', color: P.dorado, fondo: P.doradot },
    { id: 'ciclo',      emoji: '🌙', label: 'Ciclo y Productividad', desc: 'Consejos según tu fase',      color: P.malva,  fondo: P.malvat  },
    { id: 'cotizar',    emoji: '💼', label: 'Cotizar',               desc: 'Cotizaciones por WhatsApp',   color: P.verde,  fondo: P.verdet  },
  ];

  const hayPendientes = proximosEventos.length > 0 || citasHoy.length > 0 || citasProximas.length > 0;

  return (
    <div style={es.pagina}>
      <div style={es.contenedor}>
        {pantalla === 'inicio' && (
          <>
            {/* Header con logo */}
            <div style={es.header}>
              <img src={logo} alt="UNA vida y empresa" style={es.logoImg} />
            </div>

            {/* Resumen pendientes */}
            {hayPendientes && (
              <div style={es.resumenBox}>
                <div style={es.resumenEncabezado}>
                  <span style={{ fontSize: '14px' }}>📌</span>
                  <p style={es.resumenTitulo}>Próximos 30 días</p>
                </div>

                {citasHoy.map(c => (
                  <div key={c.id} style={es.resumenItem} onClick={() => setPantalla('clientes')}>
                    <span style={es.resumenEmoji}>👩‍👧</span>
                    <span style={es.resumenTexto}>Cita con <strong>{c.nombre}</strong></span>
                    <span style={{ ...es.resumenBadge, backgroundColor: P.malvat, color: P.malva }}>¡Hoy!</span>
                  </div>
                ))}

                {citasProximas.map(c => {
                  const dias = Math.round((new Date(c.proximaCita + 'T12:00:00') - new Date(hoy + 'T12:00:00')) / (1000 * 60 * 60 * 24));
                  const et = etiqueta(dias);
                  return (
                    <div key={c.id} style={es.resumenItem} onClick={() => setPantalla('clientes')}>
                      <span style={es.resumenEmoji}>👩‍👧</span>
                      <span style={es.resumenTexto}>Cita con <strong>{c.nombre}</strong></span>
                      <span style={{ ...es.resumenBadge, backgroundColor: P.doradot, color: et.color }}>{et.texto}</span>
                    </div>
                  );
                })}

                {proximosEventos.map(ev => {
                  const dias = diasRestantes(ev);
                  const et = etiqueta(dias);
                  const cat = getCat(ev.categoria);
                  return (
                    <div key={ev.id} style={es.resumenItem} onClick={() => setPantalla('calendario')}>
                      <span style={es.resumenEmoji}>{cat ? cat.label : '📅'}</span>
                      <span style={es.resumenTexto}><strong>{ev.titulo}</strong> · {formatFechaCorta(fechaEfectiva(ev))}</span>
                      <span style={{ ...es.resumenBadge, backgroundColor: et.color + '22', color: et.color }}>{et.texto}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Módulos */}
            <p style={es.seccionLabel}>Módulos</p>
            <div style={es.modulosGrid}>
              {MODULOS.map(m => (
                <button key={m.id} style={{ ...es.moduloCard, borderTop: `3px solid ${m.color}` }} onClick={() => setPantalla(m.id)}>
                  <div style={{ ...es.moduloIcono, backgroundColor: m.fondo }}>
                    <span style={{ fontSize: '24px' }}>{m.emoji}</span>
                  </div>
                  <p style={{ ...es.moduloLabel, color: m.color }}>{m.label}</p>
                  <p style={es.moduloDesc}>{m.desc}</p>
                </button>
              ))}
            </div>

            <p style={es.footer}>🌿 UNA · vida y empresa</p>
          </>
        )}

        {pantalla === 'finanzas'   && <Finanzas   onVolver={() => setPantalla('inicio')} />}
        {pantalla === 'clientes'   && <Clientes   onVolver={() => setPantalla('inicio')} />}
        {pantalla === 'calendario' && <Calendario onVolver={() => setPantalla('inicio')} />}
        {pantalla === 'ciclo'      && <Ciclo      onVolver={() => setPantalla('inicio')} />}
        {pantalla === 'cotizar'    && <Cotizar    onVolver={() => setPantalla('inicio')} />}
      </div>
    </div>
  );
}

const es = {
  pagina: { backgroundColor: P.crema, minHeight: '100vh' },
  contenedor: { fontFamily: "'Arial', sans-serif", maxWidth: '480px', margin: '0 auto', backgroundColor: P.blanco, minHeight: '100vh', boxShadow: '0 0 40px rgba(0,0,0,0.08)' },
  header: { backgroundColor: P.crema, padding: '28px 24px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #EAE7E0' },
  logoImg: { width: '200px', objectFit: 'contain' },
  resumenBox: { margin: '16px 20px 0', backgroundColor: P.blanco, borderRadius: '16px', padding: '16px', boxShadow: '0 2px 16px rgba(45,110,94,0.08)', border: `1px solid ${P.verdet}` },
  resumenEncabezado: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '10px', borderBottom: `1px solid ${P.crema}` },
  resumenTitulo: { fontWeight: 'bold', color: P.grisOs, fontSize: '12px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' },
  resumenItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${P.crema}`, cursor: 'pointer' },
  resumenEmoji: { fontSize: '15px', flexShrink: 0 },
  resumenTexto: { flex: 1, fontSize: '13px', color: P.grisOs },
  resumenBadge: { fontSize: '11px', fontWeight: 'bold', borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap' },
  seccionLabel: { fontSize: '10px', fontWeight: 'bold', color: P.gris, letterSpacing: '2px', textTransform: 'uppercase', margin: '24px 20px 12px' },
  modulosGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 20px' },
  moduloCard: { backgroundColor: P.blanco, border: `1px solid #EAE7E0`, borderRadius: '14px', padding: '16px 12px', cursor: 'pointer', textAlign: 'left', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  moduloIcono: { width: '46px', height: '46px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
  moduloLabel: { fontWeight: 'bold', fontSize: '13px', margin: '0 0 3px 0' },
  moduloDesc: { fontSize: '11px', color: P.gris, margin: 0, lineHeight: 1.4 },
  footer: { textAlign: 'center', color: P.verde, fontSize: '12px', marginTop: '32px', paddingBottom: '20px', letterSpacing: '1px', opacity: 0.6 },
};

export default App;
