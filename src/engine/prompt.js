/**
 * Myanmar AI Prompt Builder — concise version (English instructions, Myanmar data values)
 */

import { NAKSHATRAS, RASHIS, GANAS, DASHA_YEARS, PADA_SYLLABLES } from './nakshatra.js';
import { PROFILES } from './mahabote.js';

const GANA_EN = { ဒေဝ: 'Deva (Divine/Gentle)', မနုဿ: 'Manushya (Human/Practical)', ရက္ခ: 'Rakshasa (Intense/Bold)' };

const HOUSE_YATRA = {
  athonn:  'Temple visit, offering flowers',
  thoik:   'Dana (almsgiving), offering food to monks',
  raja:    'Offer food to monks, honour elders',
  adipati: 'Support education, donate to schools',
  puti:    'Release animals (thit-that-hlut), donate medicine',
  binga:   'Repair pagodas or temples',
  marana:  'Recite paritha, spread metta, offer candles',
};

const OUTCOME_EN = {
  excellent:  'Excellent ✅✅',
  good:       'Good ✅',
  reduced:    'Bad reduced 🛡️',
  neutral:    'Neutral ↔',
  diminished: 'Good diminished ⚠️',
  danger:     'Danger ⚠⚠',
};

export function buildMyanmarAIPrompt(input, nakResult, mahaboteResult, bhumma, birthChart, kasitChart, agePeriod) {
  const nak      = NAKSHATRAS[nakResult.nakshatraIndex];
  const rashi    = RASHIS[nakResult.rashiIndex];
  const gana     = GANAS[nakResult.nakshatraIndex];
  const syllable = PADA_SYLLABLES[nakResult.nakshatraIndex]?.[nakResult.pada - 1] ?? '—';
  const profile  = PROFILES[mahaboteResult.birthHouse?.id];
  const house    = mahaboteResult.birthHouse;
  const isUpper  = house?.class === 'upper';
  const yatra    = HOUSE_YATRA[house?.id] ?? 'Dana, Sila, Bhavana';

  const bhummaStatus = bhumma.greatActive
    ? `Great Bhumma ACTIVE at age ${input.age} — major life turning point`
    : bhumma.coreActive
    ? `Core Bhumma ACTIVE at age ${input.age} — root challenge period`
    : bhumma.smallActive
    ? `Small Bhumma ACTIVE at age ${input.age} — caution signal`
    : `No Bhumma active at age ${input.age} — stable. Next: Great@${bhumma.nextGreat ?? '?'}, Core@${bhumma.nextCore ?? '?'}`;

  // Graha: birth weekday position in both charts
  const bdId = input.weekdayId === 'rah' ? 'wed' : input.weekdayId;
  const bdBirth = birthChart?.find(s => s.weekdayId === bdId);
  const bdKasit = kasitChart?.find(s => s.weekdayId === bdId);

  // Age period ruler
  const ageRuler     = agePeriod?.period?.planet ?? '?';
  const ageSlotB     = agePeriod?.birthSlot ?? agePeriod?.slot;
  const ageSlotK     = agePeriod?.kasitSlot;
  const ageRulerWd   = birthChart?.find(s => s.weekdayId === ageRuler)?.weekday?.myanmar ?? ageRuler;

  // Danger combos in current year
  const dangers = kasitChart?.filter(s => s.outcome === 'danger')
    .map(s => `${s.weekday?.myanmar}→${s.house?.myanmar}`) ?? [];

  // Best combo in current year
  const bests = kasitChart?.filter(s => s.outcome === 'excellent')
    .map(s => `${s.weekday?.myanmar}→${s.house?.myanmar}`) ?? [];

  const grahaSection = birthChart ? `
Graha Riding (ဂြိုဟ်စီး):
- Birth weekday (${input.weekdayId}) in birth chart: ${bdBirth?.house?.myanmar ?? '?'} / ${bdBirth?.house?.en ?? '?'} → ${OUTCOME_EN[bdBirth?.outcome] ?? '?'}
- Birth weekday in current year chart: ${bdKasit?.house?.myanmar ?? '?'} / ${bdKasit?.house?.en ?? '?'} → ${OUTCOME_EN[bdKasit?.outcome] ?? '?'}
- Age ${input.age} period ruler: ${ageRulerWd} → birth chart: ${ageSlotB?.house?.myanmar ?? '?'} (${OUTCOME_EN[ageSlotB?.outcome] ?? '?'}), current year: ${ageSlotK?.house?.myanmar ?? '?'} (${OUTCOME_EN[ageSlotK?.outcome] ?? '?'})
${dangers.length ? `- Current year danger combos: ${dangers.join(', ')}` : '- No danger combos this year'}
${bests.length   ? `- Current year excellent combos: ${bests.join(', ')}` : ''}` : '';

  return `You are a Myanmar traditional astrology advisor (Nakshatra + Mahabote + Bhumma + Graha Riding).

Write a reading in MYANMAR LANGUAGE (Burmese script) using exactly these 6 bold headings:

**① နက္ခတ် (Nakshatra) — ဇာတ်မွေးကြယ်**
**② မဟာဘုတ် (Mahabote) — ဖွားဇာတာ**
**③ ဘုမ္မိ (Bhumma) — အချိန်ဖိအား**
**④ ဂြိုဟ်စီး (Graha Riding) — ယခုနှစ်ရာသီ**
**⑤ ပေါင်းစပ်ဆုံးဖြတ်ချက်**
**⑥ ယတြာနှင့် အကြံဥာဏ်**

Rules: 2-3 sentences per section. Diagnostic not predictive. No fear-based language. Myanmar script throughout. Technical terms in parentheses ok.
For ④: reference the birth weekday's graha position and age-period ruler. Mention danger combos only if present, with reassurance.

--- DATA ---
Birth: ${input.birthDate}, weekday: ${input.weekdayId}, age: ${input.age}
Myanmar Year: ${mahaboteResult.myanmarYear}

Nakshatra: ${nak.mm} / ${nak.en} (#${nakResult.nakshatraIndex + 1}, pada ${nakResult.pada}, syllable "${syllable}")
Lord: ${nak.lord} (${DASHA_YEARS[nak.lord]}yr dasha), Deity: ${nak.deity}, Animal: ${nak.animal}
Rashi: ${rashi.mm} / ${rashi.en} ${rashi.symbol}
Gana: ${gana} — ${GANA_EN[gana] ?? gana}

Mahabote house: ${house?.myanmar} / ${house?.en} (${isUpper ? 'Upper class' : 'Lower class'})
Profile: ${profile?.myanmar ?? ''}
Traits: ${profile?.traits?.join(', ') ?? ''}

Bhumma: ${bhummaStatus}
${grahaSection}
Yatra for ${house?.en}: ${yatra}`;
}
