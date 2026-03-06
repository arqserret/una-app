import React, { useState, useEffect } from 'react';

const BG='#0D1117', CARD='#161B22', CARD2='#1C2333', BR='rgba(255,255,255,0.08)', TXT='#E6EDF3', TXT2='rgba(255,255,255,0.4)', VE='#4AA08A', VED='#0A1F15', YE='#E8BF6A', YED='#1A1208', RE='#F47067';

function Finanzas({ onVolver }) {
  const [movs, setMovs] = useState(() => { try { return JSON.parse(localStorage.getItem('una_movimientos'))||[]; } catch { return []; } });
  const [tipo, setTipo] = useState('negocio');
  const [cat, setCat] = useState('ingreso');
  const [desc, setDesc] = useState('');
  const [monto, setMonto] = useState('');

  useEffect(() => { localStorage.setItem('una_movimientos', JSON.stringify(movs)); }, [movs]);

  const agregar = () => {
    if (!desc || !monto) return;
    setMovs([{ id:Date.now(), tipo, cat, desc, monto:parseFloat(monto), fecha:new Date().toLocaleDateString('es-MX') }, ...movs]);
    setDesc(''); setMonto('');
  };

  const total = (t,c) => movs.filter(m=>m.tipo===t&&m.cat===c).reduce((a,m)=>a+m.monto, 0);
  const NI=total('negocio','ingreso'), NG=total('negocio','gasto'), HI=total('hogar','ingreso'), HG=total('hogar','gasto');

  const pill = (activo, colorBg, colorTxt, colorBorder) => ({
    flex:1, padding:'12px 8px', borderRadius:14, border:`1px solid ${activo?colorBorder:BR}`,
    background: activo?colorBg:'transparent', cursor:'pointer', fontSize:14,
    color: activo?colorTxt:TXT2, fontWeight: activo?'bold':'normal',
  });

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:'Arial,sans-serif' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0A1F15,#163028)', padding:'52px 20px 28px', display:'flex', alignItems:'center', gap:14 }}>
        <button style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'white', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:18, flexShrink:0 }} onClick={onVolver}>←</button>
        <div style={{flex:1}}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, margin:0, letterSpacing:2 }}>MODULO</p>
          <h2 style={{ color:'white', fontSize:24, margin:0, fontWeight:'bold' }}>Mis Finanzas</h2>
        </div>
        <span style={{fontSize:42}}>💰</span>
      </div>

      <div style={{ padding:16 }}>
        {/* Resumen */}
        <div style={{ display:'flex', gap:12, marginBottom:14 }}>
          {[{l:'Negocio',c:VE,cd:VED,i:NI,g:NG},{l:'Hogar',c:YE,cd:YED,i:HI,g:HG}].map(t => (
            <div key={t.l} style={{ flex:1, background:CARD, borderRadius:22, padding:20, border:`1px solid ${BR}`, borderTop:`2px solid ${t.c}` }}>
              <p style={{ color:t.c, fontWeight:'bold', fontSize:12, margin:'0 0 12px', letterSpacing:1 }}>{t.l.toUpperCase()}</p>
              <p style={{ color:VE, fontWeight:'bold', fontSize:20, margin:'0 0 4px' }}>+${t.i.toLocaleString('es-MX')}</p>
              <p style={{ color:RE, fontWeight:'bold', fontSize:20, margin:'0 0 12px' }}>-${t.g.toLocaleString('es-MX')}</p>
              <div style={{ height:1, background:BR, margin:'0 0 10px' }}/>
              <p style={{ color:TXT2, fontSize:12, margin:0 }}>Neto <strong style={{ color:t.i-t.g>=0?VE:RE }}>${(t.i-t.g).toLocaleString('es-MX')}</strong></p>
            </div>
          ))}
        </div>

        {/* Formulario */}
        <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}` }}>
          <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>Registrar movimiento</p>
          <div style={{ display:'flex', gap:10, marginBottom:10 }}>
            <button style={pill(tipo==='negocio',VED,VE,VE)} onClick={()=>setTipo('negocio')}>Negocio</button>
            <button style={pill(tipo==='hogar',YED,YE,YE)} onClick={()=>setTipo('hogar')}>Hogar</button>
          </div>
          <div style={{ display:'flex', gap:10, marginBottom:10 }}>
            <button style={pill(cat==='ingreso',VED,VE,VE)} onClick={()=>setCat('ingreso')}>+ Ingreso</button>
            <button style={pill(cat==='gasto','#2A1010',RE,RE)} onClick={()=>setCat('gasto')}>- Gasto</button>
          </div>
          <input style={{ width:'100%', padding:'14px 16px', borderRadius:16, border:`1px solid ${BR}`, fontSize:14, marginBottom:10, boxSizing:'border-box', background:CARD2, color:TXT }} placeholder="Que fue? (ej: Venta de tamales)" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input style={{ width:'100%', padding:'14px 16px', borderRadius:16, border:`1px solid ${BR}`, fontSize:14, marginBottom:12, boxSizing:'border-box', background:CARD2, color:TXT }} placeholder="Monto en pesos" type="number" value={monto} onChange={e=>setMonto(e.target.value)} />
          <button style={{ width:'100%', padding:15, background:'linear-gradient(135deg,#0A1F15,#4AA08A)', color:'white', border:'none', borderRadius:16, fontSize:15, cursor:'pointer', fontWeight:'bold' }} onClick={agregar}>Agregar movimiento</button>
        </div>

        {/* Listas por categoria */}
        {[{k:'negocio',l:'Negocio',c:VE},{k:'hogar',l:'Hogar',c:YE}].map(col => (
          <div key={col.k} style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}`, borderLeft:`2px solid ${col.c}` }}>
            <p style={{ color:col.c, fontWeight:'bold', fontSize:14, margin:'0 0 14px' }}>{col.l}</p>
            {movs.filter(m=>m.tipo===col.k).length===0
              ? <p style={{ color:TXT2, fontSize:13, textAlign:'center', padding:'12px 0', margin:0 }}>Sin movimientos aun</p>
              : movs.filter(m=>m.tipo===col.k).map(m => (
                  <div key={m.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${BR}` }}>
                    <div style={{flex:1}}>
                      <p style={{ color:TXT, fontSize:14, margin:'0 0 2px', fontWeight:'bold' }}>{m.desc}</p>
                      <p style={{ color:TXT2, fontSize:11, margin:0 }}>{m.fecha}</p>
                    </div>
                    <p style={{ color:m.cat==='ingreso'?VE:RE, fontWeight:'bold', fontSize:17, margin:0 }}>{m.cat==='ingreso'?'+':'-'}${m.monto.toLocaleString('es-MX')}</p>
                    <button style={{ background:'none', border:'none', cursor:'pointer', color:TXT2, fontSize:16, padding:'4px 8px' }} onClick={()=>setMovs(movs.filter(x=>x.id!==m.id))}>✕</button>
                  </div>
                ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default Finanzas;
