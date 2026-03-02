import React, { useState, useEffect } from 'react';

const P = { verde: '#2D6E5E', verdet: '#E8F2EF', malva: '#9B7BAE', malvat: '#F3EEF7', dorado: '#C4973A', doradot: '#FBF5E6', crema: '#F5F3EE', gris: '#8A8A8A', grisOs: '#2D2D2D' };

const FASES = [
  { id: 'menstrual',  nombre: 'Fase Menstrual',  emoji: '🔴', diasDesde: 1,  diasHasta: 5,  color: P.malva,  colorSuave: P.malvat,  energia: 'Energía baja — modo introspectivo', descripcion: 'Tu cuerpo pide descanso y reflexión. Es el mejor momento para evaluar tu negocio, revisar números y planear con calma.', negocio: ['📊 Revisa tus finanzas del mes','📝 Planea las metas de las próximas semanas','📧 Responde correos y mensajes pendientes','🎯 Define tu estrategia de ventas'], bienestar: ['🛁 Date un baño de tina o ducha larga','📖 Lee algo que te inspire','😴 Duerme más de lo habitual si puedes','🍵 Tés de manzanilla o jengibre'], evitar: 'Evita agendar reuniones importantes o lanzamientos en estos días.' },
  { id: 'folicular',  nombre: 'Fase Folicular',  emoji: '🌱', diasDesde: 6,  diasHasta: 13, color: P.verde,  colorSuave: P.verdet,  energia: 'Energía subiendo — modo creativo', descripcion: 'Tu mente está fresca y receptiva. Ideal para aprender cosas nuevas, arrancar proyectos y crear contenido para redes.', negocio: ['🎨 Crea contenido para Instagram o Facebook','📸 Toma fotos de tus productos','💡 Desarrolla ideas nuevas para tu negocio','📚 Toma un curso o aprende algo nuevo'], bienestar: ['🚶‍♀️ Camina o haz ejercicio ligero','🥗 Come verduras y proteínas frescas','✍️ Escribe en tu diario o journaling','🌿 Sal a la naturaleza si puedes'], evitar: 'No te sobrecomprometas — todavía estás construyendo energía.' },
  { id: 'ovulatoria', nombre: 'Fase Ovulatoria', emoji: '☀️', diasDesde: 14, diasHasta: 17, color: P.dorado, colorSuave: P.doradot, energia: '¡Energía máxima! — modo social y ventas', descripcion: 'Estás en tu punto más alto. Tu comunicación es fluida y carismática. ¡Es tu semana de oro para vender!', negocio: ['💰 Haz llamadas de ventas y cotizaciones','📱 Publica videos o lives en redes sociales','🤝 Agenda reuniones importantes','🚀 Lanza productos o promociones nuevas'], bienestar: ['💃 Baila, haz ejercicio que disfrutes','👯‍♀️ Sal con amigas o familia','🌺 Usa colores vibrantes en tu ropa','☀️ Toma sol y aire fresco'], evitar: 'No descuides el descanso — la energía alta puede hacerte sobrepasar tus límites.' },
  { id: 'lutea',      nombre: 'Fase Lútea',      emoji: '🍂', diasDesde: 18, diasHasta: 28, color: '#7A8C5E', colorSuave: '#EEF2E8', energia: 'Energía bajando — modo cierre y administración', descripcion: 'Tu energía va disminuyendo. Es perfecta para terminar pendientes, hacer tareas administrativas y preparar el descanso.', negocio: ['🧾 Organiza facturas y registros','📦 Prepara pedidos y entregas pendientes','✅ Termina proyectos que empezaste','🗂️ Ordena tu espacio de trabajo'], bienestar: ['🧘‍♀️ Yoga suave o meditación','🍫 Un poco de chocolate amargo está bien','🛌 Acuéstate más temprano','💆‍♀️ Date un masaje si puedes'], evitar: 'Evita tomar decisiones grandes o iniciar cosas nuevas — mejor cerrar ciclos.' },
];

