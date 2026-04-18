import { useState, useRef } from 'react';
import InputForm from './InputForm.jsx';
import NakshatraCard from './components/NakshatraCard.jsx';
import { MahaboteCard, SevenHousesCard } from './components/MahaboteCard.jsx';
import BhummaCard from './components/BhummaCard.jsx';
import AIReading from './components/AIReading.jsx';
import { calcNakshatra } from './engine/nakshatra.js';
import KasitMahaboteCard from './components/KasitMahaboteCard.jsx';
import GrahaRidingCard from './components/GrahaRidingCard.jsx';
import { calcBirthHouse, calcBhumma, calcKasitMahabote, calcGrahaRiding, getAgePeriodRuler, getCurrentMyanmarYear, WEEKDAYS } from './engine/mahabote.js';
import { C, F } from './theme.js';

function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #2c1810 0%, #4a2f1f 50%, #3a2318 100%)',
      padding: '32px 24px 28px', textAlign: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(200,130,74,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: 48, marginBottom: 10 }}>🌙</div>
      <h1 style={{
        margin: 0, fontFamily: F.mm, fontWeight: 800, fontSize: 30,
        color: '#fff', letterSpacing: 1,
      }}>
        မြန်မာ့ နက္ခတ် ဗေဒင်
      </h1>
      <div style={{ fontFamily: F.serif, fontSize: 16, color: '#e8c87a', marginTop: 6 }}>
        Myanmar Nakshatra Astrology
      </div>
      <div style={{
        fontFamily: F.sans, fontSize: 13, color: 'rgba(255,255,255,0.60)',
        marginTop: 10, maxWidth: 500, margin: '10px auto 0', lineHeight: 1.6,
      }}>
        Nakshatra (နက္ခတ်) + Mahabote (မဟာဘုတ်) + Bhumma (ဘုမ္မိ) — from a single birth date
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{
      textAlign: 'center', padding: '28px 24px',
      fontFamily: F.sans, fontSize: 12, color: C.textFaint,
      borderTop: `1px solid ${C.border}`, marginTop: 40,
    }}>
      <div style={{ marginBottom: 6, fontFamily: F.mm, fontSize: 14, color: C.textSoft }}>
        မြန်မာ့ နက္ခတ် ဗေဒင်
      </div>
      <div style={{ maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
        Readings are for reflection and cultural appreciation only.
        Nakshatra uses simplified Meeus moon algorithm (±1° variance).
        Mahabote follows traditional Myanmar 7-house system.
      </div>
    </footer>
  );
}

