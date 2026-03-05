import React, { useState, useEffect } from 'react';

const D = { bg:'#0D1117', card:'#161B22', card2:'#1C2333', border:'rgba(255,255,255,0.08)', text:'#E6EDF3', text2:'rgba(255,255,255,0.5)', verde:'#4AA08A', verdeD:'#1A3D35', malva:'#C4A0D4', malvaD:'#2E1F3E', dorado:'#E8BF6A', doradoD:'#3A2A10', rojo:'#F47067' };

const generarHTML = (c) => `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;padding:40px;color:#1A1A2E;background:#FAFAFA;}
.header{background:linear-gradient(135deg,#1A3D35,#2D6E5E);color:white;padding:28px 32px;border-radius:16px;margin-bottom:24px;}
.logo{font-size:22px;font-weight:bold;letter-spacing:2px;margin-bottom:4px;}
.sub{opacity:.7;font-size:12px;}
.info{display:flex;gap:16px;margin-bottom:24px;}
.box{flex:1;background:#F0F0F0;border-radius:12px;padding:14px;}
.box label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;}
.box p{font-weight:bold;font-size:15px;}
table{width:100%;border-collapse:collapse;margin-bottom:20px;}
th{background:#F0F0F0;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888;}
td{padding:12px 14px;border-bottom:1px solid #EEE;font-size:14px;}
.r{text-align:right;}.bold{font-weight:bold;}
.total{background:linear-gradient(135deg,#1A3D35,#2D6E5E);color:white;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;}
.total-label{font-size:14px;opacity:.9;}.total-num{font-size:26px;font-weight:bold;}
.nota{background:#FFF8EC;border-left:4px solid #C4973A;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:13px;color:#6B5020;}
.footer{margin-top:32px;text-align:center;font-size:11px;color:#AAA;letter-spacing:2px;text-transform:uppercase;}
@media print{body{padding:20px;}}
</style></head><body>
<div class="header"><div class="logo">UNA</div><div class="sub">vida y empresa</div></div>
<div class="info">
  <div class="box"><label>Para</label><p>${c.nombreCliente}</p></div>
  <div class="box"><label>Fecha</label><p>${c.fecha}</p></div>
</div>
<table><thead><tr><th>Descripcion</th><th style="text-align:center">Cant.</th><th class="r">Precio</th><th class="r">Subtotal</th></tr></thead><tbody>
${c.partidas.map(p=>`<tr><td>${p.descripcion}</td><td style="text-align:center">${p.cantidad}</td><td class="r">$${parseFloat(p.precioUnitario).toLocaleString('es-MX')}</td><td class="r bold" style="color:#2D6E5E">$${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}</td></tr>`).join('')}
</tbody></table>
<div class="total"><span class="total-label">Total</span><span class="total-num">$${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}</span></div>
${c.notaCotizacion?`<div class="nota">${c.notaCotizacion}</div>`:''}
<div class="footer">Generado con UNA</div>
</body></html>`;

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
  useEffect(() => { if(vista==='nueva'){const g=localStorage.getItem('una_clientes');if(g)setClientes(JSON.parse(g));} }, [vista]);

  const actualizarPartida = (i,campo,valor) => setPartidas(partidas.map((p,idx)=>idx===i?{...p,[campo]:valor}:p));
  const eliminarPartida = (i) => { if(partidas.length>1)setPartidas(partidas.filter((_,idx)=>idx!==i)); };
  const calcTotal = (lista) => lista.reduce((a,p)=>a+(parseFloat(p.cantidad)||0)*(parseFloat(p.precioUnitario)||0),0);
  const totalActual = calcTotal(partidas);

  const usarConcepto = (c) => { setPartidas([...partidas.filter(p=>p.descripcion),{descripcion:c.nombre,cantidad:1,precioUnitario:c.precio}]); setMostrarConceptos(false); };
  const guardarConcepto = () => { if(!nuevoConcepto||!nuevoPrecio)return; setConceptos([...conceptos,{id:Date.now(),nombre:nuevoConcepto,precio:nuevoPrecio}]); setNuevoConcepto('');setNuevoPrecio('');setMostrarFormConcepto(false); };
  const seleccionarCliente = (c) => { setNombreCliente(c.nombre);setTelefonoCliente(c.telefono||'');setMostrarClientes(false); };

  const guardar = () => {
    if(!nombreCliente||partidas.every(p=>!p.descripcion))return;
    const cot={id:editandoId||Date.now(),nombreCliente,telefonoCliente,notaCotizacion,partidas:partidas.filter(p=>p.descripcion),total:calcTotal(partidas.filter(p=>p.descripcion)),fecha:new Date().toLocaleDateString('es-MX')};
    if(editandoId){setCotizaciones(cotizaciones.map(c=>c.id===editandoId?cot:c));setEditandoId(null);}
    else setCotizaciones([cot,...cotizaciones]);
    reset(); setVista('historial');
  };

  const reset = () => { setNombreCliente('');setTelefonoCliente('');setNotaCotizacion('');setPartidas([{descripcion:'',cantidad:1,precioUnitario:''}]);setEditandoId(null);setMostrarClientes(false);setMostrarConceptos(false); };
  const editar = (c) => { setEditandoId(c.id);setNombreCliente(c.nombreCliente);setTelefonoCliente(c.telefonoCliente);setNotaCotizacion(c.notaCotizacion||'');setPartidas(c.partidas);setVista('nueva'); };
  const eliminar = (id) => setCotizaciones(cotizaciones.filter(c=>c.id!==id));

  const enviarWA = (c) => {
    const lineas=c.partidas.map(p=>`• ${p.descripcion} x${p.cantidad} = $${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}`);
    const msg=[`Hola ${c.nombreCliente}`,``,`Cotizacion del ${c.fecha}:`,``,...lineas,``,`*Total: $${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}*`,c.notaCotizacion?`\n${c.notaCotizacion}`:'',``,`Quedamos en contacto`].join('\n');
    window.open(`https://wa.me/${c.telefonoCliente?'52'+c.telefonoCliente:''}?text=${encodeURIComponent(msg)}`,'_blank');
  };

  const verPDF = (c) => {
    const v=window.open('','_blank');
    v.document.write(generarHTML(c));
    v.document.close();
    v.focus();
    setTimeout(()=>v.print(),500);
  };

  return (
    <div style={e.page}>
      <div style={e.header}>
        <button style={e.back} onClick={onVolver}>←</button>
        <div><p style={e.headerSub}>Módulo</p><h2 style={e.headerTitle}>Cotizar</h2></div>
        <span style={e.headerEmoji}>💼</span>
      </div>

      <div style={e.body}>
        <div style={e.tabs}>
          {[['nueva','Nueva'],['conceptos',`Conceptos (${conceptos.length})`],['historial',`Historial (${cotizaciones.length})`]].map(([v,l])=>(
            <button key={v} style={{...e.tab,background:vista===v?'linear-gradient(135deg,#0E2E2A,#3A7D6E)':'transparent',color:vista===v?'white':D.text2,border:vista===v?'none':`1px solid ${D.border}`}} onClick={()=>{setVista(v);if(!editandoId&&v!=='nueva')reset();}}>{l}</button>
          ))}
        </div>

        {/* CONCEPTOS */}
        {vista==='conceptos' && (<>
          <button style={e.btn} onClick={()=>setMostrarFormConcepto(!mostrarFormConcepto)}>+ Nuevo concepto</button>
          {mostrarFormConcepto&&(
            <div style={e.card}>
              <p style={e.sectionTitle}>Guardar concepto frecuente</p>
              <input style={e.input} placeholder="Nombre (ej: Corte de cabello)" value={nuevoConcepto} onChange={ev=>setNuevoConcepto(ev.target.value)}/>
              <input style={e.input} placeholder="Precio unitario" type="number" value={nuevoPrecio} onChange={ev=>setNuevoPrecio(ev.target.value)}/>
              <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
                <button style={e.btnSec} onClick={()=>setMostrarFormConcepto(false)}>Cancelar</button>
                <button style={e.btn} onClick={guardarConcepto}>Guardar</button>
              </div>
            </div>
          )}
          {conceptos.length===0&&<div style={e.empty}><p style={{fontSize:'40px',margin:'0 0 10px'}}>📦</p><p style={{color:D.text2}}>Agrega tus servicios frecuentes aqui</p></div>}
          {conceptos.map(c=>(
            <div key={c.id} style={e.card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div><p style={{fontWeight:'bold',fontSize:'15px',color:D.text,margin:'0 0 4px'}}>{c.nombre}</p><p style={{color:D.verde,fontWeight:'bold',fontSize:'18px',margin:0}}>${parseFloat(c.precio).toLocaleString('es-MX')}</p></div>
                <button style={{...e.iconBtn,color:D.rojo}} onClick={()=>setConceptos(conceptos.filter(x=>x.id!==c.id))}>✕</button>
              </div>
            </div>
          ))}
        </>)}

        {/* NUEVA */}
        {vista==='nueva' && (<>
          <div style={e.card}>
            <p style={e.sectionTitle}>Cliente</p>
            {clientes.length>0&&<button style={e.btnOutline} onClick={()=>setMostrarClientes(!mostrarClientes)}>{mostrarClientes?'Cerrar lista':'Elegir de Mis Clientes'}</button>}
            {mostrarClientes&&(
              <div style={{background:D.card2,borderRadius:'14px',marginBottom:'12px',maxHeight:'200px',overflowY:'auto',border:`1px solid ${D.border}`}}>
                {clientes.map(c=>(
                  <div key={c.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderBottom:`1px solid ${D.border}`,cursor:'pointer'}} onClick={()=>seleccionarCliente(c)}>
                    <div style={{width:'32px',height:'32px',borderRadius:'50%',backgroundColor:D.verdeD,color:D.verde,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'14px',flexShrink:0}}>{c.nombre.charAt(0).toUpperCase()}</div>
                    <div style={{flex:1}}><p style={{fontWeight:'bold',fontSize:'13px',margin:0,color:D.text}}>{c.nombre}</p>{c.telefono&&<p style={{fontSize:'11px',color:D.text2,margin:'2px 0 0'}}>{c.telefono}</p>}</div>
                    <span style={{fontSize:'12px',color:D.verde}}>Elegir</span>
                  </div>
                ))}
              </div>
            )}
            <input style={e.input} placeholder="Nombre del cliente *" value={nombreCliente} onChange={ev=>setNombreCliente(ev.target.value)}/>
            <input style={{...e.input,marginTop:'8px'}} placeholder="Telefono WhatsApp" type="tel" value={telefonoCliente} onChange={ev=>setTelefonoCliente(ev.target.value)}/>
          </div>

          <div style={e.card}>
            <p style={e.sectionTitle}>Productos o servicios</p>
            {conceptos.length>0&&<button style={e.btnOutline} onClick={()=>setMostrarConceptos(!mostrarConceptos)}>{mostrarConceptos?'Cerrar':'Agregar concepto guardado'}</button>}
            {mostrarConceptos&&(
              <div style={{background:D.card2,borderRadius:'14px',marginBottom:'12px',maxHeight:'160px',overflowY:'auto',border:`1px solid ${D.border}`}}>
                {conceptos.map(c=>(
                  <div key={c.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 14px',borderBottom:`1px solid ${D.border}`,cursor:'pointer'}} onClick={()=>usarConcepto(c)}>
                    <p style={{flex:1,fontSize:'13px',color:D.text,margin:0}}>{c.nombre}</p>
                    <span style={{color:D.verde,fontWeight:'bold'}}>${parseFloat(c.precio).toLocaleString('es-MX')}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1.2fr 1fr',gap:'6px',marginBottom:'8px'}}>
              {['Descripcion','Cant','Precio','Sub'].map(h=><p key={h} style={{fontSize:'10px',color:D.text2,fontWeight:'bold',margin:0,textAlign:'center',textTransform:'uppercase'}}>{h}</p>)}
            </div>
            {partidas.map((p,i)=>{
              const sub=(parseFloat(p.cantidad)||0)*(parseFloat(p.precioUnitario)||0);
              return (
                <div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1.2fr 1fr',gap:'6px',marginBottom:'6px',alignItems:'center'}}>
                  <input style={e.inputSm} placeholder="Descripcion" value={p.descripcion} onChange={ev=>actualizarPartida(i,'descripcion',ev.target.value)}/>
                  <input style={{...e.inputSm,textAlign:'center'}} type="number" min="1" value={p.cantidad} onChange={ev=>actualizarPartida(i,'cantidad',ev.target.value)}/>
                  <input style={{...e.inputSm,textAlign:'center'}} type="number" placeholder="$" value={p.precioUnitario} onChange={ev=>actualizarPartida(i,'precioUnitario',ev.target.value)}/>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontSize:'12px',fontWeight:'bold',color:D.verde,margin:0}}>${sub.toLocaleString('es-MX',{minimumFractionDigits:0})}</p>
                    {partidas.length>1&&<button style={{background:'none',border:'none',color:D.text2,cursor:'pointer',fontSize:'11px'}} onClick={()=>eliminarPartida(i)}>✕</button>}
                  </div>
                </div>
              );
            })}
            <button style={{...e.btnOutline,marginTop:'8px'}} onClick={()=>setPartidas([...partidas,{descripcion:'',cantidad:1,precioUnitario:''}])}>+ Agregar linea</button>
          </div>

          <div style={{...e.card,display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(135deg,#0E2E2A,#1A4A40)'}}>
            <p style={{color:'rgba(255,255,255,0.7)',fontSize:'14px',margin:0}}>Total estimado</p>
            <p style={{color:D.verde,fontWeight:'bold',fontSize:'28px',margin:0}}>${totalActual.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
          </div>

          <div style={e.card}>
            <input style={{...e.input,marginTop:0}} placeholder="Nota (ej: Incluye envio · Valido 15 dias)" value={notaCotizacion} onChange={ev=>setNotaCotizacion(ev.target.value)}/>
          </div>

          <div style={{display:'flex',gap:'10px',marginBottom:'20px'}}>
            <button style={e.btnSec} onClick={()=>{reset();setVista('historial');}}>Cancelar</button>
            <button style={{...e.btn,flex:2,opacity:nombreCliente?1:0.4}} onClick={guardar}>{editandoId?'Guardar cambios':'Guardar cotizacion'}</button>
          </div>
        </>)}

        {/* HISTORIAL */}
        {vista==='historial' && (<>
          {cotizaciones.length===0&&<div style={e.empty}><p style={{fontSize:'48px',margin:'0 0 10px'}}>💼</p><p style={{color:D.text2}}>Sin cotizaciones aun</p></div>}
          {cotizaciones.map(c=>(
            <div key={c.id} style={e.card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                <div>
                  <p style={{fontWeight:'bold',fontSize:'16px',color:D.text,margin:'0 0 4px'}}>{c.nombreCliente}</p>
                  <p style={{fontSize:'12px',color:D.text2,margin:0}}>{c.fecha} · {c.partidas.length} concepto{c.partidas.length!==1?'s':''}</p>
                </div>
                <p style={{fontWeight:'bold',fontSize:'20px',color:D.verde,margin:0}}>${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
              </div>
              <div style={{borderTop:`1px solid ${D.border}`,borderBottom:`1px solid ${D.border}`,padding:'10px 0',marginBottom:'12px'}}>
                {c.partidas.map((p,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'3px 0'}}>
                    <span style={{flex:2,fontSize:'12px',color:D.text}}>{p.descripcion}</span>
                    <span style={{flex:1,fontSize:'11px',color:D.text2,textAlign:'center'}}>{p.cantidad} × ${parseFloat(p.precioUnitario).toLocaleString('es-MX')}</span>
                    <span style={{flex:1,fontSize:'12px',fontWeight:'bold',color:D.verde,textAlign:'right'}}>${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}</span>
                  </div>
                ))}
              </div>
              {c.notaCotizacion&&<p style={{fontSize:'12px',color:D.text2,marginBottom:'12px'}}>{c.notaCotizacion}</p>}
              <div style={{display:'flex',gap:'8px'}}>
                <button style={{flex:2,padding:'10px',borderRadius:'12px',backgroundColor:'#1A3A22',color:'#25D366',border:'1px solid #25D36644',cursor:'pointer',fontSize:'13px',fontWeight:'bold'}} onClick={()=>enviarWA(c)}>WhatsApp</button>
                <button style={{flex:2,padding:'10px',borderRadius:'12px',backgroundColor:D.verdeD,color:D.verde,border:`1px solid ${D.verde}44`,cursor:'pointer',fontSize:'13px',fontWeight:'bold'}} onClick={()=>verPDF(c)}>PDF</button>
                <button style={{...e.iconBtn,border:`1px solid ${D.border}`,borderRadius:'12px',padding:'10px 14px'}} onClick={()=>editar(c)}>✏️</button>
                <button style={{...e.iconBtn,border:`1px solid ${D.border}`,borderRadius:'12px',padding:'10px 14px',color:D.rojo}} onClick={()=>eliminar(c.id)}>✕</button>
              </div>
            </div>
          ))}
        </>)}
      </div>
    </div>
  );
}

const e = {
  page:{backgroundColor:D.bg,minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  header:{background:'linear-gradient(135deg,#0E2E2A,#3A7D6E)',padding:'52px 20px 24px',display:'flex',alignItems:'center',gap:'14px'},
  back:{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'16px',flexShrink:0},
  headerSub:{color:'rgba(255,255,255,0.6)',fontSize:'11px',margin:0,letterSpacing:'1px',textTransform:'uppercase'},
  headerTitle:{color:'white',fontSize:'22px',margin:0,fontWeight:'bold'},
  headerEmoji:{fontSize:'36px',marginLeft:'auto'},
  body:{padding:'16px'},
  card:{background:D.card,borderRadius:'20px',padding:'18px',marginBottom:'12px',border:`1px solid ${D.border}`},
  sectionTitle:{color:D.text,fontWeight:'bold',fontSize:'14px',margin:'0 0 14px'},
  tabs:{display:'flex',gap:'8px',marginBottom:'14px'},
  tab:{flex:1,padding:'10px',borderRadius:'12px',cursor:'pointer',fontSize:'12px',textAlign:'center'},
  btn:{width:'100%',padding:'14px',background:'linear-gradient(135deg,#0E2E2A,#3A7D6E)',color:'white',border:'none',borderRadius:'14px',fontSize:'14px',cursor:'pointer',fontWeight:'bold',marginBottom:'12px'},
  btnSec:{flex:1,padding:'13px',borderRadius:'14px',border:`1px solid ${D.border}`,background:'transparent',color:D.text2,cursor:'pointer',fontSize:'14px'},
  btnOutline:{width:'100%',padding:'11px',borderRadius:'12px',border:`1px solid ${D.verde}55`,background:'transparent',color:D.verde,cursor:'pointer',fontSize:'13px',fontWeight:'bold',marginBottom:'12px'},
  input:{width:'100%',padding:'13px 16px',borderRadius:'14px',border:`1px solid ${D.border}`,fontSize:'14px',marginTop:'0',boxSizing:'border-box',backgroundColor:D.card2,color:D.text},
  inputSm:{padding:'9px 8px',borderRadius:'10px',border:`1px solid ${D.border}`,fontSize:'12px',width:'100%',boxSizing:'border-box',backgroundColor:D.card2,color:D.text},
  empty:{textAlign:'center',padding:'48px 20px'},
  iconBtn:{background:'none',border:'none',cursor:'pointer',color:D.text2,fontSize:'14px',padding:'4px'},
};

export default Cotizar;
