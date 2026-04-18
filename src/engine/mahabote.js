/**
 * Mahabote Calculation Engine
 * မဟာဘုတ်ဗေဒင် — Birth House, Bhumma, Seven Houses
 */

// ─── Weekday Data ───────────────────────────────────────────────────────────────
export const WEEKDAYS = [
  { id: 'sun', label: 'Sunday',                          myanmar: 'တနင်္ဂနွေ',  number: 1, keyword: 'အောင်', keywordEn: 'Victory'       },
  { id: 'mon', label: 'Monday',                          myanmar: 'တနင်္လာ',    number: 2, keyword: 'ကြီး',  keywordEn: 'Great'         },
  { id: 'tue', label: 'Tuesday',                         myanmar: 'အင်္ဂါ',     number: 3, keyword: 'စစ်',   keywordEn: 'Battle'        },
  { id: 'wed', label: 'Wednesday',                       myanmar: 'ဗုဒ္ဓဟူး',   number: 4, keyword: 'လံ',    keywordEn: 'Lance'         },
  { id: 'rah', label: 'Wednesday (after 6 PM) — Rahu',  myanmar: 'ရာဟု',       number: 4, keyword: 'လံ',    keywordEn: 'Lance (Rahu)'  },
  { id: 'thu', label: 'Thursday',                        myanmar: 'ကြာသပတေး',  number: 5, keyword: 'ပွဲ',   keywordEn: 'Festival'      },
  { id: 'fri', label: 'Friday',                          myanmar: 'သောကြာ',     number: 6, keyword: 'သူ',    keywordEn: 'Person'        },
  { id: 'sat', label: 'Saturday',                        myanmar: 'စနေ',        number: 0, keyword: 'ထူ',    keywordEn: 'Firm'          },
];

// JS getDay() → weekday id mapping (0=Sun … 6=Sat)
const JS_DAY_TO_ID = ['sun','mon','tue','wed','thu','fri','sat'];

/**
 * Derive weekday id from a Date object.
 * If Wednesday and hour >= 18 → 'rah'
 */
export function weekdayFromDate(date) {
  const id = JS_DAY_TO_ID[date.getDay()];
  return id;
}

// ─── Seven Houses ───────────────────────────────────────────────────────────────
export const HOUSES = [
  { id: 'binga',   myanmar: 'ဘင်္ဂ',    romanized: 'Binga',   class: 'lower', en: 'Collapse',   meaning: 'Collapse, loss, frequent setbacks'    },
  { id: 'marana',  myanmar: 'မရဏ',      romanized: 'Marana',  class: 'lower', en: 'Death',      meaning: 'Illness, endings, deep intensity'      },
  { id: 'athonn',  myanmar: 'အထွန်း',   romanized: 'Athonn',  class: 'upper', en: 'Flourish',   meaning: 'Growth, fame, beauty, success'         },
  { id: 'thoik',   myanmar: 'သိုက်',    romanized: 'Thoik',   class: 'upper', en: 'Wealth',     meaning: 'Property, money, family resources'     },
  { id: 'raja',    myanmar: 'ရာဇ',      romanized: 'Raja',    class: 'upper', en: 'Royal',      meaning: 'Authority, rank, achievement'          },
  { id: 'puti',    myanmar: 'ပုတိ',     romanized: 'Puti',    class: 'lower', en: 'Decay',      meaning: 'Difficulty, early-life hardship'       },
  { id: 'adipati', myanmar: 'အဓိပတိ',  romanized: 'Adipati', class: 'upper', en: 'Leadership', meaning: 'Leadership, influence, advancement'    },
];

// Clockwise keyword sequence starting from Binga
// Victory(1) · Lance(4) · Firm(7) · War(3) · Person(6) · Great(2) · Festival(5)
const KEYWORD_SEQUENCE = [1, 4, 7, 3, 6, 2, 5];
function toSeqNumber(n) { return n === 0 ? 7 : n; }

// ─── Year Conversion ────────────────────────────────────────────────────────────
export function toMyanmarYear(ceYear, afterNewYear = true) {
  return ceYear - (afterNewYear ? 638 : 639);
}

/**
 * Determine if a date is after Myanmar New Year (~April 17).
 */
export function isAfterMyanmarNewYear(month, day) {
  // month is 1-indexed
  return month > 4 || (month === 4 && day >= 17);
}

