import React, { useState, useEffect } from 'react';

const BG='#0D1117', CARD='#161B22', CARD2='#1C2333', BR='rgba(255,255,255,0.08)', TXT='#E6EDF3', TXT2='rgba(255,255,255,0.4)';

const FASES = [
  { id:'menstrual',  nom:'Fase Menstrual',  emoji:'🔴', de:1,  a:5,  color:'#C4A0D4', dark:'#1A0825', grad:'linear-gradient(135deg,#1A0825,#4A2060)', energia:'Energia baja — modo introspectivo',
    desc:'Tu cuerpo pide descanso y reflexion. Ideal para evaluar tu negocio, revisar numeros y planear con calma.',
    negocio:['Revisa las finanzas del mes','Planea metas de las proximas semanas','Responde mensajes pendientes','Define tu estrategia de ventas'],
    bienestar:['Date un bano relajante','Lee algo que te inspire','Duerme mas de lo habitual','Te de manzanilla o jengibre'],
    evitar:'Evita agendar reuniones importantes o lanzamientos.' },
  { id:'folicular',  nom:'Fase Folicular',  emoji:'🌱', de:6,  a:13, color:'#4AA08A', dark:'#0A1F15', grad:'linear-gradient(135deg,#0A1F15,#155A35)', energia:'Energia subiendo — modo creativo',
    desc:'Tu mente esta fresca. Ideal para aprender cosas nuevas, arrancar proyectos y crear contenido.',
    negocio:['Crea contenido para redes sociales','Toma fotos de tus productos','Desarrolla ideas nuevas','Toma un curso o aprende algo'],
    bienestar:['Camina o haz ejercicio ligero','Come verduras y proteinas','Escribe en tu diario','Sal a la naturaleza si puedes'],
    evitar:'No te sobrecomprometas — todavia estas construyendo energia.' },
  { id:'ovulatoria', nom:'Fase Ovulatoria', emoji:'☀️', de:14, a:17, color:'#E8BF6A', dark:'#1A1208', grad:'linear-gradient(135deg,#1A1208,#4A3210)', energia:'Energia maxima — modo ventas',
    desc:'Estas en tu punto mas alto. Tu comunicacion es fluida y carismatica. Es tu semana de oro para vender.',
    negocio:['Haz llamadas de ventas','Publica videos o lives en redes','Agenda reuniones importantes','Lanza productos o promociones'],
    bienestar:['Baila o haz ejercicio que disfrutes','Sal con amigas o familia','Toma sol y aire fresco','Consientete'],
    evitar:'No descuides el descanso — puedes sobrepasar tus limites.' },
  { id:'lutea',      nom:'Fase Lutea',      emoji:'🍂', de:18, a:28, color:'#8AAABA', dark:'#0D1820', grad:'linear-gradient(135deg,#0D1820,#1A3040)', energia:'Energia bajando — modo cierre',
    desc:'Tu energia va disminuyendo. Perfecta para terminar pendientes y tareas administrativas.',
    negocio:['Organiza facturas y registros','Prepara pedidos y entregas','Termina proyectos empezados','Ordena tu espacio de trabajo'],
    bienestar:['Yoga suave o meditacion','Chocolate amargo con moderacion','Acuestate mas temprano','Date un masaje si puedes'],
    evitar:'Evita tomar decisiones grandes o iniciar proyectos nuevos.' },
];

