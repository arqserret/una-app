import React, { useState, useEffect } from 'react';

const BG='#0D1117', CARD='#161B22', CARD2='#1C2333', BR='rgba(255,255,255,0.08)', TXT='#E6EDF3', TXT2='rgba(255,255,255,0.4)', VE='#4AA08A', VED='#0A1F15', MA='#C4A0D4', YE='#E8BF6A', RE='#F47067';

const htmlCotizacion = (c) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,sans-serif;padding:40px;color:#1A1A2E;background:#FAFAFA;}
.header{background:linear-gradient(135deg,#0A1F15,#2D6E5E);color:white;padding:28px 32px;border-radius:16px;margin-bottom:24px;}
.logo{font-size:24px;font-weight:bold;letter-spacing:3px;margin-bottom:4px;}
.sub{opacity:.7;font-size:12px;letter-spacing:1px;}
.info{display:flex;gap:16px;margin-bottom:24px;}
.box{flex:1;background:#F5F5F5;border-radius:12px;padding:14px 18px;}
.box label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;}
.box p{font-weight:bold;font-size:15px;}
table{width:100%;border-collapse:collapse;margin-bottom:20px;}
th{background:#F0F0F0;padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#888;}
td{padding:12px 14px;border-bottom:1px solid #EEEEEE;font-size:14px;}
.r{text-align:right;}.bold{font-weight:bold;color:#2D6E5E;}
.total{background:linear-gradient(135deg,#0A1F15,#2D6E5E);color:white;border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;}
.tl{font-size:14px;opacity:.9;}.tn{font-size:26px;font-weight:bold;}
.nota{background:#FFF8EC;border-left:4px solid #C4973A;border-radius:8px;padding:12px 16px;margin-top:16px;font-size:13px;color:#6B5020;}
.footer{margin-top:32px;text-align:center;font-size:10px;color:#AAA;letter-spacing:3px;text-transform:uppercase;}
@media print{body{padding:20px;}}
</style></head><body>
<div class="header"><div class="logo">UNA</div><div class="sub">VIDA Y EMPRESA</div></div>
<div class="info"><div class="box"><label>Para</label><p>${c.nombreCliente}</p></div><div class="box"><label>Fecha</label><p>${c.fecha}</p></div></div>
<table><thead><tr><th>Descripcion</th><th style="text-align:center">Cant.</th><th class="r">Precio</th><th class="r">Subtotal</th></tr></thead><tbody>
${c.partidas.map(p=>`<tr><td>${p.descripcion}</td><td style="text-align:center">${p.cantidad}</td><td class="r">$${parseFloat(p.precioUnitario).toLocaleString('es-MX')}</td><td class="r bold">$${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}</td></tr>`).join('')}
</tbody></table>
<div class="total"><span class="tl">Total</span><span class="tn">$${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}</span></div>
${c.notaCotizacion?`<div class="nota">${c.notaCotizacion}</div>`:''}
<div class="footer">Generado con UNA</div>
</body></html>`;

function Cotizar({ onVolver }) {
  const [cots, setCots] = useState(()=>{ try{return JSON.parse(localStorage.getItem('una_cotizaciones'))||[];}catch{return[];} });
  const [concs, setConcs] = useState(()=>{ try{return JSON.parse(localStorage.getItem('una_conceptos'))||[];}catch{return[];} });
  const [clientes, setClientes] = useState(()=>{ try{return JSON.parse(localStorage.getItem('una_clientes'))||[];}catch{return[];} });
  const [vista, setVista] = useState('nueva');
  const [nombreCli, setNombreCli] = useState('');
  const [telCli, setTelCli] = useState('');
  const [notaCot, setNotaCot] = useState('');
  const [partidas, setPartidas] = useState([{descripcion:'',cantidad:1,precioUnitario:''}]);
  const [editId, setEditId] = useState(null);
  const [showClis, setShowClis] = useState(false);
  const [showConcs, setShowConcs] = useState(false);
  const [nuevoConc, setNuevoConc] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [formConc, setFormConc] = useState(false);

  useEffect(()=>{ localStorage.setItem('una_cotizaciones', JSON.stringify(cots)); }, [cots]);
  useEffect(()=>{ localStorage.setItem('una_conceptos', JSON.stringify(concs)); }, [concs]);
  useEffect(()=>{ if(vista==='nueva'){try{const g=localStorage.getItem('una_clientes');if(g)setClientes(JSON.parse(g));}catch{}} }, [vista]);

  const updP = (i,k,v) => setPartidas(partidas.map((p,idx)=>idx===i?{...p,[k]:v}:p));
  const delP = i => { if(partidas.length>1) setPartidas(partidas.filter((_,idx)=>idx!==i)); };
  const calcT = lista => lista.reduce((a,p)=>a+(parseFloat(p.cantidad)||0)*(parseFloat(p.precioUnitario)||0),0);
  const total = calcT(partidas);

  const usarConc = c => { setPartidas([...partidas.filter(p=>p.descripcion),{descripcion:c.nombre,cantidad:1,precioUnitario:c.precio}]); setShowConcs(false); };
  const guardarConc = () => { if(!nuevoConc||!nuevoPrecio) return; setConcs([...concs,{id:Date.now(),nombre:nuevoConc,precio:nuevoPrecio}]); setNuevoConc('');setNuevoPrecio('');setFormConc(false); };
  const selCli = c => { setNombreCli(c.nombre);setTelCli(c.telefono||'');setShowClis(false); };

  const guardar = () => {
    if (!nombreCli||partidas.every(p=>!p.descripcion)) return;
    const pt = partidas.filter(p=>p.descripcion);
    const cot = { id:editId||Date.now(), nombreCliente:nombreCli, telefonoCliente:telCli, notaCotizacion:notaCot, partidas:pt, total:calcT(pt), fecha:new Date().toLocaleDateString('es-MX') };
    if (editId) { setCots(cots.map(c=>c.id===editId?cot:c)); setEditId(null); }
    else setCots([cot,...cots]);
    reset(); setVista('historial');
  };
  const reset = () => { setNombreCli('');setTelCli('');setNotaCot('');setPartidas([{descripcion:'',cantidad:1,precioUnitario:''}]);setEditId(null);setShowClis(false);setShowConcs(false); };
  const editar = c => { setEditId(c.id);setNombreCli(c.nombreCliente);setTelCli(c.telefonoCliente||'');setNotaCot(c.notaCotizacion||'');setPartidas(c.partidas);setVista('nueva'); };

  const enviarWA = c => {
    const lineas = c.partidas.map(p=>`• ${p.descripcion} x${p.cantidad} = $${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}`);
    const msg = [`Hola ${c.nombreCliente}`,``,`Cotizacion del ${c.fecha}:`,``,...lineas,``,`*Total: $${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}*`,c.notaCotizacion?`\n${c.notaCotizacion}`:'',``,`Quedamos en contacto`].join('\n');
    window.open(`https://wa.me/${c.telefonoCliente?'52'+c.telefonoCliente:''}?text=${encodeURIComponent(msg)}`,'_blank');
  };

  const verPDF = c => {
    const v = window.open('','_blank');
    v.document.write(htmlCotizacion(c));
    v.document.close();
    v.focus();
    setTimeout(()=>v.print(), 500);
  };

  const inp = { width:'100%', padding:'14px 16px', borderRadius:16, border:`1px solid ${BR}`, fontSize:14, marginBottom:10, boxSizing:'border-box', background:CARD2, color:TXT };

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:'Arial,sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#061410,#163028)', padding:'52px 20px 28px', display:'flex', alignItems:'center', gap:14 }}>
        <button style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'white', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:18, flexShrink:0 }} onClick={onVolver}>←</button>
        <div style={{flex:1}}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, margin:0, letterSpacing:2 }}>MODULO</p>
          <h2 style={{ color:'white', fontSize:24, margin:0, fontWeight:'bold' }}>Cotizar</h2>
        </div>
        <span style={{fontSize:42}}>💼</span>
      </div>

      <div style={{ padding:16 }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[['nueva','Nueva'],['conceptos',`Conceptos (${concs.length})`],['historial',`Historial (${cots.length})`]].map(([v,l]) => (
            <button key={v} style={{ flex:1, padding:11, borderRadius:14, cursor:'pointer', fontSize:12, textAlign:'center', background:vista===v?'linear-gradient(135deg,#061410,#163028)':'transparent', color:vista===v?'white':TXT2, border:vista===v?'none':`1px solid ${BR}` }} onClick={()=>{setVista(v);if(v!=='nueva'&&!editId)reset();}}>{l}</button>
          ))}
        </div>

        {/* CONCEPTOS */}
        {vista==='conceptos' && <>
          <button style={{ width:'100%', padding:15, background:'linear-gradient(135deg,#061410,#163028)', color:'white', border:'none', borderRadius:16, fontSize:14, cursor:'pointer', fontWeight:'bold', marginBottom:12 }} onClick={()=>setFormConc(!formConc)}>+ Nuevo concepto frecuente</button>
          {formConc && (
            <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}` }}>
              <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 14px' }}>Guardar concepto</p>
              <input style={inp} placeholder="Nombre (ej: Corte de cabello)" value={nuevoConc} onChange={e=>setNuevoConc(e.target.value)} />
              <input style={inp} placeholder="Precio unitario" type="number" value={nuevoPrecio} onChange={e=>setNuevoPrecio(e.target.value)} />
              <div style={{ display:'flex', gap:10 }}>
                <button style={{ flex:1, padding:14, borderRadius:16, border:`1px solid ${BR}`, background:'transparent', color:TXT2, cursor:'pointer' }} onClick={()=>setFormConc(false)}>Cancelar</button>
                <button style={{ flex:2, padding:14, borderRadius:16, border:'none', background:'linear-gradient(135deg,#061410,#163028)', color:'white', cursor:'pointer', fontWeight:'bold' }} onClick={guardarConc}>Guardar</button>
              </div>
            </div>
          )}
          {concs.length===0 && <div style={{ textAlign:'center', padding:'40px 20px' }}><p style={{fontSize:40,margin:'0 0 10px'}}>📦</p><p style={{color:TXT2,fontSize:14}}>Agrega tus servicios frecuentes aqui</p></div>}
          {concs.map(c => (
            <div key={c.id} style={{ background:CARD, borderRadius:22, padding:20, marginBottom:12, border:`1px solid ${BR}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontWeight:'bold', fontSize:15, color:TXT, margin:'0 0 4px' }}>{c.nombre}</p>
                  <p style={{ color:VE, fontWeight:'bold', fontSize:20, margin:0 }}>${parseFloat(c.precio).toLocaleString('es-MX')}</p>
                </div>
                <button style={{ background:'none', border:'none', cursor:'pointer', color:RE, fontSize:18, padding:'8px 12px' }} onClick={()=>setConcs(concs.filter(x=>x.id!==c.id))}>✕</button>
              </div>
            </div>
          ))}
        </>}

        {/* NUEVA */}
        {vista==='nueva' && <>
          <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:12, border:`1px solid ${BR}` }}>
            <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 14px' }}>Cliente</p>
            {clientes.length>0 && <button style={{ width:'100%', padding:11, borderRadius:14, border:`1px solid ${VE}44`, background:'transparent', color:VE, cursor:'pointer', fontSize:13, fontWeight:'bold', marginBottom:12 }} onClick={()=>setShowClis(!showClis)}>{showClis?'Cerrar lista':'Elegir de Mis Clientes'}</button>}
            {showClis && (
              <div style={{ background:CARD2, borderRadius:14, marginBottom:12, maxHeight:200, overflowY:'auto', border:`1px solid ${BR}` }}>
                {clientes.map(c => (
                  <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderBottom:`1px solid ${BR}`, cursor:'pointer' }} onClick={()=>selCli(c)}>
                    <div style={{ width:34, height:34, borderRadius:'50%', background:VED, color:VE, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', flexShrink:0 }}>{c.nombre.charAt(0).toUpperCase()}</div>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:'bold',fontSize:13,margin:0,color:TXT}}>{c.nombre}</p>
                      {c.telefono&&<p style={{fontSize:11,color:TXT2,margin:'2px 0 0'}}>{c.telefono}</p>}
                    </div>
                    <span style={{fontSize:12,color:VE,fontWeight:'bold'}}>Elegir</span>
                  </div>
                ))}
              </div>
            )}
            <input style={inp} placeholder="Nombre del cliente *" value={nombreCli} onChange={e=>setNombreCli(e.target.value)} />
            <input style={{...inp,marginBottom:0}} placeholder="Telefono WhatsApp" type="tel" value={telCli} onChange={e=>setTelCli(e.target.value)} />
          </div>

          <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:12, border:`1px solid ${BR}` }}>
            <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 14px' }}>Productos o servicios</p>
            {concs.length>0 && <button style={{ width:'100%', padding:11, borderRadius:14, border:`1px solid ${VE}44`, background:'transparent', color:VE, cursor:'pointer', fontSize:13, fontWeight:'bold', marginBottom:12 }} onClick={()=>setShowConcs(!showConcs)}>{showConcs?'Cerrar':'Agregar concepto guardado'}</button>}
            {showConcs && (
              <div style={{ background:CARD2, borderRadius:14, marginBottom:12, maxHeight:160, overflowY:'auto', border:`1px solid ${BR}` }}>
                {concs.map(c => (
                  <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderBottom:`1px solid ${BR}`, cursor:'pointer' }} onClick={()=>usarConc(c)}>
                    <p style={{flex:1,fontSize:13,color:TXT,margin:0}}>{c.nombre}</p>
                    <span style={{color:VE,fontWeight:'bold',fontSize:14}}>${parseFloat(c.precio).toLocaleString('es-MX')}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1.2fr 1fr', gap:6, marginBottom:8 }}>
              {['Descripcion','Cant','Precio','Sub'].map(h => <p key={h} style={{ fontSize:10, color:TXT2, fontWeight:'bold', margin:0, textAlign:'center', textTransform:'uppercase' }}>{h}</p>)}
            </div>
            {partidas.map((p,i) => {
              const sub = (parseFloat(p.cantidad)||0)*(parseFloat(p.precioUnitario)||0);
              return (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1.2fr 1fr', gap:6, marginBottom:6, alignItems:'center' }}>
                  <input style={{ padding:'10px 8px', borderRadius:12, border:`1px solid ${BR}`, fontSize:12, background:CARD2, color:TXT, width:'100%', boxSizing:'border-box' }} placeholder="Descripcion" value={p.descripcion} onChange={e=>updP(i,'descripcion',e.target.value)} />
                  <input style={{ padding:'10px 8px', borderRadius:12, border:`1px solid ${BR}`, fontSize:12, background:CARD2, color:TXT, width:'100%', boxSizing:'border-box', textAlign:'center' }} type="number" min="1" value={p.cantidad} onChange={e=>updP(i,'cantidad',e.target.value)} />
                  <input style={{ padding:'10px 8px', borderRadius:12, border:`1px solid ${BR}`, fontSize:12, background:CARD2, color:TXT, width:'100%', boxSizing:'border-box', textAlign:'center' }} type="number" placeholder="$" value={p.precioUnitario} onChange={e=>updP(i,'precioUnitario',e.target.value)} />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ fontSize:12, fontWeight:'bold', color:VE, margin:0 }}>${sub.toLocaleString('es-MX',{minimumFractionDigits:0})}</p>
                    {partidas.length>1 && <button style={{ background:'none', border:'none', color:TXT2, cursor:'pointer', fontSize:11 }} onClick={()=>delP(i)}>✕</button>}
                  </div>
                </div>
              );
            })}
            <button style={{ width:'100%', padding:11, borderRadius:14, border:`1px solid ${VE}44`, background:'transparent', color:VE, cursor:'pointer', fontSize:13, marginTop:8 }} onClick={()=>setPartidas([...partidas,{descripcion:'',cantidad:1,precioUnitario:''}])}>+ Agregar linea</button>
          </div>

          <div style={{ background:'linear-gradient(135deg,#0A1F15,#163028)', borderRadius:22, padding:'18px 20px', marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center', border:`1px solid ${VE}22` }}>
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, margin:0 }}>Total estimado</p>
            <p style={{ color:VE, fontWeight:'bold', fontSize:28, margin:0 }}>${total.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
          </div>

          <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:12, border:`1px solid ${BR}` }}>
            <input style={{...inp,marginBottom:0}} placeholder="Nota (ej: Incluye envio · Valido 15 dias)" value={notaCot} onChange={e=>setNotaCot(e.target.value)} />
          </div>

          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
            <button style={{ flex:1, padding:14, borderRadius:16, border:`1px solid ${BR}`, background:'transparent', color:TXT2, cursor:'pointer', fontSize:14 }} onClick={()=>{reset();setVista('historial');}}>Cancelar</button>
            <button style={{ flex:2, padding:14, borderRadius:16, border:'none', background:'linear-gradient(135deg,#0A1F15,#4AA08A)', color:'white', cursor:'pointer', fontSize:14, fontWeight:'bold', opacity:nombreCli?1:0.4 }} onClick={guardar}>{editId?'Guardar cambios':'Guardar cotizacion'}</button>
          </div>
        </>}

        {/* HISTORIAL */}
        {vista==='historial' && <>
          {cots.length===0 && <div style={{ textAlign:'center', padding:'52px 20px' }}><p style={{fontSize:48,margin:'0 0 12px'}}>💼</p><p style={{color:TXT,fontWeight:'bold',margin:'0 0 6px'}}>Sin cotizaciones aun</p><p style={{color:TXT2,fontSize:13}}>Toca "Nueva" para crear la primera</p></div>}
          {cots.map(c => (
            <div key={c.id} style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <p style={{ fontWeight:'bold', fontSize:17, color:TXT, margin:'0 0 4px' }}>{c.nombreCliente}</p>
                  <p style={{ fontSize:12, color:TXT2, margin:0 }}>{c.fecha} · {c.partidas.length} concepto{c.partidas.length!==1?'s':''}</p>
                </div>
                <p style={{ fontWeight:'bold', fontSize:22, color:VE, margin:0 }}>${c.total.toLocaleString('es-MX',{minimumFractionDigits:2})}</p>
              </div>
              <div style={{ borderTop:`1px solid ${BR}`, borderBottom:`1px solid ${BR}`, padding:'10px 0', marginBottom:14 }}>
                {c.partidas.map((p,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'3px 0' }}>
                    <span style={{ flex:2, fontSize:12, color:TXT }}>{p.descripcion}</span>
                    <span style={{ flex:1, fontSize:11, color:TXT2, textAlign:'center' }}>{p.cantidad} × ${parseFloat(p.precioUnitario).toLocaleString('es-MX')}</span>
                    <span style={{ flex:1, fontSize:12, fontWeight:'bold', color:VE, textAlign:'right' }}>${(parseFloat(p.cantidad)*parseFloat(p.precioUnitario)).toLocaleString('es-MX',{minimumFractionDigits:2})}</span>
                  </div>
                ))}
              </div>
              {c.notaCotizacion&&<p style={{ fontSize:12, color:TXT2, marginBottom:14 }}>{c.notaCotizacion}</p>}
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ flex:2, padding:'11px 8px', borderRadius:14, background:'#0A2010', color:'#25D366', border:'1px solid #25D36644', cursor:'pointer', fontSize:13, fontWeight:'bold' }} onClick={()=>enviarWA(c)}>WhatsApp</button>
                <button style={{ flex:2, padding:'11px 8px', borderRadius:14, background:VED, color:VE, border:`1px solid ${VE}44`, cursor:'pointer', fontSize:13, fontWeight:'bold' }} onClick={()=>verPDF(c)}>PDF</button>
                <button style={{ padding:'11px 14px', borderRadius:14, background:'transparent', border:`1px solid ${YE}44`, color:YE, cursor:'pointer', fontSize:14 }} onClick={()=>editar(c)}>✏️</button>
                <button style={{ padding:'11px 14px', borderRadius:14, background:'transparent', border:`1px solid ${RE}44`, color:RE, cursor:'pointer', fontSize:14 }} onClick={()=>setCots(cots.filter(x=>x.id!==c.id))}>✕</button>
              </div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

export default Cotizar;
