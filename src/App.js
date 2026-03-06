import React, { useState, useEffect } from 'react';
import Finanzas from './Finanzas';
import Clientes from './Clientes';
import Calendario from './Calendario';
import Ciclo from './Ciclo';
import Cotizar from './Cotizar';
import Onboarding from './Onboarding';
import logo from './logo.png';

const FRASES = [
  "Hoy es un buen dia para avanzar.",
  "Tu negocio es tuyo, lo estas construyendo cada dia.",
  "Pequenos pasos constantes llegan lejos.",
  "No tienes que hacerlo todo hoy. Solo lo mas importante.",
  "Cada clienta satisfecha es una victoria.",
  "Tu energia es tu recurso mas valioso. Cuidala.",
  "Lo que construyes hoy te sostiene manana.",
  "Eres mas fuerte de lo que crees.",
  "El orden en tu negocio es orden en tu vida.",
  "Confia en el proceso. Todo llega a su tiempo.",
  "Hoy puedes ser un poco mejor que ayer.",
  "Eres emprendedora, mama, mujer. Eso requiere fuerza enorme.",
];

const DIAS = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const MODS = [
  { id:'finanzas',   emoji:'💰', label:'Mis Finanzas',    desc:'Hogar y negocio',     color:'#4AA08A', bg:'linear-gradient(145deg,#0A1F15,#163028)', border:'rgba(74,160,138,0.2)'  },
  { id:'clientes',   emoji:'👩‍👧', label:'Mis Clientes',    desc:'Cartera y citas',     color:'#C4A0D4', bg:'linear-gradient(145deg,#160D22,#281840)', border:'rgba(196,160,212,0.2)' },
  { id:'calendario', emoji:'📅', label:'Calendario',       desc:'Fechas importantes',  color:'#E8BF6A', bg:'linear-gradient(145deg,#1A1208,#302008)', border:'rgba(232,191,106,0.2)' },
  { id:'ciclo',      emoji:'🌙', label:'Ciclo',            desc:'Productividad',        color:'#B48EC4', bg:'linear-gradient(145deg,#120920,#221030)', border:'rgba(180,142,196,0.2)' },
  { id:'cotizar',    emoji:'💼', label:'Cotizar',          desc:'WhatsApp y PDF',       color:'#5AADA0', bg:'linear-gradient(145deg,#061410,#0E2820)', border:'rgba(90,173,160,0.2)'  },
];

