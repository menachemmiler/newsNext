import { useAppSelector } from "@/lib/store/hooks";

export const UI_LOCALES = ["he", "en"] as const;
export type UiLocale = (typeof UI_LOCALES)[number];

const he = {
  siteName: "עכשיו",
  siteKicker: "מכל מקום",
  siteTagline: "חדשות מכל האתרים, במקום אחד",
  selectCountry: "בחירת מדינה",
  selectLanguage: "בחירת שפה",
  themeToLight: "מעבר למצב בהיר",
  themeToDark: "מעבר למצב כהה",
  savedAria: "כתבות שמורות",
  categoriesAria: "קטגוריות",
  tickerAria: "כותרות מכל המקורות",
  search: "חיפוש",
  searchPlaceholder: "חיפוש כתבה, נושא או מקור...",
  searchAria: "חיפוש חדשות",
  searchHint: "השלמה מכתבות שכבר נטענו. חיפוש מלא ירוץ מול ה-API",
  tickerLabel: "מכל מקום",
  fromAllSources: "מכל המקורות",
  fontSmaller: "א-",
  fontLarger: "א+",
  loadError: "לא הצלחנו לטעון את החדשות",
  emptyCategory: "אין כתבות בקטגוריה הזו כרגע",
  tryOther: "נסו מדינה או נושא אחר.",
  searchKicker: "חיפוש",
  resultsFor: "תוצאות עבור “{q}”",
  searchTitle: "חפשו כתבה",
  searchFailed: "החיפוש נכשל",
  noResults: "לא נמצאו כתבות",
  tryOtherQuery: "נסו ניסוח אחר או קטגוריה מהעמוד הראשי.",
  myReading: "הקריאה שלי",
  savedTitle: "כתבות שמורות",
  noSaved: "עדיין אין שמורים",
  noSavedHint: "לחצו על הסימנייה בכל כתבה כדי לשמור אותה לקריאה מאוחר יותר.",
  lookingArticle: "מחפשים את הכתבה...",
  lookingHint:
    "אם הגעתם מקישור משותף, ננסה לאתר אותה לפי הכותרת. אפשר גם לחזור לעמוד הראשי.",
  backHome: "חזרה לראשי",
  home: "ראשי",
  print: "הדפסה",
  originalArticle: "לכתבה המקורית",
  shareArticle: "שיתוף כתבה",
  sourceContinues: "הטקסט המלא ממשיך אצל המקור.",
  readOn: "לקריאה ב-{source}",
  sourceSite: "אתר הכתבה",
  related: "עוד בנושא",
  minRead: "דק׳ קריאה",
  source: "מקור",
  copySnippet: "העתק קטע",
  copied: "הועתק",
  share: "שתף",
  shareMenuTitle: "שיתוף הכתבה",
  copyLink: "העתקת קישור",
  copiedLink: "הקישור הועתק",
  copyText: "העתקת כותרת וקישור",
  copiedText: "הטקסט הועתק",
  nativeShare: "שיתוף מהיר",
  email: "אימייל",
  bookmark: "שמירת כתבה",
  unbookmark: "הסרה מהשמורים",
  endOfFeed: "הגעתם לסוף העדכון",
  retry: "{error} — נסו שוב",
  loadingMore: "טוען עוד כתבות...",
  scrollMore: "גללו למטה לעוד כתבות",
  footerBlurb: "אוסף חדשות מכל האתרים — כותרות מכל המקורות במקום אחד.",
  copyright: "© {year} כל הזכויות שמורות למקורות הכתבות.",
  cat_general: "ראשי",
  cat_nation: "מקומי",
  cat_world: "עולם",
  cat_business: "כלכלה",
  cat_technology: "טכנולוגיה",
  cat_entertainment: "תרבות",
  cat_sports: "ספורט",
  cat_science: "מדע",
  cat_health: "בריאות",
  country_il: "ישראל",
  country_us: "ארצות הברית",
  country_gb: "בריטניה",
  country_fr: "צרפת",
  country_de: "גרמניה",
} as const;

