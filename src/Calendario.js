import React, { useState, useEffect } from 'react';

const BG='#0D1117', CARD='#161B22', CARD2='#1C2333', BR='rgba(255,255,255,0.08)', TXT='#E6EDF3', TXT2='rgba(255,255,255,0.4)', VE='#4AA08A', YE='#E8BF6A', RE='#F47067';

const CATS = [
  { id:'cumpleanos', label:'Cumpleanos', ico:'🎂', color:'#C4A0D4' },
  { id:'pago',       label:'Servicios',  ico:'💡', color:'#E8BF6A' },
  { id:'tarjeta',    label:'Tarjetas',   ico:'💳', color:'#4AA08A' },
  { id:'escolar',    label:'Escolar',    ico:'🎒', color:'#7A9C5E' },
  { id:'salud',      label:'Salud',      ico:'🩺', color:'#4AA08A' },
  { id:'tramite',    label:'Tramites',   ico:'📋', color:'#7A8A9A' },
  { id:'auto',       label:'Auto',       ico:'🚗', color:'#7A9C5E' },
  { id:'fiscal',     label:'SAT',        ico:'🏛️', color:'#E8BF6A' },
  { id:'bienestar',  label:'Bienestar',  ico:'✨', color:'#C4A0D4' },
  { id:'belleza',    label:'Belleza',    ico:'💅', color:'#C4A0D4' },
];

const SUGERIDOS = [
  { titulo:'Papanicolau',             cat:'salud',    nota:'Revision anual',           rep:'anual'   },
  { titulo:'Mastografia',             cat:'salud',    nota:'A partir de los 40',       rep:'anual'   },
  { titulo:'Dentista',                cat:'salud',    nota:'Cada 6 meses',             rep:'ninguna' },
  { titulo:'Pago de celular',         cat:'pago',     nota:'',                         rep:'mensual' },
  { titulo:'Pago de tarjeta',         cat:'tarjeta',  nota:'Fecha limite de pago',     rep:'mensual' },
  { titulo:'Declaracion mensual SAT', cat:'fiscal',   nota:'Vence dia 17',             rep:'mensual' },
  { titulo:'Declaracion anual SAT',   cat:'fiscal',   nota:'Abril de cada anio',       rep:'anual'   },
  { titulo:'Verificacion vehicular',  cat:'auto',     nota:'Revisa tu engomado',       rep:'anual'   },
  { titulo:'Cita conmigo',            cat:'bienestar',nota:'Una hora solo para ti',    rep:'mensual' },
  { titulo:'Inscripcion escolar',     cat:'escolar',  nota:'Preinscripciones SEP',     rep:'anual'   },
  { titulo:'Unias',                   cat:'belleza',  nota:'',                         rep:'mensual' },
];

const MESES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESC=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DS=['D','L','M','X','J','V','S'];