function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [onboarding, setOnboarding] = useState(() => !localStorage.getItem('una_onboarding_visto'));
  const [eventos, setEventos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    try {
      const e = localStorage.getItem('una_eventos');
      const c = localStorage.getItem('una_clientes');
      if (e) setEventos(JSON.parse(e));
      if (c) setClientes(JSON.parse(c));
    } catch(err) {}
  }, [pantalla]);

  if (onboarding) return (
    <div style={{ maxWidth:480, margin:'0 auto' }}>
      <Onboarding onTerminar={() => { localStorage.setItem('una_onboarding_visto','si'); setOnboarding(false); }} />
    </div>
  );

  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0];
  const frase = FRASES[ahora.getDate() % FRASES.length];

  const fechaEf = (ev) => {
    const partes = ev.fecha.split('-');
    const mes = partes[1], dia = partes[2];
    const rep = ev.repeticion || (ev.repetirMensual ? 'mensual' : ev.repetirAnual ? 'anual' : 'ninguna');
    if (rep === 'mensual') {
      const m = String(ahora.getMonth()+1).padStart(2,'0');
      const f = `${ahora.getFullYear()}-${m}-${dia}`;
      return f >= hoy ? f : `${ahora.getFullYear()}-${String(ahora.getMonth()+2).padStart(2,'0')}-${dia}`;
    }
    if (rep === 'anual') {
      const f = `${ahora.getFullYear()}-${mes}-${dia}`;
      return f >= hoy ? f : `${ahora.getFullYear()+1}-${mes}-${dia}`;
    }
    return ev.fecha;
  };

  const diasR = (ev) => Math.round((new Date(fechaEf(ev)+'T12:00:00') - new Date(hoy+'T12:00:00')) / 86400000);

  const proxEvs = eventos.filter(ev => { const d=diasR(ev); return d>=0&&d<=30; }).sort((a,b)=>diasR(a)-diasR(b)).slice(0,5);
  const citasHoy = clientes.filter(c => c.proximaCita===hoy);
  const citasPrx = clientes.filter(c => {
    if (!c.proximaCita) return false;
    const d = Math.round((new Date(c.proximaCita+'T12:00:00')-new Date(hoy+'T12:00:00'))/86400000);
    return d>0&&d<=7;
  });
  const hayPend = proxEvs.length>0 || citasHoy.length>0 || citasPrx.length>0;

  return (
    <div style={{ backgroundColor:'#0D1117', minHeight:'100vh' }}>
      <div style={{ maxWidth:480, margin:'0 auto', backgroundColor:'#0D1117', minHeight:'100vh', fontFamily:'Arial,sans-serif' }}>
        {pantalla === 'inicio' && <>
          {/* LOGO — ocupa la mitad de la pantalla */}
          <div style={{ height:'50vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:22, padding:'0 32px' }}>
            <img src={logo} alt="UNA" style={{ width:'85%', maxWidth:340, filter:'brightness(0) invert(1)' }} />
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13, margin:0, textAlign:'center', fontStyle:'italic', lineHeight:1.5 }}>{frase}</p>
            <div style={{ backgroundColor:'rgba(255,255,255,0.06)', borderRadius:20, padding:'7px 20px', border:'1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:12, letterSpacing:1 }}>{DIAS[ahora.getDay()]}  {ahora.getDate()} {MESES[ahora.getMonth()]}</span>
            </div>
          </div>

          <div style={{ padding:'0 16px 32px' }}>
            {/* Proximas fechas */}
            {hayPend && (
              <div style={{ marginBottom:24 }}>
                <p style={{ fontSize:10, fontWeight:'bold', color:'rgba(255,255,255,0.25)', letterSpacing:3, margin:'0 0 12px 2px' }}>PROXIMAS FECHAS</p>
                <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:8 }}>
                  {citasHoy.map(c => (
                    <div key={c.id} style={{ flexShrink:0, borderRadius:20, padding:'16px 18px', minWidth:145, cursor:'pointer', display:'flex', flexDirection:'column', gap:8, background:'linear-gradient(145deg,#160D22,#281840)', border:'1px solid rgba(196,160,212,0.2)' }} onClick={()=>setPantalla('clientes')}>
                      <span style={{fontSize:26}}>👩‍👧</span>
                      <p style={{ color:'white', fontSize:13, fontWeight:'bold', margin:0, lineHeight:1.3 }}>{c.nombre}</p>
                      <span style={{ color:'#C4A0D4', fontSize:12, fontWeight:'bold' }}>Hoy</span>
                    </div>
                  ))}
                  {citasPrx.map(c => {
                    const d = Math.round((new Date(c.proximaCita+'T12:00:00')-new Date(hoy+'T12:00:00'))/86400000);
                    return (
                      <div key={c.id} style={{ flexShrink:0, borderRadius:20, padding:'16px 18px', minWidth:145, cursor:'pointer', display:'flex', flexDirection:'column', gap:8, background:'linear-gradient(145deg,#160D22,#281840)', border:'1px solid rgba(196,160,212,0.2)' }} onClick={()=>setPantalla('clientes')}>
                        <span style={{fontSize:26}}>👩‍👧</span>
                        <p style={{ color:'white', fontSize:13, fontWeight:'bold', margin:0, lineHeight:1.3 }}>{c.nombre}</p>
                        <span style={{ color:'#C4A0D4', fontSize:12, fontWeight:'bold' }}>{d===1?'Manana':`${d}d`}</span>
                      </div>
                    );
                  })}
                  {proxEvs.map(ev => {
                    const d = diasR(ev);
                    return (
                      <div key={ev.id} style={{ flexShrink:0, borderRadius:20, padding:'16px 18px', minWidth:145, cursor:'pointer', display:'flex', flexDirection:'column', gap:8, background:'linear-gradient(145deg,#1A1208,#302008)', border:'1px solid rgba(232,191,106,0.2)' }} onClick={()=>setPantalla('calendario')}>
                        <span style={{fontSize:26}}>📅</span>
                        <p style={{ color:'white', fontSize:13, fontWeight:'bold', margin:0, lineHeight:1.3 }}>{ev.titulo}</p>
                        <span style={{ color:'#E8BF6A', fontSize:12, fontWeight:'bold' }}>{d===0?'Hoy':d===1?'Manana':`${d}d`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modulos */}
            <div style={{ marginBottom:24 }}>
              <p style={{ fontSize:10, fontWeight:'bold', color:'rgba(255,255,255,0.25)', letterSpacing:3, margin:'0 0 12px 2px' }}>MODULOS</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {MODS.map(m => (
                  <button key={m.id} style={{ background:m.bg, border:`1px solid ${m.border}`, borderRadius:24, padding:'22px 18px', cursor:'pointer', textAlign:'left', display:'flex', flexDirection:'column', gap:10, minHeight:160 }} onClick={()=>setPantalla(m.id)}>
                    <span style={{fontSize:32,lineHeight:1}}>{m.emoji}</span>
                    <p style={{ fontWeight:'bold', fontSize:15, margin:0, color:m.color }}>{m.label}</p>
                    <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, margin:0, lineHeight:1.4 }}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button style={{ display:'block', width:'100%', padding:13, borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', color:'rgba(255,255,255,0.2)', cursor:'pointer', fontSize:13, textAlign:'center', marginBottom:16 }} onClick={()=>setOnboarding(true)}>Ver tutorial de nuevo</button>
            <p style={{ textAlign:'center', color:'rgba(255,255,255,0.1)', fontSize:10, letterSpacing:3, margin:0 }}>UNA · VIDA Y EMPRESA</p>
          </div>
        </>}

        {pantalla==='finanzas'   && <Finanzas   onVolver={()=>setPantalla('inicio')} />}
        {pantalla==='clientes'   && <Clientes   onVolver={()=>setPantalla('inicio')} />}
        {pantalla==='calendario' && <Calendario onVolver={()=>setPantalla('inicio')} />}
        {pantalla==='ciclo'      && <Ciclo      onVolver={()=>setPantalla('inicio')} />}
        {pantalla==='cotizar'    && <Cotizar    onVolver={()=>setPantalla('inicio')} />}
      </div>
    </div>
  );
}

export default App;
