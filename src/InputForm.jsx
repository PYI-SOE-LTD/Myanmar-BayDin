import { useState, useEffect } from 'react';
import { WEEKDAYS, weekdayFromDate, isAfterMyanmarNewYear } from './engine/mahabote.js';
import { C, F } from './theme.js';

const TIMEZONES = [
  { value: '5.5',  label: 'India (UTC+5:30)'       },
  { value: '5.75', label: 'Nepal (UTC+5:45)'        },
  { value: '6.5',  label: 'Myanmar (UTC+6:30)'      },
  { value: '7',    label: 'Thailand/Vietnam (UTC+7)' },
  { value: '8',    label: 'Singapore/China (UTC+8)' },
  { value: '9',    label: 'Japan/Korea (UTC+9)'     },
  { value: '0',    label: 'UTC+0 (GMT)'             },
  { value: '-5',   label: 'US Eastern (UTC-5)'      },
  { value: '-8',   label: 'US Pacific (UTC-8)'      },
];

function Label({ children, mm }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 14, color: C.text }}>{children}</span>
      {mm && <span style={{ fontFamily: F.mm, fontSize: 13, color: C.textSoft, marginLeft: 8 }}>{mm}</span>}
    </div>
  );
}

function FieldError({ msg }) {
  return msg ? <div style={{ color: '#e05050', fontSize: 12, marginTop: 4, fontFamily: F.sans }}>{msg}</div> : null;
}

const inputBase = (err) => ({
  width: '100%', padding: '10px 14px', borderRadius: 12,
  border: `1.5px solid ${err ? '#e05050' : C.border}`,
  background: C.bgCard, fontFamily: F.sans, fontSize: 14,
  color: C.text, outline: 'none', boxSizing: 'border-box',
});

export default function InputForm({ onSubmit, loading }) {
  const [birthDate,  setBirthDate]  = useState('');
  const [birthTime,  setBirthTime]  = useState('12:00');
  const [tzOffset,   setTzOffset]   = useState('6.5');
  const [rahuOverride, setRahuOverride] = useState(false); // Wednesday after 6pm toggle
  const [errors, setErrors] = useState({});

  // Derived values shown as preview
  const derived = (() => {
    if (!birthDate) return null;
    const [y, m, d] = birthDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const jsWeekdayId = weekdayFromDate(dateObj);
    const effectiveId = (jsWeekdayId === 'wed' && rahuOverride) ? 'rah' : jsWeekdayId;
    const weekday = WEEKDAYS.find(w => w.id === effectiveId);
    const afterNY = isAfterMyanmarNewYear(m, d);
    const age = new Date().getFullYear() - y - (
      (() => { const n = new Date(); return (n.getMonth() + 1) * 100 + n.getDate() < m * 100 + d; })() ? 1 : 0
    );
    return { y, m, d, weekday, effectiveId, afterNY, age };
  })();

  const validate = () => {
    const e = {};
    if (!birthDate) e.date = 'Please select your birth date';
    if (!birthTime) e.time = 'Please enter your birth time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || !derived) return;
    const [h, min] = birthTime.split(':').map(Number);
    onSubmit({
      birthDate, birthTime,
      year: derived.y, month: derived.m, day: derived.d,
      hour: h, minute: min,
      tzOffset: parseFloat(tzOffset),
      weekdayId: derived.effectiveId,
      ceYear: derived.y,
      afterNewYear: derived.afterNY,
      age: derived.age,
    });
  };

  const isWednesday = derived?.effectiveId === 'wed' || derived?.effectiveId === 'rah';

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gap: 22 }}>

        {/* Birth Date */}
        <div>
          <Label mm="မွေးသက္ကရာဇ်">Birth Date</Label>
          <input
            type="date" value={birthDate}
            onChange={e => { setBirthDate(e.target.value); setRahuOverride(false); }}
            style={inputBase(errors.date)}
          />
          <FieldError msg={errors.date} />

          {/* Auto-derived preview */}
          {derived && (
            <div style={{
              marginTop: 10, padding: '10px 14px', borderRadius: 10,
              background: C.bgAlt, border: `1px solid ${C.borderSoft}`,
              display: 'flex', flexWrap: 'wrap', gap: '6px 20px',
            }}>
              <Chip label="Weekday" value={`${derived.weekday?.myanmar} (${derived.weekday?.label})`} />
              <Chip label="Myanmar Year" value={`${derived.afterNY ? derived.y - 638 : derived.y - 639} ME`} />
              <Chip label="After New Year" value={derived.afterNY ? 'Yes (post April 17)' : 'No (pre April 17)'} />
              <Chip label="Current Age" value={`${derived.age} years`} />
            </div>
          )}

          {/* Wednesday Rahu toggle */}
          {isWednesday && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
              cursor: 'pointer', fontFamily: F.sans, fontSize: 13, color: C.textMid,
            }}>
              <input
                type="checkbox" checked={rahuOverride}
                onChange={e => setRahuOverride(e.target.checked)}
                style={{ accentColor: C.primary, width: 16, height: 16 }}
              />
              Born on Wednesday <strong style={{ color: C.primary }}>after 6:00 PM</strong> — treat as Rahu (ရာဟု)
            </label>
          )}
        </div>

        {/* Birth Time + Timezone in a row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <Label mm="မွေးချိန်">Birth Time</Label>
            <input
              type="time" value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              style={inputBase(errors.time)}
            />
            <FieldError msg={errors.time} />
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4, fontFamily: F.sans }}>
              Used for Nakshatra moon calculation
            </div>
          </div>
          <div>
            <Label>Time Zone</Label>
            <select
              value={tzOffset}
              onChange={e => setTzOffset(e.target.value)}
              style={{ ...inputBase(false), appearance: 'none', cursor: 'pointer' }}
            >
              {TIMEZONES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 0', borderRadius: 16,
            background: loading ? '#d4b8a0' : C.primaryGrad,
            border: 'none', color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: F.serif, fontWeight: 700, fontSize: 16,
            boxShadow: loading ? 'none' : '0 4px 16px rgba(200,130,74,0.30)',
            transition: 'all 0.2s', letterSpacing: '0.5px',
          }}
        >
          {loading ? 'Calculating…' : '🔮 တွက်ချက်ရန် — Calculate'}
        </button>
      </div>
    </form>
  );
}

function Chip({ label, value }) {
  return (
    <div style={{ fontFamily: F.sans, fontSize: 12 }}>
      <span style={{ color: C.textFaint }}>{label}: </span>
      <span style={{ color: C.text, fontWeight: 700 }}>{value}</span>
    </div>
  );
}
