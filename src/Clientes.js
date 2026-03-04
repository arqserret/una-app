import React, { useState, useEffect } from 'react';

const P = { verde:'#2D6E5E', verdet:'#E8F2EF', malva:'#9B7BAE', malvat:'#F3EEF7', dorado:'#C4973A', doradot:'#FBF5E6', gris:'#8A8A8A', grisOs:'#2D2D2D' };

function Cotizar({ onVolver }) {
  const [cotizaciones, setCotizaciones] = useState(() => { const g=localStorage.getItem('una_cotizaciones'); return g?JSON.parse(g):[]; });
  const [conceptos, setConceptos] = useState(() => { const g=localStorage.getItem('una_conceptos'); return g?JSON.parse(g):[]; });
  const [clientes, setClientes] = useState(() => { const g=localStorage.getItem('una_clientes'); return g?JSON.parse(g):[]; });
  const [vista, setVista] = useState('nueva');
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [notaCotizacion, setNotaCotizacion] = useState('');
  const [partidas, setPartidas] = useState([{descripcion:'',cantidad:1,precioUnitario:''}]);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarConceptos, setMostrarConceptos] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [mostrarFormConcepto, setMostrarFormConcepto] = useState(false);

  useEffect(() => { localStorage.setItem('una_cotizaciones', JSON.stringify(cotizaciones)); }, [cotizaciones]);
  useEffect(() => { localStorage.setItem('una_conceptos', JSON.stringify(conceptos)); }, [conceptos]);
  useEffect(() => { if(vista==='nueva'){const g=localStorage.getItem('una_clientes'); if(g)setClientes(JSON.parse(g));} }, [vista]);

  const agregarPartida = () => setPartidas([...partidas,{descripcion:'',cantidad:1,precioUnitario:''}]);
  const actualizarPartida = (i,campo,valor) => setPartidas(partidas.map((p,idx)=>idx===i?{...p,[campo]:valor}:p));
  const eliminarPartida = (i) => { if(partidas.length>1)setPartidas(partidas.filter((_,idx)=>idx!==i)); };
  const calcularTotal = (lista) => lista.reduce((a,p)=>a+(parseFloat(p.cantidad)||0)*(parseFloat(p.precioUnitario)||0),0);
  const totalActual = calcularTotal(partidas);

  const usarConcepto = (c) => {
    setPartidas([...partidas.filter(p=>p.descripcion), {descripcion:c.nombre, cantidad:1, precioUnitario:c.precio}]);
    setMostrarConceptos(false);
  };

  const guardarConcepto = () => {
    if(!nuevoConcepto||!nuevoPrecio) return;
    setConceptos([...conceptos,{id:Date.now(),nombre:nuevoConcepto,precio:nuevoPrecio}]);
    setNuevoConcepto(''); setNuevoPrecio(''); setMostrarFormConcepto(false);
  };

  const eliminarConcepto = (id) => setConceptos(conceptos.filter(c=>c.id!==id));

  const seleccionarCliente = (c) => { setNombreCliente(c.nombre); setTelefonoCliente(c.telefono||''); setMostrarClientes(false); };

  const guardar = () => {
    if(!nombreCliente||partidas.every(p=>!p.descripcion)) return;
    const cot = {id:editandoId||Date.now(),nombreCliente,telefonoCliente,notaCotizacion,partidas:partidas.filter(p=>p.descripcion),total:calcularTotal(partidas.filter(p=>p.descripcion)),fecha:new Date().toLocaleDateString('es-MX')};
    if(editandoId){setCotizaciones(cotizaciones.map(c=>c.id===editandoId?cot:c));setEditandoId(null);}
    else setCotizaciones([cot,...cotizaciones]);
    resetFormulario(); setVista('historial');
  };

  const resetFormulario = () => { setNombreCliente('');setTelefonoCliente('');setNotaCotizacion('');setPartidas([{descripcion:'',cantidad:1,precioUnitario:''}]);setEditandoId(null);setMostrarClientes(false);setMostrarConceptos(false); };
  const editar = (c) => { setEditandoId(c.id);setNombreCliente(c.nombreCliente);setTelefonoCliente(c.telefonoCliente);setNotaCotizacion(c.notaCotizacion||'');setPartidas(c.partidas);setVista('nueva'); };
  const eliminar = (id) => setCotizaciones(cotizaciones.filter(c=>c.id!==id));

  const abrirWhatsApp = (c) => {
    const lineas = c.partidas.map(p=>`• ${p.descripcion} (${p.cantidad} x $${parseFloat(p.precioUnitario).toLocaleString('es-MX')}) = $${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}`);
    const msg = [`Hola ${c.nombreCliente} 😊`,``,`Te comparto mi cotización del ${c.fecha}:`,``,...lineas,``,`*Total: $${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}*`,c.notaCotizacion?`\n📝 ${c.notaCotizacion}`:``,``,`Quedamos en contacto 🌿`].join('\n');
    window.open(`https://wa.me/${c.telefonoCliente?'52'+c.telefonoCliente:''}?text=${encodeURIComponent(msg)}`,'_blank');
  };

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>💼 Cotizar</h2>
      </div>
      <div style={{padding:'16px 20px 0'}}>
        <div style={e.selectorVista}>
          {[['nueva','➕ Nueva'],['conceptos',`📦 Conceptos (${conceptos.length})`],['historial',`📋 Historial (${cotizaciones.length})`]].map(([v,l])=>(
            <button key={v} style={vista===v?{...e.vistaBton,background:'linear-gradient(135deg,#2D6E5E,#4AA08A)',color:'white',border:'none',fontWeight:'bold'}:e.vistaBton} onClick={()=>{setVista(v);if(!editandoId&&v!=='nueva')resetFormulario();}}>{l}</button>
          ))}
        </div>

        {/* ── CONCEPTOS FRECUENTES ── */}
        {vista==='conceptos' && (
          <>
            <button style={e.botonVerde} onClick={()=>setMostrarFormConcepto(!mostrarFormConcepto)}>+ Guardar nuevo concepto</button>
            {mostrarFormConcepto && (
              <div style={e.seccion}>
                <p style={e.seccionTitulo}>Nuevo concepto frecuente</p>
                <input style={e.input} placeholder="Nombre (ej: Corte de cabello)" value={nuevoConcepto} onChange={ev=>setNuevoConcepto(ev.target.value)} />
                <input style={e.input} placeholder="Precio unitario (ej: 250)" type="number" value={nuevoPrecio} onChange={ev=>setNuevoPrecio(ev.target.value)} />
                <div style={e.filaBotones}>
                  <button style={e.botonCancelar} onClick={()=>setMostrarFormConcepto(false)}>Cancelar</button>
                  <button style={e.botonGuardar} onClick={guardarConcepto}>💾 Guardar</button>
                </div>
              </div>
            )}
            {conceptos.length===0 && <div style={e.vacio}><p style={{fontSize:'40px',margin:0}}>📦</p><p style={{fontWeight:'bold'}}>Sin conceptos guardados</p><p style={{fontSize:'13px',color:P.gris}}>Guarda tus servicios o productos frecuentes para cotizar más rápido</p></div>}
            {conceptos.map(c=>(
              <div key={c.id} style={e.tarjeta}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div><p style={{fontWeight:'bold',fontSize:'15px',margin:0,color:P.grisOs}}>{c.nombre}</p><p style={{color:P.verde,fontWeight:'bold',fontSize:'16px',margin:'4px 0 0'}}>${parseFloat(c.precio).toLocaleString('es-MX')}</p></div>
                  <button style={{...e.botonAcc,backgroundColor:P.malvat,color:P.malva}} onClick={()=>eliminarConcepto(c.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── NUEVA COTIZACIÓN ── */}
        {vista==='nueva' && (<>
          <div style={e.seccion}>
            <p style={e.seccionTitulo}>👩‍👧 Cliente</p>
            {clientes.length>0 && <button style={e.botonSelCliente} onClick={()=>setMostrarClientes(!mostrarClientes)}>👥 {mostrarClientes?'Cerrar':'Elegir de Mis Clientes'}</button>}
            {mostrarClientes && (
              <div style={e.listaClientes}>
                {clientes.map(c=>(
                  <div key={c.id} style={e.clienteOpcion} onClick={()=>seleccionarCliente(c)}>
                    <div style={{...e.avatarMini,backgroundColor:P.verde}}>{c.nombre.charAt(0).toUpperCase()}</div>
                    <div style={{flex:1}}><p style={{fontWeight:'bold',fontSize:'13px',margin:0}}>{c.nombre}</p>{c.telefono&&<p style={{fontSize:'11px',color:P.gris,margin:'2px 0 0'}}>{c.telefono}</p>}</div>
                    <span style={{fontSize:'11px',color:P.verde,fontWeight:'bold'}}>✓ Elegir</span>
                  </div>
                ))}
              </div>
            )}
            <input style={e.input} placeholder="Nombre del cliente *" value={nombreCliente} onChange={ev=>setNombreCliente(ev.target.value)} />
            <input style={{...e.input,marginBottom:0}} placeholder="Teléfono WhatsApp (ej: 5512345678)" type="tel" value={telefonoCliente} onChange={ev=>setTelefonoCliente(ev.target.value)} />
          </div>

          <div style={e.seccion}>
            <p style={e.seccionTitulo}>📦 Productos o servicios</p>
            {conceptos.length>0 && <button style={e.botonSelCliente} onClick={()=>setMostrarConceptos(!mostrarConceptos)}>⚡ {mostrarConceptos?'Cerrar':'Agregar concepto frecuente'}</button>}
            {mostrarConceptos && (
              <div style={e.listaClientes}>
                {conceptos.map(c=>(
                  <div key={c.id} style={e.clienteOpcion} onClick={()=>usarConcepto(c)}>
                    <div style={{flex:1}}><p style={{fontWeight:'bold',fontSize:'13px',margin:0}}>{c.nombre}</p></div>
                    <span style={{color:P.verde,fontWeight:'bold',fontSize:'14px'}}>${parseFloat(c.precio).toLocaleString('es-MX')}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={e.encGrid}>{['Descripción','Cant.','Precio','Subtotal'].map(h=><p key={h} style={e.encH}>{h}</p>)}</div>
            {partidas.map((p,i)=>{
              const sub=(parseFloat(p.cantidad)||0)*(parseFloat(p.precioUnitario)||0);
              return (
                <div key={i} style={e.partidaFila}>
                  <input style={e.inputPeq} placeholder="Descripción" value={p.descripcion} onChange={ev=>actualizarPartida(i,'descripcion',ev.target.value)} />
                  <input style={{...e.inputPeq,textAlign:'center'}} type="number" min="1" value={p.cantidad} onChange={ev=>actualizarPartida(i,'cantidad',ev.target.value)} />
                  <input style={{...e.inputPeq,textAlign:'center'}} type="number" placeholder="$0" value={p.precioUnitario} onChange={ev=>actualizarPartida(i,'precioUnitario',ev.target.value)} />
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <p style={{fontSize:'13px',fontWeight:'bold',color:P.verde,margin:0}}>${sub.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
                    {partidas.length>1&&<button style={{background:'none',border:'none',color:P.gris,cursor:'pointer',fontSize:'11px'}} onClick={()=>eliminarPartida(i)}>✕</button>}
                  </div>
                </div>
              );
            })}
            <button style={e.botonLinea} onClick={agregarPartida}>+ Agregar línea</button>
          </div>

          <div style={e.totalBox}>
            <p style={{fontWeight:'bold',fontSize:'14px',color:P.grisOs,margin:0}}>Total estimado</p>
            <p style={{fontWeight:'bold',fontSize:'28px',color:P.verde,margin:0}}>${totalActual.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
          </div>

          <div style={{...e.seccion,marginBottom:'12px'}}>
            <input style={{...e.input,marginBottom:0}} placeholder="📝 Nota (ej: Incluye envío · Válido 15 días)" value={notaCotizacion} onChange={ev=>setNotaCotizacion(ev.target.value)} />
          </div>

          <div style={e.filaBotones}>
            <button style={e.botonCancelar} onClick={()=>{resetFormulario();setVista('historial');}}>Cancelar</button>
            <button style={{...e.botonGuardar,opacity:nombreCliente?1:0.5}} onClick={guardar}>{editandoId?'💾 Guardar cambios':'💾 Guardar cotización'}</button>
          </div>
        </>)}

        {/* ── HISTORIAL ── */}
        {vista==='historial' && (<>
          {cotizaciones.length===0 && <div style={e.vacio}><p style={{fontSize:'48px',margin:0}}>💼</p><p style={{fontWeight:'bold'}}>Sin cotizaciones aún</p><p style={{fontSize:'13px',color:P.gris}}>Toca "+ Nueva" para crear la primera</p></div>}
          {cotizaciones.map(c=>(
            <div key={c.id} style={e.tarjeta}>
              <div style={{display:'flex',gap:'12px',alignItems:'center',marginBottom:'12px'}}>
                <div style={{width:'40px',height:'40px',borderRadius:'12px',backgroundColor:P.verdet,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:'20px'}}>💼</span></div>
                <div style={{flex:1}}>
                  <p style={{fontWeight:'bold',fontSize:'15px',margin:0,color:P.grisOs}}>{c.nombreCliente}</p>
                  <p style={{fontSize:'12px',color:P.gris,margin:'2px 0 0'}}>{c.fecha} · {c.partidas.length} concepto{c.partidas.length!==1?'s':''}</p>
                </div>
                <p style={{fontWeight:'bold',fontSize:'20px',color:P.verde,margin:0}}>${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
              </div>
              <div style={{borderTop:'1px solid #F5F3EE',borderBottom:'1px solid #F5F3EE',padding:'8px 0',marginBottom:'10px'}}>
                {c.partidas.map((p,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'3px 0'}}>
                    <span style={{flex:2,fontSize:'12px',color:P.grisOs}}>{p.descripcion}</span>
                    <span style={{flex:1,fontSize:'11px',color:P.gris,textAlign:'center'}}>{p.cantidad} × ${parseFloat(p.precioUnitario).toLocaleString('es-MX')}</span>
                    <span style={{flex:1,fontSize:'12px',fontWeight:'bold',color:P.verde,textAlign:'right'}}>${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}</span>
                  </div>
                ))}
              </div>
              {c.notaCotizacion&&<p style={{fontSize:'12px',color:P.gris,marginBottom:'10px'}}>📝 {c.notaCotizacion}</p>}
              <div style={{display:'flex',gap:'8px'}}>
                <button style={{flex:1,padding:'10px',borderRadius:'12px',backgroundColor:'#25D366',color:'white',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:'bold'}} onClick={()=>abrirWhatsApp(c)}>💬 Enviar WhatsApp</button>
                <button style={{...e.botonAcc,backgroundColor:P.doradot,color:P.dorado}} onClick={()=>editar(c)}>✏️</button>
                <button style={{...e.botonAcc,backgroundColor:P.malvat,color:P.malva}} onClick={()=>eliminar(c.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}

const e = {
  contenedor:{backgroundColor:'#FFFFFF',minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  topBar:{background:'linear-gradient(135deg,#2D6E5E,#9B7BAE)',padding:'20px 20px 24px',display:'flex',alignItems:'center',gap:'12px'},
  volver:{background:'rgba(255,255,255,0.25)',border:'none',color:'white',padding:'8px 14px',borderRadius:'20px',cursor:'pointer',fontSize:'13px'},
  titulo:{color:'white',fontSize:'20px',margin:0,fontWeight:'normal',letterSpacing:'1px'},
  selectorVista:{display:'flex',gap:'6px',marginBottom:'16px'},
  vistaBton:{flex:1,padding:'10px 6px',borderRadius:'12px',border:'1.5px solid #EAE7E0',background:'#FAF9F7',cursor:'pointer',fontSize:'12px',textAlign:'center',color:'#8A8A8A'},
  seccion:{background:'white',borderRadius:'20px',padding:'16px',marginBottom:'12px',boxShadow:'0 4px 16px rgba(0,0,0,0.07)',border:'1px solid #EAE7E0'},
  seccionTitulo:{fontWeight:'bold',color:'#2D2D2D',fontSize:'13px',margin:'0 0 12px 0'},
  botonVerde:{width:'100%',padding:'12px',borderRadius:'12px',background:'linear-gradient(135deg,#2D6E5E,#4AA08A)',color:'white',border:'none',cursor:'pointer',fontWeight:'bold',fontSize:'14px',marginBottom:'12px'},
  botonSelCliente:{width:'100%',padding:'10px',borderRadius:'12px',border:'1.5px solid #2D6E5E',background:'#E8F2EF',color:'#2D6E5E',cursor:'pointer',fontSize:'13px',fontWeight:'bold',marginBottom:'12px'},
  listaClientes:{background:'#FAF9F7',borderRadius:'12px',border:'1.5px solid #EAE7E0',marginBottom:'12px',maxHeight:'200px',overflowY:'auto'},
  clienteOpcion:{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',borderBottom:'1px solid #EAE7E0',cursor:'pointer'},
  avatarMini:{width:'32px',height:'32px',borderRadius:'50%',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'14px',flexShrink:0},
  input:{width:'100%',padding:'12px 14px',borderRadius:'12px',border:'1.5px solid #EAE7E0',fontSize:'14px',marginBottom:'10px',boxSizing:'border-box',backgroundColor:'#FAF9F7',color:'#2D2D2D'},
  encGrid:{display:'grid',gridTemplateColumns:'2fr 1fr 1.2fr 1.2fr',gap:'4px',marginBottom:'6px'},
  encH:{fontSize:'10px',color:'#B0A898',fontWeight:'bold',margin:0,textAlign:'center',textTransform:'uppercase',letterSpacing:'0.5px'},
  partidaFila:{display:'grid',gridTemplateColumns:'2fr 1fr 1.2fr 1.2fr',gap:'4px',marginBottom:'6px',alignItems:'center'},
  inputPeq:{padding:'9px 6px',borderRadius:'10px',border:'1.5px solid #EAE7E0',fontSize:'12px',width:'100%',boxSizing:'border-box',backgroundColor:'#FAF9F7'},
  botonLinea:{width:'100%',marginTop:'8px',padding:'10px',borderRadius:'12px',border:'1.5px dashed #2D6E5E',background:'white',color:'#2D6E5E',cursor:'pointer',fontSize:'13px',fontWeight:'bold'},
  totalBox:{background:'linear-gradient(135deg,#E8F2EF,#FBF5E6)',borderRadius:'20px',padding:'16px 20px',marginBottom:'12px',display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid #EAE7E0'},
  filaBotones:{display:'flex',gap:'10px',marginBottom:'20px'},
  botonCancelar:{flex:1,padding:'12px',borderRadius:'12px',border:'1.5px solid #EAE7E0',background:'white',cursor:'pointer',fontSize:'14px',color:'#8A8A8A'},
  botonGuardar:{flex:2,padding:'12px',borderRadius:'12px',border:'none',background:'linear-gradient(135deg,#2D6E5E,#4AA08A)',color:'white',cursor:'pointer',fontSize:'14px',fontWeight:'bold'},
  vacio:{textAlign:'center',padding:'40px 20px',color:'#8A8A8A'},
  tarjeta:{background:'white',borderRadius:'20px',padding:'16px',marginBottom:'12px',boxShadow:'0 4px 16px rgba(0,0,0,0.07)',border:'1px solid #EAE7E0'},
  botonAcc:{padding:'10px 14px',borderRadius:'12px',border:'none',cursor:'pointer',fontSize:'13px'},
};

export default Cotizar;
