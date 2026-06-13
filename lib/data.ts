// ===== נתוני המשחק: מדינות, שאלות הידעת, ומשחקי מונדיאל =====

export type Country = {
  name: string;        // שם בעברית
  flag: string;        // אמוג'י דגל
  capital: string;     // עיר בירה
  continent: string;   // יבשת
};

// יבשות לשאלות הגאוגרפיה
export const CONTINENTS = [
  "אירופה",
  "אסיה",
  "אפריקה",
  "צפון אמריקה",
  "דרום אמריקה",
  "אוקיאניה",
];

// מאגר מדינות (קל להוסיף עוד — פשוט הוסיפו שורה)
export const COUNTRIES: Country[] = [
  { name: "ברזיל", flag: "🇧🇷", capital: "ברזיליה", continent: "דרום אמריקה" },
  { name: "ארגנטינה", flag: "🇦🇷", capital: "בואנוס איירס", continent: "דרום אמריקה" },
  { name: "צרפת", flag: "🇫🇷", capital: "פריז", continent: "אירופה" },
  { name: "אנגליה", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", capital: "לונדון", continent: "אירופה" },
  { name: "ספרד", flag: "🇪🇸", capital: "מדריד", continent: "אירופה" },
  { name: "גרמניה", flag: "🇩🇪", capital: "ברלין", continent: "אירופה" },
  { name: "פורטוגל", flag: "🇵🇹", capital: "ליסבון", continent: "אירופה" },
  { name: "איטליה", flag: "🇮🇹", capital: "רומא", continent: "אירופה" },
  { name: "הולנד", flag: "🇳🇱", capital: "אמסטרדם", continent: "אירופה" },
  { name: "בלגיה", flag: "🇧🇪", capital: "בריסל", continent: "אירופה" },
  { name: "קרואטיה", flag: "🇭🇷", capital: "זאגרב", continent: "אירופה" },
  { name: "מרוקו", flag: "🇲🇦", capital: "רבאט", continent: "אפריקה" },
  { name: "סנגל", flag: "🇸🇳", capital: "דקאר", continent: "אפריקה" },
  { name: "מצרים", flag: "🇪🇬", capital: "קהיר", continent: "אפריקה" },
  { name: "ניגריה", flag: "🇳🇬", capital: "אבוג'ה", continent: "אפריקה" },
  { name: "אלג'יריה", flag: "🇩🇿", capital: "אלג'יר", continent: "אפריקה" },
  { name: "יפן", flag: "🇯🇵", capital: "טוקיו", continent: "אסיה" },
  { name: "דרום קוריאה", flag: "🇰🇷", capital: "סיאול", continent: "אסיה" },
  { name: "ערב הסעודית", flag: "🇸🇦", capital: "ריאד", continent: "אסיה" },
  { name: "אוסטרליה", flag: "🇦🇺", capital: "קנברה", continent: "אוקיאניה" },
  { name: "ארצות הברית", flag: "🇺🇸", capital: "וושינגטון", continent: "צפון אמריקה" },
  { name: "מקסיקו", flag: "🇲🇽", capital: "מקסיקו סיטי", continent: "צפון אמריקה" },
  { name: "קנדה", flag: "🇨🇦", capital: "אוטווה", continent: "צפון אמריקה" },
  { name: "אורוגוואי", flag: "🇺🇾", capital: "מונטווידאו", continent: "דרום אמריקה" },
  { name: "קולומביה", flag: "🇨🇴", capital: "בוגוטה", continent: "דרום אמריקה" },
  { name: "ישראל", flag: "🇮🇱", capital: "ירושלים", continent: "אסיה" },
  { name: "שווייץ", flag: "🇨🇭", capital: "ברן", continent: "אירופה" },
  { name: "שוודיה", flag: "🇸🇪", capital: "שטוקהולם", continent: "אירופה" },
  { name: "נורווגיה", flag: "🇳🇴", capital: "אוסלו", continent: "אירופה" },
  { name: "דנמרק", flag: "🇩🇰", capital: "קופנהגן", continent: "אירופה" },
  { name: "פולין", flag: "🇵🇱", capital: "ורשה", continent: "אירופה" },
  { name: "יוון", flag: "🇬🇷", capital: "אתונה", continent: "אירופה" },
  { name: "אוקראינה", flag: "🇺🇦", capital: "קייב", continent: "אירופה" },
  { name: "אוסטריה", flag: "🇦🇹", capital: "וינה", continent: "אירופה" },
  { name: "אירלנד", flag: "🇮🇪", capital: "דבלין", continent: "אירופה" },
  { name: "צ'כיה", flag: "🇨🇿", capital: "פראג", continent: "אירופה" },
  { name: "סרביה", flag: "🇷🇸", capital: "בלגרד", continent: "אירופה" },
  { name: "רוסיה", flag: "🇷🇺", capital: "מוסקבה", continent: "אירופה" },
  { name: "טורקיה", flag: "🇹🇷", capital: "אנקרה", continent: "אסיה" },
  { name: "סין", flag: "🇨🇳", capital: "בייג'ינג", continent: "אסיה" },
  { name: "הודו", flag: "🇮🇳", capital: "ניו דלהי", continent: "אסיה" },
  { name: "תאילנד", flag: "🇹🇭", capital: "בנגקוק", continent: "אסיה" },
  { name: "איראן", flag: "🇮🇷", capital: "טהראן", continent: "אסיה" },
  { name: "איחוד האמירויות", flag: "🇦🇪", capital: "אבו דאבי", continent: "אסיה" },
  { name: "קטאר", flag: "🇶🇦", capital: "דוחא", continent: "אסיה" },
  { name: "אינדונזיה", flag: "🇮🇩", capital: "ג'קרטה", continent: "אסיה" },
  { name: "וייטנאם", flag: "🇻🇳", capital: "האנוי", continent: "אסיה" },
  { name: "דרום אפריקה", flag: "🇿🇦", capital: "פרטוריה", continent: "אפריקה" },
  { name: "גאנה", flag: "🇬🇭", capital: "אקרה", continent: "אפריקה" },
  { name: "קמרון", flag: "🇨🇲", capital: "יאונדה", continent: "אפריקה" },
  { name: "חוף השנהב", flag: "🇨🇮", capital: "יאמוסוקרו", continent: "אפריקה" },
  { name: "תוניסיה", flag: "🇹🇳", capital: "תוניס", continent: "אפריקה" },
  { name: "קניה", flag: "🇰🇪", capital: "ניירובי", continent: "אפריקה" },
  { name: "אתיופיה", flag: "🇪🇹", capital: "אדיס אבבה", continent: "אפריקה" },
  { name: "ניו זילנד", flag: "🇳🇿", capital: "וולינגטון", continent: "אוקיאניה" },
  { name: "צ'ילה", flag: "🇨🇱", capital: "סנטיאגו", continent: "דרום אמריקה" },
  { name: "פרו", flag: "🇵🇪", capital: "לימה", continent: "דרום אמריקה" },
  { name: "אקוודור", flag: "🇪🇨", capital: "קיטו", continent: "דרום אמריקה" },
  { name: "פרגוואי", flag: "🇵🇾", capital: "אסונסיון", continent: "דרום אמריקה" },
  { name: "קוסטה ריקה", flag: "🇨🇷", capital: "סן חוסה", continent: "צפון אמריקה" },
  { name: "ג'מייקה", flag: "🇯🇲", capital: "קינגסטון", continent: "צפון אמריקה" },
  { name: "פנמה", flag: "🇵🇦", capital: "פנמה סיטי", continent: "צפון אמריקה" },
  { name: "בוסניה והרצגובינה", flag: "🇧🇦", capital: "סרייבו", continent: "אירופה" },
  { name: "סקוטלנד", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", capital: "אדינבורו", continent: "אירופה" },
  { name: "האיטי", flag: "🇭🇹", capital: "פורט-או-פרנס", continent: "צפון אמריקה" },
  { name: "קוראסאו", flag: "🇨🇼", capital: "וילמסטד", continent: "צפון אמריקה" },
  { name: "כף ורדה", flag: "🇨🇻", capital: "פראיה", continent: "אפריקה" },
  { name: "עיראק", flag: "🇮🇶", capital: "בגדד", continent: "אסיה" },
  { name: "ירדן", flag: "🇯🇴", capital: "עמאן", continent: "אסיה" },
  { name: "קונגו הדמוקרטית", flag: "🇨🇩", capital: "קינשאסה", continent: "אפריקה" },
  { name: "אוזבקיסטן", flag: "🇺🇿", capital: "טשקנט", continent: "אסיה" },
];

// ===== שאלות הידעת על כדורגל: שלושה משפטי קריאה ואז שאלה אמריקאית =====
export type Trivia = {
  facts: string[];      // שלושה משפטים ללמידה
  question: string;     // השאלה
  options: string[];    // אפשרויות
  answer: number;       // אינדקס התשובה הנכונה
};

export const TRIVIA: Trivia[] = [
  {
    facts: [
      "המונדיאל (גביע העולם בכדורגל) מתקיים אחת לארבע שנים.",
      "הטורניר הראשון נערך בשנת 1930 באורוגוואי, והמדינה המארחת גם זכתה בו.",
      "מאז משתתפות בו הנבחרות הטובות בעולם מכל היבשות.",
    ],
    question: "באיזו שנה נערך המונדיאל הראשון?",
    options: ["1930", "1950", "1966", "1992"],
    answer: 0,
  },
  {
    facts: [
      "ברזיל היא הנבחרת המצליחה בהיסטוריה של המונדיאל.",
      "היא זכתה בגביע העולם חמש פעמים — יותר מכל מדינה אחרת.",
      "שחקנים אגדיים כמו פלה ורונאלדו שיחקו עבורה.",
    ],
    question: "כמה פעמים זכתה ברזיל בגביע העולם?",
    options: ["3", "4", "5", "6"],
    answer: 2,
  },
  {
    facts: [
      "במשחק כדורגל יש 11 שחקנים בכל קבוצה על המגרש.",
      "אחד מהם הוא השוער, היחיד שמותר לו לגעת בכדור עם הידיים.",
      "המשחק נמשך 90 דקות, מחולקות לשתי מחציות.",
    ],
    question: "כמה שחקנים יש בכל קבוצה על המגרש?",
    options: ["9", "10", "11", "12"],
    answer: 2,
  },
  {
    facts: [
      "ליאו מסי נחשב לאחד הכדורגלנים הגדולים בכל הזמנים.",
      "הוא הוביל את נבחרת ארגנטינה לזכייה במונדיאל 2022 בקטאר.",
      "מסי זכה בתואר שחקן השנה של פיפ\"א מספר שיא של פעמים.",
    ],
    question: "עם איזו נבחרת זכה מסי במונדיאל 2022?",
    options: ["ברזיל", "ספרד", "ארגנטינה", "צרפת"],
    answer: 2,
  },
  {
    facts: [
      "כרטיס אדום מורה לשחקן לעזוב את המגרש מיד.",
      "אחרי כרטיס אדום הקבוצה ממשיכה לשחק עם שחקן אחד פחות.",
      "שני כרטיסים צהובים באותו משחק שווים לכרטיס אדום.",
    ],
    question: "מה קורה לשחקן שמקבל כרטיס אדום?",
    options: ["מקבל אזהרה", "עוזב את המגרש", "מבקיע גול", "מחליף עמדה"],
    answer: 1,
  },
  {
    facts: [
      "מונדיאל 2026 הוא המארח בשלוש מדינות יחד לראשונה בהיסטוריה.",
      "המשחקים מתקיימים בארצות הברית, קנדה ומקסיקו.",
      "זהו גם המונדיאל הראשון עם 48 נבחרות משתתפות.",
    ],
    question: "כמה נבחרות משתתפות במונדיאל 2026?",
    options: ["24", "32", "48", "64"],
    answer: 2,
  },
  {
    facts: [
      "בעיטת עונשין (פנדל) ניתנת על עבירה בתוך רחבת ה-16.",
      "הכדור מונח על נקודה במרחק 11 מטר מהשער.",
      "רק השוער עומד מול הבועט בניסיון להציל.",
    ],
    question: "ממרחק כמה מטרים נבעט פנדל?",
    options: ["9 מטר", "11 מטר", "16 מטר", "20 מטר"],
    answer: 1,
  },
  {
    facts: [
      "ה'האט-טריק' הוא כינוי להבקעת שלושה שערים על ידי שחקן אחד במשחק.",
      "זהו הישג נדיר ומרגש מאוד לכל חובב כדורגל.",
      "השחקן זוכה בדרך כלל לקחת איתו את כדור המשחק למזכרת.",
    ],
    question: "כמה שערים צריך להבקיע ל'האט-טריק'?",
    options: ["2", "3", "4", "5"],
    answer: 1,
  },
];

// ===== משחקי מונדיאל 2026 (זרע התחלתי) =====
// ניתן לעדכן/להוסיף משחקים גם דרך לשונית ההורים, והשליפה האוטומטית תעדכן תוצאות.
export type SeedMatch = {
  id: string;
  teamA: string;
  teamB: string;
  date: string;   // ISO
  stage: string;
};

function c(name: string): Country {
  return COUNTRIES.find((x) => x.name === name)!;
}

// כל 72 משחקי שלב הבתים — תאריכים ב-UTC, הדפדפן מציג בשעון מקומי (ישראל UTC+3)
// להוספת משחקי נוק-אאוט: השתמש בממשק הניהול (כרטיסייה "ניהול" → "הוספת משחק")
export const SEED_MATCHES: SeedMatch[] = [
  // === בית A: מקסיקו, דרום אפריקה, דרום קוריאה, צ׳כיה ===
  { id: "a1", teamA: "מקסיקו",      teamB: "דרום אפריקה", date: "2026-06-11T19:00:00Z", stage: "בית A" },
  { id: "a2", teamA: "דרום קוריאה", teamB: "צ'כיה",        date: "2026-06-12T02:00:00Z", stage: "בית A" },
  { id: "a3", teamA: "צ'כיה",        teamB: "דרום אפריקה", date: "2026-06-18T16:00:00Z", stage: "בית A" },
  { id: "a4", teamA: "מקסיקו",      teamB: "דרום קוריאה", date: "2026-06-19T03:00:00Z", stage: "בית A" },
  { id: "a5", teamA: "צ'כיה",        teamB: "מקסיקו",      date: "2026-06-25T01:00:00Z", stage: "בית A" },
  { id: "a6", teamA: "דרום אפריקה", teamB: "דרום קוריאה", date: "2026-06-25T01:00:00Z", stage: "בית A" },

  // === בית B: קנדה, בוסניה והרצגובינה, קטאר, שווייץ ===
  { id: "b1", teamA: "קנדה",               teamB: "בוסניה והרצגובינה", date: "2026-06-12T19:00:00Z", stage: "בית B" },
  { id: "b2", teamA: "קטאר",               teamB: "שווייץ",             date: "2026-06-13T19:00:00Z", stage: "בית B" },
  { id: "b3", teamA: "שווייץ",             teamB: "בוסניה והרצגובינה", date: "2026-06-18T19:00:00Z", stage: "בית B" },
  { id: "b4", teamA: "קנדה",               teamB: "קטאר",               date: "2026-06-18T22:00:00Z", stage: "בית B" },
  { id: "b5", teamA: "שווייץ",             teamB: "קנדה",               date: "2026-06-24T19:00:00Z", stage: "בית B" },
  { id: "b6", teamA: "בוסניה והרצגובינה", teamB: "קטאר",               date: "2026-06-24T19:00:00Z", stage: "בית B" },

  // === בית C: ארצות הברית, פרגוואי, אוסטרליה, טורקיה ===
  { id: "c1", teamA: "ארצות הברית", teamB: "פרגוואי",    date: "2026-06-13T01:00:00Z", stage: "בית C" },
  { id: "c2", teamA: "אוסטרליה",    teamB: "טורקיה",     date: "2026-06-14T04:00:00Z", stage: "בית C" },
  { id: "c3", teamA: "ארצות הברית", teamB: "אוסטרליה",   date: "2026-06-19T19:00:00Z", stage: "בית C" },
  { id: "c4", teamA: "טורקיה",      teamB: "פרגוואי",    date: "2026-06-20T04:00:00Z", stage: "בית C" },
  { id: "c5", teamA: "טורקיה",      teamB: "ארצות הברית",date: "2026-06-26T02:00:00Z", stage: "בית C" },
  { id: "c6", teamA: "פרגוואי",     teamB: "אוסטרליה",   date: "2026-06-26T02:00:00Z", stage: "בית C" },

  // === בית D: ברזיל, מרוקו, סקוטלנד, האיטי ===
  { id: "d1", teamA: "ברזיל",    teamB: "מרוקו",    date: "2026-06-13T22:00:00Z", stage: "בית D" },
  { id: "d2", teamA: "האיטי",    teamB: "סקוטלנד",  date: "2026-06-14T01:00:00Z", stage: "בית D" },
  { id: "d3", teamA: "סקוטלנד",  teamB: "מרוקו",    date: "2026-06-19T22:00:00Z", stage: "בית D" },
  { id: "d4", teamA: "ברזיל",    teamB: "האיטי",    date: "2026-06-20T01:00:00Z", stage: "בית D" },
  { id: "d5", teamA: "סקוטלנד",  teamB: "ברזיל",    date: "2026-06-24T22:00:00Z", stage: "בית D" },
  { id: "d6", teamA: "מרוקו",    teamB: "האיטי",    date: "2026-06-24T22:00:00Z", stage: "בית D" },

  // === בית E: גרמניה, קוראסאו, חוף השנהב, אקוודור ===
  { id: "e1", teamA: "גרמניה",      teamB: "קוראסאו",    date: "2026-06-14T17:00:00Z", stage: "בית E" },
  { id: "e2", teamA: "חוף השנהב",   teamB: "אקוודור",    date: "2026-06-14T23:00:00Z", stage: "בית E" },
  { id: "e3", teamA: "גרמניה",      teamB: "חוף השנהב",  date: "2026-06-20T20:00:00Z", stage: "בית E" },
  { id: "e4", teamA: "אקוודור",     teamB: "קוראסאו",    date: "2026-06-21T00:00:00Z", stage: "בית E" },
  { id: "e5", teamA: "אקוודור",     teamB: "גרמניה",     date: "2026-06-25T20:00:00Z", stage: "בית E" },
  { id: "e6", teamA: "קוראסאו",     teamB: "חוף השנהב",  date: "2026-06-25T20:00:00Z", stage: "בית E" },

  // === בית F: הולנד, יפן, שוודיה, תוניסיה ===
  { id: "f1", teamA: "הולנד",   teamB: "יפן",     date: "2026-06-14T20:00:00Z", stage: "בית F" },
  { id: "f2", teamA: "שוודיה",  teamB: "תוניסיה", date: "2026-06-15T02:00:00Z", stage: "בית F" },
  { id: "f3", teamA: "הולנד",   teamB: "שוודיה",  date: "2026-06-20T17:00:00Z", stage: "בית F" },
  { id: "f4", teamA: "תוניסיה", teamB: "יפן",     date: "2026-06-21T04:00:00Z", stage: "בית F" },
  { id: "f5", teamA: "יפן",     teamB: "שוודיה",  date: "2026-06-25T23:00:00Z", stage: "בית F" },
  { id: "f6", teamA: "תוניסיה", teamB: "הולנד",   date: "2026-06-25T23:00:00Z", stage: "בית F" },

  // === בית G: ספרד, כף ורדה, ערב הסעודית, אורוגוואי ===
  { id: "g1", teamA: "ספרד",          teamB: "כף ורדה",      date: "2026-06-15T17:00:00Z", stage: "בית G" },
  { id: "g2", teamA: "ערב הסעודית",   teamB: "אורוגוואי",    date: "2026-06-15T22:00:00Z", stage: "בית G" },
  { id: "g3", teamA: "ספרד",          teamB: "ערב הסעודית",  date: "2026-06-21T16:00:00Z", stage: "בית G" },
  { id: "g4", teamA: "אורוגוואי",     teamB: "כף ורדה",      date: "2026-06-21T22:00:00Z", stage: "בית G" },
  { id: "g5", teamA: "אורוגוואי",     teamB: "ספרד",         date: "2026-06-27T00:00:00Z", stage: "בית G" },
  { id: "g6", teamA: "כף ורדה",       teamB: "ערב הסעודית",  date: "2026-06-27T00:00:00Z", stage: "בית G" },

  // === בית H: בלגיה, מצרים, איראן, ניו זילנד ===
  { id: "h1", teamA: "בלגיה",    teamB: "מצרים",    date: "2026-06-15T22:00:00Z", stage: "בית H" },
  { id: "h2", teamA: "איראן",    teamB: "ניו זילנד", date: "2026-06-16T04:00:00Z", stage: "בית H" },
  { id: "h3", teamA: "בלגיה",    teamB: "איראן",    date: "2026-06-21T19:00:00Z", stage: "בית H" },
  { id: "h4", teamA: "ניו זילנד", teamB: "מצרים",   date: "2026-06-22T01:00:00Z", stage: "בית H" },
  { id: "h5", teamA: "מצרים",    teamB: "איראן",    date: "2026-06-27T03:00:00Z", stage: "בית H" },
  { id: "h6", teamA: "ניו זילנד", teamB: "בלגיה",   date: "2026-06-27T03:00:00Z", stage: "בית H" },

  // === בית I: צרפת, סנגל, עיראק, נורווגיה ===
  { id: "i1", teamA: "צרפת",    teamB: "סנגל",    date: "2026-06-16T19:00:00Z", stage: "בית I" },
  { id: "i2", teamA: "עיראק",   teamB: "נורווגיה", date: "2026-06-16T22:00:00Z", stage: "בית I" },
  { id: "i3", teamA: "צרפת",    teamB: "עיראק",   date: "2026-06-22T21:00:00Z", stage: "בית I" },
  { id: "i4", teamA: "נורווגיה", teamB: "סנגל",    date: "2026-06-23T00:00:00Z", stage: "בית I" },
  { id: "i5", teamA: "נורווגיה", teamB: "צרפת",    date: "2026-06-26T19:00:00Z", stage: "בית I" },
  { id: "i6", teamA: "סנגל",    teamB: "עיראק",   date: "2026-06-26T19:00:00Z", stage: "בית I" },

  // === בית J: ארגנטינה, אלג׳יריה, אוסטריה, ירדן ===
  { id: "j1", teamA: "ארגנטינה",  teamB: "אלג'יריה",  date: "2026-06-17T01:00:00Z", stage: "בית J" },
  { id: "j2", teamA: "אוסטריה",   teamB: "ירדן",      date: "2026-06-17T04:00:00Z", stage: "בית J" },
  { id: "j3", teamA: "ארגנטינה",  teamB: "אוסטריה",   date: "2026-06-22T17:00:00Z", stage: "בית J" },
  { id: "j4", teamA: "ירדן",      teamB: "אלג'יריה",  date: "2026-06-23T03:00:00Z", stage: "בית J" },
  { id: "j5", teamA: "אלג'יריה",  teamB: "אוסטריה",   date: "2026-06-28T02:00:00Z", stage: "בית J" },
  { id: "j6", teamA: "ירדן",      teamB: "ארגנטינה",  date: "2026-06-28T02:00:00Z", stage: "בית J" },

  // === בית K: פורטוגל, קונגו הדמוקרטית, אוזבקיסטן, קולומביה ===
  { id: "k1", teamA: "פורטוגל",           teamB: "קונגו הדמוקרטית", date: "2026-06-17T17:00:00Z", stage: "בית K" },
  { id: "k2", teamA: "אוזבקיסטן",         teamB: "קולומביה",        date: "2026-06-18T02:00:00Z", stage: "בית K" },
  { id: "k3", teamA: "פורטוגל",           teamB: "אוזבקיסטן",       date: "2026-06-23T17:00:00Z", stage: "בית K" },
  { id: "k4", teamA: "קולומביה",          teamB: "קונגו הדמוקרטית", date: "2026-06-24T02:00:00Z", stage: "בית K" },
  { id: "k5", teamA: "קולומביה",          teamB: "פורטוגל",         date: "2026-06-27T23:30:00Z", stage: "בית K" },
  { id: "k6", teamA: "קונגו הדמוקרטית",  teamB: "אוזבקיסטן",       date: "2026-06-27T23:30:00Z", stage: "בית K" },

  // === בית L: אנגליה, קרואטיה, גאנה, פנמה ===
  { id: "l1", teamA: "אנגליה",  teamB: "קרואטיה", date: "2026-06-17T20:00:00Z", stage: "בית L" },
  { id: "l2", teamA: "גאנה",    teamB: "פנמה",    date: "2026-06-17T23:00:00Z", stage: "בית L" },
  { id: "l3", teamA: "אנגליה",  teamB: "גאנה",    date: "2026-06-23T20:00:00Z", stage: "בית L" },
  { id: "l4", teamA: "פנמה",    teamB: "קרואטיה", date: "2026-06-23T23:00:00Z", stage: "בית L" },
  { id: "l5", teamA: "פנמה",    teamB: "אנגליה",  date: "2026-06-27T21:00:00Z", stage: "בית L" },
  { id: "l6", teamA: "קרואטיה", teamB: "גאנה",    date: "2026-06-27T21:00:00Z", stage: "בית L" },
];

export function flagOf(team: string): string {
  const found = COUNTRIES.find((x) => x.name === team);
  return found ? found.flag : "🏳️";
}

export { c };