type MessageKey = keyof typeof he;

const en: Record<MessageKey, string> = {
  siteName: "Now",
  siteKicker: "From everywhere",
  siteTagline: "News from every site, in one place",
  selectCountry: "Choose country",
  selectLanguage: "Choose language",
  themeToLight: "Switch to light mode",
  themeToDark: "Switch to dark mode",
  savedAria: "Saved articles",
  categoriesAria: "Categories",
  tickerAria: "Headlines from all sources",
  search: "Search",
  searchPlaceholder: "Search article, topic or source...",
  searchAria: "Search news",
  searchHint: "Suggestions from loaded articles. Full search runs against the API",
  tickerLabel: "Everywhere",
  fromAllSources: "From all sources",
  fontSmaller: "A-",
  fontLarger: "A+",
  loadError: "We couldn't load the news",
  emptyCategory: "No articles in this category right now",
  tryOther: "Try another country or topic.",
  searchKicker: "Search",
  resultsFor: "Results for “{q}”",
  searchTitle: "Search an article",
  searchFailed: "Search failed",
  noResults: "No articles found",
  tryOtherQuery: "Try different wording or a category from the home page.",
  myReading: "My reading",
  savedTitle: "Saved articles",
  noSaved: "Nothing saved yet",
  noSavedHint: "Tap the bookmark on any article to save it for later.",
  lookingArticle: "Looking for the article...",
  lookingHint:
    "If you arrived from a shared link, we'll try to find it by title. You can also go back home.",
  backHome: "Back to home",
  home: "Home",
  print: "Print",
  originalArticle: "Original article",
  shareArticle: "Share article",
  sourceContinues: "The full text continues at the source.",
  readOn: "Read on {source}",
  sourceSite: "the article site",
  related: "More on this",
  minRead: "min read",
  source: "Source",
  copySnippet: "Copy excerpt",
  copied: "Copied",
  share: "Share",
  shareMenuTitle: "Share article",
  copyLink: "Copy link",
  copiedLink: "Link copied",
  copyText: "Copy title and link",
  copiedText: "Text copied",
  nativeShare: "Quick share",
  email: "Email",
  bookmark: "Save article",
  unbookmark: "Remove from saved",
  endOfFeed: "You've reached the end",
  retry: "{error} — try again",
  loadingMore: "Loading more articles...",
  scrollMore: "Scroll down for more",
  footerBlurb: "A news collection from every site — headlines from all sources in one place.",
  copyright: "© {year} All rights remain with the original sources.",
  cat_general: "Top",
  cat_nation: "Local",
  cat_world: "World",
  cat_business: "Business",
  cat_technology: "Tech",
  cat_entertainment: "Culture",
  cat_sports: "Sports",
  cat_science: "Science",
  cat_health: "Health",
  country_il: "Israel",
  country_us: "United States",
  country_gb: "United Kingdom",
  country_fr: "France",
  country_de: "Germany",
};

const dict: Record<UiLocale, Record<MessageKey, string>> = { he, en };

export const isUiLocale = (value: string | null): value is UiLocale =>
  value === "he" || value === "en";

export const translate = (
  locale: UiLocale,
  key: MessageKey,
  vars?: Record<string, string | number>,
) => {
  let text = dict[locale][key] ?? dict.he[key];
  if (vars) {
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, String(value));
    });
  }
  return text;
};

export const catKey = (id: string): MessageKey => `cat_${id}` as MessageKey;
export const countryKey = (id: string): MessageKey =>
  `country_${id}` as MessageKey;

export const dateLocaleFor = (locale: UiLocale) =>
  locale === "en" ? "en-US" : "he-IL";

export const useT = () => {
  const locale = useAppSelector((state) => state.ui.locale);
  return {
    locale,
    dateLocale: dateLocaleFor(locale),
    t: (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
  };
};
