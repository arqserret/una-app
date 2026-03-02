import React, { useState, useEffect } from 'react';

const P = { verde: '#2D6E5E', verdet: '#E8F2EF', malva: '#9B7BAE', malvat: '#F3EEF7', dorado: '#C4973A', doradot: '#FBF5E6', crema: '#F5F3EE', gris: '#8A8A8A', grisOs: '#2D2D2D' };

const CATEGORIAS = [
  { id: 'cumpleanos', label: '🎂 Cumpleaños',   color: P.malva  },
  { id: 'pago',       label: '💡 Servicios',     color: P.dorado },
  { id: 'tarjeta',    label: '💳 Tarjetas',      color: P.verde  },
  { id: 'escolar',    label: '🎒 Escolar',       color: '#7A8C5E'},
  { id: 'salud',      label: '🩺 Salud',         color: P.verde  },
  { id: 'tramite',    label: '📋 Trámites',      color: P.gris   },
  { id: 'auto',       label: '🚗 Auto',          color: '#7A8C5E'},
  { id: 'fiscal',     label: '🏛️ Fiscal/SAT',   color: P.dorado },
  { id: 'bienestar',  label: '🌸 Bienestar',     color: P.malva  },
  { id: 'belleza',    label: '💅 Belleza',       color: P.malva  },
];

