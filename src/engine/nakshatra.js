/**
 * Nakshatra Calculation Engine
 * Moon longitude via simplified Meeus algorithm + Lahiri ayanamsa
 */

// ─── Astronomical Calculations ─────────────────────────────────────────────────
export function julianDay(year, month, day, hour = 0) {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5;
}

export function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const D  = (297.8501921 + 445267.1114034 * T - 0.0018819 * T * T) % 360;
  const M  = (357.5291092 +  35999.0502909 * T - 0.0001536 * T * T) % 360;
  const Mp = (134.9633964 + 477198.8675055 * T + 0.0087414 * T * T) % 360;
  const F  = ( 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T) % 360;
  const r  = (d) => d * Math.PI / 180;

  let lon = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  lon +=  6.288774 * Math.sin(r(Mp));
  lon +=  1.274027 * Math.sin(r(2*D - Mp));
  lon +=  0.658314 * Math.sin(r(2*D));
  lon +=  0.213618 * Math.sin(r(2*Mp));
  lon -= 0.185116 * Math.sin(r(M));
  lon -= 0.114332 * Math.sin(r(2*F));
  lon +=  0.058793 * Math.sin(r(2*D - 2*Mp));
  lon +=  0.057066 * Math.sin(r(2*D - M - Mp));
  lon +=  0.053322 * Math.sin(r(2*D + Mp));
  lon +=  0.045758 * Math.sin(r(2*D - M));
  lon -= 0.040923 * Math.sin(r(M - Mp));
  lon -= 0.034720 * Math.sin(r(D));
  lon -= 0.030383 * Math.sin(r(M + Mp));
  lon +=  0.015327 * Math.sin(r(2*D - 2*F));
  lon -= 0.012528 * Math.sin(r(Mp + 2*F));
  lon +=  0.010980 * Math.sin(r(Mp - 2*F));
  return ((lon % 360) + 360) % 360;
}

export function lahiriAyanamsa(jd) {
  return 23.85 + 0.0137 * (jd - 2451545.0) / 365.25;
}

/**
 * Calculate nakshatra from birth date/time/timezone.
 * @param {number} year @param {number} month @param {number} day
 * @param {number} hour @param {number} minute @param {number} tzOffset
 */
export function calcNakshatra(year, month, day, hour, minute, tzOffset) {
  const utcHour = hour - tzOffset + minute / 60;
  const jd = julianDay(year, month, day, utcHour);
  const tropicalMoon = moonLongitude(jd);
  const ayanamsa = lahiriAyanamsa(jd);
  const siderealMoon = ((tropicalMoon - ayanamsa) % 360 + 360) % 360;
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
  const pada = Math.floor((siderealMoon % (360 / 27)) / (360 / 108)) + 1;
  const rashiIndex = Math.floor(siderealMoon / 30);
  return { siderealMoon, nakshatraIndex, pada, rashiIndex, ayanamsa, tropicalMoon };
}

// ─── Data ───────────────────────────────────────────────────────────────────────
export const NAKSHATRAS = [
  { mm: 'အဿဝဏီ',          en: 'Ashwini',        lord: 'Ketu',    deity: 'Ashwini Kumaras', symbol: '🐴', animal: 'Horse'    },
  { mm: 'ဘရဏီ',            en: 'Bharani',        lord: 'Venus',   deity: 'Yama',            symbol: '🔺', animal: 'Elephant' },
  { mm: 'ကြတ္တိကာ',         en: 'Krittika',       lord: 'Sun',     deity: 'Agni',            symbol: '🔥', animal: 'Goat'     },
  { mm: 'ရောဟဏီ',          en: 'Rohini',         lord: 'Moon',    deity: 'Brahma',          symbol: '🐂', animal: 'Serpent'  },
  { mm: 'မိဂသီ',            en: 'Mrigashira',     lord: 'Mars',    deity: 'Soma',            symbol: '🦌', animal: 'Serpent'  },
  { mm: 'အဒြ',              en: 'Ardra',          lord: 'Rahu',    deity: 'Rudra',           symbol: '💎', animal: 'Dog'      },
  { mm: 'ပုဏ္ဏဖုသျှု',       en: 'Punarvasu',      lord: 'Jupiter', deity: 'Aditi',           symbol: '🏹', animal: 'Cat'      },
  { mm: 'ဖုသျှ',            en: 'Pushya',         lord: 'Saturn',  deity: 'Brihaspati',      symbol: '🌸', animal: 'Goat'     },
  { mm: 'အသလိဿ',           en: 'Ashlesha',       lord: 'Mercury', deity: 'Nagas',           symbol: '🐍', animal: 'Cat'      },
  { mm: 'မာဃ',              en: 'Magha',          lord: 'Ketu',    deity: 'Pitris',          symbol: '👑', animal: 'Rat'      },
  { mm: 'ပြုဗ္ဗာဘရဂုဏ္ဏီ',   en: 'P.Phalguni',    lord: 'Venus',   deity: 'Bhaga',           symbol: '🛏️', animal: 'Rat'      },
  { mm: 'ဥတ္တရာဘရဂုဏ္ဏီ',   en: 'U.Phalguni',    lord: 'Sun',     deity: 'Aryaman',         symbol: '🛏️', animal: 'Cow'      },
  { mm: 'ဟတ္ထ',             en: 'Hasta',          lord: 'Moon',    deity: 'Savitar',         symbol: '✋', animal: 'Buffalo'  },
  { mm: 'စိတြာ',            en: 'Chitra',         lord: 'Mars',    deity: 'Tvashtar',        symbol: '💎', animal: 'Tiger'    },
  { mm: 'သာတိ',             en: 'Swati',          lord: 'Rahu',    deity: 'Vayu',            symbol: '🌿', animal: 'Buffalo'  },
  { mm: 'ဝိသာခ',            en: 'Vishakha',       lord: 'Jupiter', deity: 'Indra-Agni',      symbol: '🏛️', animal: 'Tiger'    },
  { mm: 'အနုရာဓ',           en: 'Anuradha',       lord: 'Saturn',  deity: 'Mitra',           symbol: '🪷', animal: 'Deer'     },
  { mm: 'ဇေဋ္ဌာ',           en: 'Jyeshtha',       lord: 'Mercury', deity: 'Indra',           symbol: '☂️', animal: 'Deer'     },
  { mm: 'မူလ',              en: 'Mula',           lord: 'Ketu',    deity: 'Nirriti',         symbol: '⚡', animal: 'Dog'      },
  { mm: 'ပြုဗ္ဗာသာဠ်',      en: 'P.Ashadha',     lord: 'Venus',   deity: 'Apas',            symbol: '🐘', animal: 'Monkey'   },
  { mm: 'ဥတ္တရာသာဠ်',      en: 'U.Ashadha',     lord: 'Sun',     deity: 'Vishvadevas',     symbol: '🐘', animal: 'Mongoose' },
  { mm: 'သရဝဏ',             en: 'Shravana',       lord: 'Moon',    deity: 'Vishnu',          symbol: '👂', animal: 'Monkey'   },
  { mm: 'ဓနိဋ္ဌာ',          en: 'Dhanishta',      lord: 'Mars',    deity: 'Vasus',           symbol: '🥁', animal: 'Lion'     },
  { mm: 'သတဘိသျက်',        en: 'Shatabhisha',    lord: 'Rahu',    deity: 'Varuna',          symbol: '⭕', animal: 'Horse'    },
  { mm: 'ပြုဗ္ဗာဘဒ္ဒပဒ',     en: 'P.Bhadrapada',  lord: 'Jupiter', deity: 'Ajaikapada',      symbol: '⚔️', animal: 'Lion'     },
  { mm: 'ဥတ္တရာဘဒ္ဒပဒ',     en: 'U.Bhadrapada',  lord: 'Saturn',  deity: 'Ahir Budhnya',    symbol: '🐍', animal: 'Cow'      },
  { mm: 'ရေဝတီ',            en: 'Revati',         lord: 'Mercury', deity: 'Pushan',          symbol: '🐟', animal: 'Elephant' },
];

