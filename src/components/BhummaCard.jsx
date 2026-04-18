import { C, F } from '../theme.js';

export default function BhummaCard({ bhumma, age, weekday }) {
  const levels = [
    {
      active: bhumma.greatActive,
      label:  'Great Bhumma (ဘုမ္မိကြီး)',
      sub:    'Irreversible turning point — rise or collapse',
      emoji:  '⚡',
      color:  '#e05050',
      bg:     '#fff0f0',
      border: '#e0505044',
      ages:   bhumma.greatAges,
      next:   bhumma.nextGreat,
      msg: bhumma.greatActive
        ? `Active at age ${age}. This is a major turning point — focus and intentional action matter enormously.`
        : bhumma.nextGreat
          ? `Not active. Your next Great Bhumma is at age ${bhumma.nextGreat}. Use this period to build foundations.`
          : `Not active for your weekday in the reference range.`,
    },
    {
      active: bhumma.coreActive,
      label:  'Core Bhumma (ဘုမ္မိ)',
      sub:    'Root-level interference — decisions have permanent effect',
      emoji:  '🌀',
      color:  '#c8824a',
      bg:     '#fdf0e6',
      border: '#c8824a44',
      ages:   bhumma.coreAges,
      next:   bhumma.nextCore,
      msg: bhumma.coreActive
        ? `Active at age ${age}. Decisions made now have long-lasting effects. Avoid major irreversible commitments without deliberation.`
        : bhumma.nextCore
          ? `Not active. Your next Core Bhumma is at age ${bhumma.nextCore}.`
          : `No more Core Bhumma years in the standard reference range.`,
    },
    {
      active: bhumma.smallActive,
      label:  'Small Bhumma (ဘုမ္မိလေး)',
      sub:    'Warning cycle — self-questioning phase',
      emoji:  '🔔',
      color:  '#997700',
      bg:     '#fffbea',
      border: '#ffc10744',
      ages:   null,
      next:   bhumma.nextSmall,
      msg: bhumma.smallActive
        ? `Active at age ${age} (age ÷ 8 = remainder 7). A natural pause for reflection.`
        : `Not active. Next at age ${bhumma.nextSmall} (ages where age ÷ 8 = remainder 7).`,
    },
  ];

  const anyActive = bhumma.greatActive || bhumma.coreActive || bhumma.smallActive;

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`,
      borderRadius: 20, padding: '20px 24px', boxShadow: C.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>⏱</span>
        <div>
          <div style={{ fontFamily: F.serif, fontWeight: 700, fontSize: 17, color: C.text }}>Pressure Timing (Bhumma)</div>
          <div style={{ fontFamily: F.mm, fontSize: 13, color: C.textSoft, marginTop: 1 }}>ဘုမ္မိ — ဖိအားအချိန်</div>
        </div>
      </div>

      {!anyActive && (
        <div style={{
          padding: '12px 16px', borderRadius: 12, marginBottom: 14,
          background: '#f0fdf4', border: '1.5px solid #74c69d44',
          fontFamily: F.sans, fontSize: 14, color: '#2d6a4f',
        }}>
          ✅ No active Bhumma pressure at age {age}. This is a relatively stable period.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {levels.map((lvl, i) => (
          <div key={i} style={{
            padding: '14px 16px', borderRadius: 14,
            background: lvl.active ? lvl.bg : '#faf8f5',
            border: `1.5px solid ${lvl.active ? lvl.border : C.borderSoft}`,
            opacity: lvl.active ? 1 : 0.75,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{lvl.emoji}</span>
              <div>
                <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 14, color: lvl.active ? lvl.color : C.textMid }}>
                  {lvl.label}
                  {lvl.active && (
                    <span style={{ marginLeft: 8, fontSize: 11, background: lvl.color, color: '#fff',
                      padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>ACTIVE</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.textSoft, fontFamily: F.sans }}>{lvl.sub}</div>
              </div>
            </div>
            <div style={{ fontFamily: F.sans, fontSize: 13, color: C.textMid, lineHeight: 1.6 }}>{lvl.msg}</div>
            {lvl.ages && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontFamily: F.sans, fontSize: 12, color: C.textFaint, alignSelf: 'center' }}>
                  Ages for {weekday?.label}:
                </span>
                {lvl.ages.map(a => (
                  <span key={a} style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                    background: (a === age ? lvl.color : C.textSoft) + '18',
                    border: `1px solid ${(a === age ? lvl.color : C.textSoft)}44`,
                    color: a === age ? lvl.color : C.textSoft,
                    fontSize: 12, fontFamily: F.sans, fontWeight: 700,
                  }}>Age {a}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {anyActive && (
        <div style={{
          marginTop: 14, padding: '14px 16px', borderRadius: 12,
          background: '#fdf6ee', border: `1px solid ${C.borderSoft}`,
        }}>
          <div style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 13, color: C.textMid, marginBottom: 8 }}>
            💊 Suggested Practices (ယတြာ) During Pressure Years
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 16px' }}>
            {[
              ['ဒါန (Dana)',       'Generosity — give to others'],
              ['သီလ (Sila)',       'Keep moral precepts'],
              ['ဘာဝနာ (Bhavana)',  'Meditate regularly'],
              ['ပရိတ်',            'Listen to protective chants'],
              ['ဆွမ်းကပ်',         'Offer food to monks'],
              ['သက်သတ်လွှတ်',     'Release captive animals'],
            ].map(([mm, en]) => (
              <div key={mm} style={{ fontFamily: F.sans, fontSize: 12, color: C.textMid, padding: '3px 0' }}>
                <span style={{ fontFamily: F.mm, color: C.primary }}>{mm}</span>
                <span style={{ color: C.textFaint }}> — {en}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: F.sans, fontSize: 11, color: C.textFaint, fontStyle: 'italic' }}>
            Remedies reduce pressure intensity — the goal is clarity and reduced reactivity.
          </div>
        </div>
      )}
    </div>
  );
}