const SUGERIDOS = [
  { titulo: 'Papanicolau',              categoria: 'salud',     nota: 'Revisión anual recomendada',         repetirAnual: true  },
  { titulo: 'Mastografía',             categoria: 'salud',     nota: 'A partir de los 40, cada año',       repetirAnual: true  },
  { titulo: 'Dentista',                categoria: 'salud',     nota: 'Revisión cada 6 meses',              repetirAnual: false },
  { titulo: 'Vacuna de los niños',     categoria: 'salud',     nota: 'Revisa cartilla de vacunación',      repetirAnual: false },
  { titulo: 'Pago de luz',             categoria: 'pago',      nota: 'Bimestral CFE',                      repetirAnual: false },
  { titulo: 'Pago de agua',            categoria: 'pago',      nota: 'Bimestral',                          repetirAnual: false },
  { titulo: 'Pago de celular',         categoria: 'pago',      nota: '',                                   repetirAnual: false },
  { titulo: 'Pago de tarjeta',         categoria: 'tarjeta',   nota: 'Revisa fecha límite de pago',        repetirAnual: false },
  { titulo: 'Inscripción escolar',     categoria: 'escolar',   nota: 'Preinscripciones SEP',               repetirAnual: true  },
  { titulo: 'Compra de útiles',        categoria: 'escolar',   nota: 'Inicio de ciclo escolar',            repetirAnual: true  },
  { titulo: 'Declaración mensual SAT', categoria: 'fiscal',    nota: 'Vence el día 17 de cada mes',        repetirAnual: false },
  { titulo: 'Declaración anual SAT',   categoria: 'fiscal',    nota: 'Abril de cada año',                  repetirAnual: true  },
  { titulo: 'Verificación vehicular',  categoria: 'auto',      nota: 'Revisa el color de tu engomado',     repetirAnual: true  },
  { titulo: 'Servicio del auto',       categoria: 'auto',      nota: 'Cada 5,000 km o 6 meses',            repetirAnual: false },
  { titulo: 'Renovación de licencia',  categoria: 'tramite',   nota: 'Revisa fecha de vencimiento',        repetirAnual: false },
  { titulo: 'Renovación de pasaporte', categoria: 'tramite',   nota: 'Vigencia 10 años',                   repetirAnual: false },
  { titulo: 'Cita conmigo ☕',         categoria: 'bienestar', nota: 'Una hora a la semana solo para ti',  repetirAnual: false },
  { titulo: 'Cita con mis amigas',     categoria: 'bienestar', nota: 'Una vez al mes mínimo',              repetirAnual: false },
  { titulo: 'Corte y tinte',           categoria: 'belleza',   nota: '',                                   repetirAnual: false },
  { titulo: 'Uñas',                    categoria: 'belleza',   nota: '',                                   repetirAnual: false },
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function Calendario({ onVolver }) {
  const [eventos, setEventos] = useState(() => { const g = localStorage.getItem('una_eventos'); return g ? JSON.parse(g) : []; });
  const [vista, setVista] = useState('agregar');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('cumpleanos');
  const [nota, setNota] = useState('');
  const [repetirAnual, setRepetirAnual] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const ahora = new Date();
  const [mesVista, setMesVista] = useState(ahora.getMonth());
  const [anioVista, setAnioVista] = useState(ahora.getFullYear());

  useEffect(() => { localStorage.setItem('una_eventos', JSON.stringify(eventos)); }, [eventos]);

  const hoy = ahora.toISOString().split('T')[0];

  const fechaEfectiva = (ev, anio) => {
    const a = anio || ahora.getFullYear();
    if (!ev.repetirAnual) return ev.fecha;
    const [, mes, dia] = ev.fecha.split('-');
    return `${a}-${mes}-${dia}`;
  };

  const diasRestantes = (ev) => {
    const fe = new Date(fechaEfectiva(ev) + 'T12:00:00');
    const hoyDate = new Date(hoy + 'T12:00:00');
    const diff = Math.round((fe - hoyDate) / (1000 * 60 * 60 * 24));
    if (ev.repetirAnual && diff < -30) {
      const feNext = new Date(fechaEfectiva(ev, ahora.getFullYear() + 1) + 'T12:00:00');
      return Math.round((feNext - hoyDate) / (1000 * 60 * 60 * 24));
    }
    return diff;
  };

  const etiquetaDias = (dias) => {
    if (dias === 0)  return { texto: '¡Hoy!',         color: P.malva  };
    if (dias === 1)  return { texto: 'Mañana',         color: P.dorado };
    if (dias < 0)   return { texto: 'Vencido',         color: P.gris   };
    if (dias <= 7)  return { texto: `En ${dias} días`, color: P.dorado };
    if (dias <= 30) return { texto: `En ${dias} días`, color: P.verde  };
    return               { texto: `En ${dias} días`, color: P.gris   };
  };

  const getCat = (id) => CATEGORIAS.find(c => c.id === id);

  const formatFecha = (fechaStr) => {
    const [anio, mes, dia] = fechaStr.split('-');
    return `${dia} de ${MESES[parseInt(mes) - 1]}${anio !== String(ahora.getFullYear()) ? ` ${anio}` : ''}`;
  };

  const guardar = () => {
    if (!titulo || !fecha) return;
    if (editandoId) {
      setEventos(eventos.map(ev => ev.id === editandoId ? { ...ev, titulo, fecha, categoria, nota, repetirAnual } : ev));
      setEditandoId(null);
    } else {
      setEventos([...eventos, { id: Date.now(), titulo, fecha, categoria, nota, repetirAnual, creadoEl: hoy }]);
    }
    resetFormulario();
  };

  const resetFormulario = () => { setTitulo(''); setFecha(''); setNota(''); setCategoria('cumpleanos'); setRepetirAnual(false); setMostrarFormulario(false); setEditandoId(null); };
  const eliminar = (id) => setEventos(eventos.filter(ev => ev.id !== id));
  const editar = (ev) => { setEditandoId(ev.id); setTitulo(ev.titulo); setFecha(ev.fecha); setCategoria(ev.categoria); setNota(ev.nota); setRepetirAnual(ev.repetirAnual); setMostrarFormulario(true); };
  const usarSugerido = (s) => { setTitulo(s.titulo); setCategoria(s.categoria); setNota(s.nota); setRepetirAnual(s.repetirAnual); setFecha(''); setMostrarFormulario(true); setVista('agregar'); };

  const eventosDelDia = (dia, mes, anio) => {
    const diaStr = String(dia).padStart(2,'0'), mesStr = String(mes+1).padStart(2,'0');
    return eventos.filter(ev => fechaEfectiva(ev, anio) === `${anio}-${mesStr}-${diaStr}`);
  };

  const eventosDelMes = (mes, anio) => eventos.filter(ev => { const [a,m] = fechaEfectiva(ev, anio).split('-'); return parseInt(m)-1===mes && parseInt(a)===anio; });

  const construirMes = (mes, anio) => {
    const primer = new Date(anio, mes, 1).getDay();
    const dias = new Date(anio, mes+1, 0).getDate();
    const celdas = [];
    for (let i = 0; i < primer; i++) celdas.push(null);
    for (let d = 1; d <= dias; d++) celdas.push(d);
    return celdas;
  };

  const celdas = construirMes(mesVista, anioVista);
  const mesAnterior = () => { if (mesVista===0){setMesVista(11);setAnioVista(anioVista-1);}else setMesVista(mesVista-1); setDiaSeleccionado(null); };
  const mesSiguiente = () => { if (mesVista===11){setMesVista(0);setAnioVista(anioVista+1);}else setMesVista(mesVista+1); setDiaSeleccionado(null); };

  const proximos = eventos.filter(ev => { const d = diasRestantes(ev); return d >= 0 && d <= 7; }).sort((a,b) => diasRestantes(a)-diasRestantes(b));
  const eventosFiltrados = eventos.filter(ev => filtro==='todos' || ev.categoria===filtro).sort((a,b) => diasRestantes(a)-diasRestantes(b));
  const categoriasSugeridas = CATEGORIAS.filter(cat => SUGERIDOS.some(s => s.categoria===cat.id));
  const hoyDia = ahora.getDate(), hoyMes = ahora.getMonth(), hoyAnio = ahora.getFullYear();
  const eventosDiaSeleccionado = diaSeleccionado ? eventosDelDia(diaSeleccionado, mesVista, anioVista) : [];

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>📅 Calendario Vital</h2>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        {proximos.length > 0 && (
          <div style={e.alertaBox}>
            <p style={e.alertaTitulo}>⏰ Esta semana no olvides</p>
            {proximos.map(ev => {
              const dias = diasRestantes(ev);
              const cat = getCat(ev.categoria);
              return <p key={ev.id} style={e.alertaItem}>{cat.label.split(' ')[0]} <strong>{ev.titulo}</strong> — {dias===0?'¡Hoy!':dias===1?'mañana':`en ${dias} días`}</p>;
            })}
          </div>
        )}

        <div style={e.selectorVista}>
          {[['agregar','➕ Agregar'],['lista','📋 Lista'],['mes','📆 Mes']].map(([v,label]) => (
            <button key={v} style={vista===v ? { ...e.vistaBton, backgroundColor: P.verde, color: 'white', border: 'none', fontWeight: 'bold' } : e.vistaBton} onClick={() => setVista(v)}>{label}</button>
          ))}
        </div>

        {vista === 'mes' && (
          <div style={e.mesBox}>
            <div style={e.mesNav}>
              <button style={e.mesNavBtn} onClick={mesAnterior}>‹</button>
              <p style={e.mesNombre}>{MESES[mesVista]} {anioVista}</p>
              <button style={e.mesNavBtn} onClick={mesSiguiente}>›</button>
            </div>
            <div style={e.semanaGrid}>{DIAS_SEMANA.map(d => <p key={d} style={e.diaSemana}>{d}</p>)}</div>
            <div style={e.diasGrid}>
              {celdas.map((dia, i) => {
                if (!dia) return <div key={`v-${i}`} />;
                const evsDia = eventosDelDia(dia, mesVista, anioVista);
                const esHoy = dia===hoyDia && mesVista===hoyMes && anioVista===hoyAnio;
                const esSel = dia===diaSeleccionado;
                return (
                  <div key={dia} style={{ ...e.diaCell, backgroundColor: esSel ? P.verde : esHoy ? P.verdet : 'white', border: esHoy ? `2px solid ${P.verde}` : '1px solid #F0EBE3' }} onClick={() => setDiaSeleccionado(dia===diaSeleccionado ? null : dia)}>
                    <p style={{ ...e.diaNum, color: esSel ? 'white' : esHoy ? P.verde : P.grisOs }}>{dia}</p>
                    <div style={e.puntosBox}>{evsDia.slice(0,3).map((ev,idx) => <span key={idx} style={{ ...e.punto, backgroundColor: getCat(ev.categoria).color }} />)}</div>
                  </div>
                );
              })}
            </div>
            {diaSeleccionado && (
              <div style={e.diaDetalleBox}>
                <p style={e.diaDetalleTitulo}>{diaSeleccionado} de {MESES[mesVista]}</p>
                {eventosDiaSeleccionado.length === 0 ? <p style={e.sinEventos}>Sin eventos este día</p> :
                  eventosDiaSeleccionado.map(ev => {
                    const cat = getCat(ev.categoria);
                    return (
                      <div key={ev.id} style={{ ...e.eventoDetalle, borderLeft: `3px solid ${cat.color}` }}>
                        <div style={{ flex: 1 }}>
                          <p style={e.eventoDetalleTit}>{cat.label.split(' ')[0]} {ev.titulo}</p>
                          {ev.nota && <p style={e.eventoDetalleNota}>{ev.nota}</p>}
                        </div>
                        <button style={{ ...e.botonAcc, backgroundColor: P.doradot, color: P.dorado }} onClick={() => { editar(ev); setVista('agregar'); }}>✏️</button>
                        <button style={{ ...e.botonAcc, backgroundColor: P.malvat, color: P.malva }} onClick={() => eliminar(ev.id)}>🗑️</button>
                      </div>
                    );
                  })
                }
              </div>
            )}
            <div style={e.resumenMes}>
              <p style={e.resumenTitulo}>Este mes: {eventosDelMes(mesVista, anioVista).length} eventos</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CATEGORIAS.map(cat => { const count = eventosDelMes(mesVista, anioVista).filter(ev => ev.categoria===cat.id).length; if (!count) return null; return <span key={cat.id} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', backgroundColor: cat.color+'22', color: cat.color }}>{cat.label.split(' ')[0]} {count}</span>; })}
              </div>
            </div>
          </div>
        )}

        {vista === 'lista' && (
          <>
            <div style={e.filtros}>
              <button style={filtro==='todos' ? { ...e.filtro, backgroundColor: P.verde, color: 'white', border: 'none' } : e.filtro} onClick={() => setFiltro('todos')}>Todos</button>
              {CATEGORIAS.map(cat => (
                <button key={cat.id} style={filtro===cat.id ? { ...e.filtro, backgroundColor: cat.color, color: 'white', border: 'none' } : e.filtro} onClick={() => setFiltro(cat.id)}>{cat.label.split(' ')[0]}</button>
              ))}
            </div>
            {eventosFiltrados.length === 0 && <div style={e.vacio}><p style={{ fontSize: '40px', margin: 0 }}>📅</p><p>No hay eventos aquí todavía</p></div>}
            {eventosFiltrados.map(ev => {
              const dias = diasRestantes(ev);
              const cat = getCat(ev.categoria);
              const etiqueta = etiquetaDias(dias);
              return (
                <div key={ev.id} style={{ ...e.tarjeta, borderLeft: `4px solid ${cat.color}` }}>
                  <div style={e.tarjetaTop}>
                    <span style={{ fontSize: '22px' }}>{cat.label.split(' ')[0]}</span>
                    <div style={{ flex: 1 }}>
                      <p style={e.eventoTitulo}>{ev.titulo}</p>
                      <p style={e.eventoFecha}>{formatFecha(fechaEfectiva(ev))}{ev.repetirAnual && <span style={{ fontSize: '11px', color: P.malva }}> 🔁 anual</span>}</p>
                      {ev.nota && <p style={e.eventoNota}>💬 {ev.nota}</p>}
                    </div>
                    <span style={{ ...e.badge, color: etiqueta.color, borderColor: etiqueta.color }}>{etiqueta.texto}</span>
                  </div>
                  <div style={e.acciones}>
                    <button style={{ ...e.botonAcc, backgroundColor: P.doradot, color: P.dorado }} onClick={() => { editar(ev); setVista('agregar'); }}>✏️ Editar</button>
                    <button style={{ ...e.botonAcc, backgroundColor: P.malvat, color: P.malva }} onClick={() => eliminar(ev.id)}>🗑️ Borrar</button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {vista === 'agregar' && (
          <>
            {!mostrarFormulario && (
              <>
                <button style={e.botonNuevo} onClick={() => setMostrarFormulario(true)}>+ Agregar personalizado</button>
                <div style={e.sugeridosBox}>
                  <p style={e.sugeridosTitulo}>✨ Agrega rápido — toca cualquiera</p>
                  {categoriasSugeridas.map(cat => (
                    <div key={cat.id} style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', color: cat.color }}>{cat.label}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {SUGERIDOS.filter(s => s.categoria===cat.id).map((s, i) => (
                          <button key={i} style={{ padding: '7px 14px', borderRadius: '20px', border: `1.5px solid ${cat.color}55`, background: 'white', cursor: 'pointer', fontSize: '12px', color: cat.color, whiteSpace: 'nowrap' }} onClick={() => usarSugerido(s)}>{s.titulo}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {mostrarFormulario && (
              <div style={e.formulario}>
                <p style={e.formTitulo}>{editandoId ? '✏️ Editar evento' : '➕ Nuevo evento'}</p>
                <input style={e.input} placeholder="¿Qué es? (ej: Cumpleaños de mamá)" value={titulo} onChange={ev => setTitulo(ev.target.value)} />
                <label style={e.labelInput}>Categoría</label>
                <div style={e.categoriasGrid}>
                  {CATEGORIAS.map(cat => (
                    <button key={cat.id} style={{ padding: '10px', borderRadius: '8px', border: `2px solid ${categoria===cat.id ? cat.color : '#EAE7E0'}`, backgroundColor: categoria===cat.id ? cat.color+'22' : 'white', color: categoria===cat.id ? cat.color : P.gris, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }} onClick={() => setCategoria(cat.id)}>{cat.label}</button>
                  ))}
                </div>
                <label style={e.labelInput}>Fecha</label>
                <input style={e.input} type="date" value={fecha} onChange={ev => setFecha(ev.target.value)} />
                <input style={e.input} placeholder="Nota opcional" value={nota} onChange={ev => setNota(ev.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <input type="checkbox" id="repetir" checked={repetirAnual} onChange={ev => setRepetirAnual(ev.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: P.verde }} />
                  <label htmlFor="repetir" style={{ fontSize: '14px', color: P.gris, cursor: 'pointer' }}>🔁 Repetir cada año</label>
                </div>
                <div style={e.filaBotones}>
                  <button style={e.botonCancelar} onClick={resetFormulario}>Cancelar</button>
                  <button style={e.botonGuardar} onClick={guardar}>{editandoId ? 'Guardar cambios' : '+ Agregar'}</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const e = {
  contenedor: { backgroundColor: '#FFFFFF', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  topBar: { background: 'linear-gradient(135deg, #C4973A, #2D6E5E)', padding: '20px 20px 24px', display: 'flex', alignItems: 'center', gap: '12px' },
  volver: { background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  titulo: { color: 'white', fontSize: '20px', margin: 0, fontWeight: 'normal', letterSpacing: '1px' },
  alertaBox: { background: P.doradot, borderRadius: '12px', padding: '14px', marginBottom: '12px', borderLeft: `4px solid ${P.dorado}` },
  alertaTitulo: { fontWeight: 'bold', color: P.dorado, margin: '0 0 8px 0', fontSize: '13px' },
  alertaItem: { margin: '4px 0', fontSize: '13px', color: P.grisOs },
  selectorVista: { display: 'flex', gap: '8px', marginBottom: '16px' },
  vistaBton: { flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #EAE7E0', background: '#FAF9F7', cursor: 'pointer', fontSize: '13px', textAlign: 'center', color: P.gris },
  mesBox: { background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0', marginBottom: '16px' },
  mesNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  mesNavBtn: { background: 'none', border: `1.5px solid #EAE7E0`, borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '18px', color: P.verde },
  mesNombre: { fontWeight: 'bold', fontSize: '16px', color: P.grisOs, margin: 0 },
  semanaGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' },
  diaSemana: { textAlign: 'center', fontSize: '11px', color: P.gris, fontWeight: 'bold', margin: '0 0 4px 0' },
  diasGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' },
  diaCell: { borderRadius: '8px', padding: '4px 2px', minHeight: '44px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  diaNum: { fontSize: '13px', fontWeight: 'bold', margin: '2px 0' },
  puntosBox: { display: 'flex', gap: '2px', justifyContent: 'center' },
  punto: { width: '5px', height: '5px', borderRadius: '50%' },
  diaDetalleBox: { marginTop: '12px', borderTop: `1px solid ${P.crema}`, paddingTop: '12px' },
  diaDetalleTitulo: { fontWeight: 'bold', color: P.grisOs, fontSize: '14px', marginBottom: '8px' },
  sinEventos: { color: P.gris, fontSize: '13px', textAlign: 'center', padding: '10px 0' },
  eventoDetalle: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', marginBottom: '6px', backgroundColor: '#FAF9F7' },
  eventoDetalleTit: { fontSize: '13px', fontWeight: 'bold', color: P.grisOs, margin: 0 },
  eventoDetalleNota: { fontSize: '12px', color: P.gris, margin: '2px 0 0 0' },
  resumenMes: { marginTop: '12px', borderTop: `1px solid ${P.crema}`, paddingTop: '10px' },
  resumenTitulo: { fontSize: '12px', color: P.gris, marginBottom: '8px' },
  filtros: { display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' },
  filtro: { padding: '7px 12px', borderRadius: '20px', border: '1.5px solid #EAE7E0', background: 'white', cursor: 'pointer', fontSize: '12px', color: P.gris },
  botonNuevo: { width: '100%', backgroundColor: P.verde, color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', marginBottom: '12px' },
  sugeridosBox: { background: 'white', borderRadius: '14px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0' },
  sugeridosTitulo: { fontWeight: 'bold', color: P.gris, fontSize: '12px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '1px' },
  formulario: { background: 'white', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #EAE7E0', marginBottom: '20px' },
  formTitulo: { fontWeight: 'bold', color: P.grisOs, fontSize: '14px', margin: '0 0 14px 0' },
  labelInput: { fontSize: '12px', color: P.gris, display: 'block', marginBottom: '6px', marginTop: '4px' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #EAE7E0', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', backgroundColor: '#FAF9F7', color: P.grisOs },
  categoriasGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' },
  filaBotones: { display: 'flex', gap: '10px' },
  botonCancelar: { flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #EAE7E0', background: 'white', cursor: 'pointer', fontSize: '14px', color: P.gris },
  botonGuardar: { flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: P.verde, color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  vacio: { textAlign: 'center', padding: '40px 20px', color: P.gris },
  tarjeta: { background: 'white', borderRadius: '12px', padding: '14px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0' },
  tarjetaTop: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' },
  eventoTitulo: { fontWeight: 'bold', fontSize: '14px', margin: '0 0 2px 0', color: P.grisOs },
  eventoFecha: { fontSize: '12px', color: P.gris, margin: '0 0 2px 0' },
  eventoNota: { fontSize: '12px', color: '#B0A898', margin: 0 },
  badge: { fontSize: '12px', fontWeight: 'bold', border: '1px solid', borderRadius: '20px', padding: '3px 10px', whiteSpace: 'nowrap' },
  acciones: { display: 'flex', gap: '8px' },
  botonAcc: { padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
};

export default Calendario;
