import React, { useState, useEffect } from 'react';

const D = { bg:'#0D1117', card:'#161B22', card2:'#1C2333', border:'rgba(255,255,255,0.08)', text:'#E6EDF3', text2:'rgba(255,255,255,0.5)', verde:'#4AA08A', verdeD:'#1A3D35', malva:'#C4A0D4', malvaD:'#2E1F3E', dorado:'#E8BF6A', doradoD:'#3A2A10', rojo:'#F47067' };

const CATEGORIAS = [
  { id:'cumpleanos', label:'Cumpleanos',  ico:'🎂', color:'#C4A0D4' },
  { id:'pago',       label:'Servicios',  ico:'💡', color:'#E8BF6A' },
  { id:'tarjeta',    label:'Tarjetas',   ico:'💳', color:'#4AA08A' },
  { id:'escolar',    label:'Escolar',    ico:'🎒', color:'#7A8C5E' },
  { id:'salud',      label:'Salud',      ico:'🩺', color:'#4AA08A' },
  { id:'tramite',    label:'Tramites',   ico:'📋', color:'#7A8A9A' },
  { id:'auto',       label:'Auto',       ico:'🚗', color:'#7A8C5E' },
  { id:'fiscal',     label:'SAT',        ico:'🏛️', color:'#E8BF6A' },
  { id:'bienestar',  label:'Bienestar',  ico:'✨', color:'#C4A0D4' },
  { id:'belleza',    label:'Belleza',    ico:'💅', color:'#C4A0D4' },
];