function Calendario({ onVolver }) {
  const [evs, setEvs] = useState(()=>{ try{return JSON.parse(localStorage.getItem('una_eventos'))||[];}catch{return[];} });
  const [vista, setVista] = useState('agregar');
  const [form, setForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [cat, setCat] = useState('salud');
  const [nota, setNota] = useState('');
  const [rep, setRep] = useState('ninguna');
  const [editId, setEditId] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [diaSel, setDiaSel] = useState(null);
  const ahora = new Date();
  const [mesV, setMesV] = useState(ahora.getMonth());
  const [anioV, setAnioV] = useState(ahora.getFullYear());

  useEffect(()=>{ localStorage.setItem('una_eventos', JSON.stringify(evs)); }, [evs]);

  const hoy = ahora.toISOString().split('T')[0];

  const getRep = ev => ev.repeticion || (ev.repetirMensual?'mensual':ev.repetirAnual?'anual':'ninguna');

  const fechaEf = (ev, anioF) => {
    const r = getRep(ev);
    const [,emes,edia] = ev.fecha.split('-');
    const a = anioF || ahora.getFullYear();
    if (r==='mensual') {
      const m = String(ahora.getMonth()+1).padStart(2,'0');
      const f = `${a}-${m}-${edia}`;
      return f>=hoy ? f : `${a}-${String(ahora.getMonth()+2).padStart(2,'0')}-${edia}`;
    }
    if (r==='anual') {
      const f = `${a}-${emes}-${edia}`;
      return f>=hoy ? f : `${a+1}-${emes}-${edia}`;
    }
    return ev.fecha;
  };

  const fechaPorMes = (ev, mes, anio) => {
    const r = getRep(ev);
    const m = String(mes+1).padStart(2,'0');
    if (r==='mensual') return `${anio}-${m}-${ev.fecha.split('-')[2]}`;
    if (r==='anual') { const [,em,ed]=ev.fecha.split('-'); return em===m?`${anio}-${m}-${ed}`:null; }
    const [ea,em,ed]=ev.fecha.split('-');
    return (parseInt(ea)===anio && parseInt(em)-1===mes) ? ev.fecha : null;
  };

  const diasR = ev => {
    const d = Math.round((new Date(fechaEf(ev)+'T12:00:00')-new Date(hoy+'T12:00:00'))/86400000);
    if (getRep(ev)==='anual' && d<-30) return Math.round((new Date(fechaEf(ev,ahora.getFullYear()+1)+'T12:00:00')-new Date(hoy+'T12:00:00'))/86400000);
    return d;
  };

  const getCat = id => CATS.find(c=>c.id===id)||CATS[0];
  const etq = d => d===0?{t:'Hoy',c:'#C4A0D4'}:d===1?{t:'Manana',c:YE}:d<0?{t:'Vencido',c:TXT2}:{t:`${d}d`,c:VE};
  const repLabel = ev => { const r=getRep(ev); return r==='mensual'?'mensual':r==='anual'?'anual':''; };

  const guardar = () => {
    if (!titulo||!fecha) return;
    const ev = { id:editId||Date.now(), titulo, fecha, categoria:cat, nota, repeticion:rep, repetirAnual:rep==='anual', repetirMensual:rep==='mensual' };
    if (editId) { setEvs(evs.map(e=>e.id===editId?ev:e)); setEditId(null); }
    else setEvs([...evs, ev]);
    resetF();
  };
  const resetF = () => { setTitulo('');setFecha('');setNota('');setCat('salud');setRep('ninguna');setForm(false);setEditId(null); };
  const editar = ev => { setEditId(ev.id);setTitulo(ev.titulo);setFecha(ev.fecha);setCat(ev.categoria);setNota(ev.nota||'');setRep(getRep(ev));setForm(true);setVista('agregar'); };
  const usarSug = sg => { setTitulo(sg.titulo);setCat(sg.cat);setNota(sg.nota);setRep(sg.rep);setFecha('');setForm(true);setVista('agregar'); };

  const evsDia = (d,m,a) => evs.filter(ev => {
    const f = fechaPorMes(ev,m,a);
    return f===`${a}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  });

  const buildMes = (m,a) => {
    const p=new Date(a,m,1).getDay(), dias=new Date(a,m+1,0).getDate(), arr=[];
    for(let i=0;i<p;i++) arr.push(null);
    for(let d=1;d<=dias;d++) arr.push(d);
    return arr;
  };
  const celdas = buildMes(mesV, anioV);
  const mesAnt = () => { if(mesV===0){setMesV(11);setAnioV(anioV-1);}else setMesV(mesV-1); setDiaSel(null); };
  const mesSig = () => { if(mesV===11){setMesV(0);setAnioV(anioV+1);}else setMesV(mesV+1); setDiaSel(null); };

  const proximos = evs.filter(ev=>{const d=diasR(ev);return d>=0&&d<=7;}).sort((a,b)=>diasR(a)-diasR(b));
  const filtrados = evs.filter(ev=>filtro==='todos'||ev.categoria===filtro).sort((a,b)=>diasR(a)-diasR(b));
  const hoyD=ahora.getDate(), hoyM=ahora.getMonth(), hoyA=ahora.getFullYear();

  const inp = { width:'100%', padding:'14px 16px', borderRadius:16, border:`1px solid ${BR}`, fontSize:14, marginBottom:10, boxSizing:'border-box', background:CARD2, color:TXT };

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:'Arial,sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#1A1208,#3D2C10)', padding:'52px 20px 28px', display:'flex', alignItems:'center', gap:14 }}>
        <button style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'white', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:18, flexShrink:0 }} onClick={onVolver}>←</button>
        <div style={{flex:1}}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, margin:0, letterSpacing:2 }}>MODULO</p>
          <h2 style={{ color:'white', fontSize:24, margin:0, fontWeight:'bold' }}>Calendario Vital</h2>
        </div>
        <span style={{fontSize:42}}>📅</span>
      </div>

      <div style={{ padding:16 }}>
        {proximos.length>0 && (
          <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}`, borderLeft:`2px solid ${YE}` }}>
            <p style={{ color:YE, fontWeight:'bold', fontSize:14, margin:'0 0 12px' }}>Esta semana</p>
            {proximos.map(ev => { const ct=getCat(ev.categoria); const d=diasR(ev); return (
              <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0' }}>
                <span style={{fontSize:18}}>{ct.ico}</span>
                <span style={{color:TXT,fontSize:13,flex:1}}><strong>{ev.titulo}</strong> — {d===0?'hoy':d===1?'manana':`en ${d} dias`}</span>
              </div>
            ); })}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[['agregar','Agregar'],['lista','Lista'],['mes','Mes']].map(([v,l]) => (
            <button key={v} style={{ flex:1, padding:11, borderRadius:14, cursor:'pointer', fontSize:13, textAlign:'center', background:vista===v?'linear-gradient(135deg,#1A1208,#5A4010)':'transparent', color:vista===v?'white':TXT2, border:vista===v?'none':`1px solid ${BR}` }} onClick={()=>setVista(v)}>{l}</button>
          ))}
        </div>

        {/* VISTA MES */}
        {vista==='mes' && (
          <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <button style={{ background:CARD2, border:`1px solid ${BR}`, color:YE, padding:'8px 18px', borderRadius:12, cursor:'pointer', fontSize:20 }} onClick={mesAnt}>‹</button>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:16, margin:0 }}>{MESES[mesV]} {anioV}</p>
              <button style={{ background:CARD2, border:`1px solid ${BR}`, color:YE, padding:'8px 18px', borderRadius:12, cursor:'pointer', fontSize:20 }} onClick={mesSig}>›</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:8 }}>
              {DS.map(d => <p key={d} style={{ textAlign:'center', fontSize:11, color:TXT2, fontWeight:'bold', margin:0 }}>{d}</p>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
              {celdas.map((d,i) => {
                if (!d) return <div key={`v${i}`}/>;
                const eD=evsDia(d,mesV,anioV), esHoy=d===hoyD&&mesV===hoyM&&anioV===hoyA, esSel=d===diaSel;
                return (
                  <div key={d} style={{ borderRadius:12, padding:'4px 2px', minHeight:46, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', background:esSel?'linear-gradient(135deg,#1A1208,#5A4010)':esHoy?'#1A1208':'transparent', border:esHoy&&!esSel?`1px solid ${YE}`:'1px solid transparent' }} onClick={()=>setDiaSel(d===diaSel?null:d)}>
                    <p style={{ fontSize:13, fontWeight:'bold', margin:'2px 0', color:esSel?'white':esHoy?YE:TXT }}>{d}</p>
                    <div style={{ display:'flex', gap:2 }}>{eD.slice(0,3).map((ev,idx)=><span key={idx} style={{ width:5, height:5, borderRadius:'50%', background:getCat(ev.categoria).color }}/>)}</div>
                  </div>
                );
              })}
            </div>
            {diaSel && (
              <div style={{ marginTop:16, borderTop:`1px solid ${BR}`, paddingTop:16 }}>
                <p style={{ color:TXT, fontWeight:'bold', fontSize:14, marginBottom:10 }}>{diaSel} de {MESC[mesV]}</p>
                {evsDia(diaSel,mesV,anioV).length===0
                  ? <p style={{ color:TXT2, fontSize:13, textAlign:'center' }}>Sin eventos</p>
                  : evsDia(diaSel,mesV,anioV).map(ev => {
                      const ct=getCat(ev.categoria);
                      return (
                        <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:10, padding:12, borderRadius:14, marginBottom:8, background:CARD2 }}>
                          <span style={{fontSize:22}}>{ct.ico}</span>
                          <div style={{flex:1}}>
                            <p style={{fontSize:13,fontWeight:'bold',color:TXT,margin:0}}>{ev.titulo}</p>
                            {repLabel(ev)&&<p style={{fontSize:11,color:ct.color,margin:'2px 0 0'}}>{repLabel(ev)}</p>}
                          </div>
                          <button style={{ background:'none',border:'none',cursor:'pointer',color:YE,fontSize:15,padding:'4px 8px' }} onClick={()=>editar(ev)}>✏️</button>
                          <button style={{ background:'none',border:'none',cursor:'pointer',color:RE,fontSize:15,padding:'4px 8px' }} onClick={()=>setEvs(evs.filter(e=>e.id!==ev.id))}>✕</button>
                        </div>
                      );
                    })
                }
              </div>
            )}
          </div>
        )}

        {/* VISTA LISTA */}
        {vista==='lista' && <>
          <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
            <button style={{ padding:'8px 14px', borderRadius:20, cursor:'pointer', fontSize:12, background:filtro==='todos'?'linear-gradient(135deg,#1A1208,#5A4010)':'transparent', color:filtro==='todos'?'white':TXT2, border:filtro==='todos'?'none':`1px solid ${BR}` }} onClick={()=>setFiltro('todos')}>Todos</button>
            {CATS.map(ct => (
              <button key={ct.id} style={{ padding:'8px 14px', borderRadius:20, cursor:'pointer', fontSize:12, background:filtro===ct.id?ct.color+'22':'transparent', color:filtro===ct.id?ct.color:TXT2, border:`1px solid ${filtro===ct.id?ct.color:BR}` }} onClick={()=>setFiltro(ct.id)}>{ct.ico}</button>
            ))}
          </div>
          {filtrados.length===0 && <div style={{ textAlign:'center', padding:'40px 20px' }}><p style={{fontSize:40,margin:'0 0 10px'}}>📅</p><p style={{color:TXT2}}>Sin eventos aun</p></div>}
          {filtrados.map(ev => {
            const d=diasR(ev), ct=getCat(ev.categoria), et=etq(d);
            return (
              <div key={ev.id} style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}`, borderLeft:`2px solid ${ct.color}` }}>
                <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:ct.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{ct.ico}</div>
                  <div style={{flex:1}}>
                    <p style={{ fontWeight:'bold', fontSize:14, margin:'0 0 2px', color:TXT }}>{ev.titulo}</p>
                    <p style={{ fontSize:11, color:TXT2, margin:0 }}>
                      {new Date(fechaEf(ev)+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long'})}
                      {repLabel(ev)&&<span style={{color:ct.color}}> · {repLabel(ev)}</span>}
                    </p>
                    {ev.nota&&<p style={{fontSize:11,color:TXT2,margin:'3px 0 0'}}>{ev.nota}</p>}
                  </div>
                  <span style={{ fontSize:11, fontWeight:'bold', color:et.c, border:`1px solid ${et.c}44`, borderRadius:20, padding:'3px 10px', whiteSpace:'nowrap' }}>{et.t}</span>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ flex:1, padding:9, borderRadius:12, border:`1px solid ${YE}44`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:'bold', color:YE }} onClick={()=>editar(ev)}>Editar</button>
                  <button style={{ flex:1, padding:9, borderRadius:12, border:`1px solid ${RE}44`, background:'transparent', cursor:'pointer', fontSize:12, fontWeight:'bold', color:RE }} onClick={()=>setEvs(evs.filter(e=>e.id!==ev.id))}>Borrar</button>
                </div>
              </div>
            );
          })}
        </>}

        {/* VISTA AGREGAR */}
        {vista==='agregar' && <>
          {!form && <>
            <button style={{ width:'100%', padding:15, background:'linear-gradient(135deg,#1A1208,#5A4010)', color:'white', border:'none', borderRadius:16, fontSize:15, cursor:'pointer', fontWeight:'bold', marginBottom:12 }} onClick={()=>setForm(true)}>+ Agregar evento</button>
            <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>Agrega rapido</p>
              {CATS.filter(ct=>SUGERIDOS.some(sg=>sg.cat===ct.id)).map(ct => (
                <div key={ct.id} style={{ marginBottom:14 }}>
                  <p style={{ fontSize:12, fontWeight:'bold', margin:'0 0 8px', color:ct.color }}>{ct.ico} {ct.label}</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {SUGERIDOS.filter(sg=>sg.cat===ct.id).map((sg,i) => (
                      <button key={i} style={{ padding:'8px 16px', borderRadius:20, border:`1px solid ${ct.color}44`, background:'transparent', cursor:'pointer', fontSize:12, color:ct.color }} onClick={()=>usarSug(sg)}>{sg.titulo}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>}

          {form && (
            <div style={{ background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}` }}>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>{editId?'Editar evento':'Nuevo evento'}</p>
              <input style={inp} placeholder="Nombre del evento" value={titulo} onChange={e=>setTitulo(e.target.value)} />
              <label style={{ color:TXT2, fontSize:12, display:'block', marginBottom:8 }}>Categoria</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                {CATS.map(ct => (
                  <button key={ct.id} style={{ padding:'11px 10px', borderRadius:14, border:`1px solid ${cat===ct.id?ct.color:BR}`, background:cat===ct.id?ct.color+'18':'transparent', color:cat===ct.id?ct.color:TXT2, cursor:'pointer', fontSize:12, textAlign:'left' }} onClick={()=>setCat(ct.id)}>{ct.ico} {ct.label}</button>
                ))}
              </div>
              <label style={{ color:TXT2, fontSize:12, display:'block', marginBottom:4 }}>Fecha</label>
              <input style={inp} type="date" value={fecha} onChange={e=>setFecha(e.target.value)} />
              <input style={inp} placeholder="Nota opcional" value={nota} onChange={e=>setNota(e.target.value)} />
              <label style={{ color:TXT2, fontSize:12, display:'block', marginBottom:8 }}>Repeticion</label>
              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                {[['ninguna','Sin repetir'],['mensual','Cada mes'],['anual','Cada ano']].map(([v,l]) => (
                  <button key={v} style={{ flex:1, padding:'11px 6px', borderRadius:14, border:`1px solid ${rep===v?VE:BR}`, background:rep===v?'#0A1F15':'transparent', color:rep===v?VE:TXT2, cursor:'pointer', fontSize:12, fontWeight:rep===v?'bold':'normal' }} onClick={()=>setRep(v)}>{l}</button>
                ))}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button style={{ flex:1, padding:14, borderRadius:16, border:`1px solid ${BR}`, background:'transparent', color:TXT2, cursor:'pointer', fontSize:14 }} onClick={resetF}>Cancelar</button>
                <button style={{ flex:2, padding:14, borderRadius:16, border:'none', background:'linear-gradient(135deg,#1A1208,#5A4010)', color:'white', cursor:'pointer', fontSize:14, fontWeight:'bold' }} onClick={guardar}>{editId?'Guardar cambios':'Agregar'}</button>
              </div>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

export default Calendario;
