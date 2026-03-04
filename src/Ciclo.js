import React, { useState, useEffect } from 'react';

const FASES = [
  { id:'menstrual',  nombre:'Fase Menstrual',  emoji:'🔴', diasDesde:1,  diasHasta:5,  gradiente:'linear-gradient(135deg,#9B7BAE,#C4A0D4)', colorTexto:'#7A5C8A', colorSuave:'#F3EEF7', energia:'Energía baja — modo introspectivo', descripcion:'Tu cuerpo pide descanso y reflexión. Es el mejor momento para evaluar tu negocio, revisar números y planear con calma.', negocio:['📊 Revisa tus finanzas del mes','📝 Planea las metas de las próximas semanas','📧 Responde mensajes pendientes','🎯 Define tu estrategia de ventas'], bienestar:['🛁 Date un baño relajante','📖 Lee algo que te inspire','😴 Duerme más de lo habitual','🍵 Tés de manzanilla o jengibre'], evitar:'Evita agendar reuniones importantes o lanzamientos.' },
  { id:'folicular',  nombre:'Fase Folicular',  emoji:'🌱', diasDesde:6,  diasHasta:13, gradiente:'linear-gradient(135deg,#2D6E5E,#4AA08A)', colorTexto:'#2D6E5E', colorSuave:'#E8F2EF', energia:'Energía subiendo — modo creativo', descripcion:'Tu mente está fresca y receptiva. Ideal para aprender cosas nuevas, arrancar proyectos y crear contenido para redes.', negocio:['🎨 Crea contenido para redes sociales','📸 Toma fotos de tus productos','💡 Desarrolla ideas nuevas','📚 Toma un curso o aprende algo nuevo'], bienestar:['🚶‍♀️ Camina o haz ejercicio ligero','🥗 Come verduras y proteínas frescas','✍️ Escribe en tu diario','🌿 Sal a la naturaleza si puedes'], evitar:'No te sobrecomprometas — todavía estás construyendo energía.' },
  { id:'ovulatoria', nombre:'Fase Ovulatoria', emoji:'☀️', diasDesde:14, diasHasta:17, gradiente:'linear-gradient(135deg,#C4973A,#E8BF6A)', colorTexto:'#A07828', colorSuave:'#FBF5E6', energia:'¡Energía máxima! — modo ventas', descripcion:'Estás en tu punto más alto. Tu comunicación es fluida y carismática. ¡Es tu semana de oro para vender!', negocio:['💰 Haz llamadas de ventas y cotizaciones','📱 Publica videos o lives en redes','🤝 Agenda reuniones importantes','🚀 Lanza productos o promociones nuevas'], bienestar:['💃 Baila o haz ejercicio que disfrutes','👯‍♀️ Sal con amigas o familia','🌺 Usa colores vibrantes','☀️ Toma sol y aire fresco'], evitar:'No descuides el descanso — la energía alta puede hacerte sobrepasar tus límites.' },
  { id:'lutea',      nombre:'Fase Lútea',      emoji:'🍂', diasDesde:18, diasHasta:28, gradiente:'linear-gradient(135deg,#7A8C5E,#A0B480)', colorTexto:'#5A6C40', colorSuave:'#EEF2E8', energia:'Energía bajando — modo cierre', descripcion:'Tu energía va disminuyendo. Perfecta para terminar pendientes, tareas administrativas y preparar el descanso.', negocio:['🧾 Organiza facturas y registros','📦 Prepara pedidos y entregas','✅ Termina proyectos empezados','🗂️ Ordena tu espacio de trabajo'], bienestar:['🧘‍♀️ Yoga suave o meditación','🍫 Un poco de chocolate amargo está bien','🛌 Acuéstate más temprano','💆‍♀️ Date un masaje si puedes'], evitar:'Evita tomar decisiones grandes o iniciar cosas nuevas.' },
];

