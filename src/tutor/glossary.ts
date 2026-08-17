// M5 — English ↔ Urdu terminology glossary
// Technical terms stay English-first with a consistent Urdu phrasing so the
// Tutor (and future M6 Translator Agent) never blindly translates them.
// This glossary is shared with M6 via the TranslatorAgent boundary.

export interface GlossaryEntry {
  term: string;
  /** Urdu phrasing used when the term must appear in Urdu text. */
  urdu: string;
  /** Short Urdu explanation used on first mention. */
  explanation: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  { term: 'Freelancing', urdu: 'فری لانسنگ', explanation: 'آزادانہ کام کرنا جہاں آپ خود اپنے کلائنٹس کے ساتھ کام کرتے ہیں' },
  { term: 'AI Agent', urdu: 'AI ایجنٹ', explanation: 'ایک خودکار AI پروگرام جو کام مکمل کرتا ہے' },
  { term: 'RAG', urdu: 'RAG', explanation: 'Retrieval-Augmented Generation — دستاویزات سے جواب تلاش کر کے تیار کرنا' },
  { term: 'MCP', urdu: 'MCP', explanation: 'Model Context Protocol — AI کو دوسرے ٹولز سے جوڑنے کا معیار' },
  { term: 'API', urdu: 'API', explanation: 'ایپلیکیشنز کے درمیان رابطے کا انٹرفیس' },
  { term: 'GitHub', urdu: 'GitHub', explanation: 'کوڈ محفوظ اور شیئر کرنے کا پلیٹ فارم' },
  { term: 'Repository', urdu: 'ریپوزٹری', explanation: 'پروجیکٹ کا کوڈ محفوظ رکھنے کی جگہ' },
  { term: 'Specification', urdu: 'تصریح', explanation: 'تفصیلی وضاحت کہ کیا بنانا ہے' },
  { term: 'Implementation', urdu: 'نفاذ', explanation: 'تصریح کے مطابق کوڈ لکھنا' },
  { term: 'Verification', urdu: 'تصدیق', explanation: 'تصدیق کرنا کہ کام درست ہے' },
  { term: 'Vector Database', urdu: 'ویکٹر ڈیٹابیس', explanation: 'مشابہت کی بنیاد پر معلومات تلاش کرنے کا ڈیٹابیس' },
  { term: 'VS Code', urdu: 'VS Code', explanation: 'کوڈ لکھنے کا پیشہ ورانہ ایڈیٹر' },
  { term: 'Spec-Kit', urdu: 'Spec-Kit', explanation: 'Spec-Driven Development کے لیے ٹولز کا سیٹ' },
  { term: 'AI Coding Agent', urdu: 'AI کوڈنگ ایجنٹ', explanation: 'کوڈ لکھنے اور درست کرنے والا خودکار AI معاون' },
  { term: 'Agentic AI', urdu: 'ایجینٹک AI', explanation: 'ایسا AI جو خود فیصلے کر کے کام مکمل کرتا ہے' },
  { term: 'React', urdu: 'React', explanation: 'یوزر انٹرفیس بنانے کے لیے JavaScript لائبریری' },
  { term: 'Next.js', urdu: 'Next.js', explanation: 'React پر مبنی ویب ڈیولپمنٹ فریم ورک' },
  { term: 'TypeScript', urdu: 'TypeScript', explanation: 'JavaScript کا نوع-محفوظ (type-safe) توسیع' },
  { term: 'Python', urdu: 'Python', explanation: 'ایک مقبول پروگرامنگ زبان' },
  { term: 'JavaScript', urdu: 'JavaScript', explanation: 'ویب ڈیولپمنٹ کی بنیادی پروگرامنگ زبان' },
  { term: 'Node.js', urdu: 'Node.js', explanation: 'سرور پر JavaScript چلانے کا رن ٹائم' },
  { term: 'npm', urdu: 'npm', explanation: 'Node.js پیکجز کا مینیجر' },
  { term: 'SDK', urdu: 'SDK', explanation: 'Software Development Kit — ایپ بنانے کے ٹولز کا سیٹ' },
  { term: 'Git', urdu: 'Git', explanation: 'کوڈ کے ورژن محفوظ کرنے کا نظام' },
  { term: 'Docusaurus', urdu: 'Docusaurus', explanation: 'دستاویزات کی ویب سائٹ بنانے کا فریم ورک' },
  { term: 'OpenAI', urdu: 'OpenAI', explanation: 'AI ماڈلز بنانے والی کمپنی' },
  { term: 'Gemini', urdu: 'Gemini', explanation: 'Google کا AI ماڈل' },
  { term: 'Claude', urdu: 'Claude', explanation: 'Anthropic کا AI ماڈل' },
  { term: 'ChromaDB', urdu: 'ChromaDB', explanation: 'ویکٹر ڈیٹا محفوظ کرنے کا ڈیٹابیس' },
];

export const TECHNICAL_TERMS = GLOSSARY.map((entry) => entry.term);

/** Comma-separated term list for prompt instructions. */
export function termsPromptHint(): string {
  return TECHNICAL_TERMS.join(', ');
}
