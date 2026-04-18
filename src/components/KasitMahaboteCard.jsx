/**
 * KasitMahaboteCard.jsx — ကသစ်မဟာဘုတ် (Current Year Transit Mahabote)
 * Shows which house the birth weekday occupies in the current Myanmar year.
 */

import { useState } from 'react';
import { PROFILES } from '../engine/mahabote.js';
import { C, F } from '../theme.js';

export default function KasitMahaboteCard({ kasit, birthHouseId }) {
  const [showSteps, setShowSteps] = useState(false);

  const house   = kasit.kasitHouse;
  const profile = PROFILES[house?.id];
  const isGood  = kasit.isGoodYear;

  const fortune = isGood
    ? { label: 'ကံကောင်းနှစ်',  labelEn: 'Favourable Year',  bg: '#e8f5e9', border: '#81c784', text: '#2e7d32', icon: '✅' }
    : { label: 'သတိထားရန်နှစ်', labelEn: 'Caution Year',     bg: '#fff8e1', border: '#ffb74d', text: '#e65100', icon: '⚠️' };

  const houseColor = isGood ? C.upper : C.lower;
  const houseText  = isGood ? C.upperText : C.lowerText;

  // Highlight if same as birth house
  const sameAsBirth = house?.id === birthHouseId;

  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: '1.4rem',
      boxShadow: C.shadow,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>🗓️</span>
          <div>
            <h3 style={{ margin: 0, fontFamily: F.mm, fontSize: '1.1rem', color: C.text }}>
              ကသစ်မဟာဘုတ်
            </h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: C.textSoft, fontFamily: F.sans }}>
              Current Year Transit · Myanmar Year {kasit.currentMyanmarYear}
            </p>
          </div>
        </div>

        {/* Fortune badge */}
        <div style={{
          background: fortune.bg, border: `1px solid ${fortune.border}`,
          borderRadius: 20, padding: '4px 14px',
          fontSize: '0.82rem', fontFamily: F.mm, color: fortune.text, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          {fortune.icon} {fortune.label}
        </div>
      </div>

      {/* House badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <div style={{
          background: houseColor, color: houseText,
          borderRadius: 12, padding: '0.6rem 1.2rem',
          fontFamily: F.mm, fontSize: '1.3rem', fontWeight: 700,
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          {house?.myanmar}
          <span style={{ fontFamily: F.sans, fontSize: '0.78rem', opacity: 0.8 }}>({house?.en})</span>
        </div>
        {sameAsBirth && (
          <div style={{
            background: '#e8d5f5', color: '#6a1b9a', border: '1px solid #ce93d8',
            borderRadius: 20, padding: '3px 12px', fontSize: '0.78rem', fontFamily: F.sans,
          }}>
            ✦ မွေးဇာတာနှင့် တူညီ
          </div>
        )}
      </div>

      {/* Explanation */}
      <div style={{ fontFamily: F.mm, fontSize: '0.95rem', color: C.text, lineHeight: 1.8, marginBottom: '0.8rem' }}>
        {kasit.weekday?.myanmar} မွေးနံသည် မြန်မာသက္ကရာဇ် {kasit.currentMyanmarYear} ခုနှစ်တွင်{' '}
        <strong style={{ color: houseText }}>{house?.myanmar}</strong> အိမ်သို့ ရောက်ရှိနေသည်။
      </div>

      {/* Profile traits for this year */}
      {profile && (
        <div style={{
          background: C.bgAlt, borderRadius: 10, padding: '0.8rem 1rem',
          fontSize: '0.85rem', lineHeight: 1.7, color: C.textMid,
          fontFamily: F.sans, marginBottom: '0.8rem',
        }}>
          <div style={{ fontFamily: F.mm, fontWeight: 700, color: C.text, marginBottom: 4 }}>
            {house?.myanmar} အိမ်သဘော
          </div>
          <div style={{ fontFamily: F.mm, color: C.textMid, marginBottom: 6 }}>
            {profile.myanmar}
          </div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {profile.traits.slice(0, 2).map((t, i) => (
              <li key={i} style={{ marginBottom: 2 }}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Fortune description */}
      <div style={{
        background: fortune.bg, border: `1px solid ${fortune.border}`,
        borderRadius: 10, padding: '0.7rem 1rem',
        fontSize: '0.85rem', fontFamily: F.mm, color: fortune.text, lineHeight: 1.7,
        marginBottom: '0.8rem',
      }}>
        {isGood
          ? `ယခုနှစ် (${kasit.currentMyanmarYear}) တွင် ${kasit.weekday?.myanmar} မွေးသူများအတွက် အဆင်ပြေချိန်ဖြစ်သည်။ အစီအစဉ်သစ်များ၊ ဆက်ဆံရေးတည်ဆောက်ခြင်း၊ ကြိုးစားမှုအကျိုးအဖြေရသောနှစ်ဖြစ်သည်။`
          : `ယခုနှစ် (${kasit.currentMyanmarYear}) တွင် ${kasit.weekday?.myanmar} မွေးသူများ သတိအထူးထားရမည်။ ကြီးမားသောစီးပွားရေးဆုံးဖြတ်ချက်များ၊ ချေးငွေ၊ မှတ်ချက်အရေးကြီးသောကိစ္စများ မဆောင်ရွက်မီ ဂရုတစိုက် ဆင်ခြင်ပါ။`}
      </div>

      {/* Calc steps toggle */}
      <button
        onClick={() => setShowSteps(v => !v)}
        style={{
          background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '5px 12px', cursor: 'pointer', fontFamily: F.sans,
          fontSize: '0.78rem', color: C.textSoft,
        }}
      >
        {showSteps ? '▲ Hide' : '▼ Show'} calculation steps
      </button>

      {showSteps && (
        <div style={{ marginTop: '0.8rem' }}>
          {kasit.steps.map((s, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr',
              padding: '5px 0', borderBottom: `1px solid ${C.borderSoft}`,
              fontFamily: F.sans, fontSize: '0.8rem',
            }}>
              <span style={{ color: C.textSoft }}>{s.label}</span>
              <span style={{ color: C.text, fontWeight: i === kasit.steps.length - 1 ? 700 : 400 }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