// ─── Birth House Calculation ────────────────────────────────────────────────────
export function calcBirthHouse(ceYear, weekdayId, afterNewYear = true) {
  const myanmarYear = toMyanmarYear(ceYear, afterNewYear);
  const remainder   = myanmarYear % 7;
  const yearKeyNum  = toSeqNumber(remainder);

  const weekday       = WEEKDAYS.find(w => w.id === weekdayId);
  const weekdayKeyNum = toSeqNumber(weekday?.number ?? 0);

  const yearSeqPos    = KEYWORD_SEQUENCE.indexOf(yearKeyNum);
  const weekdaySeqPos = KEYWORD_SEQUENCE.indexOf(weekdayKeyNum);

  const dist       = (weekdaySeqPos - yearSeqPos + 7) % 7;
  const houseIndex = dist;
  const birthHouse = HOUSES[houseIndex];

  const rotatedSeq = Array.from({ length: 7 }, (_, i) =>
    KEYWORD_SEQUENCE[(yearSeqPos + i) % 7]
  );
  const yearKwDay = WEEKDAYS.find(w => toSeqNumber(w.number) === yearKeyNum && w.id !== 'rah');

  const steps = [
    { label: 'Myanmar Year',   value: `${ceYear} − ${afterNewYear ? 638 : 639} = ${myanmarYear}` },
    { label: 'Year ÷ 7',       value: `${myanmarYear} ÷ 7 = ${Math.floor(myanmarYear / 7)} remainder ${remainder}` },
    { label: 'Year keyword',   value: `Remainder ${remainder} → ${yearKwDay?.keyword ?? '?'} (${yearKwDay?.keywordEn ?? '?'}) — placed at ဘင်္ဂ` },
    { label: 'House sequence', value: rotatedSeq.join(' → ') },
    { label: 'Birth weekday',  value: `${weekday?.label} keyword: ${weekday?.keyword} (${weekday?.keywordEn}) = ${weekdayKeyNum}` },
    { label: 'House position', value: `${weekdayKeyNum} is at position ${dist + 1} → ${birthHouse?.myanmar}` },
    { label: 'Birth House',    value: `${birthHouse?.myanmar} (${birthHouse?.en})` },
  ];

  return { myanmarYear, remainder, yearKeywordIndex: yearSeqPos, houseIndex, birthHouse, weekday, steps };
}

// ─── Character Profiles ─────────────────────────────────────────────────────────
export const PROFILES = {
  athonn: {
    title: 'Athonn-born (အထွန်းဖွား)',
    subtitle: 'The Flourishing Star',
    traits: [
      'Attractive, light-spirited, and socially magnetic',
      'Loves travel and thrives when away from home base',
      'Success comes through movement and outward connection',
      'Natural charm opens doors others find closed',
    ],
    myanmar: 'လှပ၊ ပေါ့ပါး၊ ခရီးသွားလာကြိုက်၊ အိမ်မကပ် စီးပွားအောင်မြင်',
    warning: null,
  },
  thoik: {
    title: 'Thoik-born (သိုက်ဖွား)',
    subtitle: 'The Wealth Nest',
    traits: [
      'Practical, hardworking, endures difficulty without complaint',
      'Manages money carefully and systematically',
      'Deep loyalty — willingly sacrifices for family',
      'Patient builder; results come slowly but solidly',
    ],
    myanmar: 'လက်တွေ့ကျ၊ ပင်ပန်းခံ၊ ငွေကိုစနစ်တကျသုံး၊ မိသားစုအတွက် ငွေကုန်များ',
    warning: null,
  },
  raja: {
    title: 'Raja-born (ရာဇဖွား)',
    subtitle: 'The Royal Authority',
    traits: [
      'Commands authority naturally — a born leader',
      'Carries great dignity and demands respect',
      'Strong drive for achievement and recognition',
      'Works best in positions of rank and responsibility',
    ],
    myanmar: 'အာဏာရ၊ ခေါင်းဆောင်ပီသ၊ ဂုဏ်သိက္ခာကြီးမား',
    warning: null,
  },
  adipati: {
    title: 'Adipati-born (အဓိပတိဖွား)',
    subtitle: 'The Presiding Chief',
    traits: [
      'Sharp intellect and clear analytical thinking',
      'Steady, upright advancement — rarely takes shortcuts',
      'Natural influence over others without forcing it',
      'Strong capacity for long-term strategic thinking',
    ],
    myanmar: 'ဉာဏ်ပညာထက်မြက်၊ တိုးတက်မှုဖြောင့်ဖြူး',
    warning: null,
  },
  puti: {
    title: 'Puti-born (ပုတိဖွား)',
    subtitle: 'The Duty Carrier',
    traits: [
      'Deep sense of duty and responsibility',
      'Early life is often difficult — fortune improves with age',
      'Dislikes privileged environments; thrives through genuine effort',
      'Hidden resilience that emerges under pressure',
    ],
    myanmar: 'တာဝန်ကျေပွန်လို၊ ငယ်စဉ်ကံနည်း၊ ရှေ့အစောပိုင်းခက်ခဲ',
    warning: 'Early stage challenges are temporary — this birth class often peaks in mid-to-late life.',
  },
  binga: {
    title: 'Binga-born (ဘင်္ဂဖွား)',
    subtitle: 'The Far-Flourishing',
    traits: [
      'Strangers tend to help more than close relatives',
      'Thrives when away from birthplace or hometown',
      'Passionate and intense — like a quick, bright fire',
      'Independent spirit; finds own path despite obstacles',
    ],
    myanmar: 'တစိမ်းထက် ဆွေမျိုးကဒုက္ခပေး၊ ဇာတိအဝေးမှာ ထွန်းပေါက်၊ ကောက်ရိုးမီးစိတ်',
    warning: 'Be mindful of trusting close family with major decisions during Bhumma years.',
  },
  marana: {
    title: 'Marana-born (မရဏဖွား)',
    subtitle: 'The Intense Survivor',
    traits: [
      'Intense, sharp, and mentally highly resilient',
      'Impulsive by nature — not suited to very long-term ventures',
      'Meticulous when focused, but tends to forget quickly',
      'Bears worldly hardship with surprising inner strength',
    ],
    myanmar: 'စိတ်ပြင်းထန်၊ ထက်မြက်၊ ချိတုံချတုံ၊ မေ့လွယ်၊ လောကဓံခံနိုင်',
    warning: 'Channel intensity into shorter, focused projects. Long, slow endeavors may frustrate.',
  },
};