function Ciclo({ onVolver }) {
  const [ultimaMenstruacion, setUltimaMenstruacion] = useState(() => localStorage.getItem('una_ciclo_fecha') || '');
  const [duracionCiclo, setDuracionCiclo] = useState(() => parseInt(localStorage.getItem('una_ciclo_duracion')) || 28);
  const [configurado, setConfigurado] = useState(() => !!localStorage.getItem('una_ciclo_fecha'));
  const [pestana, setPestana] = useState('hoy');

  useEffect(() => {
    if (ultimaMenstruacion) localStorage.setItem('una_ciclo_fecha', ultimaMenstruacion);
    localStorage.setItem('una_ciclo_duracion', duracionCiclo);
  }, [ultimaMenstruacion, duracionCiclo]);

  const calcularFase = () => {
    if (!ultimaMenstruacion) return null;
    const inicio = new Date(ultimaMenstruacion + 'T12:00:00');
    const diasTranscurridos = Math.round((new Date() - inicio) / (1000 * 60 * 60 * 24));
    const diaDelCiclo = ((diasTranscurridos % duracionCiclo) + duracionCiclo) % duracionCiclo + 1;
    return { fase: FASES.find(f => diaDelCiclo >= f.diasDesde && diaDelCiclo <= f.diasHasta) || FASES[3], diaDelCiclo };
  };

  const resultado = configurado ? calcularFase() : null;
  const diasRestantes = () => resultado ? resultado.fase.diasHasta - resultado.diaDelCiclo + 1 : null;
  const proximaFase = () => FASES[(FASES.findIndex(f => f.id === resultado.fase.id) + 1) % FASES.length];

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>🌙 Ciclo y Productividad</h2>
      </div>

      <div style={{ padding: '20px' }}>
        {!configurado && (
          <div style={e.configBox}>
            <p style={e.configTitulo}>Para personalizar tus consejos necesito saber:</p>
            <label style={e.label}>📅 ¿Cuándo fue el primer día de tu última menstruación?</label>
            <input style={e.input} type="date" value={ultimaMenstruacion} onChange={ev => setUltimaMenstruacion(ev.target.value)} />
            <label style={e.label}>🔄 ¿Cuántos días dura tu ciclo normalmente?</label>
            <div style={e.duracionFila}>
              {[21,24,26,28,30,32,35].map(d => (
                <button key={d} style={{ ...e.duracionBtn, backgroundColor: duracionCiclo === d ? P.verde : 'white', color: duracionCiclo === d ? 'white' : P.gris, borderColor: duracionCiclo === d ? P.verde : '#EAE7E0' }} onClick={() => setDuracionCiclo(d)}>{d}</button>
              ))}
            </div>
            <p style={e.hint}>Si no lo sabes con exactitud, 28 días es el promedio más común.</p>
            <button style={{ ...e.botonGuardar, opacity: ultimaMenstruacion ? 1 : 0.5 }} onClick={() => ultimaMenstruacion && setConfigurado(true)}>Ver mi fase de hoy ✨</button>
          </div>
        )}

        {configurado && resultado && (
          <>
            <div style={{ ...e.faseTarjeta, backgroundColor: resultado.fase.colorSuave, borderColor: resultado.fase.color }}>
              <div style={e.faseEncabezado}>
                <span style={e.faseEmoji}>{resultado.fase.emoji}</span>
                <div>
                  <p style={{ ...e.faseNombre, color: resultado.fase.color }}>{resultado.fase.nombre}</p>
                  <p style={e.faseEnergia}>{resultado.fase.energia}</p>
                </div>
              </div>
              <p style={e.faseDescripcion}>{resultado.fase.descripcion}</p>
              <div style={e.faseMeta}>
                <div style={e.faseMetaItem}><p style={e.faseMetaNum}>Día {resultado.diaDelCiclo}</p><p style={e.faseMetaLabel}>de tu ciclo</p></div>
                <div style={e.faseMetaItem}><p style={e.faseMetaNum}>{diasRestantes()}</p><p style={e.faseMetaLabel}>días restantes</p></div>
                <div style={e.faseMetaItem}><p style={{ ...e.faseMetaNum, fontSize: '20px' }}>{proximaFase().emoji}</p><p style={e.faseMetaLabel}>próxima fase</p></div>
              </div>
            </div>

            <div style={e.pestanas}>
              {['hoy','bienestar','ciclo'].map((p, i) => {
                const labels = ['💼 Negocio','🌸 Bienestar','📊 Mi ciclo'];
                return <button key={p} style={pestana === p ? { ...e.pestana, ...e.pestanaActiva, borderColor: resultado.fase.color, color: resultado.fase.color } : e.pestana} onClick={() => setPestana(p)}>{labels[i]}</button>;
              })}
            </div>

            {pestana === 'hoy' && (
              <div style={e.consejosBox}>
                <p style={e.consejosTitle}>Actividades ideales para hoy</p>
                {resultado.fase.negocio.map((c, i) => (
                  <div key={i} style={e.consejoItem}>
                    <span style={{ fontSize: '18px' }}>{c.split(' ')[0]}</span>
                    <span style={e.consejoTexto}>{c.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
                <div style={{ ...e.evitarBox, borderColor: resultado.fase.color }}>
                  <p style={{ ...e.evitarTexto, color: resultado.fase.color }}>⚠️ {resultado.fase.evitar}</p>
                </div>
              </div>
            )}

            {pestana === 'bienestar' && (
              <div style={e.consejosBox}>
                <p style={e.consejosTitle}>Cuídate hoy así</p>
                {resultado.fase.bienestar.map((c, i) => (
                  <div key={i} style={e.consejoItem}>
                    <span style={{ fontSize: '18px' }}>{c.split(' ')[0]}</span>
                    <span style={e.consejoTexto}>{c.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            )}

            {pestana === 'ciclo' && (
              <div style={e.consejosBox}>
                <p style={e.consejosTitle}>Tu ciclo de {duracionCiclo} días</p>
                {FASES.map(fase => (
                  <div key={fase.id} style={{ ...e.cicloFila, backgroundColor: resultado.fase.id === fase.id ? fase.colorSuave : 'white', borderLeft: `4px solid ${fase.color}` }}>
                    <span style={{ fontSize: '20px' }}>{fase.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 'bold', fontSize: '13px', margin: 0, color: fase.color }}>{fase.nombre}</p>
                      <p style={{ fontSize: '11px', color: P.gris, margin: '2px 0 0 0' }}>Días {fase.diasDesde}–{fase.diasHasta}</p>
                    </div>
                    {resultado.fase.id === fase.id && <span style={{ ...e.hoyBadge, backgroundColor: fase.color }}>Hoy</span>}
                  </div>
                ))}
                <button style={e.botonReconfigurar} onClick={() => setConfigurado(false)}>🔄 Actualizar mi fecha</button>
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
  topBar: { background: 'linear-gradient(135deg, #9B7BAE, #7A8C5E)', padding: '20px 20px 24px', display: 'flex', alignItems: 'center', gap: '12px' },
  volver: { background: 'rgba(255,255,255,0.25)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  titulo: { color: 'white', fontSize: '20px', margin: 0, fontWeight: 'normal', letterSpacing: '1px' },
  configBox: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #EAE7E0' },
  configTitulo: { fontWeight: 'bold', color: '#2D2D2D', fontSize: '15px', marginBottom: '16px' },
  label: { fontSize: '13px', color: '#8A8A8A', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #EAE7E0', fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box', backgroundColor: '#FAF9F7' },
  duracionFila: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' },
  duracionBtn: { padding: '8px 14px', borderRadius: '8px', border: '1.5px solid', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  hint: { fontSize: '12px', color: '#B0A898', marginBottom: '16px' },
  botonGuardar: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: P.verde, color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  faseTarjeta: { borderRadius: '16px', padding: '20px', border: '2px solid', marginBottom: '16px' },
  faseEncabezado: { display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '10px' },
  faseEmoji: { fontSize: '40px', lineHeight: 1 },
  faseNombre: { fontWeight: 'bold', fontSize: '18px', margin: 0 },
  faseEnergia: { fontSize: '13px', color: '#8A8A8A', margin: '2px 0 0 0' },
  faseDescripcion: { fontSize: '14px', color: '#444', lineHeight: 1.5, marginBottom: '14px' },
  faseMeta: { display: 'flex', gap: '8px' },
  faseMetaItem: { flex: 1, background: 'white', borderRadius: '10px', padding: '10px', textAlign: 'center' },
  faseMetaNum: { fontWeight: 'bold', fontSize: '22px', margin: 0, color: '#2D2D2D' },
  faseMetaLabel: { fontSize: '11px', color: '#8A8A8A', margin: '2px 0 0 0' },
  pestanas: { display: 'flex', gap: '8px', marginBottom: '16px' },
  pestana: { flex: 1, padding: '10px', borderRadius: '8px', border: '1.5px solid #EAE7E0', background: 'white', cursor: 'pointer', fontSize: '12px', textAlign: 'center', color: '#8A8A8A' },
  pestanaActiva: { border: '2px solid', fontWeight: 'bold' },
  consejosBox: { background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #EAE7E0' },
  consejosTitle: { fontWeight: 'bold', color: '#2D2D2D', fontSize: '14px', marginBottom: '12px' },
  consejoItem: { display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #FAF9F7' },
  consejoTexto: { fontSize: '14px', color: '#444' },
  evitarBox: { marginTop: '14px', borderRadius: '8px', padding: '12px', border: '1px solid', backgroundColor: '#FAF9F7' },
  evitarTexto: { fontSize: '13px', fontWeight: 'bold', margin: 0 },
  cicloFila: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', marginBottom: '8px' },
  hoyBadge: { color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '20px' },
  botonReconfigurar: { width: '100%', marginTop: '14px', padding: '10px', borderRadius: '8px', border: '1.5px solid #EAE7E0', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#8A8A8A' },
};

export default Ciclo;
