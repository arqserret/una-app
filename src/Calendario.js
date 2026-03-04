import React, { useState, useEffect } from 'react';

const P = { verde:'#2D6E5E', verdet:'#E8F2EF', malva:'#9B7BAE', malvat:'#F3EEF7', dorado:'#C4973A', doradot:'#FBF5E6', gris:'#8A8A8A', grisOs:'#2D2D2D' };

const CATEGORIAS = [
  { id:'cumpleanos', label:'🎂 Cumpleaños',  color:P.malva  },
  { id:'pago',       label:'💡 Servicios',   color:P.dorado },
  { id:'tarjeta',    label:'💳 Tarjetas',    color:P.verde  },
  { id:'escolar',    label:'🎒 Escolar',     color:'#7A8C5E'},
  { id:'salud',      label:'🩺 Salud',       color:P.verde  },
  { id:'tramite',    label:'📋 Trámites',    color:P.gris   },
  { id:'auto',       label:'🚗 Auto',        color:'#7A8C5E'},
  { id:'fiscal',     label:'🏛️ Fiscal/SAT', color:P.dorado },
  { id:'bienestar',  label:'🌸 Bienestar',   color:P.malva  },
  { id:'belleza',    label:'💅 Belleza',     color:P.malva  },
];

const SUGERIDOS = [
  { titulo:'Papanicolau',              categoria:'salud',    nota:'Revisión anual recomendada',       repetirAnual:true  },
  { titulo:'Mastografía',              categoria:'salud',    nota:'A partir de los 40, cada año',     repetirAnual:true  },
  { titulo:'Dentista',                 categoria:'salud',    nota:'Revisión cada 6 meses',            repetirAnual:false },
  { titulo:'Pago de luz',              categoria:'pago',     nota:'Bimestral CFE',                    repetirAnual:false },
  { titulo:'Pago de agua',             categoria:'pago',     nota:'Bimestral',                        repetirAnual:false },
  { titulo:'Pago de celular',          categoria:'pago',     nota:'',                                 repetirAnual:false },
  { titulo:'Pago de tarjeta',          categoria:'tarjeta',  nota:'Revisa fecha límite de pago',      repetirAnual:false },
  { titulo:'Inscripción escolar',      categoria:'escolar',  nota:'Preinscripciones SEP',             repetirAnual:true  },
  { titulo:'Declaración mensual SAT',  categoria:'fiscal',   nota:'Vence el día 17 de cada mes',      repetirAnual:false },
  { titulo:'Declaración anual SAT',    categoria:'fiscal',   nota:'Abril de cada año',                repetirAnual:true  },
  { titulo:'Verificación vehicular',   categoria:'auto',     nota:'Revisa el color de tu engomado',   repetirAnual:true  },
  { titulo:'Cita conmigo ☕',          categoria:'bienestar',nota:'Una hora a la semana solo para ti',repetirAnual:false },
  { titulo:'Corte y tinte',            categoria:'belleza',  nota:'',                                 repetirAnual:false },
  { titulo:'Uñas',                     categoria:'belleza',  nota:'',                                 repetirAnual:false },
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DIAS_SEMANA = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

function Calendario({ onVolver }) {
  const [eventos, setEventos] = useState(() => { const g=localStorage.getItem('una_eventos'); return g?JSON.parse(g):[]; });
  const [vista, setVista] = useState('agregar');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('cumpleanos');
  const [nota, setNota] = useState('');
  const [repetirAnual, setRepetirAnual] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const ahora = new Date();
  const [mesVista, setMesVista] = useState(ahora.getMonth());
  const [anioVista, setAnioVista] = useState(ahora.getFullYear());

  useEffect(() => { localStorage.setItem('una_eventos', JSON.stringify(eventos)); }, [eventos]);

  const hoy = ahora.toISOString().split('T')[0];

  const fechaEfectiva = (ev, anio) => {
    const a = anio||ahora.getFullYear();
    if(!ev.repetirAnual) return ev.fecha;
    const [,mes,dia] = ev.fecha.split('-');
    return `${a}-${mes}-${dia}`;
  };

  const diasRestantes = (ev) => {
    const fe = new Date(fechaEfectiva(ev)+'T12:00:00');
    const diff = Math.round((fe-new Date(hoy+'T12:00:00'))/(1000*60*60*24));
    if(ev.repetirAnual&&diff<-30){ const fn=new Date(fechaEfectiva(ev,ahora.getFullYear()+1)+'T12:00:00'); return Math.round((fn-new Date(hoy+'T12:00:00'))/(1000*60*60*24)); }
    return diff;
  };

  const getCat = (id) => CATEGORIAS.find(c=>c.id===id);

  const formatFecha = (fs) => {
    const [a,m,d] = fs.split('-');
    return `${d} de ${MESES[parseInt(m)-1]}${a!==String(ahora.getFullYear())?` ${a}`:''}`;
  };

  const guardar = () => {
    if(!titulo||!fecha) return;
    if(editandoId){ setEventos(eventos.map(ev=>ev.id===editandoId?{...ev,titulo,fecha,categoria,nota,repetirAnual}:ev)); setEditandoId(null); }
    else setEventos([...eventos,{id:Date.now(),titulo,fecha,categoria,nota,repetirAnual,creadoEl:hoy}]);
    resetFormulario();
  };

  const resetFormulario = () => { setTitulo('');setFecha('');setNota('');setCategoria('cumpleanos');setRepetirAnual(false);setMostrarForm(false);setEditandoId(null); };
  const eliminar = (id) => setEventos(eventos.filter(ev=>ev.id!==id));
  const editar = (ev) => { setEditandoId(ev.id);setTitulo(ev.titulo);setFecha(ev.fecha);setCategoria(ev.categoria);setNota(ev.nota);setRepetirAnual(ev.repetirAnual);setMostrarForm(true);setVista('agregar'); };
  const usarSugerido = (s) => { setTitulo(s.titulo);setCategoria(s.categoria);setNota(s.nota);setRepetirAnual(s.repetirAnual);setFecha('');setMostrarForm(true);setVista('agregar'); };

  const eventosDelDia = (dia,mes,anio) => {
    const ds=String(dia).padStart(2,'0'), ms=String(mes+1).padStart(2,'0');
    return eventos.filter(ev=>fechaEfectiva(ev,anio)===`${anio}-${ms}-${ds}`);
  };

  const construirMes = (mes,anio) => {
    const primer=new Date(anio,mes,1).getDay(), dias=new Date(anio,mes+1,0).getDate(), celdas=[];
    for(let i=0;i<primer;i++)celdas.push(null);
    for(let d=1;d<=dias;d++)celdas.push(d);
    return celdas;
  };

  const celdas = construirMes(mesVista,anioVista);
  const mesAnt = () => { if(mesVista===0){setMesVista(11);setAnioVista(anioVista-1);}else setMesVista(mesVista-1); setDiaSeleccionado(null); };
  const mesSig = () => { if(mesVista===11){setMesVista(0);setAnioVista(anioVista+1);}else setMesVista(mesVista+1); setDiaSeleccionado(null); };

  const proximos = eventos.filter(ev=>{const d=diasRestantes(ev);return d>=0&&d<=7;}).sort((a,b)=>diasRestantes(a)-diasRestantes(b));
  const eventosFiltrados = eventos.filter(ev=>filtro==='todos'||ev.categoria===filtro).sort((a,b)=>diasRestantes(a)-diasRestantes(b));
  const hoyD=ahora.getDate(), hoyM=ahora.getMonth(), hoyA=ahora.getFullYear();

  const etiqueta = (dias) => {
    if(dias===0) return {texto:'¡Hoy!',color:P.malva};
    if(dias===1) return {texto:'Mañana',color:P.dorado};
    if(dias<0)  return {texto:'Vencido',color:P.gris};
    if(dias<=7) return {texto:`En ${dias}d`,color:P.dorado};
    return           {texto:`En ${dias}d`,color:P.verde};
  };

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>📅 Calendario Vital</h2>
      </div>

      <div style={{padding:'16px 20px 0'}}>
        {proximos.length>0 && (
          <div style={e.alertaBox}>
            <p style={e.alertaTitulo}>⏰ Esta semana</p>
            {proximos.map(ev=>{const cat=getCat(ev.categoria); const d=diasRestantes(ev); return <p key={ev.id} style={e.alertaItem}>{cat.label.split(' ')[0]} <strong>{ev.titulo}</strong> — {d===0?'¡Hoy!':d===1?'mañana':`en ${d} días`}</p>;})}
          </div>
        )}

        <div style={e.selectorVista}>
          {[['agregar','➕ Agregar'],['lista','📋 Lista'],['mes','📆 Mes']].map(([v,l])=>(
            <button key={v} style={vista===v?{...e.vistaBton,background:'linear-gradient(135deg,#C4973A,#E8BF6A)',color:'white',border:'none',fontWeight:'bold'}:e.vistaBton} onClick={()=>setVista(v)}>{l}</button>
          ))}
        </div>

        {/* ── MES ── */}
        {vista==='mes' && (
          <div style={e.mesBox}>
            <div style={e.mesNav}>
              <button style={e.mesNavBtn} onClick={mesAnt}>‹</button>
              <p style={e.mesNombre}>{MESES[mesVista]} {anioVista}</p>
              <button style={e.mesNavBtn} onClick={mesSig}>›</button>
            </div>
            <div style={e.semanaGrid}>{DIAS_SEMANA.map(d=><p key={d} style={e.diaSemana}>{d}</p>)}</div>
            <div style={e.diasGrid}>
              {celdas.map((dia,i)=>{
                if(!dia) return <div key={`v-${i}`}/>;
                const evsDia=eventosDelDia(dia,mesVista,anioVista);
                const esHoy=dia===hoyD&&mesVista===hoyM&&anioVista===hoyA;
                const esSel=dia===diaSeleccionado;
                return (
                  <div key={dia} style={{ ...e.diaCell, background:esSel?'linear-gradient(135deg,#C4973A,#E8BF6A)':esHoy?P.doradot:'white', border:esHoy&&!esSel?`2px solid ${P.dorado}`:'1px solid #F0EBE3' }} onClick={()=>setDiaSeleccionado(dia===diaSeleccionado?null:dia)}>
                    <p style={{ ...e.diaNum, color:esSel?'white':esHoy?P.dorado:P.grisOs }}>{dia}</p>
                    <div style={e.puntosBox}>{evsDia.slice(0,3).map((ev,idx)=><span key={idx} style={{ ...e.punto, backgroundColor:getCat(ev.categoria).color }}/>)}</div>
                  </div>
                );
              })}
            </div>
            {diaSeleccionado && (
              <div style={e.diaDetalleBox}>
                <p style={e.diaDetalleTitulo}>{diaSeleccionado} de {MESES_CORTOS[mesVista]}</p>
                {eventosDelDia(diaSeleccionado,mesVista,anioVista).length===0
                  ? <p style={{color:P.gris,fontSize:'13px',textAlign:'center',padding:'10px 0'}}>Sin eventos este día</p>
                  : eventosDelDia(diaSeleccionado,mesVista,anioVista).map(ev=>{
                      const cat=getCat(ev.categoria);
                      return (
                        <div key={ev.id} style={{ ...e.eventoDetalle, borderLeft:`3px solid ${cat.color}` }}>
                          <div style={{flex:1}}>
                            <p style={{fontSize:'13px',fontWeight:'bold',color:P.grisOs,margin:0}}>{cat.label.split(' ')[0]} {ev.titulo}</p>
                            {ev.nota&&<p style={{fontSize:'12px',color:P.gris,margin:'2px 0 0'}}>{ev.nota}</p>}
                          </div>
                          <button style={{...e.botonAcc,backgroundColor:P.doradot,color:P.dorado}} onClick={()=>editar(ev)}>✏️</button>
                          <button style={{...e.botonAcc,backgroundColor:P.malvat,color:P.malva}} onClick={()=>eliminar(ev.id)}>🗑️</button>
                        </div>
                      );
                    })
                }
              </div>
            )}
          </div>
        )}

        {/* ── LISTA ── */}
        {vista==='lista' && (<>
          <div style={e.filtros}>
            <button style={filtro==='todos'?{...e.filtro,background:'linear-gradient(135deg,#C4973A,#E8BF6A)',color:'white',border:'none'}:e.filtro} onClick={()=>setFiltro('todos')}>Todos</button>
            {CATEGORIAS.map(cat=>(
              <button key={cat.id} style={filtro===cat.id?{...e.filtro,backgroundColor:cat.color,color:'white',border:'none'}:e.filtro} onClick={()=>setFiltro(cat.id)}>{cat.label.split(' ')[0]}</button>
            ))}
          </div>
          {eventosFiltrados.length===0&&<div style={e.vacio}><p style={{fontSize:'40px',margin:0}}>📅</p><p>No hay eventos aquí todavía</p></div>}
          {eventosFiltrados.map(ev=>{
            const dias=diasRestantes(ev), cat=getCat(ev.categoria), et=etiqueta(dias);
            return (
              <div key={ev.id} style={{ ...e.tarjeta, borderLeft:`4px solid ${cat.color}` }}>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}>
                  <div style={{...e.catIcono,backgroundColor:cat.color+'22'}}><span style={{fontSize:'20px'}}>{cat.label.split(' ')[0]}</span></div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:'bold',fontSize:'14px',margin:'0 0 2px',color:P.grisOs}}>{ev.titulo}</p>
                    <p style={{fontSize:'12px',color:P.gris,margin:'0 0 2px'}}>{formatFecha(fechaEfectiva(ev))}{ev.repetirAnual&&<span style={{fontSize:'11px',color:P.malva}}> 🔁 anual</span>}</p>
                    {ev.nota&&<p style={{fontSize:'12px',color:'#B0A898',margin:0}}>💬 {ev.nota}</p>}
                  </div>
                  <span style={{...e.badge,color:et.color,borderColor:et.color}}>{et.texto}</span>
                </div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button style={{...e.botonAcc,backgroundColor:P.doradot,color:P.dorado,flex:1}} onClick={()=>editar(ev)}>✏️ Editar</button>
                  <button style={{...e.botonAcc,backgroundColor:P.malvat,color:P.malva,flex:1}} onClick={()=>eliminar(ev.id)}>🗑️ Borrar</button>
                </div>
              </div>
            );
          })}
        </>)}

        {/* ── AGREGAR ── */}
        {vista==='agregar' && (<>
          {!mostrarForm && (<>
            <button style={e.botonNuevo} onClick={()=>setMostrarForm(true)}>+ Agregar evento personalizado</button>
            <div style={e.sugeridosBox}>
              <p style={e.sugeridosTitulo}>✨ Agrega rápido — toca cualquiera</p>
              {CATEGORIAS.filter(cat=>SUGERIDOS.some(s=>s.categoria===cat.id)).map(cat=>(
                <div key={cat.id} style={{marginBottom:'14px'}}>
                  <p style={{fontSize:'12px',fontWeight:'bold',margin:'0 0 8px',color:cat.color}}>{cat.label}</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                    {SUGERIDOS.filter(s=>s.categoria===cat.id).map((s,i)=>(
                      <button key={i} style={{padding:'8px 16px',borderRadius:'20px',border:`1.5px solid ${cat.color}55`,background:'white',cursor:'pointer',fontSize:'12px',color:cat.color,fontWeight:'bold'}} onClick={()=>usarSugerido(s)}>{s.titulo}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {mostrarForm && (
            <div style={e.formulario}>
              <p style={e.formTitulo}>{editandoId?'✏️ Editar evento':'➕ Nuevo evento'}</p>
              <input style={e.input} placeholder="¿Qué es? (ej: Cumpleaños de mamá)" value={titulo} onChange={ev=>setTitulo(ev.target.value)} />
              <label style={e.labelInput}>Categoría</label>
              <div style={e.categGrid}>
                {CATEGORIAS.map(cat=>(
                  <button key={cat.id} style={{padding:'10px',borderRadius:'10px',border:`2px solid ${categoria===cat.id?cat.color:'#EAE7E0'}`,backgroundColor:categoria===cat.id?cat.color+'22':'white',color:categoria===cat.id?cat.color:P.gris,cursor:'pointer',fontSize:'11px',fontWeight:'bold'}} onClick={()=>setCategoria(cat.id)}>{cat.label}</button>
                ))}
              </div>
              <label style={e.labelInput}>Fecha</label>
              <input style={e.input} type="date" value={fecha} onChange={ev=>setFecha(ev.target.value)} />
              <input style={e.input} placeholder="Nota opcional" value={nota} onChange={ev=>setNota(ev.target.value)} />
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px'}}>
                <input type="checkbox" id="repetir" checked={repetirAnual} onChange={ev=>setRepetirAnual(ev.target.checked)} style={{width:'18px',height:'18px',cursor:'pointer',accentColor:P.verde}} />
                <label htmlFor="repetir" style={{fontSize:'14px',color:P.gris,cursor:'pointer'}}>🔁 Repetir cada año</label>
              </div>
              <div style={{display:'flex',gap:'10px'}}>
                <button style={e.botonCancelar} onClick={resetFormulario}>Cancelar</button>
                <button style={e.botonGuardar} onClick={guardar}>{editandoId?'Guardar cambios':'+ Agregar'}</button>
              </div>
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}

const e = {
  contenedor:{backgroundColor:'#FFFFFF',minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  topBar:{background:'linear-gradient(135deg,#C4973A,#2D6E5E)',padding:'20px 20px 24px',display:'flex',alignItems:'center',gap:'12px'},
  volver:{background:'rgba(255,255,255,0.25)',border:'none',color:'white',padding:'8px 14px',borderRadius:'20px',cursor:'pointer',fontSize:'13px'},
  titulo:{color:'white',fontSize:'20px',margin:0,fontWeight:'normal',letterSpacing:'1px'},
  alertaBox:{background:P.doradot,borderRadius:'16px',padding:'14px',marginBottom:'12px',borderLeft:`4px solid ${P.dorado}`},
  alertaTitulo:{fontWeight:'bold',color:P.dorado,margin:'0 0 8px',fontSize:'13px'},
  alertaItem:{margin:'4px 0',fontSize:'13px',color:P.grisOs},
  selectorVista:{display:'flex',gap:'8px',marginBottom:'16px'},
  vistaBton:{flex:1,padding:'10px',borderRadius:'12px',border:'1.5px solid #EAE7E0',background:'#FAF9F7',cursor:'pointer',fontSize:'13px',textAlign:'center',color:P.gris},
  mesBox:{background:'white',borderRadius:'20px',padding:'16px',boxShadow:'0 4px 20px rgba(0,0,0,0.07)',border:'1px solid #EAE7E0',marginBottom:'16px'},
  mesNav:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'},
  mesNavBtn:{background:'none',border:`1.5px solid #EAE7E0`,borderRadius:'10px',padding:'6px 14px',cursor:'pointer',fontSize:'20px',color:P.dorado},
  mesNombre:{fontWeight:'bold',fontSize:'16px',color:P.grisOs,margin:0},
  semanaGrid:{display:'grid',gridTemplateColumns:'repeat(7,1fr)',marginBottom:'4px'},
  diaSemana:{textAlign:'center',fontSize:'11px',color:P.gris,fontWeight:'bold',margin:'0 0 4px'},
  diasGrid:{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'3px'},
  diaCell:{borderRadius:'10px',padding:'4px 2px',minHeight:'46px',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center'},
  diaNum:{fontSize:'13px',fontWeight:'bold',margin:'2px 0'},
  puntosBox:{display:'flex',gap:'2px',justifyContent:'center'},
  punto:{width:'5px',height:'5px',borderRadius:'50%'},
  diaDetalleBox:{marginTop:'12px',borderTop:`1px solid #F5F3EE`,paddingTop:'12px'},
  diaDetalleTitulo:{fontWeight:'bold',color:P.grisOs,fontSize:'14px',marginBottom:'8px'},
  eventoDetalle:{display:'flex',alignItems:'center',gap:'8px',padding:'10px',borderRadius:'12px',marginBottom:'8px',backgroundColor:'#FAF9F7'},
  filtros:{display:'flex',gap:'6px',marginBottom:'16px',flexWrap:'wrap'},
  filtro:{padding:'8px 14px',borderRadius:'20px',border:'1.5px solid #EAE7E0',background:'white',cursor:'pointer',fontSize:'12px',color:P.gris},
  botonNuevo:{width:'100%',background:'linear-gradient(135deg,#C4973A,#E8BF6A)',color:'white',border:'none',padding:'13px',borderRadius:'14px',cursor:'pointer',fontWeight:'bold',fontSize:'14px',marginBottom:'12px'},
  sugeridosBox:{background:'white',borderRadius:'20px',padding:'16px',marginBottom:'16px',boxShadow:'0 4px 16px rgba(0,0,0,0.07)',border:'1px solid #EAE7E0'},
  sugeridosTitulo:{fontWeight:'bold',color:P.gris,fontSize:'11px',margin:'0 0 12px',textTransform:'uppercase',letterSpacing:'1px'},
  formulario:{background:'white',borderRadius:'20px',padding:'18px',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',border:'1px solid #EAE7E0',marginBottom:'20px'},
  formTitulo:{fontWeight:'bold',color:P.grisOs,fontSize:'14px',margin:'0 0 14px'},
  labelInput:{fontSize:'12px',color:P.gris,display:'block',marginBottom:'6px',marginTop:'4px'},
  input:{width:'100%',padding:'12px 14px',borderRadius:'12px',border:'1.5px solid #EAE7E0',fontSize:'14px',marginBottom:'10px',boxSizing:'border-box',backgroundColor:'#FAF9F7',color:P.grisOs},
  categGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'12px'},
  botonCancelar:{flex:1,padding:'12px',borderRadius:'12px',border:'1.5px solid #EAE7E0',background:'white',cursor:'pointer',fontSize:'14px',color:P.gris},
  botonGuardar:{flex:2,padding:'12px',borderRadius:'12px',border:'none',background:'linear-gradient(135deg,#C4973A,#E8BF6A)',color:'white',cursor:'pointer',fontSize:'14px',fontWeight:'bold'},
  vacio:{textAlign:'center',padding:'40px 20px',color:P.gris},
  tarjeta:{background:'white',borderRadius:'16px',padding:'14px',marginBottom:'12px',boxShadow:'0 4px 16px rgba(0,0,0,0.07)',border:'1px solid #EAE7E0'},
  catIcono:{width:'40px',height:'40px',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0},
  badge:{fontSize:'12px',fontWeight:'bold',border:'1px solid',borderRadius:'20px',padding:'3px 10px',whiteSpace:'nowrap'},
  botonAcc:{padding:'8px 12px',borderRadius:'10px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:'bold',textAlign:'center'},
};

export default Calendario;
