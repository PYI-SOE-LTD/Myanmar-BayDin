/**
 * GrahaRidingCard.jsx — ဂြိုဟ်စီးဂြိုဟ်နင်း
 * Shows the full 7-house planet chart for birth year (မူလ) and current year (ကသစ်),
 * with comparison and age-period ruler reading.
 */

import { useState } from 'react';
import { C, F } from '../theme.js';

// ─── Outcome display config ───────────────────────────────────────────────────
const OUTCOME = {
  excellent:  { icon: '✅✅', label: 'ထူးကောင်း',      bg: '#e8f5e9', text: '#1b5e20' },
  good:       { icon: '✅',   label: 'ကောင်း',          bg: '#f1f8e9', text: '#33691e' },
  reduced:    { icon: '🛡️',  label: 'ဆိုးမှုလျော့',   bg: '#e3f2fd', text: '#0d47a1' },
  neutral:    { icon: '↔',   label: 'ကြားနေ',          bg: '#fafafa', text: '#616161' },
  diminished: { icon: '⚠️',  label: 'ကောင်းယိုယွင်း', bg: '#fff8e1', text: '#e65100' },
  danger:     { icon: '⚠⚠', label: 'အန္တရာယ်ကြီး',   bg: '#fce4ec', text: '#b71c1c' },
};

const STRENGTH_LABEL = {
  strong: { label: 'အားကောင်း', color: '#2e7d32' },
  medium: { label: 'အားသင့်',   color: '#1565c0' },
  weak:   { label: 'အားဆိုး',   color: '#c62828' },
};

const COMPARE_ICON = { up: '⬆', down: '⬇', same: '→' };

