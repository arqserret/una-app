import React, { useState } from 'react';
import logo from './logo.png';

const PASOS = [
  { esLogo: true, gradiente: 'linear-gradient(160deg, #0D1117 0%, #1A3D35 100%)', subtitulo: 'vida y empresa', descripcion: 'La app pensada para ti, que llevas el negocio y la casa al mismo tiempo. En 5 pasos te cuento cómo funciona.', boton: 'Empezar' },
  { emoji: '💰', gradiente: 'linear-gradient(160deg, #0D1117 0%, #1A3D35 100%)', titulo: 'Separa tus finanzas', subtitulo: 'Módulo: Mis Finanzas', descripcion: 'Registra ingresos y gastos del negocio por separado de los del hogar. Siempre sabrás cuánto gana tu negocio y cuánto gastas en casa.', tip: 'Registra cada venta el mismo día para no perder el control.', boton: 'Siguiente' },
  { emoji: '👩‍👧', gradiente: 'linear-gradient(160deg, #0D1117 0%, #2E1F3E 100%)', titulo: 'Da seguimiento a tus clientas', subtitulo: 'Módulo: Mis Clientes', descripcion: 'Guarda nombre, teléfono y notas de cada clienta. Llámales o manda WhatsApp directo desde la app y agenda su próxima cita.', tip: 'Agenda una fecha de seguimiento a cada clienta nueva para no perder la venta.', boton: 'Siguiente' },
  { emoji: '📅', gradiente: 'linear-gradient(160deg, #0D1117 0%, #3A2A10 100%)', titulo: 'Nunca olvides nada importante', subtitulo: 'Módulo: Calendario Vital', descripcion: 'Pagos, declaraciones del SAT, citas médicas, fechas escolares y tu cita de bienestar. Todo en un solo lugar.', tip: 'Activa los eventos anuales como verificación y Papanicolau para que se repitan solos.', boton: 'Siguiente' },
  { emoji: '🌙', gradiente: 'linear-gradient(160deg, #0D1117 0%, #251530 100%)', titulo: 'Trabaja con tu ciclo, no contra él', subtitulo: 'Módulo: Ciclo y Productividad', descripcion: 'Cada fase de tu ciclo tiene una energía diferente. UNA te dice qué actividades son ideales hoy — cuándo vender, cuándo crear, cuándo descansar.', tip: 'Esto es único en UNA. Ninguna otra app de negocios lo tiene.', boton: 'Siguiente' },
  { emoji: '💼', gradiente: 'linear-gradient(160deg, #0D1117 0%, #0E2E2A 100%)', titulo: 'Cotiza en segundos', subtitulo: 'Módulo: Cotizar', descripcion: 'Crea cotizaciones profesionales y envíalas por WhatsApp con un toque. Guarda tus conceptos frecuentes y elige tus clientas de tu lista.', tip: 'Guarda tus servicios frecuentes para cotizar aún más rápido.', boton: 'Comenzar a usar UNA' },
];

function Onboarding({ onTerminar }) {
  const [paso, setPaso] = useState(0);
  const actual = PASOS[paso];
  const esUltimo = paso === PASOS.length - 1;

  return (
    <div style={{ ...e.contenedor, background: actual.gradiente }}>
      <div style={e.indicadores}>
        {PASOS.map((_, i) => <div key={i} style={{ ...e.punto, backgroundColor: i === paso ? 'white' : 'rgba(255,255,255,0.25)', width: i === paso ? '24px' : '8px' }} />)}
      </div>

      <div style={e.cuerpo}>
        {actual.esLogo ? (
          <>
            <img src={logo} alt="UNA" style={e.logoImg} />
            <p style={e.subtitulo}>{actual.subtitulo}</p>
            <p style={e.descripcion}>{actual.descripcion}</p>
          </>
        ) : (
          <>
            <div style={e.emojiCirculo}><span style={{ fontSize: '52px' }}>{actual.emoji}</span></div>
            <p style={e.subtitulo}>{actual.subtitulo}</p>
            <h1 style={e.titulo}>{actual.titulo}</h1>
            <p style={e.descripcion}>{actual.descripcion}</p>
            {actual.tip && <div style={e.tipBox}><p style={e.tipTexto}>{actual.tip}</p></div>}
          </>
        )}
      </div>

      <div style={e.botones}>
        {paso > 0 && <button style={e.botonAtras} onClick={() => setPaso(paso - 1)}>← Atrás</button>}
        <button style={{ ...e.botonSiguiente, flex: paso === 0 ? 1 : 2 }} onClick={() => esUltimo ? onTerminar() : setPaso(paso + 1)}>{actual.boton}</button>
      </div>
      {!esUltimo && <button style={e.saltar} onClick={onTerminar}>Saltar tutorial</button>}
    </div>
  );
}

const e = {
  contenedor: { minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '52px 28px 36px', fontFamily: 'Arial, sans-serif' },
  indicadores: { display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '40px' },
  punto: { height: '8px', borderRadius: '4px', transition: 'all 0.3s' },
  cuerpo: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  logoImg: { width: '85%', maxWidth: '320px', filter: 'brightness(0) invert(1)', marginBottom: '28px' },
  emojiCirculo: { width: '100px', height: '100px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.1)' },
  subtitulo: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px 0' },
  titulo: { color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: 1.2 },
  descripcion: { color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0', maxWidth: '300px' },
  tipBox: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '14px', padding: '14px 18px', maxWidth: '300px', border: '1px solid rgba(255,255,255,0.1)' },
  tipTexto: { color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0, lineHeight: 1.5, fontStyle: 'italic' },
  botones: { display: 'flex', gap: '10px', marginTop: '32px' },
  botonAtras: { flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '15px' },
  botonSiguiente: { padding: '16px', borderRadius: '16px', border: 'none', background: 'white', color: '#0D1117', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  saltar: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer', marginTop: '16px', textAlign: 'center', width: '100%' },
};

export default Onboarding;
