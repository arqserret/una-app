import React, { useState } from 'react';
import logo from './logo.png';

const PASOS = [
  { gradiente: 'linear-gradient(160deg, #1A1A2E 0%, #2D6E5E 100%)', titulo: null, esBienvenida: true, boton: 'Comenzar' },
  { emoji: '💰', gradiente: 'linear-gradient(160deg, #2D6E5E 0%, #4AA08A 100%)', titulo: 'Separa tus finanzas', subtitulo: 'Módulo: Mis Finanzas', descripcion: 'Registra ingresos y gastos del negocio por separado de los del hogar. Siempre sabrás cuánto gana tu negocio y cuánto gastas en casa.', tip: '💡 Registra cada venta el mismo día para no perder el control.', boton: 'Siguiente' },
  { emoji: '👩‍👧', gradiente: 'linear-gradient(160deg, #9B7BAE 0%, #C4A0D4 100%)', titulo: 'Da seguimiento a tus clientas', subtitulo: 'Módulo: Mis Clientes', descripcion: 'Guarda nombre, teléfono y notas de cada clienta. Llámales o manda WhatsApp directo desde la app y agenda su próxima cita.', tip: '💡 Agenda una fecha de seguimiento a cada clienta nueva para no perder la venta.', boton: 'Siguiente' },
  { emoji: '📅', gradiente: 'linear-gradient(160deg, #C4973A 0%, #E8BF6A 100%)', titulo: 'Nunca olvides nada importante', subtitulo: 'Módulo: Calendario Vital', descripcion: 'Pagos, SAT, citas médicas, fechas escolares y tu tiempo personal. Todo en un solo lugar con alertas anticipadas.', tip: '💡 Activa los eventos anuales o mensuales para que se repitan solos.', boton: 'Siguiente' },
  { emoji: '🌙', gradiente: 'linear-gradient(160deg, #7A5C8A 0%, #B48EC4 100%)', titulo: 'Trabaja con tu ciclo, no contra él', subtitulo: 'Módulo: Ciclo y Productividad', descripcion: 'Cada fase de tu ciclo tiene una energía diferente. UNA te dice qué actividades son ideales hoy — cuándo vender, cuándo crear, cuándo descansar.', tip: '💡 Esto es único en UNA. Ninguna otra app de negocios lo tiene.', boton: 'Siguiente' },
  { emoji: '💼', gradiente: 'linear-gradient(160deg, #3A7D6E 0%, #5AADA0 100%)', titulo: 'Cotiza en segundos', subtitulo: 'Módulo: Cotizar', descripcion: 'Crea cotizaciones profesionales, envíalas por WhatsApp o descárgalas como PDF. Elige tus clientas de tu lista y guarda tus servicios frecuentes.', tip: '💡 Guarda tus conceptos frecuentes para cotizar aún más rápido.', boton: 'Comenzar a usar UNA' },
];

function Onboarding({ onTerminar }) {
  const [paso, setPaso] = useState(0);
  const actual = PASOS[paso];
  const esUltimo = paso === PASOS.length - 1;

  return (
    <div style={{ ...e.contenedor, background: actual.gradiente }}>
      <div style={e.indicadores}>
        {PASOS.map((_, i) => <div key={i} style={{ ...e.punto, backgroundColor: i === paso ? 'white' : 'rgba(255,255,255,0.3)', width: i === paso ? '24px' : '8px' }} />)}
      </div>

      <div style={e.cuerpo}>
        {actual.esBienvenida ? (
          <div style={e.bienvenidaBox}>
            <img src={logo} alt="UNA" style={e.logoGrande} />
            <p style={e.bienvenidaSub}>Tu app de vida y empresa</p>
            <p style={e.bienvenidaDesc}>Pensada para las mujeres que llevan el negocio y la casa al mismo tiempo.</p>
          </div>
        ) : (
          <>
            <div style={e.emojiCirculo}><span style={{ fontSize: '50px' }}>{actual.emoji}</span></div>
            <p style={e.subtitulo}>{actual.subtitulo}</p>
            <h1 style={e.titulo}>{actual.titulo}</h1>
            <p style={e.descripcion}>{actual.descripcion}</p>
            {actual.tip && <div style={e.tipBox}><p style={e.tipTexto}>{actual.tip}</p></div>}
          </>
        )}
      </div>

      <div style={e.botones}>
        {paso > 0 && <button style={e.botonAtras} onClick={() => setPaso(paso - 1)}>← Atrás</button>}
        <button style={{ ...e.botonSig, flex: paso === 0 ? 1 : 2 }} onClick={() => esUltimo ? onTerminar() : setPaso(paso + 1)}>
          {actual.boton}
        </button>
      </div>
      {!esUltimo && <button style={e.saltar} onClick={onTerminar}>Saltar tutorial</button>}
    </div>
  );
}

const e = {
  contenedor: { minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '52px 28px 36px', fontFamily: 'Arial, sans-serif' },
  indicadores: { display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '32px' },
  punto: { height: '8px', borderRadius: '4px', transition: 'all 0.3s' },
  cuerpo: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  bienvenidaBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  logoGrande: { width: '220px', objectFit: 'contain', filter: 'brightness(0) invert(1)' },
  bienvenidaSub: { color: 'rgba(255,255,255,0.85)', fontSize: '16px', letterSpacing: '1px', margin: 0 },
  bienvenidaDesc: { color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: 1.6, margin: 0, maxWidth: '300px' },
  emojiCirculo: { width: '96px', height: '96px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' },
  subtitulo: { color: 'rgba(255,255,255,0.7)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' },
  titulo: { color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 14px', lineHeight: 1.2 },
  descripcion: { color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: 1.6, margin: '0 0 20px', maxWidth: '300px' },
  tipBox: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '14px 18px', maxWidth: '300px' },
  tipTexto: { color: 'white', fontSize: '14px', margin: 0, lineHeight: 1.5, fontStyle: 'italic' },
  botones: { display: 'flex', gap: '10px', marginTop: '28px' },
  botonAtras: { flex: 1, padding: '16px', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.4)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: '15px' },
  botonSig: { padding: '16px', borderRadius: '16px', border: 'none', background: 'white', color: '#2D6E5E', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  saltar: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '13px', cursor: 'pointer', marginTop: '14px', textAlign: 'center', width: '100%' },
};

export default Onboarding;
