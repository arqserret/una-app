import React, { useState, useEffect } from 'react';

const D = { bg:'#0D1117', card:'#161B22', card2:'#1C2333', border:'rgba(255,255,255,0.08)', text:'#E6EDF3', text2:'rgba(255,255,255,0.5)' };

const FASES = [
  { id:'menstrual',  nombre:'Fase Menstrual',  emoji:'🔴', diasDesde:1,  diasHasta:5,  color:'#C4A0D4', colorD:'#2E1F3E', g:'linear-gradient(135deg,#2E1F3E,#7A5C8A)', energia:'Energía baja — modo introspectivo', descripcion:'Tu cuerpo pide descanso y reflexión. Es el mejor momento para evaluar tu negocio, revisar números y planear con calma.', negocio:['📊 Revisa tus finanzas del mes','📝 Planea metas de las próximas semanas','📧 Responde mensajes pendientes','🎯 Define tu estrategia de ventas'], bienestar:['🛁 Date un baño relajante','📖 Lee algo que te inspire','😴 Duerme más de lo habitual','🍵 Tés de manzanilla o jengibre'], evitar:'Evita agendar reuniones importantes o lanzamientos.' },
  { id:'folicular',  nombre:'Fase Folicular',  emoji:'🌱', diasDesde:6,  diasHasta:13, color:'#4AA08A', colorD:'#1A3D35', g:'linear-gradient(135deg,#1A3D35,#2D6E5E)', energia:'Energía subiendo — modo creativo', descripcion:'Tu mente está fresca y receptiva. Ideal para aprender cosas nuevas, arrancar proyectos y crear contenido.', negocio:['🎨 Crea contenido para redes sociales','📸 Toma fotos de tus productos','💡 Desarrolla ideas nuevas','📚 Toma un curso o aprende algo nuevo'], bienestar:['🚶‍♀️ Camina o haz ejercicio ligero','🥗 Come verduras y proteínas','✍️ Escribe en tu diario','🌿 Sal a la naturaleza si puedes'], evitar:'No te sobrecomprometas — todavía estás construyendo energía.' },
  { id:'ovulatoria', nombre:'Fase Ovulatoria', emoji:'☀️', diasDesde:14, diasHasta:17, color:'#E8BF6A', colorD:'#3A2A10', g:'linear-gradient(135deg,#3A2A10,#C4973A)', energia:'Energía máxima — modo ventas', descripcion:'Estás en tu punto más alto. Tu comunicación es fluida y carismática. ¡Es tu semana de oro para vender!', negocio:['💰 Haz llamadas de ventas','📱 Publica videos o lives en redes','🤝 Agenda reuniones importantes','🚀 Lanza productos o promociones'], bienestar:['💃 Baila o haz ejercicio que disfrutes','👯‍♀️ Sal con amigas o familia','☀️ Toma sol y aire fresco','🌸 Consiéntete'], evitar:'No descuides el descanso — puedes sobrepasar tus límites.' },
  { id:'lutea',      nombre:'Fase Lútea',      emoji:'🍂', diasDesde:18, diasHasta:28, color:'#7A8C9A', colorD:'#1A2530', g:'linear-gradient(135deg,#1A2530,#4A6070)', energia:'Energía bajando — modo cierre', descripcion:'Tu energía va disminuyendo. Perfecta para terminar pendientes, tareas administrativas y preparar el descanso.', negocio:['🧾 Organiza facturas y registros','📦 Prepara pedidos y entregas','✅ Termina proyectos empezados','🗂️ Ordena tu espacio de trabajo'], bienestar:['🧘‍♀️ Yoga suave o meditación','🍫 Chocolate amargo con moderación','🛌 Acuéstate más temprano','💆‍♀️ Date un masaje si puedes'], evitar:'Evita tomar decisiones grandes o iniciar proyectos nuevos.' },
];

