import React, { useState, useEffect } from 'react';

const BG='#0D1117', CARD='#161B22', CARD2='#1C2333', BR='rgba(255,255,255,0.08)', TXT='#E6EDF3', TXT2='rgba(255,255,255,0.4)', VE='#4AA08A', MA='#C4A0D4', YE='#E8BF6A', RE='#F47067';
const AVTS = ['#4AA08A','#C4A0D4','#E8BF6A','#5B9BD5','#B48EC4'];

function Clientes({ onVolver }) {
  const [cls, setCls] = useState(() => { try { return JSON.parse(localStorage.getItem('una_clientes'))||[]; } catch { return []; } });
  const [busq, setBusq] = useState('');
  const [form, setForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tel, setTel] = useState('');
  const [notas, setNotas] = useState('');
  const [cita, setCita] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => { localStorage.setItem('una_clientes', JSON.stringify(cls)); }, [cls]);

  const guardar = () => {
    if (!nombre) return;
    if (editId) {
      setCls(cls.map(c => c.id===editId ? {...c, nombre, telefono:tel, notas, proximaCita:cita} : c));
      setEditId(null);
    } else {
      setCls([{ id:Date.now(), nombre, telefono:tel, notas, proximaCita:cita, fechaAlta:new Date().toLocaleDateString('es-MX') }, ...cls]);
    }
    setNombre(''); setTel(''); setNotas(''); setCita(''); setForm(false);
  };

  const cancelar = () => { setEditId(null); setNombre(''); setTel(''); setNotas(''); setCita(''); setForm(false); };
  const editar = (c) => { setEditId(c.id); setNombre(c.nombre); setTel(c.telefono||''); setNotas(c.notas||''); setCita(c.proximaCita||''); setForm(true); };

  const hoy = new Date().toISOString().split('T')[0];
  const filtrados = cls.filter(c => c.nombre.toLowerCase().includes(busq.toLowerCase()));

  const inp = { width:'100%', padding:'14px 16px', borderRadius:16, border:`1px solid ${BR}`, fontSize:14, marginBottom:10, boxSizing:'border-box', background:CARD2, color:TXT };

  return (
    <div style={{ background:BG, minHeight:'100vh', fontFamily:'Arial,sans-serif' }}>
      <div style={{ background:'linear-gradient(135deg,#160D22,#2E1A48)', padding:'52px 20px 28px', display:'flex', alignItems:'center', gap:14 }}>
        <button style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'white', width:40, height:40, borderRadius:'50%', cursor:'pointer', fontSize:18, flexShrink:0 }} onClick={onVolver}>←</button>
        <div style={{flex:1}}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, margin:0, letterSpacing:2 }}>MODULO</p>
          <h2 style={{ color:'white', fontSize:24, margin:0, fontWeight:'bold' }}>Mis Clientes</h2>
        </div>
        <span style={{fontSize:42}}>👩‍👧</span>
      </div>

      <div style={{ padding:16 }}>
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          <input style={{ flex:1, padding:'13px 16px', borderRadius:16, border:`1px solid ${BR}`, background:CARD, color:TXT, fontSize:14 }} placeholder="Buscar clienta..." value={busq} onChange={e=>setBusq(e.target.value)} />
          <button style={{ padding:'13px 20px', borderRadius:16, background:'linear-gradient(135deg,#2E1A48,#7A5C8A)', color:'white', border:'none', cursor:'pointer', fontWeight:'bold', fontSize:14 }} onClick={()=>setForm(true)}>+ Nueva</button>
        </div>

        {form && (
          <div style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}` }}>
            <p style={{ color:TXT, fontWeight:'bold', fontSize:15, margin:'0 0 16px' }}>{editId?'Editar clienta':'Nueva clienta'}</p>
            <input style={inp} placeholder="Nombre completo *" value={nombre} onChange={e=>setNombre(e.target.value)} />
            <input style={inp} placeholder="Telefono WhatsApp" type="tel" value={tel} onChange={e=>setTel(e.target.value)} />
            <input style={inp} placeholder="Notas" value={notas} onChange={e=>setNotas(e.target.value)} />
            <label style={{ color:TXT2, fontSize:12, display:'block', marginBottom:6 }}>Proxima cita o seguimiento</label>
            <input style={inp} type="date" value={cita} min={hoy} onChange={e=>setCita(e.target.value)} />
            <div style={{ display:'flex', gap:10 }}>
              <button style={{ flex:1, padding:14, borderRadius:16, border:`1px solid ${BR}`, background:'transparent', color:TXT2, cursor:'pointer', fontSize:14 }} onClick={cancelar}>Cancelar</button>
              <button style={{ flex:2, padding:14, borderRadius:16, border:'none', background:'linear-gradient(135deg,#2E1A48,#7A5C8A)', color:'white', cursor:'pointer', fontSize:14, fontWeight:'bold' }} onClick={guardar}>{editId?'Guardar':'Agregar'}</button>
            </div>
          </div>
        )}

        {cls.length===0 && !form && (
          <div style={{ textAlign:'center', padding:'52px 20px' }}>
            <p style={{fontSize:52,margin:'0 0 14px'}}>👩‍👧</p>
            <p style={{color:TXT,fontWeight:'bold',margin:'0 0 6px',fontSize:16}}>Aun no tienes clientas</p>
            <p style={{color:TXT2,fontSize:13,margin:0}}>Toca "+ Nueva" para comenzar</p>
          </div>
        )}

        {filtrados.map((c, i) => {
          const tv=!!c.proximaCita, venc=tv&&c.proximaCita<hoy, citH=tv&&c.proximaCita===hoy;
          const ac = AVTS[i % AVTS.length];
          return (
            <div key={c.id} style={{ background:CARD, borderRadius:22, padding:20, marginBottom:14, border:`1px solid ${BR}` }}>
              <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:14 }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background:ac+'18', border:`2px solid ${ac}44`, color:ac, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:22, flexShrink:0 }}>
                  {c.nombre.charAt(0).toUpperCase()}
                </div>
                <div style={{flex:1}}>
                  <p style={{ fontWeight:'bold', fontSize:16, margin:'0 0 3px', color:TXT }}>{c.nombre}</p>
                  {c.notas && <p style={{ fontSize:12, color:TXT2, margin:0 }}>{c.notas}</p>}
                </div>
              </div>
              {tv && (
                <div style={{ borderRadius:12, padding:'10px 14px', fontSize:12, fontWeight:'bold', marginBottom:14, background:citH?'#1A1208':venc?'#2A1010':'rgba(74,160,138,0.08)', color:citH?YE:venc?RE:VE, border:`1px solid ${citH?YE:venc?RE:VE}44` }}>
                  {citH?'Cita HOY —':venc?'Vencida —':'Proxima —'} {new Date(c.proximaCita+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long'})}
                </div>
              )}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {c.telefono && <>
                  <a href={`tel:${c.telefono}`} style={{ padding:'9px 16px', borderRadius:12, fontSize:12, textDecoration:'none', fontWeight:'bold', border:`1px solid ${VE}44`, color:VE }}>Llamar</a>
                  <a href={`https://wa.me/52${c.telefono}`} target="_blank" rel="noreferrer" style={{ padding:'9px 16px', borderRadius:12, fontSize:12, textDecoration:'none', fontWeight:'bold', border:'1px solid #25D36644', color:'#25D366' }}>WhatsApp</a>
                </>}
                <button style={{ padding:'9px 16px', borderRadius:12, fontSize:12, fontWeight:'bold', border:`1px solid ${YE}44`, color:YE, cursor:'pointer', background:'transparent' }} onClick={()=>editar(c)}>Editar</button>
                <button style={{ padding:'9px 16px', borderRadius:12, fontSize:12, fontWeight:'bold', border:`1px solid ${RE}44`, color:RE, cursor:'pointer', background:'transparent' }} onClick={()=>setCls(cls.filter(x=>x.id!==c.id))}>Borrar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Clientes;
