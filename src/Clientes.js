import React, { useState, useEffect } from 'react';

const D = { bg:'#0D1117', card:'#161B22', card2:'#1C2333', border:'rgba(255,255,255,0.08)', text:'#E6EDF3', text2:'rgba(255,255,255,0.5)', verde:'#4AA08A', verdeD:'#1A3D35', malva:'#C4A0D4', malvaD:'#2E1F3E', dorado:'#E8BF6A', doradoD:'#3A2A10', rojo:'#F47067' };
const COLORES_AVATAR = ['#4AA08A','#C4A0D4','#E8BF6A','#5B9BD5','#7A8C5E'];

function Clientes({ onVolver }) {
  const [clientes, setClientes] = useState(() => { const g=localStorage.getItem('una_clientes'); return g?JSON.parse(g):[]; });
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [proximaCita, setProximaCita] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => { localStorage.setItem('una_clientes', JSON.stringify(clientes)); }, [clientes]);

  const guardar = () => {
    if(!nombre) return;
    if(editandoId){setClientes(clientes.map(c=>c.id===editandoId?{...c,nombre,telefono,notas,proximaCita}:c));setEditandoId(null);}
    else setClientes([{id:Date.now(),nombre,telefono,notas,proximaCita,fechaAlta:new Date().toLocaleDateString('es-MX')},...clientes]);
    setNombre('');setTelefono('');setNotas('');setProximaCita('');setMostrarForm(false);
  };
  const cancelar = () => {setEditandoId(null);setNombre('');setTelefono('');setNotas('');setProximaCita('');setMostrarForm(false);};
  const eliminar = (id) => setClientes(clientes.filter(c=>c.id!==id));
  const editar = (c) => {setEditandoId(c.id);setNombre(c.nombre);setTelefono(c.telefono);setNotas(c.notas);setProximaCita(c.proximaCita);setMostrarForm(true);};

  const hoy = new Date().toISOString().split('T')[0];
  const filtrados = clientes.filter(c=>c.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div style={e.page}>
      <div style={e.header}>
        <button style={e.back} onClick={onVolver}>←</button>
        <div>
          <p style={e.headerSub}>Módulo</p>
          <h2 style={e.headerTitle}>Mis Clientes</h2>
        </div>
        <span style={e.headerEmoji}>👩‍👧</span>
      </div>

      <div style={e.body}>
        <div style={e.searchRow}>
          <input style={e.search} placeholder="Buscar clienta..." value={busqueda} onChange={ev=>setBusqueda(ev.target.value)}/>
          <button style={e.btnNueva} onClick={()=>setMostrarForm(true)}>+ Nueva</button>
        </div>

        {mostrarForm && (
          <div style={e.card}>
            <p style={e.cardTitle}>{editandoId?'Editar clienta':'Nueva clienta'}</p>
            <input style={e.input} placeholder="Nombre completo *" value={nombre} onChange={ev=>setNombre(ev.target.value)}/>
            <input style={e.input} placeholder="Teléfono WhatsApp" type="tel" value={telefono} onChange={ev=>setTelefono(ev.target.value)}/>
            <input style={e.input} placeholder="Notas" value={notas} onChange={ev=>setNotas(ev.target.value)}/>
            <label style={e.label}>Próxima cita o seguimiento</label>
            <input style={e.input} type="date" value={proximaCita} min={hoy} onChange={ev=>setProximaCita(ev.target.value)}/>
            <div style={e.row}>
              <button style={e.btnSec} onClick={cancelar}>Cancelar</button>
              <button style={e.btn} onClick={guardar}>{editandoId?'Guardar':'Agregar'}</button>
            </div>
          </div>
        )}

        {clientes.length===0&&!mostrarForm&&(
          <div style={e.empty}><p style={{fontSize:'48px',margin:'0 0 12px'}}>👩‍👧</p><p style={{color:D.text,fontWeight:'bold',margin:'0 0 6px'}}>Aún no tienes clientas</p><p style={{color:D.text2,fontSize:'13px',margin:0}}>Toca "+ Nueva" para comenzar</p></div>
        )}

        {filtrados.map((c,idx)=>{
          const tieneCita=!!c.proximaCita, citaVencida=tieneCita&&c.proximaCita<hoy, citaHoy=tieneCita&&c.proximaCita===hoy;
          const colorAvatar=COLORES_AVATAR[idx%COLORES_AVATAR.length];
          return (
            <div key={c.id} style={e.card}>
              <div style={{display:'flex',gap:'14px',alignItems:'center',marginBottom:'12px'}}>
                <div style={{...e.avatar,backgroundColor:colorAvatar+'22',borderColor:colorAvatar+'44',color:colorAvatar}}>{c.nombre.charAt(0).toUpperCase()}</div>
                <div style={{flex:1}}>
                  <p style={e.clienteNombre}>{c.nombre}</p>
                  {c.notas&&<p style={e.clienteNota}>{c.notas}</p>}
                </div>
              </div>
              {tieneCita&&(
                <div style={{...e.citaBadge,backgroundColor:citaHoy?D.doradoD:citaVencida?'#2A1010':D.verdeD,borderColor:citaHoy?D.dorado:citaVencida?D.rojo:D.verde,color:citaHoy?D.dorado:citaVencida?D.rojo:D.verde}}>
                  {citaHoy?'¡Cita HOY!':citaVencida?'Vencida:':'Próxima:'} {new Date(c.proximaCita+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long'})}
                </div>
              )}
              <div style={e.acciones}>
                {c.telefono&&<>
                  <a href={`tel:${c.telefono}`} style={{...e.accion,borderColor:D.verde+'44',color:D.verde}}>Llamar</a>
                  <a href={`https://wa.me/52${c.telefono}`} target="_blank" rel="noreferrer" style={{...e.accion,borderColor:'#25D36644',color:'#25D366'}}>WhatsApp</a>
                </>}
                <button style={{...e.accion,borderColor:D.dorado+'44',color:D.dorado,cursor:'pointer',background:'transparent'}} onClick={()=>editar(c)}>Editar</button>
                <button style={{...e.accion,borderColor:D.rojo+'44',color:D.rojo,cursor:'pointer',background:'transparent'}} onClick={()=>eliminar(c.id)}>Borrar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const e = {
  page:{backgroundColor:D.bg,minHeight:'100vh',fontFamily:'Arial,sans-serif'},
  header:{background:'linear-gradient(135deg,#2E1F3E,#7A5C8A)',padding:'52px 20px 24px',display:'flex',alignItems:'center',gap:'14px'},
  back:{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:'36px',height:'36px',borderRadius:'50%',cursor:'pointer',fontSize:'16px',flexShrink:0},
  headerSub:{color:'rgba(255,255,255,0.6)',fontSize:'11px',margin:0,letterSpacing:'1px',textTransform:'uppercase'},
  headerTitle:{color:'white',fontSize:'22px',margin:0,fontWeight:'bold'},
  headerEmoji:{fontSize:'36px',marginLeft:'auto'},
  body:{padding:'16px'},
  searchRow:{display:'flex',gap:'10px',marginBottom:'16px'},
  search:{flex:1,padding:'13px 16px',borderRadius:'14px',border:`1px solid ${D.border}`,backgroundColor:D.card,color:D.text,fontSize:'14px'},
  btnNueva:{padding:'13px 20px',borderRadius:'14px',background:'linear-gradient(135deg,#7A5C8A,#C4A0D4)',color:'white',border:'none',cursor:'pointer',fontWeight:'bold',fontSize:'14px',whiteSpace:'nowrap'},
  card:{background:D.card,borderRadius:'20px',padding:'18px',marginBottom:'12px',border:`1px solid ${D.border}`},
  cardTitle:{color:D.text,fontWeight:'bold',fontSize:'14px',margin:'0 0 14px'},
  label:{color:D.text2,fontSize:'12px',display:'block',marginTop:'8px',marginBottom:'4px'},
  input:{width:'100%',padding:'13px 16px',borderRadius:'14px',border:`1px solid ${D.border}`,fontSize:'14px',marginTop:'8px',boxSizing:'border-box',backgroundColor:D.card2,color:D.text},
  row:{display:'flex',gap:'10px',marginTop:'12px'},
  btn:{flex:2,padding:'13px',borderRadius:'14px',border:'none',background:'linear-gradient(135deg,#7A5C8A,#C4A0D4)',color:'white',cursor:'pointer',fontSize:'14px',fontWeight:'bold'},
  btnSec:{flex:1,padding:'13px',borderRadius:'14px',border:`1px solid ${D.border}`,background:'transparent',color:D.text2,cursor:'pointer',fontSize:'14px'},
  empty:{textAlign:'center',padding:'48px 20px'},
  avatar:{width:'48px',height:'48px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',fontSize:'20px',flexShrink:0,border:'2px solid'},
  clienteNombre:{fontWeight:'bold',fontSize:'15px',margin:0,color:D.text},
  clienteNota:{fontSize:'12px',color:D.text2,margin:'3px 0 0'},
  citaBadge:{borderRadius:'10px',padding:'8px 14px',fontSize:'12px',fontWeight:'bold',marginBottom:'12px',border:'1px solid'},
  acciones:{display:'flex',gap:'8px',flexWrap:'wrap'},
  accion:{padding:'8px 14px',borderRadius:'10px',fontSize:'12px',textDecoration:'none',fontWeight:'bold',border:'1px solid'},
};

export default Clientes;