// Score for comparison
const OUTCOME_SCORE = { excellent: 2, good: 1, reduced: 1, neutral: 0, diminished: -1, danger: -2 };

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChartTable({ chart, birthWeekdayId, label }) {
  return (
    <div>
      <div style={{ fontFamily: F.mm, fontWeight: 700, fontSize: '0.95rem', color: C.text, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: C.bgAlt }}>
              {['အိမ်', 'ဂြိုဟ်', 'အင်အား', 'ရလဒ်'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontFamily: F.mm, color: C.textMid, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.map((slot, i) => {
              const isBirth  = slot.weekdayId === birthWeekdayId || (birthWeekdayId === 'rah' && slot.weekdayId === 'wed');
              const outcome  = OUTCOME[slot.outcome];
              const strength = STRENGTH_LABEL[slot.strength];
              const rowBg    = isBirth ? '#fff9e6' : i % 2 === 0 ? '#fff' : C.bgAlt;
              return (
                <tr key={slot.houseId} style={{ background: rowBg, borderBottom: `1px solid ${C.borderSoft}` }}>
                  <td style={{ padding: '7px 8px', fontFamily: F.mm, color: slot.isGoodHouse ? C.upperText : C.lowerText, fontWeight: isBirth ? 700 : 400 }}>
                    {isBirth && <span style={{ marginRight: 4 }}>★</span>}
                    {slot.house?.myanmar}
                  </td>
                  <td style={{ padding: '7px 8px', fontFamily: F.mm, color: C.text }}>
                    {slot.weekday?.myanmar}
                    <span style={{ fontFamily: F.sans, fontSize: '0.72rem', color: C.textSoft, marginLeft: 4 }}>
                      ({slot.num})
                    </span>
                  </td>
                  <td style={{ padding: '7px 8px', fontFamily: F.mm, color: strength.color, fontWeight: 600 }}>
                    {strength.label}
                  </td>
                  <td style={{ padding: '7px 8px' }}>
                    <span style={{
                      background: outcome.bg, color: outcome.text,
                      borderRadius: 6, padding: '2px 8px',
                      fontFamily: F.mm, fontSize: '0.78rem', fontWeight: 600,
                    }}>
                      {outcome.icon} {outcome.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompareTable({ birthChart, kasitChart, birthWeekdayId }) {
  return (
    <div>
      <div style={{ fontFamily: F.mm, fontWeight: 700, fontSize: '0.95rem', color: C.text, marginBottom: 8 }}>
        မူလ vs ကသစ် ပြောင်းလဲချက်
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: C.bgAlt }}>
              {['ဂြိုဟ်', 'မူလအိမ်', 'ကသစ်အိမ်', 'ပြောင်းလဲ'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', fontFamily: F.mm, color: C.textMid, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {birthChart.map((bSlot, i) => {
              const kSlot    = kasitChart.find(s => s.weekdayId === bSlot.weekdayId);
              const bScore   = OUTCOME_SCORE[bSlot.outcome];
              const kScore   = OUTCOME_SCORE[kSlot?.outcome];
              const diff     = kScore - bScore;
              const isBirth  = bSlot.weekdayId === birthWeekdayId || (birthWeekdayId === 'rah' && bSlot.weekdayId === 'wed');
              const changeIcon = diff > 0 ? '⬆' : diff < 0 ? '⬇' : '→';
              const changeColor = diff > 0 ? '#2e7d32' : diff < 0 ? '#c62828' : '#616161';
              const rowBg = isBirth ? '#fff9e6' : i % 2 === 0 ? '#fff' : C.bgAlt;
              return (
                <tr key={bSlot.weekdayId} style={{ background: rowBg, borderBottom: `1px solid ${C.borderSoft}` }}>
                  <td style={{ padding: '7px 8px', fontFamily: F.mm, fontWeight: isBirth ? 700 : 400 }}>
                    {isBirth && <span style={{ marginRight: 4 }}>★</span>}
                    {bSlot.weekday?.myanmar}
                  </td>
                  <td style={{ padding: '7px 8px', fontFamily: F.mm }}>
                    <span style={{ color: bSlot.isGoodHouse ? C.upperText : C.lowerText }}>
                      {bSlot.house?.myanmar}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: '0.72rem', color: C.textSoft, marginLeft: 4 }}>
                      {OUTCOME[bSlot.outcome]?.icon}
                    </span>
                  </td>
                  <td style={{ padding: '7px 8px', fontFamily: F.mm }}>
                    <span style={{ color: kSlot?.isGoodHouse ? C.upperText : C.lowerText }}>
                      {kSlot?.house?.myanmar}
                    </span>
                    <span style={{ fontFamily: F.sans, fontSize: '0.72rem', color: C.textSoft, marginLeft: 4 }}>
                      {OUTCOME[kSlot?.outcome]?.icon}
                    </span>
                  </td>
                  <td style={{ padding: '7px 8px', fontFamily: F.sans, fontWeight: 700, color: changeColor }}>
                    {changeIcon} {diff > 0 ? 'တက်' : diff < 0 ? 'ကျ' : 'တည်ငြိမ်'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export default function GrahaRidingCard({ birthChart, kasitChart, birthWeekdayId, age, agePeriod, birthMyanmarYear, kasitMyanmarYear }) {
  const [tab, setTab] = useState('birth');

  const tabs = [
    { id: 'birth', label: 'မူလ', sublabel: `မြန်မာ ${birthMyanmarYear}` },
    { id: 'kasit', label: 'ကသစ်', sublabel: `မြန်မာ ${kasitMyanmarYear}` },
    { id: 'compare', label: 'ပေါင်း', sublabel: 'နှိုင်းယှဉ်' },
  ];

  // Age period summary
  const ageSlotBirth = agePeriod?.birthSlot;
  const ageSlotKasit = agePeriod?.kasitSlot;
  const agePlanetWd  = agePeriod?.period?.planet;
  const agePlanetLabel = birthChart.find(s => s.weekdayId === agePlanetWd)?.weekday?.myanmar ?? agePlanetWd;

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '1.4rem', boxShadow: C.shadow,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🪐</span>
        <div>
          <h3 style={{ margin: 0, fontFamily: F.mm, fontSize: '1.1rem', color: C.text }}>
            ဂြိုဟ်စီးဂြိုဟ်နင်း
          </h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: C.textSoft, fontFamily: F.sans }}>
            Planet Riding Chart · Birth & Current Year
          </p>
        </div>
      </div>

      {/* Age period ruler summary */}
      {ageSlotBirth && (
        <div style={{
          background: '#f3e5f5', border: '1px solid #ce93d8',
          borderRadius: 10, padding: '0.65rem 1rem', marginBottom: '1rem',
          fontFamily: F.mm, fontSize: '0.85rem', color: '#4a148c', lineHeight: 1.7,
        }}>
          <strong>အသက် {age} နှစ် အုပ်စိုးဂြိုဟ်:</strong>{' '}{agePlanetLabel} —{' '}
          မူလခွင်တွင် <strong>{ageSlotBirth.house?.myanmar}</strong>{' '}
          ({OUTCOME[ageSlotBirth.outcome]?.icon} {OUTCOME[ageSlotBirth.outcome]?.label})
          {ageSlotKasit && (
            <> · ကသစ်ခွင်တွင် <strong>{ageSlotKasit.house?.myanmar}</strong>{' '}
            ({OUTCOME[ageSlotKasit.outcome]?.icon} {OUTCOME[ageSlotKasit.outcome]?.label})</>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '7px 4px', borderRadius: 10, cursor: 'pointer',
              border: `1px solid ${tab === t.id ? C.primary : C.border}`,
              background: tab === t.id ? C.primary : C.bgAlt,
              color: tab === t.id ? '#fff' : C.text,
              fontFamily: F.mm, fontSize: '0.85rem', fontWeight: 700,
              transition: 'all .15s',
            }}
          >
            <div>{t.label}</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.8, fontFamily: F.sans }}>{t.sublabel}</div>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '0.8rem', fontSize: '0.75rem', fontFamily: F.mm, color: C.textMid }}>
        <span>★ = မွေးနံ</span>
        <span style={{ color: C.upperText }}>■ ကောင်းအိမ်</span>
        <span style={{ color: C.lowerText }}>■ ဆိုးအိမ်</span>
      </div>

      {/* Tab content */}
      {tab === 'birth'   && <ChartTable chart={birthChart} birthWeekdayId={birthWeekdayId} label={`မူလခွင် — မြန်မာ ${birthMyanmarYear}`} />}
      {tab === 'kasit'   && <ChartTable chart={kasitChart} birthWeekdayId={birthWeekdayId} label={`ကသစ်ခွင် — မြန်မာ ${kasitMyanmarYear}`} />}
      {tab === 'compare' && <CompareTable birthChart={birthChart} kasitChart={kasitChart} birthWeekdayId={birthWeekdayId} />}
    </div>
  );
}
