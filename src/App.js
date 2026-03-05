import React, { useState, useEffect } from 'react';
import Finanzas from './Finanzas';
import Clientes from './Clientes';
import Calendario from './Calendario';
import Ciclo from './Ciclo';
import Cotizar from './Cotizar';
import Onboarding from './Onboarding';
import logo from './logo.png';

const FRASES = [
  "Hoy es un buen dia para avanzar.","Tu negocio es tuyo — lo estas construyendo cada dia.",
  "Pequenos pasos constantes llegan lejos.","Eres emprendedora, mama, mujer. Eso requiere fuerza enorme.",
  "No tienes que hacerlo todo hoy. Solo lo mas importante.","Cada clienta satisfecha es una victoria.",
  "Tu energia es tu recurso mas valioso. Cuidala.","Lo que construyes hoy, te sostiene manana.",
  "Eres mas fuerte de lo que crees.","El orden en tu negocio es orden en tu vida.",
  "Confia en el proceso. Todo llega a su tiempo.","Hoy puedes ser un poco mejor que ayer.",
];

const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DIAS  = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];

const MODULOS = [
  { id:'finanzas',   emoji:'💰', label:'Mis Finanzas',     desc:'Hogar y negocio',      color:'#4AA08A', g:'linear-gradient(135deg,#0D2018,#1A3D35)', b:'#4AA08A33' },
  { id:'clientes',   emoji:'👩‍👧', label:'Mis Clientes',     desc:'Cartera y citas',      color:'#C4A0D4', g:'linear-gradient(135deg,#1A0E25,#2E1F3E)', b:'#C4A0D433' },
  { id:'calendario', emoji:'📅', label:'Calendario Vital',  desc:'Fechas importantes',   color:'#E8BF6A', g:'linear-gradient(135deg,#1E1508,#3A2A10)', b:'#E8BF6A33' },
  { id:'ciclo',      emoji:'🌙', label:'Ciclo',             desc:'Productividad',         color:'#B48EC4', g:'linear-gradient(135deg,#150B20,#251530)', b:'#B48EC433' },
  { id:'cotizar',    emoji:'💼', label:'Cotizar',           desc:'WhatsApp y PDF',        color:'#5AADA0', g:'linear-gradient(135deg,#061512,#0E2E2A)', b:'#5AADA033' },
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
    if (ev.repetirMensual || ev.repeticion==='mensual') {
      const dia = ev.fecha.split('-')[2];
      const mes = String(ahora.getMonth()+1).padStart(2,'0');
      const esteM = `${ahora.getFullYear()}-${mes}-${dia}`;
      return esteM >= hoy ? esteM : `${ahora.getFullYear()}-${String(ahora.getMonth()+2).padStart(2,'0')}-${dia}`;
    }
    if (ev.repetirAnual || ev.repeticion==='anual') {
      const [,mes,dia] = ev.fecha.split('-');
      const esteA = `${ahora.getFullYear()}-${mes}-${dia}`;
      return esteA >= hoy ? esteA : `${ahora.getFullYear()+1}-${mes}-${dia}`;
    }
    return ev.fecha;
  };

  const diasRestantes = (ev) => Math.round((new Date(fechaEfectiva(ev)+'T12:00:00') - new Date(hoy+'T12:00:00'))/(1000*60*60*24));

  const proximosEventos = eventos.filter(ev=>{const d=diasRestantes(ev);return d>=0&&d<=30;}).sort((a,b)=>diasRestantes(a)-diasRestantes(b)).slice(0,4);
  const citasHoy = clientes.filter(c=>c.proximaCita===hoy);
  const citasProximas = clientes.filter(c=>{if(!c.proximaCita)return false;const d=Math.round((new Date(c.proximaCita+'T12:00:00')-new Date(hoy+'T12:00:00'))/(1000*60*60*24));return d>0&&d<=7;});
  const hayPendientes = proximosEventos.length>0||citasHoy.length>0||citasProximas.length>0;

  return (
    <div style={es.pagina}>
      <div style={es.contenedor}>
        {pantalla==='inicio' && <>
          {/* LOGO — mitad de pantalla */}
          <div style={es.logoSection}>
            <img src={logo} alt="UNA" style={es.logoImg}/>
            <p style={es.frase}>{frase}</p>
            <div style={es.fechaPill}>
              <span style={es.fechaTexto}>{DIAS[ahora.getDay()]}  {ahora.getDate()} {MESES[ahora.getMonth()]}</span>
            </div>
          </div>

          <div style={es.cuerpo}>
            {hayPendientes && (
              <div style={es.seccion}>
                <p style={es.label}>PROXIMAS FECHAS</p>
                <div style={es.scroll}>
                  {citasHoy.map(c=>(
                    <div key={c.id} style={{...es.chip,background:'linear-gradient(135deg,#1A0E25,#2E1F3E)',borderColor:'#C4A0D433'}} onClick={()=>setPantalla('clientes')}>
                      <span>👩‍👧</span><p style={es.chipNom}>{c.nombre}</p><span style={{...es.chipDia,color:'#C4A0D4'}}>Hoy</span>
                    </div>
                  ))}
                  {citasProximas.map(c=>{
                    const d=Math.round((new Date(c.proximaCita+'T12:00:00')-new Date(hoy+'T12:00:00'))/(1000*60*60*24));
                    return <div key={c.id} style={{...es.chip,background:'linear-gradient(135deg,#1A0E25,#2E1F3E)',borderColor:'#C4A0D433'}} onClick={()=>setPantalla('clientes')}>
                      <span>👩‍👧</span><p style={es.chipNom}>{c.nombre}</p><span style={{...es.chipDia,color:'#C4A0D4'}}>{d===1?'Manana':`${d}d`}</span>
                    </div>;
                  })}
                  {proximosEventos.map(ev=>{
                    const d=diasRestantes(ev);
                    return <div key={ev.id} style={{...es.chip,background:'linear-gradient(135deg,#1E1508,#3A2A10)',borderColor:'#E8BF6A33'}} onClick={()=>setPantalla('calendario')}>
                      <span>📅</span><p style={es.chipNom}>{ev.titulo}</p><span style={{...es.chipDia,color:'#E8BF6A'}}>{d===0?'Hoy':d===1?'Manana':`${d}d`}</span>
                    </div>;
                  })}
                </div>
              </div>
            )}

            <div style={es.seccion}>
              <p style={es.label}>MODULOS</p>
              <div style={es.grid}>
                {MODULOS.map(m=>(
                  <button key={m.id} style={{...es.modCard,background:m.g,borderColor:m.b}} onClick={()=>setPantalla(m.id)}>
                    <span style={es.modEmoji}>{m.emoji}</span>
                    <p style={{...es.modLabel,color:m.color}}>{m.label}</p>
                    <p style={es.modDesc}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button style={es.btnTutorial} onClick={()=>setMostrarOnboarding(true)}>Ver tutorial de nuevo</button>
            <p style={es.footer}>UNA · VIDA Y EMPRESA</p>
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
  pagina:{ backgroundColor:'#0D1117', minHeight:'100vh' },
  contenedor:{ fontFamily:'Arial,sans-serif', maxWidth:'480px', margin:'0 auto', backgroundColor:'#0D1117', minHeight:'100vh' },

  logoSection:{ height:'50vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', padding:'0 24px' },
  logoImg:{ width:'85%', maxWidth:'340px', objectFit:'contain', filter:'brightness(0) invert(1)', opacity:0.95 },
  frase:{ color:'rgba(255,255,255,0.35)', fontSize:'13px', margin:0, lineHeight:1.5, textAlign:'center', fontStyle:'italic', maxWidth:'280px' },
  fechaPill:{ backgroundColor:'rgba(255,255,255,0.06)', borderRadius:'20px', padding:'7px 18px', border:'1px solid rgba(255,255,255,0.08)' },
  fechaTexto:{ color:'rgba(255,255,255,0.45)', fontSize:'12px', letterSpacing:'1px' },

  cuerpo:{ padding:'0 16px' },
  seccion:{ marginBottom:'24px' },
  label:{ fontSize:'10px', fontWeight:'bold', color:'rgba(255,255,255,0.25)', letterSpacing:'3px', margin:'0 0 12px 2px' },

  scroll:{ display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'8px' },
  chip:{ flexShrink:0, borderRadius:'18px', padding:'14px 16px', minWidth:'130px', cursor:'pointer', display:'flex', flexDirection:'column', gap:'6px', border:'1px solid' },
  chipNom:{ color:'white', fontSize:'13px', fontWeight:'bold', margin:0, lineHeight:1.3 },
  chipDia:{ fontSize:'12px', fontWeight:'bold' },

  grid:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
  modCard:{ border:'1px solid', borderRadius:'22px', padding:'20px 16px', cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:'8px', minHeight:'145px' },
  modEmoji:{ fontSize:'30px', lineHeight:1 },
  modLabel:{ fontWeight:'bold', fontSize:'14px', margin:0 },
  modDesc:{ color:'rgba(255,255,255,0.3)', fontSize:'12px', margin:0 },

  btnTutorial:{ display:'block', width:'100%', padding:'13px', borderRadius:'14px', border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'rgba(255,255,255,0.2)', cursor:'pointer', fontSize:'13px', textAlign:'center', marginBottom:'16px' },
  footer:{ textAlign:'center', color:'rgba(255,255,255,0.1)', fontSize:'10px', marginBottom:'28px', letterSpacing:'3px' },
};

export default App;