const SUGERIDOS = [
  { titulo:'Papanicolau',             categoria:'salud',    nota:'Revision anual',           repeticion:'anual'    },
  { titulo:'Mastografia',             categoria:'salud',    nota:'A partir de los 40',       repeticion:'anual'    },
  { titulo:'Dentista',                categoria:'salud',    nota:'Cada 6 meses',             repeticion:'ninguna'  },
  { titulo:'Pago de celular',         categoria:'pago',     nota:'',                         repeticion:'mensual'  },
  { titulo:'Pago de tarjeta',         categoria:'tarjeta',  nota:'Fecha limite de pago',     repeticion:'mensual'  },
  { titulo:'Declaracion mensual SAT', categoria:'fiscal',   nota:'Vence dia 17 de cada mes', repeticion:'mensual'  },
  { titulo:'Declaracion anual SAT',   categoria:'fiscal',   nota:'Abril de cada anio',       repeticion:'anual'    },
  { titulo:'Verificacion vehicular',  categoria:'auto',     nota:'Revisa tu engomado',       repeticion:'anual'    },
  { titulo:'Cita conmigo',            categoria:'bienestar',nota:'Una hora solo para ti',    repeticion:'mensual'  },
  { titulo:'Inscripcion escolar',     categoria:'escolar',  nota:'Preinscripciones SEP',     repeticion:'anual'    },
  { titulo:'Unias',                   categoria:'belleza',  nota:'',                         repeticion:'mensual'  },
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_C = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DSEM = ['D','L','M','X','J','V','S'];

function Calendario({ onVolver }) {
  const [eventos, setEventos] = useState(() => { const g=localStorage.getItem('una_eventos'); return g?JSON.parse(g):[]; });
  const [vista, setVista] = useState('agregar');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('salud');
  const [nota, setNota] = useState('');
  const [repeticion, setRepeticion] = useState('ninguna');
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const ahora = new Date();
  const [mesVista, setMesVista] = useState(ahora.getMonth());
  const [anioVista, setAnioVista] = useState(ahora.getFullYear());

  useEffect(() => { localStorage.setItem('una_eventos', JSON.stringify(eventos)); }, [eventos]);

  const hoy = ahora.toISOString().split('T')[0];

  const fechaEfectiva = (ev, anioForzado, mesForzado) => {
    const anio = anioForzado || ahora.getFullYear();
    if (ev.repetirMensual || ev.repeticion === 'mensual') {
      const dia = ev.fecha.split('-')[2];
      const mes = String((mesForzado !== undefined ? mesForzado : ahora.getMonth()) + 1).padStart(2,'0');
      return `${anio}-${mes}-${dia}`;
    }
    if (ev.repetirAnual || ev.repeticion === 'anual') {
      const [,mes,dia] = ev.fecha.split('-');
      const esteA = `${anio}-${mes}-${dia}`;
      return esteA >= hoy ? esteA : `${anio+1}-${mes}-${dia}`;
    }
    return ev.fecha;
  };

  const fechaParaMes = (ev, mes, anio) => {
    const m = String(mes+1).padStart(2,'0');
    if (ev.repetirMensual || ev.repeticion === 'mensual') {
      const dia = ev.fecha.split('-')[2];
      return `${anio}-${m}-${dia}`;
    }
    if (ev.repetirAnual || ev.repeticion === 'anual') {
      const [,em,dia] = ev.fecha.split('-');
      return em === m ? `${anio}-${m}-${dia}` : null;
    }
    const [ea,em,ed] = ev.fecha.split('-');
    return (parseInt(ea)===anio && parseInt(em)-1===mes) ? ev.fecha : null;
  };

  const diasRestantes = (ev) => {
    const fe = new Date(fechaEfectiva(ev)+'T12:00:00');
    const diff = Math.round((fe - new Date(hoy+'T12:00:00'))/(1000*60*60*24));
    if ((ev.repetirAnual || ev.repeticion==='anual') && diff < -30) {
      const fn = new Date(fechaEfectiva(ev, ahora.getFullYear()+1)+'T12:00:00');
      return Math.round((fn - new Date(hoy+'T12:00:00'))/(1000*60*60*24));
    }
    return diff;
  };

  const getCat = (id) => CATEGORIAS.find(c=>c.id===id) || CATEGORIAS[0];
  const getRep = (ev) => ev.repeticion==='mensual'||ev.repetirMensual ? 'mensual' : ev.repeticion==='anual'||ev.repetirAnual ? 'anual' : 'ninguna';

  const guardar = () => {
    if(!titulo||!fecha) return;
    const ev = { id:editandoId||Date.now(), titulo, fecha, categoria, nota, repeticion, repetirAnual:repeticion==='anual', repetirMensual:repeticion==='mensual', creadoEl:hoy };
    if(editandoId){ setEventos(eventos.map(e=>e.id===editandoId?ev:e)); setEditandoId(null); }
    else setEventos([...eventos, ev]);
    resetFormulario();
  };

  const reset = () => { setTitulo('');setFecha('');setNota('');setCategoria('salud');setRepeticion('ninguna');setMostrarForm(false);setEditandoId(null); };
  const resetFormulario = reset;
  const eliminar = (id) => setEventos(eventos.filter(ev=>ev.id!==id));
  const editar = (ev) => { setEditandoId(ev.id);setTitulo(ev.titulo);setFecha(ev.fecha);setCategoria(ev.categoria);setNota(ev.nota||'');setRepeticion(getRep(ev));setMostrarForm(true);setVista('agregar'); };
  const usarSugerido = (s) => { setTitulo(s.titulo);setCategoria(s.categoria);setNota(s.nota);setRepeticion(s.repeticion);setFecha('');setMostrarForm(true);setVista('agregar'); };

  const eventosDelDia = (dia,mes,anio) => eventos.filter(ev => {
    const f = fechaParaMes(ev,mes,anio);
    return f === `${anio}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  });

  const construirMes = (mes,anio) => {
    const primer=new Date(anio,mes,1).getDay(), dias=new Date(anio,mes+1,0).getDate(), arr=[];
    for(let i=0;i<primer;i++) arr.push(null);
    for(let d=1;d<=dias;d++) arr.push(d);
    return arr;
  };

  const celdas = construirMes(mesVista, anioVista);
  const mesAnt = () => { if(mesVista===0){setMesVista(11);setAnioVista(anioVista-1);}else setMesVista(mesVista-1); setDiaSeleccionado(null); };
  const mesSig = () => { if(mesVista===11){setMesVista(0);setAnioVista(anioVista+1);}else setMesVista(mesVista+1); setDiaSeleccionado(null); };

  const proximos = eventos.filter(ev=>{const d=diasRestantes(ev);return d>=0&&d<=7;}).sort((a,b)=>diasRestantes(a)-diasRestantes(b));
  const eventosFiltrados = eventos.filter(ev=>filtro==='todos'||ev.categoria===filtro).sort((a,b)=>diasRestantes(a)-diasRestantes(b));
  const hoyD=ahora.getDate(), hoyM=ahora.getMonth(), hoyA=ahora.getFullYear();

  const etiqueta = (dias) => dias===0?{t:'Hoy',c:D.malva}:dias===1?{t:'Mañana',c:D.dorado}:dias<0?{t:'Vencido',c:D.text2}:{t:`${dias}d`,c:D.verde};

  const repLabel = (ev) => { const r=getRep(ev); return r==='mensual'?'↻ mensual':r==='anual'?'↻ anual':''; };

  return (
    <div style={e.page}>
      <div style={e.header}>
        <button style={e.back} onClick={onVolver}>←</button>
        <div><p style={e.headerSub}>Módulo</p><h2 style={e.headerTitle}>Calendario Vital</h2></div>
        <span style={e.headerEmoji}>📅</span>
      </div>

      <div style={e.body}>
        {proximos.length>0 && (
          <div style={{...e.card,borderLeft:`2px solid ${D.dorado}`}}>
            <p style={{...e.sectionTitle,color:D.dorado}}>Esta semana</p>
            {proximos.map(ev=>{const cat=getCat(ev.categoria);const d=diasRestantes(ev);return(
              <div key={ev.id} style={e.alertItem}>
                <span style={{fontSize:'18px'}}>{cat.ico}</span>
                <span style={{color:D.text,fontSize:'13px',flex:1}}><strong>{ev.titulo}</strong> — {d===0?'hoy':d===1?'mañana':`en ${d} días`}</span>
              </div>
            );})}
          </div>
        )}

        <div style={e.tabs}>
          {[['agregar','Agregar'],['lista','Lista'],['mes','Mes']].map(([v,l])=>(
            <button key={v} style={{...e.tab,background:vista===v?'linear-gradient(135deg,#3A2A10,#C4973A)':'transparent',color:vista===v?'white':D.text2,border:vista===v?'none':`1px solid ${D.border}`}} onClick={()=>setVista(v)}>{l}</button>
          ))}
        </div>

        {/* MES */}
        {vista==='mes' && (
          <div style={e.card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <button style={e.navBtn} onClick={mesAnt}>‹</button>
              <p style={{color:D.text,fontWeight:'bold',fontSize:'16px',margin:0}}>{MESES[mesVista]} {anioVista}</p>
              <button style={e.navBtn} onClick={mesSig}>›</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',marginBottom:'8px'}}>
              {DSEM.map(d=><p key={d} style={{textAlign:'center',fontSize:'11px',color:D.text2,fontWeight:'bold',margin:0}}>{d}</p>)}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px'}}>
              {celdas.map((dia,i)=>{
                if(!dia) return <div key={`v-${i}`}/>;
                const evsDia=eventosDelDia(dia,mesVista,anioVista);
                const esHoy=dia===hoyD&&mesVista===hoyM&&anioVista===hoyA;
                const esSel=dia===diaSeleccionado;
                return (
                  <div key={dia} style={{borderRadius:'10px',padding:'4px 2px',minHeight:'44px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',background:esSel?'linear-gradient(135deg,#3A2A10,#C4973A)':esHoy?D.doradoD:'transparent',border:esHoy&&!esSel?`1px solid ${D.dorado}`:'1px solid transparent'}} onClick={()=>setDiaSeleccionado(dia===diaSeleccionado?null:dia)}>
                    <p style={{fontSize:'13px',fontWeight:'bold',margin:'2px 0',color:esSel?'white':esHoy?D.dorado:D.text}}>{dia}</p>
                    <div style={{display:'flex',gap:'2px'}}>{evsDia.slice(0,3).map((ev,idx)=><span key={idx} style={{width:'5px',height:'5px',borderRadius:'50%',backgroundColor:getCat(ev.categoria).color}}/>)}</div>
                  </div>
                );
              })}
            </div>
            {diaSeleccionado && (
              <div style={{marginTop:'16px',borderTop:`1px solid ${D.border}`,paddingTop:'16px'}}>
                <p style={{color:D.text,fontWeight:'bold',fontSize:'14px',marginBottom:'10px'}}>{diaSeleccionado} de {MESES_C[mesVista]}</p>
                {eventosDelDia(diaSeleccionado,mesVista,anioVista).length===0
                  ? <p style={{color:D.text2,fontSize:'13px',textAlign:'center'}}>Sin eventos</p>
                  : eventosDelDia(diaSeleccionado,mesVista,anioVista).map(ev=>{
                      const cat=getCat(ev.categoria);
                      return (
                        <div key={ev.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px',borderRadius:'12px',marginBottom:'8px',background:D.card2}}>
                          <span style={{fontSize:'20px'}}>{cat.ico}</span>
                          <div style={{flex:1}}>
                            <p style={{fontSize:'13px',fontWeight:'bold',color:D.text,margin:0}}>{ev.titulo}</p>
                            {repLabel(ev)&&<p style={{fontSize:'11px',color:cat.color,margin:'2px 0 0'}}>{repLabel(ev)}</p>}
                          </div>
                          <button style={e.iconBtn} onClick={()=>editar(ev)}>✏️</button>
                          <button style={e.iconBtn} onClick={()=>eliminar(ev.id)}>✕</button>
                        </div>
                      );
                    })
                }
              </div>
            )}
          </div>
        )}

        {/* LISTA */}
        {vista==='lista' && (<>
          <div style={{display:'flex',gap:'6px',marginBottom:'14px',flexWrap:'wrap'}}>
            <button style={{...e.filterBtn,background:filtro==='todos'?'linear-gradient(135deg,#3A2A10,#C4973A)':'transparent',color:filtro==='todos'?'white':D.text2,border:filtro==='todos'?'none':`1px solid ${D.border}`}} onClick={()=>setFiltro('todos')}>Todos</button>
            {CATEGORIAS.map(cat=>(
              <button key={cat.id} style={{...e.filterBtn,background:filtro===cat.id?cat.color+'33':'transparent',color:filtro===cat.id?cat.color:D.text2,borderColor:filtro===cat.id?cat.color:D.border}} onClick={()=>setFiltro(cat.id)}>{cat.ico}</button>
            ))}
          </div>
          {eventosFiltrados.length===0&&<div style={e.empty}><p style={{fontSize:'40px',margin:'0 0 10px'}}>📅</p><p style={{color:D.text2}}>No hay eventos</p></div>}
          {eventosFiltrados.map(ev=>{
            const dias=diasRestantes(ev),cat=getCat(ev.categoria),et=etiqueta(dias);
            return (
              <div key={ev.id} style={{...e.card,borderLeft:`2px solid ${cat.color}`}}>
                <div style={{display:'flex',gap:'12px',alignItems:'center',marginBottom:'10px'}}>
                  <div style={{width:'42px',height:'42px',borderRadius:'12px',background:cat.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>{cat.ico}</div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:'bold',fontSize:'14px',margin:'0 0 2px',color:D.text}}>{ev.titulo}</p>
                    <p style={{fontSize:'11px',color:D.text2,margin:0}}>{new Date(fechaEfectiva(ev)+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long'})}{repLabel(ev)&&<span style={{color:cat.color}}> · {repLabel(ev)}</span>}</p>
                    {ev.nota&&<p style={{fontSize:'11px',color:D.text2,margin:'2px 0 0'}}>{ev.nota}</p>}
                  </div>
                  <span style={{fontSize:'12px',fontWeight:'bold',color:et.c,border:`1px solid ${et.c}55`,borderRadius:'20px',padding:'3px 10px',whiteSpace:'nowrap'}}>{et.t}</span>
                </div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button style={{...e.actionBtn,borderColor:D.dorado+'55',color:D.dorado}} onClick={()=>editar(ev)}>Editar</button>
                  <button style={{...e.actionBtn,borderColor:D.rojo+'55',color:D.rojo}} onClick={()=>eliminar(ev.id)}>Borrar</button>
                </div>
              </div>
            );
          })}
        </>)}

        {/* AGREGAR */}
        {vista==='agregar' && (<>
          {!mostrarForm && (<>
            <button style={e.btn} onClick={()=>setMostrarForm(true)}>+ Agregar evento</button>
            <div style={e.card}>
              <p style={e.sectionTitle}>Agrega rapido</p>
              {CATEGORIAS.filter(cat=>SUGERIDOS.some(s=>s.categoria===cat.id)).map(cat=>(
                <div key={cat.id} style={{marginBottom:'14px'}}>
                  <p style={{fontSize:'12px',fontWeight:'bold',margin:'0 0 8px',color:cat.color}}>{cat.ico} {cat.label}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {SUGERIDOS.filter(s=>s.categoria===cat.id).map((s,i)=>(
                      <button key={i} style={{padding:'7px 14px',borderRadius:'20px',border:`1px solid ${cat.color}44`,background:'transparent',cursor:'pointer',fontSize:'12px',color:cat.color}} onClick={()=>usarSugerido(s)}>{s.titulo}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {mostrarForm && (
            <div style={e.card}>
              <p style={e.sectionTitle}>{editandoId?'Editar evento':'Nuevo evento'}</p>
              <input style={e.input} placeholder="Nombre del evento" value={titulo} onChange={ev=>setTitulo(ev.target.value)}/>
              <label style={e.label}>Categoria</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',margin:'8px 0 14px'}}>
                {CATEGORIAS.map(cat=>(
                  <button key={cat.id} style={{padding:'10px',borderRadius:'12px',border:`1px solid ${categoria===cat.id?cat.color:D.border}`,background:categoria===cat.id?cat.color+'22':'transparent',color:categoria===cat.id?cat.color:D.text2,cursor:'pointer',fontSize:'12px',textAlign:'left'}} onClick={()=>setCategoria(cat.id)}>{cat.ico} {cat.label}</button>
                ))}
              </div>
              <label style={e.label}>Fecha</label>
              <input style={e.input} type="date" value={fecha} onChange={ev=>setFecha(ev.target.value)}/>
              <input style={e.input} placeholder="Nota opcional" value={nota} onChange={ev=>setNota(ev.target.value)}/>
              <label style={e.label}>Repeticion</label>
              <div style={{display:'flex',gap:'8px',margin:'8px 0 16px'}}>
                {[['ninguna','Sin repetir'],['mensual','Cada mes'],['anual','Cada año']].map(([v,l])=>(
                  <button key={v} style={{flex:1,padding:'10px',borderRadius:'12px',border:`1px solid ${repeticion===v?D.verde:D.border}`,background:repeticion===v?D.verdeD:'transparent',color:repeticion===v?D.verde:D.text2,cursor:'pointer',fontSize:'12px',fontWeight:repeticion===v?'bold':'normal'}} onClick={()=>setRepeticion(v)}>{l}</button>
                ))}
              </div>
              <div style={{display:'flex',gap:'10px'}}>
                <button style={e.btnSec} onClick={reset}>Cancelar</button>
                <button style={e.btn} onClick={guardar}>{editandoId?'Guardar cambios':'Agregar'}</button>
              </div>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

const e = {
  page:{backgroundColor:D.bg,minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  header:{background:'linear-gradient(135deg,#3A2A10,#C4973A)',padding:'52px 20px 24px',display:'flex',alignItems:'center',gap:'14px'},
  back:{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'16px',flexShrink:0},
  headerSub:{color:'rgba(255,255,255,0.6)',fontSize:'11px',margin:0,letterSpacing:'1px',textTransform:'uppercase'},
  headerTitle:{color:'white',fontSize:'22px',margin:0,fontWeight:'bold'},
  headerEmoji:{fontSize:'36px',marginLeft:'auto'},
  body:{padding:'16px'},
  card:{background:D.card,borderRadius:'20px',padding:'18px',marginBottom:'12px',border:`1px solid ${D.border}`},
  sectionTitle:{color:D.text,fontWeight:'bold',fontSize:'14px',margin:'0 0 14px'},
  tabs:{display:'flex',gap:'8px',marginBottom:'14px'},
  tab:{flex:1,padding:'10px',borderRadius:'12px',cursor:'pointer',fontSize:'13px',textAlign:'center'},
  navBtn:{background:D.card2,border:`1px solid ${D.border}`,color:D.dorado,padding:'8px 16px',borderRadius:'10px',cursor:'pointer',fontSize:'18px'},
  filterBtn:{padding:'8px 12px',borderRadius:'20px',cursor:'pointer',fontSize:'13px',border:'1px solid'},
  alertItem:{display:'flex',alignItems:'center',gap:'10px',padding:'6px 0'},
  label:{color:D.text2,fontSize:'12px',display:'block',marginTop:'10px',marginBottom:'4px'},
  input:{width:'100%',padding:'13px 16px',borderRadius:'14px',border:`1px solid ${D.border}`,fontSize:'14px',marginTop:'4px',boxSizing:'border-box',backgroundColor:D.card2,color:D.text},
  btn:{width:'100%',padding:'14px',background:'linear-gradient(135deg,#3A2A10,#C4973A)',color:'white',border:'none',borderRadius:'14px',fontSize:'15px',cursor:'pointer',fontWeight:'bold',marginBottom:'12px'},
  btnSec:{flex:1,padding:'13px',borderRadius:'14px',border:`1px solid ${D.border}`,background:'transparent',color:D.text2,cursor:'pointer',fontSize:'14px'},
  empty:{textAlign:'center',padding:'40px 20px'},
  actionBtn:{flex:1,padding:'9px',borderRadius:'10px',border:'1px solid',background:'transparent',cursor:'pointer',fontSize:'12px',fontWeight:'bold'},
  iconBtn:{background:'none',border:'none',cursor:'pointer',color:D.text2,fontSize:'14px',padding:'4px 8px'},
};

export default Calendario;