function HowItWorks() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 16, overflow: 'hidden', boxShadow: C.shadow,
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: F.serif, fontWeight: 700, fontSize: 15, color: C.text,
        }}
      >
        <span>ℹ️ How does this work?</span>
        <span style={{ color: C.textSoft, fontSize: 18 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 16px', borderTop: `1px solid ${C.borderSoft}` }}>
          {[
            ['🌙 Nakshatra (နက္ခတ်)', "The moon's position at birth determines your Janma Nakshatra — one of 27 lunar mansions. Requires birth date, time, and timezone."],
            ['🏠 Mahabote (မဟာဘုတ်)', 'Myanmar traditional system: Myanmar birth year ÷ 7 → keyword sequence → one of 7 houses reveals life-root nature. Auto-derived from birth date.'],
            ['⏱ Bhumma (ဘုမ္မိ)', 'Three levels of timing pressure (Small/Core/Great) based on age and birth weekday — both auto-derived from birth date.'],
          ].map(([title, desc]) => (
            <div key={title} style={{ padding: '10px 0', borderBottom: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 13, color: C.text, marginBottom: 3 }}>{title}</div>
              <div style={{ fontFamily: F.sans, fontSize: 13, color: C.textMid, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
          <div style={{ marginTop: 10, fontFamily: F.sans, fontSize: 12, color: C.textFaint, fontStyle: 'italic' }}>
            ⚠️ Upper/lower class birth labels are not good/bad judgments. Weekday and age are auto-derived from your birth date.
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

  const handleSubmit = (input) => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const nakResult      = calcNakshatra(input.year, input.month, input.day, input.hour, input.minute, input.tzOffset);
      const mahaboteResult = calcBirthHouse(input.ceYear, input.weekdayId, input.afterNewYear);
      const bhumma         = calcBhumma(input.age, input.weekdayId);
      const currentMM      = getCurrentMyanmarYear();
      const kasit          = calcKasitMahabote(currentMM, input.weekdayId);
      const birthChart     = calcGrahaRiding(mahaboteResult.myanmarYear);
      const kasitChart     = calcGrahaRiding(currentMM);
      const agePeriod      = {
        ...getAgePeriodRuler(input.age, birthChart),
        kasitSlot: getAgePeriodRuler(input.age, kasitChart).slot,
      };
      const weekday        = WEEKDAYS.find(w => w.id === input.weekdayId);
      setResult({ nakResult, mahaboteResult, bhumma, kasit, birthChart, kasitChart, agePeriod, currentMM, weekday, input });
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }, 400);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <Header />
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '28px 16px' }}>
        <div style={{ marginBottom: 20 }}>
          <HowItWorks />
        </div>

        {!result && (
          <div style={{
            background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: '28px', boxShadow: C.shadow,
          }}>
            <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 20, color: C.text, marginBottom: 4 }}>
              Your Birth Details
            </div>
            <div style={{ fontFamily: F.mm, fontSize: 14, color: C.textSoft, marginBottom: 24 }}>
              မွေးဖွားမှုအချက်အလက်
            </div>
            <InputForm onSubmit={handleSubmit} loading={loading} />
          </div>
        )}

        {result && (
          <div ref={resultsRef}>
            <div style={{
              background: 'linear-gradient(135deg, #2c1810, #4a2f1f)',
              borderRadius: 20, padding: '18px 24px', marginBottom: 20,
              color: '#fff', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ fontFamily: F.mm, fontWeight: 700, fontSize: 18 }}>
                  {result.weekday?.myanmar}
                  <span style={{ fontFamily: F.sans, fontSize: 14, marginLeft: 10, color: '#e8c87a' }}>
                    {result.weekday?.label}
                  </span>
                </div>
                <div style={{ fontFamily: F.sans, fontSize: 13, color: 'rgba(255,255,255,0.60)', marginTop: 3 }}>
                  {result.input.birthDate} · Myanmar Year {result.mahaboteResult.myanmarYear} · Age {result.input.age}
                </div>
              </div>
              <button
                onClick={handleReset}
                style={{
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 12, padding: '7px 16px', color: '#fff',
                  cursor: 'pointer', fontFamily: F.sans, fontSize: 13,
                }}
              >
                ← New reading
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <NakshatraCard result={result.nakResult} />
              <MahaboteCard result={result.mahaboteResult} />
              <KasitMahaboteCard kasit={result.kasit} birthHouseId={result.mahaboteResult.birthHouse?.id} />
              <GrahaRidingCard
                birthChart={result.birthChart}
                kasitChart={result.kasitChart}
                birthWeekdayId={result.input.weekdayId}
                age={result.input.age}
                agePeriod={result.agePeriod}
                birthMyanmarYear={result.mahaboteResult.myanmarYear}
                kasitMyanmarYear={result.currentMM}
              />
              <BhummaCard bhumma={result.bhumma} age={result.input.age} weekday={result.weekday} />
              <SevenHousesCard birthHouseId={result.mahaboteResult.birthHouse?.id} />
              <AIReading
                input={result.input}
                nakResult={result.nakResult}
                mahaboteResult={result.mahaboteResult}
                bhumma={result.bhumma}
                birthChart={result.birthChart}
                kasitChart={result.kasitChart}
                agePeriod={result.agePeriod}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