function Ciclo({ onVolver }) {
  const [ultimaMenstruacion, setUltimaMenstruacion] = useState(()=>localStorage.getItem('una_ciclo_fecha')||'');
  const [duracionCiclo, setDuracionCiclo] = useState(()=>parseInt(localStorage.getItem('una_ciclo_duracion'))||28);
  const [configurado, setConfigurado] = useState(()=>!!localStorage.getItem('una_ciclo_fecha'));
  const [pestana, setPestana] = useState('hoy');

  useEffect(()=>{ if(ultimaMenstruacion)localStorage.setItem('una_ciclo_fecha',ultimaMenstruacion); localStorage.setItem('una_ciclo_duracion',duracionCiclo); },[ultimaMenstruacion,duracionCiclo]);

  const calcularFase = () => {
    if(!ultimaMenstruacion) return null;
    const inicio = new Date(ultimaMenstruacion+'T12:00:00');
    const diasTrans = Math.round((new Date()-inicio)/(1000*60*60*24));
    const diaDelCiclo = ((diasTrans%duracionCiclo)+duracionCiclo)%duracionCiclo+1;
    return { fase:FASES.find(f=>diaDelCiclo>=f.diasDesde&&diaDelCiclo<=f.diasHasta)||FASES[3], diaDelCiclo };
  };

  const resultado = configurado ? calcularFase() : null;
  const diasRestantes = () => resultado ? resultado.fase.diasHasta - resultado.diaDelCiclo + 1 : null;
  const proximaFase = () => FASES[(FASES.findIndex(f=>f.id===resultado.fase.id)+1)%FASES.length];

  return (
    <div style={e.contenedor}>
      <div style={{ ...e.topBar, background: resultado ? resultado.fase.gradiente : 'linear-gradient(135deg,#7A5C8A,#B48EC4)' }}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>🌙 Ciclo y Productividad</h2>
      </div>

      <div style={{padding:'20px'}}>
        {!configurado && (
          <div style={e.configBox}>
            <div style={e.configHeader}><span style={{fontSize:'40px'}}>🌙</span><div><p style={e.configTitulo}>Personaliza tus consejos</p><p style={e.configSub}>Solo necesito dos datos</p></div></div>
            <label style={e.label}>📅 Primer día de tu última menstruación</label>
            <input style={e.input} type="date" value={ultimaMenstruacion} onChange={ev=>setUltimaMenstruacion(ev.target.value)} />
            <label style={e.label}>🔄 ¿Cuántos días dura tu ciclo?</label>
            <div style={e.duracionFila}>
              {[21,24,26,28,30,32,35].map(d=>(
                <button key={d} style={{ ...e.durBtn, backgroundColor:duracionCiclo===d?'#7A5C8A':'white', color:duracionCiclo===d?'white':'#8A8A8A', borderColor:duracionCiclo===d?'#7A5C8A':'#EAE7E0' }} onClick={()=>setDuracionCiclo(d)}>{d}</button>
              ))}
            </div>
            <p style={e.hint}>28 días es el promedio más común si no lo sabes con exactitud.</p>
            <button style={{ ...e.botonGuardar, opacity:ultimaMenstruacion?1:0.5 }} onClick={()=>ultimaMenstruacion&&setConfigurado(true)}>Ver mi fase de hoy ✨</button>
          </div>
        )}

        {configurado && resultado && (<>
          <div style={{ ...e.faseTarjeta, background:resultado.fase.gradiente }}>
            <div style={e.faseTop}>
              <div>
                <p style={e.faseSubtitulo}>Hoy estás en</p>
                <p style={e.faseNombre}>{resultado.fase.emoji} {resultado.fase.nombre}</p>
                <p style={e.faseEnergia}>{resultado.fase.energia}</p>
              </div>
              <div style={e.faseMetas}>
                <div style={e.faseMeta}><p style={e.faseMetaNum}>Día {resultado.diaDelCiclo}</p><p style={e.faseMetaLabel}>de tu ciclo</p></div>
                <div style={e.faseMeta}><p style={e.faseMetaNum}>{diasRestantes()}</p><p style={e.faseMetaLabel}>días más</p></div>
              </div>
            </div>
            <p style={e.faseDescripcion}>{resultado.fase.descripcion}</p>
            <div style={e.proximaFaseBox}>
              <p style={e.proximaFaseTexto}>Próxima fase: {proximaFase().emoji} {proximaFase().nombre}</p>
            </div>
          </div>

          <div style={e.pestanas}>
            {[['hoy','💼 Negocio'],['bienestar','🌸 Bienestar'],['ciclo','📊 Mi ciclo']].map(([p,l])=>(
              <button key={p} style={pestana===p?{...e.pestana,background:resultado.fase.gradiente,color:'white',border:'none',fontWeight:'bold'}:e.pestana} onClick={()=>setPestana(p)}>{l}</button>
            ))}
          </div>

          {pestana==='hoy' && (
            <div style={e.consejosBox}>
              <p style={e.consejosTitle}>Actividades ideales para hoy</p>
              {resultado.fase.negocio.map((c,i)=>(
                <div key={i} style={e.consejoItem}>
                  <div style={{ ...e.consejoIcono, backgroundColor:resultado.fase.colorSuave }}><span style={{fontSize:'20px'}}>{c.split(' ')[0]}</span></div>
                  <span style={e.consejoTexto}>{c.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
              <div style={{ ...e.evitarBox, borderColor:resultado.fase.colorTexto, backgroundColor:resultado.fase.colorSuave }}>
                <p style={{ ...e.evitarTexto, color:resultado.fase.colorTexto }}>⚠️ {resultado.fase.evitar}</p>
              </div>
            </div>
          )}

          {pestana==='bienestar' && (
            <div style={e.consejosBox}>
              <p style={e.consejosTitle}>Cuídate hoy así 🌸</p>
              {resultado.fase.bienestar.map((c,i)=>(
                <div key={i} style={e.consejoItem}>
                  <div style={{ ...e.consejoIcono, backgroundColor:resultado.fase.colorSuave }}><span style={{fontSize:'20px'}}>{c.split(' ')[0]}</span></div>
                  <span style={e.consejoTexto}>{c.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          )}

          {pestana==='ciclo' && (
            <div style={e.consejosBox}>
              <p style={e.consejosTitle}>Tu ciclo de {duracionCiclo} días</p>
              {FASES.map(fase=>(
                <div key={fase.id} style={{ ...e.cicloFila, background:resultado.fase.id===fase.id?fase.gradiente:'white', border:resultado.fase.id===fase.id?'none':'1px solid #EAE7E0' }}>
                  <span style={{fontSize:'24px'}}>{fase.emoji}</span>
                  <div style={{flex:1}}>
                    <p style={{ fontWeight:'bold', fontSize:'13px', margin:0, color:resultado.fase.id===fase.id?'white':fase.colorTexto }}>{fase.nombre}</p>
                    <p style={{ fontSize:'11px', margin:'2px 0 0', color:resultado.fase.id===fase.id?'rgba(255,255,255,0.8)':'#8A8A8A' }}>Días {fase.diasDesde}–{fase.diasHasta}</p>
                  </div>
                  {resultado.fase.id===fase.id && <span style={e.hoyBadge}>HOY</span>}
                </div>
              ))}
              <button style={e.botonReconf} onClick={()=>setConfigurado(false)}>🔄 Actualizar mi fecha</button>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

const e = {
  contenedor:{ backgroundColor:'#FFFFFF', minHeight:'100vh', fontFamily:'Arial,sans-serif' },
  topBar:{ padding:'20px 20px 24px', display:'flex', alignItems:'center', gap:'12px' },
  volver:{ background:'rgba(255,255,255,0.25)', border:'none', color:'white', padding:'8px 14px', borderRadius:'20px', cursor:'pointer', fontSize:'13px' },
  titulo:{ color:'white', fontSize:'20px', margin:0, fontWeight:'normal', letterSpacing:'1px' },
  configBox:{ background:'white', borderRadius:'20px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', border:'1px solid #EAE7E0' },
  configHeader:{ display:'flex', gap:'14px', alignItems:'center', marginBottom:'20px' },
  configTitulo:{ fontWeight:'bold', color:'#2D2D2D', fontSize:'16px', margin:0 },
  configSub:{ color:'#8A8A8A', fontSize:'13px', margin:'4px 0 0' },
  label:{ fontSize:'13px', color:'#8A8A8A', marginBottom:'6px', display:'block' },
  input:{ width:'100%', padding:'12px 14px', borderRadius:'12px', border:'1.5px solid #EAE7E0', fontSize:'14px', marginBottom:'14px', boxSizing:'border-box', backgroundColor:'#FAF9F7' },
  duracionFila:{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'8px' },
  durBtn:{ padding:'8px 14px', borderRadius:'10px', border:'1.5px solid', cursor:'pointer', fontSize:'14px', fontWeight:'bold' },
  hint:{ fontSize:'12px', color:'#B0A898', marginBottom:'16px' },
  botonGuardar:{ width:'100%', padding:'14px', borderRadius:'14px', border:'none', background:'linear-gradient(135deg,#7A5C8A,#B48EC4)', color:'white', cursor:'pointer', fontSize:'16px', fontWeight:'bold' },
  faseTarjeta:{ borderRadius:'24px', padding:'24px', marginBottom:'16px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' },
  faseTop:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' },
  faseSubtitulo:{ color:'rgba(255,255,255,0.75)', fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', margin:'0 0 4px' },
  faseNombre:{ color:'white', fontWeight:'bold', fontSize:'22px', margin:'0 0 4px' },
  faseEnergia:{ color:'rgba(255,255,255,0.85)', fontSize:'13px', margin:0 },
  faseMetas:{ display:'flex', gap:'8px' },
  faseMeta:{ backgroundColor:'rgba(255,255,255,0.2)', borderRadius:'12px', padding:'10px 14px', textAlign:'center' },
  faseMetaNum:{ color:'white', fontWeight:'bold', fontSize:'20px', margin:0, lineHeight:1 },
  faseMetaLabel:{ color:'rgba(255,255,255,0.8)', fontSize:'11px', margin:'3px 0 0' },
  faseDescripcion:{ color:'rgba(255,255,255,0.9)', fontSize:'14px', lineHeight:1.6, marginBottom:'14px' },
  proximaFaseBox:{ backgroundColor:'rgba(255,255,255,0.2)', borderRadius:'10px', padding:'10px 14px' },
  proximaFaseTexto:{ color:'white', fontSize:'13px', margin:0 },
  pestanas:{ display:'flex', gap:'8px', marginBottom:'16px' },
  pestana:{ flex:1, padding:'10px', borderRadius:'12px', border:'1.5px solid #EAE7E0', background:'white', cursor:'pointer', fontSize:'12px', textAlign:'center', color:'#8A8A8A' },
  consejosBox:{ background:'white', borderRadius:'20px', padding:'18px', boxShadow:'0 4px 16px rgba(0,0,0,0.07)', border:'1px solid #EAE7E0' },
  consejosTitle:{ fontWeight:'bold', color:'#2D2D2D', fontSize:'14px', marginBottom:'14px' },
  consejoItem:{ display:'flex', gap:'12px', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #FAF9F7' },
  consejoIcono:{ width:'40px', height:'40px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  consejoTexto:{ fontSize:'14px', color:'#444', flex:1 },
  evitarBox:{ marginTop:'14px', borderRadius:'12px', padding:'12px', border:'1px solid' },
  evitarTexto:{ fontSize:'13px', fontWeight:'bold', margin:0 },
  cicloFila:{ display:'flex', alignItems:'center', gap:'12px', padding:'14px', borderRadius:'14px', marginBottom:'8px' },
  hoyBadge:{ color:'white', fontSize:'11px', fontWeight:'bold', backgroundColor:'rgba(255,255,255,0.3)', padding:'3px 10px', borderRadius:'20px' },
  botonReconf:{ width:'100%', marginTop:'14px', padding:'10px', borderRadius:'12px', border:'1.5px solid #EAE7E0', background:'white', cursor:'pointer', fontSize:'13px', color:'#8A8A8A' },
};

export default Ciclo;