function Ciclo({ onVolver }) {
  const [fecha, setFecha] = useState(()=>localStorage.getItem('una_ciclo_fecha')||'');
  const [dur, setDur] = useState(()=>parseInt(localStorage.getItem('una_ciclo_duracion'))||28);
  const [conf, setConf] = useState(()=>!!localStorage.getItem('una_ciclo_fecha'));
  const [tab, setTab] = useState('hoy');

  useEffect(() => {
    if (fecha) localStorage.setItem('una_ciclo_fecha', fecha);
    localStorage.setItem('una_ciclo_duracion', String(dur));
  }, [fecha, dur]);

  const calc = () => {
    if (!fecha) return null;
    const dias = Math.round((new Date() - new Date(fecha+'T12:00:00')) / 86400000);
    const dia = ((dias % dur) + dur) % dur + 1;
    return { fase: FASES.find(f=>dia>=f.de&&dia<=f.a)||FASES[3], dia };
  };

  const res = conf ? calc() : null;
  const quedan = () => res ? res.fase.a - res.dia + 1 : 0;
  const proxF = () => FASES[(FASES.findIndex(f=>f.id===res.fase.id)+1) % FASES.length];

  const iconosN = ['📊','📝','📧','🎯','💰','📱','🤝','🚀'];
  const iconosB = ['🛁','📖','😴','🍵','🚶‍♀️','🥗','✍️','🌿'];

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:'Arial,sans-serif' }}>
      <div style={{ background: res ? res.fase.grad : 'linear-gradient(135deg,#120920,#2A1040)', padding:'52px 20px 28px', display:'flex', alignItems:'center', gap:14 }}>
        <button style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'white', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:18, flexShrink:0 }} onClick={onVolver}>←</button>
        <div style={{flex:1}}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, margin:0, letterSpacing:2 }}>MODULO</p>
          <h2 style={{ color:'white', fontSize:24, margin:0, fontWeight:'bold' }}>Ciclo y Productividad</h2>
        </div>
        <span style={{fontSize:42}}>🌙</span>
      </div>

      <div style={{ padding:16 }}>
        {!conf && (
          <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
            <p style={{ color:TXT, fontWeight:'bold', fontSize:18, margin:'0 0 8px' }}>Personaliza tus consejos</p>
            <p style={{ color:TXT2, fontSize:13, margin:'0 0 22px', lineHeight:1.5 }}>Solo necesito dos datos para mostrarte que hacer cada dia.</p>
            <label style={{ color:TXT2, fontSize:12, display:'block', marginBottom:6 }}>Primer dia de tu ultima menstruacion</label>
            <input style={{ width:'100%', padding:'14px 16px', borderRadius:16, border:`1px solid ${BR}`, fontSize:14, marginBottom:16, boxSizing:'border-box', background:CARD2, color:TXT }} type="date" value={fecha} onChange={e=>setFecha(e.target.value)} />
            <label style={{ color:TXT2, fontSize:12, display:'block', marginBottom:8 }}>Cuantos dias dura tu ciclo?</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
              {[21,24,26,28,30,32,35].map(d => (
                <button key={d} style={{ padding:'9px 16px', borderRadius:12, border:`1px solid ${dur===d?'#7A5C8A':BR}`, background:dur===d?'#2A1540':'transparent', color:dur===d?'white':TXT2, cursor:'pointer', fontSize:14, fontWeight:dur===d?'bold':'normal' }} onClick={()=>setDur(d)}>{d}</button>
              ))}
            </div>
            <p style={{ color:TXT2, fontSize:12, margin:'0 0 18px' }}>28 dias es el promedio mas comun.</p>
            <button style={{ width:'100%', padding:15, background: fecha?'linear-gradient(135deg,#2A1540,#7A5C8A)':'rgba(255,255,255,0.05)', color:'white', border:'none', borderRadius:16, fontSize:15, cursor:fecha?'pointer':'default', fontWeight:'bold', opacity:fecha?1:0.4 }} onClick={()=>fecha&&setConf(true)}>Ver mi fase de hoy</button>
          </div>
        )}

        {conf && res && <>
          {/* Tarjeta de fase */}
          <div style={{ background:res.fase.grad, borderRadius:22, padding:22, marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:10, letterSpacing:3, textTransform:'uppercase', margin:'0 0 6px' }}>HOY ESTAS EN</p>
                <p style={{ color:'white', fontWeight:'bold', fontSize:24, margin:'0 0 6px' }}>{res.fase.emoji} {res.fase.nom}</p>
                <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, margin:0 }}>{res.fase.energia}</p>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {[{n:`Dia ${res.dia}`,l:'de tu ciclo'},{n:`${quedan()}`,l:'dias mas'},{n:proxF().emoji,l:'proxima'}].map((m,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,0.15)', borderRadius:14, padding:'10px 10px', textAlign:'center', minWidth:50 }}>
                    <p style={{ color:'white', fontWeight:'bold', fontSize:15, margin:0, lineHeight:1 }}>{m.n}</p>
                    <p style={{ color:'rgba(255,255,255,0.6)', fontSize:10, margin:'4px 0 0', lineHeight:1.2 }}>{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ color:'rgba(255,255,255,0.85)', fontSize:14, lineHeight:1.6, margin:0 }}>{res.fase.desc}</p>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            {[['hoy','Negocio'],['bienestar','Bienestar'],['ciclo','Mi ciclo']].map(([p,l]) => (
              <button key={p} style={{ flex:1, padding:11, borderRadius:14, cursor:'pointer', fontSize:13, textAlign:'center', background:tab===p?res.fase.grad:'transparent', color:tab===p?'white':TXT2, border:tab===p?'none':`1px solid ${BR}` }} onClick={()=>setTab(p)}>{l}</button>
            ))}
          </div>

          {tab==='hoy' && (
            <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>Actividades ideales hoy</p>
              {res.fase.negocio.map((a,i) => (
                <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${BR}` }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:res.fase.dark, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{iconosN[i]||'✅'}</div>
                  <span style={{ color:TXT, fontSize:14, flex:1 }}>{a}</span>
                </div>
              ))}
              <div style={{ background:res.fase.dark, borderRadius:14, padding:'12px 16px', marginTop:14, border:`1px solid ${res.fase.color}33` }}>
                <p style={{ color:res.fase.color, fontSize:13, fontWeight:'bold', margin:0 }}>{res.fase.evitar}</p>
              </div>
            </div>
          )}

          {tab==='bienestar' && (
            <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>Cuidate hoy asi</p>
              {res.fase.bienestar.map((a,i) => (
                <div key={i} style={{ display:'flex', gap:14, alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${BR}` }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:res.fase.dark, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{iconosB[i]||'✨'}</div>
                  <span style={{ color:TXT, fontSize:14, flex:1 }}>{a}</span>
                </div>
              ))}
            </div>
          )}

          {tab==='ciclo' && (
            <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>Tu ciclo de {dur} dias</p>
              {FASES.map(f => (
                <div key={f.id} style={{ display:'flex', alignItems:'center', gap:14, padding:16, borderRadius:16, marginBottom:8, background:res.fase.id===f.id?f.grad:CARD2, border:res.fase.id===f.id?'none':`1px solid ${BR}` }}>
                  <span style={{fontSize:26}}>{f.emoji}</span>
                  <div style={{flex:1}}>
                    <p style={{ fontWeight:'bold', fontSize:14, margin:'0 0 2px', color:res.fase.id===f.id?'white':f.color }}>{f.nom}</p>
                    <p style={{ fontSize:11, margin:0, color:'rgba(255,255,255,0.35)' }}>Dias {f.de}–{f.a}</p>
                  </div>
                  {res.fase.id===f.id && <span style={{ color:'white', fontSize:11, fontWeight:'bold', background:'rgba(255,255,255,0.2)', padding:'3px 12px', borderRadius:20 }}>HOY</span>}
                </div>
              ))}
              <button style={{ width:'100%', padding:13, borderRadius:16, border:`1px solid ${BR}`, background:'transparent', color:TXT2, cursor:'pointer', fontSize:13, marginTop:12 }} onClick={()=>setConf(false)}>Actualizar mi fecha</button>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

export default Ciclo;
