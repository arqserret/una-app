import React, { useState, useEffect } from 'react';

const P = { verde:'#2D6E5E', verdet:'#E8F2EF', malva:'#9B7BAE', malvat:'#F3EEF7', dorado:'#C4973A', doradot:'#FBF5E6', gris:'#8A8A8A', grisOs:'#2D2D2D' };

function Finanzas({ onVolver }) {
  const [movimientos, setMovimientos] = useState(() => { const g = localStorage.getItem('una_movimientos'); return g ? JSON.parse(g) : []; });
  const [tipo, setTipo] = useState('negocio');
  const [categoria, setCategoria] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  useEffect(() => { localStorage.setItem('una_movimientos', JSON.stringify(movimientos)); }, [movimientos]);

  const agregar = () => {
    if (!descripcion || !monto) return;
    setMovimientos([{ id:Date.now(), tipo, categoria, descripcion, monto:parseFloat(monto), fecha:new Date().toLocaleDateString('es-MX') }, ...movimientos]);
    setDescripcion(''); setMonto('');
  };
  const eliminar = (id) => setMovimientos(movimientos.filter(m => m.id !== id));
  const total = (t,c) => movimientos.filter(m => m.tipo===t&&m.categoria===c).reduce((a,m)=>a+m.monto,0);
  const tNI=total('negocio','ingreso'), tNG=total('negocio','gasto'), tHI=total('hogar','ingreso'), tHG=total('hogar','gasto');

  return (
    <div style={e.contenedor}>
      <div style={e.topBar}>
        <button style={e.volver} onClick={onVolver}>← Volver</button>
        <h2 style={e.titulo}>💰 Mis Finanzas</h2>
      </div>
      <div style={{ padding:'20px' }}>
        <div style={e.tarjetasFila}>
          {[{label:'🏢 Negocio', color:P.verde, i:tNI, g:tNG},{label:'🏠 Hogar', color:P.dorado, i:tHI, g:tHG}].map(t => (
            <div key={t.label} style={{ ...e.tarjeta, borderTop:`3px solid ${t.color}` }}>
              <p style={e.tarjetaLabel}>{t.label}</p>
              <p style={{ ...e.tarjetaNum, color:P.verde }}>+${t.i.toLocaleString('es-MX')}</p>
              <p style={{ ...e.tarjetaNum, color:P.malva }}>-${t.g.toLocaleString('es-MX')}</p>
              <div style={e.sep}/>
              <p style={e.neto}>Neto: <strong style={{ color:t.i-t.g>=0?P.verde:P.malva }}>${(t.i-t.g).toLocaleString('es-MX')}</strong></p>
            </div>
          ))}
        </div>

        <div style={e.formulario}>
          <p style={e.formTitulo}>Registrar movimiento</p>
          <div style={e.fila}>
            <button style={tipo==='negocio'?{...e.tab,borderColor:P.verde,color:P.verde,backgroundColor:P.verdet,fontWeight:'bold'}:e.tab} onClick={()=>setTipo('negocio')}>🏢 Negocio</button>
            <button style={tipo==='hogar'?{...e.tab,borderColor:P.dorado,color:P.dorado,backgroundColor:P.doradot,fontWeight:'bold'}:e.tab} onClick={()=>setTipo('hogar')}>🏠 Hogar</button>
          </div>
          <div style={e.fila}>
            <button style={categoria==='ingreso'?{...e.tab,borderColor:P.verde,color:P.verde,backgroundColor:P.verdet,fontWeight:'bold'}:e.tab} onClick={()=>setCategoria('ingreso')}>✅ Ingreso</button>
            <button style={categoria==='gasto'?{...e.tab,borderColor:P.malva,color:P.malva,backgroundColor:P.malvat,fontWeight:'bold'}:e.tab} onClick={()=>setCategoria('gasto')}>❌ Gasto</button>
          </div>
          <input style={e.input} placeholder="¿Qué fue? (ej: Venta de tamales)" value={descripcion} onChange={ev=>setDescripcion(ev.target.value)} />
          <input style={e.input} placeholder="Monto en pesos" type="number" value={monto} onChange={ev=>setMonto(ev.target.value)} />
          <button style={e.botonAgregar} onClick={agregar}>+ Agregar movimiento</button>
        </div>

        <div style={e.dosColumnas}>
          {[{key:'negocio',label:'🏢 Negocio',color:P.verde},{key:'hogar',label:'🏠 Hogar',color:P.dorado}].map(col => (
            <div key={col.key} style={{ ...e.columna, borderTop:`3px solid ${col.color}` }}>
              <p style={{ ...e.columnaTitle, color:col.color }}>{col.label}</p>
              {movimientos.filter(m=>m.tipo===col.key).length===0 ? <p style={e.vacio}>Sin movimientos</p> :
                movimientos.filter(m=>m.tipo===col.key).map(m => (
                  <div key={m.id} style={e.item}>
                    <span style={{ color:m.categoria==='ingreso'?P.verde:P.malva, fontSize:'10px', marginTop:'4px' }}>●</span>
                    <div style={{ flex:1 }}>
                      <p style={e.itemDesc}>{m.descripcion}</p>
                      <p style={e.itemFecha}>{m.fecha}</p>
                      <p style={{ color:m.categoria==='ingreso'?P.verde:P.malva, fontWeight:'bold', fontSize:'13px', margin:'2px 0 0' }}>{m.categoria==='ingreso'?'+':'-'}${m.monto.toLocaleString('es-MX')}</p>
                    </div>
                    <button style={e.borrar} onClick={()=>eliminar(m.id)}>🗑️</button>
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const e = {
  contenedor:{ backgroundColor:'#FFFFFF', minHeight:'100vh', fontFamily:'Arial,sans-serif' },
  topBar:{ background:'linear-gradient(135deg,#2D6E5E,#9B7BAE)', padding:'20px 20px 24px', display:'flex', alignItems:'center', gap:'12px' },
  volver:{ background:'rgba(255,255,255,0.25)', border:'none', color:'white', padding:'8px 14px', borderRadius:'20px', cursor:'pointer', fontSize:'13px' },
  titulo:{ color:'white', fontSize:'20px', margin:0, fontWeight:'normal', letterSpacing:'1px' },
  tarjetasFila:{ display:'flex', gap:'12px', marginBottom:'16px' },
  tarjeta:{ flex:1, background:'white', borderRadius:'16px', padding:'14px', boxShadow:'0 4px 16px rgba(0,0,0,0.08)', border:'1px solid #EAE7E0' },
  tarjetaLabel:{ fontWeight:'bold', fontSize:'13px', color:'#2D2D2D', margin:'0 0 8px 0' },
  tarjetaNum:{ fontWeight:'bold', fontSize:'14px', margin:'2px 0' },
  sep:{ height:'1px', backgroundColor:'#F5F3EE', margin:'8px 0' },
  neto:{ fontSize:'12px', color:'#8A8A8A', margin:0 },
  formulario:{ background:'white', borderRadius:'20px', padding:'18px', boxShadow:'0 4px 20px rgba(0,0,0,0.08)', border:'1px solid #EAE7E0', marginBottom:'16px' },
  formTitulo:{ fontWeight:'bold', color:'#2D2D2D', fontSize:'14px', margin:'0 0 14px 0' },
  fila:{ display:'flex', gap:'8px', marginBottom:'10px' },
  tab:{ flex:1, padding:'10px', borderRadius:'12px', border:'1.5px solid #EAE7E0', background:'#FAF9F7', cursor:'pointer', fontSize:'13px', color:'#8A8A8A' },
  input:{ width:'100%', padding:'12px 14px', borderRadius:'12px', border:'1.5px solid #EAE7E0', fontSize:'14px', marginBottom:'10px', boxSizing:'border-box', backgroundColor:'#FAF9F7', color:'#2D2D2D' },
  botonAgregar:{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#2D6E5E,#4AA08A)', color:'white', border:'none', borderRadius:'14px', fontSize:'15px', cursor:'pointer', fontWeight:'bold' },
  dosColumnas:{ display:'flex', gap:'12px', alignItems:'flex-start' },
  columna:{ flex:1, background:'white', borderRadius:'16px', padding:'14px', boxShadow:'0 4px 16px rgba(0,0,0,0.07)', border:'1px solid #EAE7E0' },
  columnaTitle:{ fontWeight:'bold', fontSize:'13px', marginBottom:'10px' },
  item:{ display:'flex', gap:'8px', alignItems:'flex-start', padding:'8px 0', borderBottom:'1px solid #FAF9F7' },
  itemDesc:{ fontSize:'12px', color:'#2D2D2D', margin:0 },
  itemFecha:{ fontSize:'11px', color:'#B0A898', margin:'1px 0 0' },
  borrar:{ background:'none', border:'none', cursor:'pointer', fontSize:'12px', opacity:0.4 },
  vacio:{ color:'#C4B89A', fontSize:'12px', textAlign:'center', padding:'16px 0' },
};

export default Finanzas;