// ─── Kasit Mahabote (Current Year Transit) ──────────────────────────────────────

/**
 * Get the current Myanmar year from today's date.
 */
export function getCurrentMyanmarYear() {
  const today = new Date();
  const after = isAfterMyanmarNewYear(today.getMonth() + 1, today.getDate());
  return today.getFullYear() - (after ? 638 : 639);
}

/**
 * ကသစ်မဟာဘုတ် — same algorithm as birth Mahabote but uses current Myanmar year.
 * Tells which house the birth weekday occupies THIS year.
 */
export function calcKasitMahabote(currentMyanmarYear, weekdayId) {
  const remainder     = currentMyanmarYear % 7;
  const yearKeyNum    = toSeqNumber(remainder);

  const weekday       = WEEKDAYS.find(w => w.id === weekdayId);
  const weekdayKeyNum = toSeqNumber(weekday?.number ?? 0);

  const yearSeqPos    = KEYWORD_SEQUENCE.indexOf(yearKeyNum);
  const weekdaySeqPos = KEYWORD_SEQUENCE.indexOf(weekdayKeyNum);

  const dist      = (weekdaySeqPos - yearSeqPos + 7) % 7;
  const kasitHouse = HOUSES[dist];

  const isGoodYear = ['athonn', 'thoik', 'raja', 'adipati'].includes(kasitHouse?.id);

  const yearKwDay  = WEEKDAYS.find(w => toSeqNumber(w.number) === yearKeyNum && w.id !== 'rah');
  const rotatedSeq = Array.from({ length: 7 }, (_, i) =>
    KEYWORD_SEQUENCE[(yearSeqPos + i) % 7]
  );

  const steps = [
    { label: 'Current Myanmar Year', value: `${currentMyanmarYear}` },
    { label: 'Year ÷ 7',             value: `${currentMyanmarYear} ÷ 7 = ${Math.floor(currentMyanmarYear / 7)} remainder ${remainder}` },
    { label: 'Year keyword',         value: `Remainder ${remainder} → ${yearKwDay?.keyword ?? '?'} — placed at ဘင်္ဂ` },
    { label: 'House sequence',       value: rotatedSeq.join(' → ') },
    { label: 'Birth weekday',        value: `${weekday?.myanmar} keyword: ${weekday?.keyword} = ${weekdayKeyNum}` },
    { label: 'Kasit House',          value: `${kasitHouse?.myanmar} (${kasitHouse?.en})` },
  ];

  return { currentMyanmarYear, remainder, kasitHouse, isGoodYear, weekday, steps };
}

// ─── Graha Riding (ဂြိုဟ်စီးဂြိုဟ်နင်း) ────────────────────────────────────────

