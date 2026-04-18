import { useState } from 'react';
import { NAKSHATRAS, RASHIS, GANAS, DASHA_YEARS, PADA_SYLLABLES } from '../engine/nakshatra.js';
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

function SectionTitle({ emoji, en, mm }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <div>
        <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 17, color: C.text }}>{en}</div>
        {mm && <div style={{ fontFamily: F.mm, fontSize: 13, color: C.textSoft, marginTop: 1 }}>{mm}</div>}
      </div>
    </div>
  );
}

function Row({ label, val, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0',
      borderBottom: `1px solid ${C.borderSoft}`, fontSize: 13 }}>
      <span style={{ fontFamily: F.sans, color: C.textSoft }}>{label}</span>
      <span style={{ fontFamily: mono ? F.mono : F.sans, color: C.text, fontWeight: 600 }}>{val}</span>
    </div>
  );
}

export default function NakshatraCard({ result }) {
  const [showTech, setShowTech] = useState(false);
  const nak   = NAKSHATRAS[result.nakshatraIndex];
  const rashi = RASHIS[result.rashiIndex];
  const gana  = GANAS[result.nakshatraIndex];
  const ganaEn = gana === 'ဒေဝ' ? 'Divine' : gana === 'မနုဿ' ? 'Human' : 'Demonic';
  const syllable = PADA_SYLLABLES[result.nakshatraIndex]?.[result.pada - 1] ?? '—';
  const dashaYrs = DASHA_YEARS[nak.lord];

  return (
    <Card>
      <SectionTitle emoji="🌙" en="Birth Nakshatra" mm="ဇာတ်မွေးနက္ခတ်" />

      {/* Main badge */}
      <div style={{
        textAlign: 'center', padding: '20px 16px', borderRadius: 16, marginBottom: 16,
        background: 'linear-gradient(145deg, rgba(200,130,74,0.10), rgba(200,130,74,0.04))',
        border: `1.5px solid ${C.primary}44`,
      }}>
        <div style={{ fontSize: 48, marginBottom: 6 }}>{nak.symbol}</div>
        <div style={{ fontFamily: F.mm, fontWeight: 700, fontSize: 26, color: C.primary }}>
          {nak.mm}
        </div>
        <div style={{ fontFamily: F.sans, fontSize: 16, color: C.textMid, marginTop: 2 }}>
          {nak.en} — Pada {result.pada}
        </div>
        <div style={{
          display: 'inline-block', marginTop: 8,
          background: `${C.primary}18`, border: `1px solid ${C.primary}44`,
          padding: '4px 16px', borderRadius: 20,
          fontFamily: F.sans, fontSize: 12, color: C.primary, fontWeight: 700,
        }}>
          Nakshatra #{result.nakshatraIndex + 1} / 27
        </div>
      </div>

      {/* Detail grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'ရာသီ (Rashi)',   value: `${rashi.symbol} ${rashi.mm}`, sub: rashi.en },
          { label: 'ဂြိုဟ်ပိုင် (Lord)', value: nak.lord,         sub: `Dasha: ${dashaYrs} yrs` },
          { label: 'ဂဏ (Gana)',       value: gana,               sub: ganaEn },
          { label: 'နတ်ပိုင် (Deity)', value: nak.deity,          sub: `Animal: ${nak.animal}` },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{
            background: C.bgAlt, border: `1px solid ${C.borderSoft}`,
            borderRadius: 12, padding: '12px 14px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textFaint, marginBottom: 5 }}>{label}</div>
            <div style={{ fontFamily: F.mm, fontSize: 15, fontWeight: 700, color: C.text }}>{value}</div>
            {sub && <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textSoft, marginTop: 3 }}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* Name syllable highlight */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderRadius: 12,
        background: C.bgAlt, border: `1px solid ${C.borderSoft}`,
        marginBottom: 12,
      }}>
        <div>
          <div style={{ fontFamily: F.sans, fontSize: 12, color: C.textFaint }}>နာမည်အက္ခရာ (Name Syllable)</div>
          <div style={{ fontFamily: F.sans, fontSize: 11, color: C.textFaint }}>Suggested starting sound for name</div>
        </div>
        <div style={{
          fontFamily: F.serif, fontWeight: 800, fontSize: 28, color: C.primary,
          background: `${C.primary}12`, padding: '4px 18px', borderRadius: 10,
        }}>
          {syllable}
        </div>
      </div>

      {/* Technical toggle */}
      <button
        onClick={() => setShowTech(v => !v)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: F.sans, fontSize: 12, color: C.primary, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}
      >
        {showTech ? '▲' : '▼'} {showTech ? 'Hide' : 'Show'} technical details
      </button>
      {showTech && (
        <div style={{ marginTop: 10 }}>
          <Row label="Moon Sidereal"    val={`${result.siderealMoon.toFixed(4)}°`} mono />
          <Row label="Moon Tropical"    val={`${result.tropicalMoon.toFixed(4)}°`} mono />
          <Row label="Ayanamsa (Lahiri)" val={`${result.ayanamsa.toFixed(4)}°`}   mono />
          <Row label="Nakshatra Degree" val={`${(result.siderealMoon % (360/27)).toFixed(2)}° / 13.33°`} mono />
          <div style={{ marginTop: 8, fontFamily: F.sans, fontSize: 11, color: C.textFaint, fontStyle: 'italic' }}>
            ⚠ Simplified Meeus algorithm — may differ ±1° from Swiss Ephemeris.
          </div>
        </div>
      )}
    </Card>
  );
}
