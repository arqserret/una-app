import React, { useState, useEffect } from 'react';
import Finanzas from './Finanzas';
import Clientes from './Clientes';
import Calendario from './Calendario';
import Ciclo from './Ciclo';
import Cotizar from './Cotizar';
import Onboarding from './Onboarding';
import logo from './logo.png';

const FRASES = [
  "Hoy es un buen día para avanzar. 🌿","Tu negocio es tuyo — lo estás construyendo cada día. 💚",
  "Pequeños pasos constantes llegan lejos. 🌺","Eres emprendedora, mamá, mujer. Eso requiere fuerza enorme. ✨",
  "No tienes que hacerlo todo hoy. Solo lo más importante. 🍃","Cada clienta satisfecha es una victoria. 🌸",
  "Tu energía es tu recurso más valioso. Cuídala. 🌙","Lo que construyes hoy, te sostiene mañana. 💛",
  "Eres más fuerte de lo que crees. 🌺","El orden en tu negocio es orden en tu vida. 🌿",
  "Confía en el proceso. Todo llega a su tiempo. ✨","Hoy puedes ser un poco mejor que ayer. 💚",
];

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const MODULOS = [
  { id:'finanzas',   emoji:'💰', label:'Mis Finanzas',        desc:'Hogar y negocio',           g:'linear-gradient(135deg,#2D6E5E,#4AA08A)', s:'rgba(45,110,94,0.35)'   },
  { id:'clientes',   emoji:'👩‍👧', label:'Mis Clientes',        desc:'Cartera y citas',           g:'linear-gradient(135deg,#9B7BAE,#C4A0D4)', s:'rgba(155,123,174,0.35)' },
  { id:'calendario', emoji:'📅', label:'Calendario Vital',     desc:'Fechas importantes',        g:'linear-gradient(135deg,#C4973A,#E8BF6A)', s:'rgba(196,151,58,0.35)'  },
  { id:'ciclo',      emoji:'🌙', label:'Ciclo',                desc:'Productividad y bienestar', g:'linear-gradient(135deg,#7A5C8A,#B48EC4)', s:'rgba(122,92,138,0.35)'  },
  { id:'cotizar',    emoji:'💼', label:'Cotizar',              desc:'Envía por WhatsApp o PDF',  g:'linear-gradient(135deg,#3A7D6E,#5AADA0)', s:'rgba(58,125,110,0.35)'  },
];

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [mostrarOnboarding, setMostrarOnboarding] = useState(() => !localStorage.getItem('una_onboarding_visto'));
  const [eventos, setEventos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const evs = localStorage.getItem('una_eventos');
    const cls = localStorage.getItem('una_clientes');
    if (evs) setEventos(JSON.parse(evs));
    if (cls) setClientes(JSON.parse(cls));
  }, [pantalla]);

  const terminarOnboarding = () => { localStorage.setItem('una_onboarding_visto','si'); setMostrarOnboarding(false); };
  if (mostrarOnboarding) return <div style={{maxWidth:'480px',margin:'0 auto'}}><Onboarding onTerminar={terminarOnboarding}/></div>;

  const ahora = new Date();
  const hoy   = ahora.toISOString().split('T')[0];
  const frase = FRASES[ahora.getDate() % FRASES.length];

  const fechaEfectiva = (ev) => {
    if (!ev.repetirAnual && !ev.repetirMensual) return ev.fecha;
    if (ev.repetirMensual) {
      const [,,dia] = ev.fecha.split('-');
      const mes = String(ahora.getMonth()+1).padStart(2,'0');
      const anio = ahora.getFullYear();
      const esteM = `${anio}-${mes}-${dia}`;
      return esteM >= hoy ? esteM : `${anio}-${String(ahora.getMonth()+2).padStart(2,'0')}-${dia}`;
    }
    const [,mes,dia] = ev.fecha.split('-');
    const esteA = `${ahora.getFullYear()}-${mes}-${dia}`;
    return esteA >= hoy ? esteA : `${ahora.getFullYear()+1}-${mes}-${dia}`;
  };

  const diasRestantes = (ev) => {
    const fe = new Date(fechaEfectiva(ev)+'T12:00:00');
    return Math.round((fe - new Date(hoy+'T12:00:00'))/(1000*60*60*24));
  };

  const proximosEventos = eventos.filter(ev=>{const d=diasRestantes(ev);return d>=0&&d<=30;}).sort((a,b)=>diasRestantes(a)-diasRestantes(b)).slice(0,4);
  const citasHoy = clientes.filter(c=>c.proximaCita===hoy);
  const citasProximas = clientes.filter(c=>{if(!c.proximaCita)return false;const d=Math.round((new Date(c.proximaCita+'T12:00:00')-new Date(hoy+'T12:00:00'))/(1000*60*60*24));return d>0&&d<=7;});
  const hayPendientes = proximosEventos.length>0||citasHoy.length>0||citasProximas.length>0;

  return (
    <div style={es.pagina}>
      <div style={es.contenedor}>
        {pantalla==='inicio' && <>
          {/* SPLASH superior con logo */}
          <div style={es.splash}>
            <img src={logo} alt="UNA" style={es.logoImg}/>
            <div style={es.fraseBox}><p style={es.fraseTexto}>{frase}</p></div>
            <div style={es.fechaPill}>
              <span style={es.fechaTexto}>{DIAS[ahora.getDay()]} {ahora.getDate()} {MESES[ahora.getMonth()]}</span>
            </div>
          </div>

          <div style={es.cuerpo}>
            {/* Pendientes */}
            {hayPendientes && (
              <div style={es.seccion}>
                <p style={es.seccionLabel}>⏰ Próximamente</p>
                <div style={es.scroll}>
                  {citasHoy.map(c=>(
                    <div key={c.id} style={{...es.pendCard,background:'linear-gradient(135deg,#9B7BAE,#C4A0D4)'}} onClick={()=>setPantalla('clientes')}>
                      <span style={es.pendEmoji}>👩‍👧</span><p style={es.pendNom}>{c.nombre}</p><span style={es.pendDia}>¡Hoy!</span>
                    </div>
                  ))}
                  {citasProximas.map(c=>{
                    const d=Math.round((new Date(c.proximaCita+'T12:00:00')-new Date(hoy+'T12:00:00'))/(1000*60*60*24));
                    return <div key={c.id} style={{...es.pendCard,background:'linear-gradient(135deg,#7A5C8A,#9B7BAE)'}} onClick={()=>setPantalla('clientes')}>
                      <span style={es.pendEmoji}>👩‍👧</span><p style={es.pendNom}>{c.nombre}</p><span style={es.pendDia}>{d===1?'Mañana':`${d}d`}</span>
                    </div>;
                  })}
                  {proximosEventos.map(ev=>{
                    const d=diasRestantes(ev);
                    return <div key={ev.id} style={{...es.pendCard,background:'linear-gradient(135deg,#C4973A,#E8BF6A)'}} onClick={()=>setPantalla('calendario')}>
                      <span style={es.pendEmoji}>📅</span><p style={es.pendNom}>{ev.titulo}</p><span style={es.pendDia}>{d===0?'¡Hoy!':d===1?'Mañana':`${d}d`}</span>
                    </div>;
                  })}
                </div>
              </div>
            )}

            {/* Módulos */}
            <div style={es.seccion}>
              <p style={es.seccionLabel}>Módulos</p>
              <div style={es.grid}>
                {MODULOS.map(m=>(
                  <button key={m.id} style={{...es.modCard,background:m.g,boxShadow:`0 8px 28px ${m.s}`}} onClick={()=>setPantalla(m.id)}>
                    <span style={es.modEmoji}>{m.emoji}</span>
                    <p style={es.modLabel}>{m.label}</p>
                    <p style={es.modDesc}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button style={es.botonTutorial} onClick={()=>setMostrarOnboarding(true)}>📖 Ver tutorial de nuevo</button>
            <p style={es.footer}>🌿 UNA · vida y empresa</p>
          </div>
        </>}

        {pantalla==='finanzas'   && <Finanzas   onVolver={()=>setPantalla('inicio')}/>}
        {pantalla==='clientes'   && <Clientes   onVolver={()=>setPantalla('inicio')}/>}
        {pantalla==='calendario' && <Calendario onVolver={()=>setPantalla('inicio')}/>}
        {pantalla==='ciclo'      && <Ciclo      onVolver={()=>setPantalla('inicio')}/>}
        {pantalla==='cotizar'    && <Cotizar    onVolver={()=>setPantalla('inicio')}/>}
      </div>
    </div>
  );
}

const es = {
  pagina:{ backgroundColor:'#0F1923', minHeight:'100vh' },
  contenedor:{ fontFamily:'Arial,sans-serif', maxWidth:'480px', margin:'0 auto', backgroundColor:'#0F1923', minHeight:'100vh' },
  splash:{ background:'linear-gradient(160deg,#0F1923 0%,#1A3A30 40%,#2D6E5E 100%)', padding:'56px 28px 36px', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px', borderBottomLeftRadius:'36px', borderBottomRightRadius:'36px' },
  logoImg:{ width:'200px', objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.95 },
  fraseBox:{ backgroundColor:'rgba(255,255,255,0.1)', borderRadius:'16px', padding:'12px 20px', width:'100%', boxSizing:'border-box' },
  fraseTexto:{ color:'rgba(255,255,255,0.85)', fontSize:'14px', margin:0, lineHeight:1.5, fontStyle:'italic', textAlign:'center' },
  fechaPill:{ backgroundColor:'rgba(255,255,255,0.15)', borderRadius:'20px', padding:'6px 18px' },
  fechaTexto:{ color:'rgba(255,255,255,0.8)', fontSize:'13px', fontWeight:'bold', letterSpacing:'0.5px' },
  cuerpo:{ padding:'20px 20px 0' },
  seccion:{ marginBottom:'20px' },
  seccionLabel:{ fontSize:'11px', fontWeight:'bold', color:'rgba(255,255,255,0.4)', letterSpacing:'2px', textTransform:'uppercase', margin:'0 0 12px' },
  scroll:{ display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'8px' },
  pendCard:{ flexShrink:0, borderRadius:'18px', padding:'16px', minWidth:'130px', cursor:'pointer', display:'flex', flexDirection:'column', gap:'6px', boxShadow:'0 4px 16px rgba(0,0,0,0.25)' },
  pendEmoji:{ fontSize:'24px' },
  pendNom:{ color:'white', fontSize:'13px', fontWeight:'bold', margin:0, lineHeight:1.3 },
  pendDia:{ color:'rgba(255,255,255,0.8)', fontSize:'12px', fontWeight:'bold' },
  grid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  modCard:{ border:'none', borderRadius:'24px', padding:'22px 18px', cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:'8px', minHeight:'140px' },
  modEmoji:{ fontSize:'34px', lineHeight:1 },
  modLabel:{ color:'white', fontWeight:'bold', fontSize:'15px', margin:0 },
  modDesc:{ color:'rgba(255,255,255,0.7)', fontSize:'12px', margin:0, lineHeight:1.4 },
  botonTutorial:{ display:'block', width:'100%', padding:'14px', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'14px', textAlign:'center', marginBottom:'16px' },
  footer:{ textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:'12px', marginBottom:'28px', letterSpacing:'1px' },
};

export default App;
