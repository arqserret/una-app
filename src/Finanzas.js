import React, { useState, useEffect } from 'react';

const D = { bg:'#0D1117', card:'#161B22', card2:'#1C2333', border:'rgba(255,255,255,0.08)', text:'#E6EDF3', text2:'rgba(255,255,255,0.5)', verde:'#4AA08A', verdeD:'#1A3D35', malva:'#C4A0D4', malvaD:'#2E1F3E', dorado:'#E8BF6A', doradoD:'#3A2A10', rojo:'#F47067' };

function Finanzas({ onVolver }) {
  const [movimientos, setMovimientos] = useState(() => { const g=localStorage.getItem('una_movimientos'); return g?JSON.parse(g):[]; });
  const [tipo, setTipo] = useState('negocio');
  const [categoria, setCategoria] = useState('ingreso');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  useEffect(() => { localStorage.setItem('una_movimientos', JSON.stringify(movimientos)); }, [movimientos]);

  const agregar = () => {
    if(!descripcion||!monto) return;
    setMovimientos([{id:Date.now(),tipo,categoria,descripcion,monto:parseFloat(monto),fecha:new Date().toLocaleDateString('es-MX')},...movimientos]);
    setDescripcion(''); setMonto('');
  };
  const eliminar = (id) => setMovimientos(movimientos.filter(m=>m.id!==id));
  const total = (t,c) => movimientos.filter(m=>m.tipo===t&&m.categoria===c).reduce((a,m)=>a+m.monto,0);
  const tNI=total('negocio','ingreso'),tNG=total('negocio','gasto'),tHI=total('hogar','ingreso'),tHG=total('hogar','gasto');

  return (
    <div style={e.page}>
      <div style={e.header}>
        <button style={e.back} onClick={onVolver}>←</button>
        <div>
          <p style={e.headerSub}>Módulo</p>
          <h2 style={e.headerTitle}>Mis Finanzas</h2>
        </div>
        <span style={e.headerEmoji}>💰</span>
      </div>

      <div style={e.body}>
        {/* Resumen */}
        <div style={e.row}>
          {[{label:'Negocio',color:D.verde,colorD:D.verdeD,i:tNI,g:tNG},{label:'Hogar',color:D.dorado,colorD:D.doradoD,i:tHI,g:tHG}].map(t=>(
            <div key={t.label} style={{...e.card,flex:1,borderTop:`2px solid ${t.color}`}}>
              <p style={e.cardLabel}>{t.label}</p>
              <p style={{...e.cardNum,color:D.verde}}>+${t.i.toLocaleString('es-MX')}</p>
              <p style={{...e.cardNum,color:D.rojo}}>-${t.g.toLocaleString('es-MX')}</p>
              <div style={e.divider}/>
              <p style={e.neto}>Neto <strong style={{color:t.i-t.g>=0?D.verde:D.rojo}}>${(t.i-t.g).toLocaleString('es-MX')}</strong></p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div style={e.card}>
          <p style={e.cardTitle}>Registrar movimiento</p>
          <div style={e.row}>
            <button style={tipo==='negocio'?{...e.pill,backgroundColor:D.verdeD,color:D.verde,borderColor:D.verde}:e.pill} onClick={()=>setTipo('negocio')}>Negocio</button>
            <button style={tipo==='hogar'?{...e.pill,backgroundColor:D.doradoD,color:D.dorado,borderColor:D.dorado}:e.pill} onClick={()=>setTipo('hogar')}>Hogar</button>
          </div>
          <div style={{...e.row,marginTop:'8px'}}>
            <button style={categoria==='ingreso'?{...e.pill,backgroundColor:D.verdeD,color:D.verde,borderColor:D.verde}:e.pill} onClick={()=>setCategoria('ingreso')}>+ Ingreso</button>
            <button style={categoria==='gasto'?{...e.pill,backgroundColor:'#2A1010',color:D.rojo,borderColor:D.rojo}:e.pill} onClick={()=>setCategoria('gasto')}>− Gasto</button>
          </div>
          <input style={e.input} placeholder="¿Qué fue?" value={descripcion} onChange={ev=>setDescripcion(ev.target.value)}/>
          <input style={e.input} placeholder="Monto en pesos" type="number" value={monto} onChange={ev=>setMonto(ev.target.value)}/>
          <button style={e.btn} onClick={agregar}>Agregar movimiento</button>
        </div>

        {/* Listas */}
        {[{key:'negocio',label:'Negocio',color:D.verde},{key:'hogar',label:'Hogar',color:D.dorado}].map(col=>(
          <div key={col.key} style={{...e.card,borderLeft:`2px solid ${col.color}`}}>
            <p style={{...e.cardTitle,color:col.color}}>{col.label}</p>
            {movimientos.filter(m=>m.tipo===col.key).length===0
              ? <p style={e.empty}>Sin movimientos aún</p>
              : movimientos.filter(m=>m.tipo===col.key).map(m=>(
                <div key={m.id} style={e.item}>
                  <div style={{flex:1}}>
                    <p style={e.itemTitle}>{m.descripcion}</p>
                    <p style={e.itemSub}>{m.fecha}</p>
                  </div>
                  <p style={{...e.itemMonto,color:m.categoria==='ingreso'?D.verde:D.rojo}}>{m.categoria==='ingreso'?'+':'-'}${m.monto.toLocaleString('es-MX')}</p>
                  <button style={e.del} onClick={()=>eliminar(m.id)}>✕</button>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

const e = {
  page:{backgroundColor:D.bg,minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  header:{background:'linear-gradient(135deg,#1A3D35,#2D6E5E)',padding:'52px 20px 24px',display:'flex',alignItems:'center',gap:'14px'},
  back:{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'16px',flexShrink:0},
  headerSub:{color:'rgba(255,255,255,0.6)',fontSize:'11px',margin:0,letterSpacing:'1px',textTransform:'uppercase'},
  headerTitle:{color:'white',fontSize:'22px',margin:0,fontWeight:'bold'},
  headerEmoji:{fontSize:'36px',marginLeft:'auto'},
  body:{padding:'16px'},
  row:{display:'flex',gap:'12px'},
  card:{background:D.card,borderRadius:'20px',padding:'18px',marginBottom:'12px',border:`1px solid ${D.border}`},
  cardLabel:{color:D.text2,fontSize:'12px',margin:'0 0 6px',textTransform:'uppercase',letterSpacing:'0.5px'},
  cardNum:{fontWeight:'bold',fontSize:'16px',margin:'2px 0'},
  divider:{height:'1px',backgroundColor:D.border,margin:'10px 0'},
  neto:{fontSize:'12px',color:D.text2,margin:0},
  cardTitle:{color:D.text,fontWeight:'bold',fontSize:'14px',margin:'0 0 14px'},
  pill:{flex:1,padding:'10px',borderRadius:'12px',border:`1px solid ${D.border}`,background:'transparent',cursor:'pointer',fontSize:'13px',color:D.text2},
  input:{width:'100%',padding:'13px 16px',borderRadius:'14px',border:`1px solid ${D.border}`,fontSize:'14px',marginTop:'10px',boxSizing:'border-box',backgroundColor:D.card2,color:D.text},
  btn:{width:'100%',padding:'14px',background:'linear-gradient(135deg,#2D6E5E,#4AA08A)',color:'white',border:'none',borderRadius:'14px',fontSize:'15px',cursor:'pointer',fontWeight:'bold',marginTop:'12px'},
  item:{display:'flex',gap:'10px',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${D.border}`},
  itemTitle:{fontSize:'14px',color:D.text,margin:0},
  itemSub:{fontSize:'11px',color:D.text2,margin:'2px 0 0'},
  itemMonto:{fontWeight:'bold',fontSize:'15px',margin:0,whiteSpace:'nowrap'},
  del:{background:'none',border:'none',cursor:'pointer',color:D.text2,fontSize:'14px',padding:'4px'},
  empty:{color:D.text2,fontSize:'13px',textAlign:'center',padding:'12px 0',margin:0},
};

export default Finanzas;
