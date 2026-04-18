import { useState } from 'react';
import { HOUSES, PROFILES } from '../engine/mahabote.js';
import { C, F } from '../theme.js';

function Card({ children }) {
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 20, padding: '20px 24px', boxShadow: C.shadow,
    }}>
      {children}
    </div>
  );
}

export function MahaboteCard({ result }) {
  const [showSteps, setShowSteps] = useState(false);
  const { birthHouse, weekday, steps } = result;
  const profile = PROFILES[birthHouse?.id];
  const isUpper = birthHouse?.class === 'upper';

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>🏠</span>
        <div>
          <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 17, color: C.text }}>Birth House (Mahabote)</div>
          <div style={{ fontFamily: F.mm, fontSize: 13, color: C.textSoft, marginTop: 1 }}>ဖွားဇာတာ (မဟာဘုတ်)</div>
        </div>
      </div>

      {/* House badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16,
        padding: '14px 18px', borderRadius: 14,
        background: isUpper ? '#f0faf4' : '#fff8ee',
        border: `1.5px solid ${isUpper ? '#74c69d' : '#f4a261'}`,
      }}>
        <div style={{ fontSize: 36 }}>{isUpper ? '🌟' : '🔥'}</div>
        <div>
          <div style={{ fontFamily: F.serif, fontWeight: 800, fontSize: 22, color: C.text }}>
            {birthHouse?.en}{' '}
            <span style={{ fontFamily: F.mm, fontSize: 16, fontWeight: 600, color: C.textMid }}>
              ({birthHouse?.myanmar})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.sans, fontSize: 13, color: C.textMid }}>{profile?.subtitle}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, fontFamily: F.sans,
              color: isUpper ? C.upperText : C.lowerText,
              background: isUpper ? C.upper : C.lower,
              padding: '2px 8px', borderRadius: 8,
            }}>
              {isUpper ? 'Upper Class (အထက်တန်း)' : 'Lower Class (အောက်တန်း)'}
            </span>
          </div>
        </div>
      </div>

      {/* Traits */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 12, color: C.textMid, marginBottom: 8,
          textTransform: 'uppercase', letterSpacing: 0.5 }}>Key Traits</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {profile?.traits.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: C.primary, fontSize: 14, lineHeight: 1.5, flexShrink: 0 }}>◆</span>
              <span style={{ fontFamily: F.sans, fontSize: 14, color: C.text, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Myanmar text */}
      <div style={{
        padding: '10px 14px', borderRadius: 10,
        background: '#fdf0e6', border: `1px solid ${C.borderSoft}`,
        fontFamily: F.mm, fontSize: 14, color: C.textMid, lineHeight: 1.8, marginBottom: 12,
      }}>
        {profile?.myanmar}
      </div>

      {/* Warning */}
      {profile?.warning && (
        <div style={{
          marginBottom: 12, padding: '10px 14px', borderRadius: 10,
          background: C.warn, border: `1px solid #ffc10766`,
          fontFamily: F.sans, fontSize: 13, color: C.warnText,
        }}>
          💡 {profile.warning}
        </div>
      )}

      {/* Calc steps */}
      <button
        onClick={() => setShowSteps(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: F.sans, fontSize: 12, color: C.primary, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {showSteps ? '▲' : '▼'} {showSteps ? 'Hide' : 'Show'} calculation steps
      </button>
      {showSteps && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8,
              padding: '6px 10px', background: '#faf5ef', borderRadius: 8,
              fontFamily: F.sans, fontSize: 13,
            }}>
              <span style={{ color: C.textSoft, fontWeight: 700 }}>{s.label}</span>
              <span style={{ color: C.text }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function SevenHousesCard({ birthHouseId }) {
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 20, padding: '20px 24px', boxShadow: C.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 22 }}>🏛</span>
        <div>
          <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 17, color: C.text }}>Seven Houses (ဌာန ၇ ခု)</div>
          <div style={{ fontFamily: F.mm, fontSize: 13, color: C.textSoft, marginTop: 1 }}>အိမ် ၇ လုံး</div>
        </div>
      </div>
      <div style={{ marginBottom: 12, fontFamily: F.sans, fontSize: 13, color: C.textMid }}>
        Clockwise: ဘင်္ဂ → မရဏ → အထွန်း → သိုက် → ရာဇ → ပုတိ → အဓိပတိ
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {HOUSES.map((h, i) => {
          const isYours = h.id === birthHouseId;
          return (
            <div key={h.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 12,
              background: isYours ? (h.class === 'upper' ? '#f0faf4' : '#fff8ee') : '#faf8f5',
              border: `1.5px solid ${isYours ? (h.class === 'upper' ? '#74c69d' : '#f4a261') : C.borderSoft}`,
              fontWeight: isYours ? 700 : 400,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontFamily: F.sans,
                background: isYours ? C.primary : C.borderSoft,
                color: isYours ? '#fff' : C.textFaint,
              }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.mm, fontSize: 15, color: isYours ? C.text : C.textMid }}>{h.myanmar}</span>
                  <span style={{ fontFamily: F.sans, fontSize: 13, color: C.textSoft }}>({h.en})</span>
                  <span style={{
                    fontSize: 11, padding: '1px 7px', borderRadius: 8, fontFamily: F.sans, fontWeight: 700,
                    background: h.class === 'upper' ? C.upper : C.lower,
                    color: h.class === 'upper' ? C.upperText : C.lowerText,
                  }}>{h.class === 'upper' ? 'Upper' : 'Lower'}</span>
                  {isYours && (
                    <span style={{ fontSize: 11, background: C.primary, color: '#fff',
                      padding: '1px 8px', borderRadius: 8, fontFamily: F.sans }}>← You</span>
                  )}
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 12, color: C.textSoft, marginTop: 2 }}>{h.meaning}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