// House order for graha riding (+3 mod 7 starting from Binga)
const GRAHA_HOUSE_ORDER = ['binga', 'marana', 'athonn', 'thoik', 'raja', 'puti', 'adipati'];

// Number (1-7) → weekday id
const NUM_TO_WD = { 1:'sun', 2:'mon', 3:'tue', 4:'wed', 5:'thu', 6:'fri', 7:'sat' };

// Planet strength
const PLANET_STRENGTH = {
  sun: 'strong', mon: 'medium', tue: 'weak',
  wed: 'medium', thu: 'strong', fri: 'medium',
  sat: 'weak',   rah: 'weak',
};

// Age period rulers (from reference section 5)
const AGE_PERIODS = [
  { planet: 'mon', from: 0,  to: 1   },
  { planet: 'tue', from: 1,  to: 2   },
  { planet: 'wed', from: 2,  to: 8   },
  { planet: 'sat', from: 8,  to: 15  },
  { planet: 'thu', from: 15, to: 21  },
  { planet: 'sun', from: 21, to: 35  },
  { planet: 'fri', from: 35, to: 999 },
];

/**
 * Build the full 7-house Graha Riding chart for a given Myanmar year.
 * Returns array of 7 entries (one per house in Binga-first order).
 */
export function calcGrahaRiding(myanmarYear) {
  const remainder = myanmarYear % 7;
  const startNum  = remainder === 0 ? 7 : remainder;

  return GRAHA_HOUSE_ORDER.map((houseId, i) => {
    // +3 per step, 1-indexed (formula verified against reference examples)
    const num       = ((startNum - 1 + i * 3) % 7) + 1;
    const weekdayId = NUM_TO_WD[num];
    const house     = HOUSES.find(h => h.id === houseId);
    const weekday   = WEEKDAYS.find(w => w.id === weekdayId);
    const strength  = PLANET_STRENGTH[weekdayId] ?? 'medium';
    const isGoodHouse = ['athonn', 'thoik', 'raja', 'adipati'].includes(houseId);

    // Outcome matrix from reference section 4
    let outcome;
    if      (strength === 'strong' && isGoodHouse)   outcome = 'excellent';   // ✅✅
    else if (strength === 'strong' && !isGoodHouse)  outcome = 'reduced';     // ✅ ဆိုးမှုလျော့
    else if (strength === 'medium' && isGoodHouse)   outcome = 'good';        // ✅
    else if (strength === 'medium' && !isGoodHouse)  outcome = 'neutral';     // ↔
    else if (strength === 'weak'   && isGoodHouse)   outcome = 'diminished';  // ⚠ ကောင်းယိုယွင်း
    else                                              outcome = 'danger';      // ⚠⚠

    return { houseId, house, num, weekdayId, weekday, strength, isGoodHouse, outcome };
  });
}

/**
 * Get the age-period ruling planet and where it sits in a given graha chart.
 */
export function getAgePeriodRuler(age, grahaChart) {
  const period   = AGE_PERIODS.find(p => age >= p.from && age < p.to) ?? AGE_PERIODS[AGE_PERIODS.length - 1];
  const slot     = grahaChart.find(s => s.weekdayId === period.planet);
  return { period, slot };
}

// ─── Bhumma ─────────────────────────────────────────────────────────────────────
const BHUMMA_CORE_AGES = {
  sun: [36,44], mon: [44], tue: [36,44,52], wed: [52],
  rah: [52], thu: [52], fri: [44], sat: [44,52,60],
};
const BHUMMA_GREAT_AGES = {
  sun: [31,39], mon: [47], tue: [39,47], wed: [47,55],
  rah: [39,47], thu: [55], fri: [47], sat: [47,55],
};

export function calcBhumma(age, weekdayId) {
  const smallActive = age % 8 === 7;
  const nextSmall   = smallActive ? age : age + (7 - (age % 8) + 7) % 8 || age + 8;

  const coreAges   = BHUMMA_CORE_AGES[weekdayId]  ?? [];
  const coreActive = coreAges.includes(age);
  const nextCore   = coreAges.find(a => a > age) ?? null;

  const greatAges   = BHUMMA_GREAT_AGES[weekdayId] ?? [];
  const greatActive = greatAges.includes(age);
  const nextGreat   = greatAges.find(a => a > age) ?? null;

  let severity = 'none';
  if (greatActive) severity = 'great';
  else if (coreActive) severity = 'core';
  else if (smallActive) severity = 'small';

  return { smallActive, nextSmall, coreActive, coreAges, nextCore, greatActive, greatAges, nextGreat, severity };
}