function Ciclo({ onVolver }) {
  const [ultimaMenstruacion, setUltimaMenstruacion] = useState(()=>localStorage.getItem('una_ciclo_fecha')||'');
  const [duracionCiclo, setDuracionCiclo] = useState(()=>parseInt(localStorage.getItem('una_ciclo_duracion'))||28);
  const [configurado, setConfigurado] = useState(()=>!!localStorage.getItem('una_ciclo_fecha'));
  const [pestana, setPestana] = useState('hoy');

  useEffect(()=>{ if(ultimaMenstruacion)localStorage.setItem('una_ciclo_fecha',ultimaMenstruacion); localStorage.setItem('una_ciclo_duracion',duracionCiclo); },[ultimaMenstruacion,duracionCiclo]);

  const calcularFase = () => {
    if(!ultimaMenstruacion) return null;
    const inicio=new Date(ultimaMenstruacion+'T12:00:00');
    const diasTrans=Math.round((new Date()-inicio)/(1000*60*60*24));
    const diaDelCiclo=((diasTrans%duracionCiclo)+duracionCiclo)%duracionCiclo+1;
    return {fase:FASES.find(f=>diaDelCiclo>=f.diasDesde&&diaDelCiclo<=f.diasHasta)||FASES[3],diaDelCiclo};
  };

  const resultado=configurado?calcularFase():null;
  const diasRestantes=()=>resultado?resultado.fase.diasHasta-resultado.diaDelCiclo+1:null;
  const proximaFase=()=>FASES[(FASES.findIndex(f=>f.id===resultado.fase.id)+1)%FASES.length];

  return (
    <div style={e.page}>
      <div style={{...e.header,background:resultado?resultado.fase.g:'linear-gradient(135deg,#251530,#7A5C8A)'}}>
        <button style={e.back} onClick={onVolver}>←</button>
        <div>
          <p style={e.headerSub}>Módulo</p>
          <h2 style={e.headerTitle}>Ciclo y Productividad</h2>
        </div>
        <span style={e.headerEmoji}>🌙</span>
      </div>

      <div style={e.body}>
        {!configurado && (
          <div style={e.card}>
            <p style={{color:D.text,fontWeight:'bold',fontSize:'16px',margin:'0 0 6px'}}>Personaliza tus consejos</p>
            <p style={{color:D.text2,fontSize:'13px',margin:'0 0 20px',lineHeight:1.5}}>Solo necesito dos datos para mostrarte qué hacer cada día.</p>
            <label style={e.label}>Primer día de tu última menstruación</label>
            <input style={e.input} type="date" value={ultimaMenstruacion} onChange={ev=>setUltimaMenstruacion(ev.target.value)}/>
            <label style={e.label}>¿Cuántos días dura tu ciclo?</label>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px',margin:'8px 0 16px'}}>
              {[21,24,26,28,30,32,35].map(d=>(
                <button key={d} style={{...e.durBtn,backgroundColor:duracionCiclo===d?'#7A5C8A':'transparent',color:duracionCiclo===d?'white':D.text2,borderColor:duracionCiclo===d?'#7A5C8A':D.border}} onClick={()=>setDuracionCiclo(d)}>{d}</button>
              ))}
            </div>
            <p style={{color:D.text2,fontSize:'12px',margin:'0 0 16px'}}>28 días es el promedio más común.</p>
            <button style={{...e.btn,opacity:ultimaMenstruacion?1:0.4}} onClick={()=>ultimaMenstruacion&&setConfigurado(true)}>Ver mi fase de hoy</button>
          </div>
        )}

        {configurado&&resultado&&(<>
          <div style={{...e.faseCard,background:resultado.fase.g}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
              <div>
                <p style={{color:'rgba(255,255,255,0.7)',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',margin:'0 0 4px'}}>HOY ESTÁS EN</p>
                <p style={{color:'white',fontWeight:'bold',fontSize:'22px',margin:'0 0 4px'}}>{resultado.fase.emoji} {resultado.fase.nombre}</p>
                <p style={{color:'rgba(255,255,255,0.8)',fontSize:'13px',margin:0}}>{resultado.fase.energia}</p>
              </div>
              <div style={{display:'flex',gap:'8px'}}>
                {[{n:`Día ${resultado.diaDelCiclo}`,l:'de tu ciclo'},{n:`${diasRestantes()}`,l:'días más'},{n:proximaFase().emoji,l:'próxima'}].map((m,i)=>(
                  <div key={i} style={{backgroundColor:'rgba(255,255,255,0.15)',borderRadius:'12px',padding:'10px 12px',textAlign:'center'}}>
                    <p style={{color:'white',fontWeight:'bold',fontSize:'16px',margin:0}}>{m.n}</p>
                    <p style={{color:'rgba(255,255,255,0.7)',fontSize:'10px',margin:'3px 0 0',whiteSpace:'nowrap'}}>{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <p style={{color:'rgba(255,255,255,0.85)',fontSize:'14px',lineHeight:1.6,margin:'0 0 12px'}}>{resultado.fase.descripcion}</p>
          </div>

          <div style={e.tabs}>
            {[['hoy','Negocio'],['bienestar','Bienestar'],['ciclo','Mi ciclo']].map(([p,l])=>(
              <button key={p} style={{...e.tab,background:pestana===p?resultado.fase.g:'transparent',color:pestana===p?'white':D.text2,border:pestana===p?'none':`1px solid ${D.border}`}} onClick={()=>setPestana(p)}>{l}</button>
            ))}
          </div>

          {pestana==='hoy'&&(
            <div style={e.card}>
              <p style={e.sectionTitle}>Actividades ideales hoy</p>
              {resultado.fase.negocio.map((c,i)=>(
                <div key={i} style={e.item}>
                  <div style={{...e.itemIcon,backgroundColor:resultado.fase.colorD}}><span style={{fontSize:'20px'}}>{c.split(' ')[0]}</span></div>
                  <span style={{fontSize:'14px',color:D.text,flex:1}}>{c.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
              <div style={{...e.aviso,borderColor:resultado.fase.color,backgroundColor:resultado.fase.colorD}}>
                <p style={{color:resultado.fase.color,fontSize:'13px',fontWeight:'bold',margin:0}}>⚠️ {resultado.fase.evitar}</p>
              </div>
            </div>
          )}

          {pestana==='bienestar'&&(
            <div style={e.card}>
              <p style={e.sectionTitle}>Cuídate hoy así</p>
              {resultado.fase.bienestar.map((c,i)=>(
                <div key={i} style={e.item}>
                  <div style={{...e.itemIcon,backgroundColor:resultado.fase.colorD}}><span style={{fontSize:'20px'}}>{c.split(' ')[0]}</span></div>
                  <span style={{fontSize:'14px',color:D.text,flex:1}}>{c.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          )}

          {pestana==='ciclo'&&(
            <div style={e.card}>
              <p style={e.sectionTitle}>Tu ciclo de {duracionCiclo} días</p>
              {FASES.map(fase=>(
                <div key={fase.id} style={{...e.faseRow,background:resultado.fase.id===fase.id?fase.g:D.card2,border:resultado.fase.id===fase.id?'none':`1px solid ${D.border}`}}>
                  <span style={{fontSize:'22px'}}>{fase.emoji}</span>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:'bold',fontSize:'13px',margin:0,color:resultado.fase.id===fase.id?'white':fase.color}}>{fase.nombre}</p>
                    <p style={{fontSize:'11px',margin:'2px 0 0',color:'rgba(255,255,255,0.5)'}}>Días {fase.diasDesde}–{fase.diasHasta}</p>
                  </div>
                  {resultado.fase.id===fase.id&&<span style={{color:'white',fontSize:'11px',fontWeight:'bold',backgroundColor:'rgba(255,255,255,0.2)',padding:'3px 10px',borderRadius:'20px'}}>HOY</span>}
                </div>
              ))}
              <button style={e.btnSec} onClick={()=>setConfigurado(false)}>Actualizar mi fecha</button>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

const e = {
  page:{backgroundColor:D.bg,minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  header:{padding:'52px 20px 24px',display:'flex',alignItems:'center',gap:'14px'},
  back:{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'16px',flexShrink:0},
  headerSub:{color:'rgba(255,255,255,0.6)',fontSize:'11px',margin:0,letterSpacing:'1px',textTransform:'uppercase'},
  headerTitle:{color:'white',fontSize:'22px',margin:0,fontWeight:'bold'},
  headerEmoji:{fontSize:'36px',marginLeft:'auto'},
  body:{padding:'16px'},
  card:{background:D.card,borderRadius:'20px',padding:'18px',marginBottom:'12px',border:`1px solid ${D.border}`},
  label:{color:D.text2,fontSize:'12px',display:'block',marginTop:'12px',marginBottom:'4px'},
  input:{width:'100%',padding:'13px 16px',borderRadius:'14px',border:`1px solid ${D.border}`,fontSize:'14px',marginTop:'4px',boxSizing:'border-box',backgroundColor:D.card2,color:D.text},
  durBtn:{padding:'8px 14px',borderRadius:'10px',border:'1px solid',cursor:'pointer',fontSize:'14px',fontWeight:'bold'},
  btn:{width:'100%',padding:'14px',background:'linear-gradient(135deg,#7A5C8A,#C4A0D4)',color:'white',border:'none',borderRadius:'14px',fontSize:'15px',cursor:'pointer',fontWeight:'bold'},
  btnSec:{width:'100%',padding:'12px',borderRadius:'14px',border:`1px solid ${D.border}`,background:'transparent',color:D.text2,cursor:'pointer',fontSize:'13px',marginTop:'12px'},
  faseCard:{borderRadius:'20px',padding:'20px',marginBottom:'12px'},
  tabs:{display:'flex',gap:'8px',marginBottom:'12px'},
  tab:{flex:1,padding:'10px',borderRadius:'12px',cursor:'pointer',fontSize:'13px',textAlign:'center'},
  sectionTitle:{color:D.text,fontWeight:'bold',fontSize:'14px',margin:'0 0 14px'},
  item:{display:'flex',gap:'12px',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${D.border}`},
  itemIcon:{width:'40px',height:'40px',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0},
  aviso:{borderRadius:'12px',padding:'12px',border:'1px solid',marginTop:'14px'},
  faseRow:{display:'flex',alignItems:'center',gap:'12px',padding:'14px',borderRadius:'14px',marginBottom:'8px'},
};

export default Ciclo;