export const RASHIS = [
  { mm: 'မိဿ',    en: 'Aries',       symbol: '♈' },
  { mm: 'ပြိဿ',   en: 'Taurus',      symbol: '♉' },
  { mm: 'မေထုန်',  en: 'Gemini',      symbol: '♊' },
  { mm: 'ကရကဋ်',  en: 'Cancer',      symbol: '♋' },
  { mm: 'သိဟ်',   en: 'Leo',         symbol: '♌' },
  { mm: 'ကန်',    en: 'Virgo',       symbol: '♍' },
  { mm: 'တူ',     en: 'Libra',       symbol: '♎' },
  { mm: 'ဗြိစ္ဆာ', en: 'Scorpio',     symbol: '♏' },
  { mm: 'ဓနု',    en: 'Sagittarius', symbol: '♐' },
  { mm: 'မကာရ',   en: 'Capricorn',   symbol: '♑' },
  { mm: 'ကုံ',    en: 'Aquarius',    symbol: '♒' },
  { mm: 'မိန်',   en: 'Pisces',      symbol: '♓' },
];

export const GANAS = {
  0:'ဒေဝ', 1:'မနုဿ', 2:'ရက္ခ', 3:'မနုဿ', 4:'ဒေဝ',
  5:'မနုဿ', 6:'ဒေဝ', 7:'ဒေဝ', 8:'ရက္ခ', 9:'ရက္ခ',
  10:'မနုဿ', 11:'မနုဿ', 12:'ဒေဝ', 13:'ရက္ခ', 14:'ဒေဝ',
  15:'ရက္ခ', 16:'ဒေဝ', 17:'ရက္ခ', 18:'ရက္ခ', 19:'မနုဿ',
  20:'မနုဿ', 21:'ဒေဝ', 22:'ရက္ခ', 23:'ရက္ခ', 24:'မနုဿ',
  25:'မနုဿ', 26:'ဒေဝ',
};

export const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export const PADA_SYLLABLES = [
  ['Chu','Che','Cho','La'],   ['Li','Lu','Le','Lo'],    ['A','I','U','E'],
  ['O','Va','Vi','Vu'],       ['Ve','Vo','Ka','Ki'],     ['Ku','Gha','Ng','Chha'],
  ['Ke','Ko','Ha','Hi'],      ['Hu','He','Ho','Da'],     ['Di','Du','De','Do'],
  ['Ma','Mi','Mu','Me'],      ['Mo','Ta','Ti','Tu'],     ['Te','To','Pa','Pi'],
  ['Pu','Sha','Na','Tha'],    ['Pe','Po','Ra','Ri'],     ['Ru','Re','Ro','Taa'],
  ['Ti','Tu','Te','To'],      ['Na','Ni','Nu','Ne'],     ['No','Ya','Yi','Yu'],
  ['Ye','Yo','Bha','Bhi'],    ['Bhu','Dha','Pha','Dha'],['Bhe','Bho','Ja','Ji'],
  ['Ju/Khi','Je/Khu','Jo/Khe','Gha'], ['Ga','Gi','Gu','Ge'],
  ['Go','Sa','Si','Su'],      ['Se','So','Da','Di'],     ['Du','Tha','Jha','Da'],
  ['De','Do','Cha','Chi'],
];
