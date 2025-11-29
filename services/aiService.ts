import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) ai = new GoogleGenAI({ apiKey });

const hasKey = () => !!apiKey && !!ai;

// -------------------- LANGUAGE DETECTION --------------------
export const detectLanguageFromText = (text?: string): 'vi' | 'en' => {
  if (!text) return 'en';
  const sample = text.slice(0, 4000).toLowerCase();
  const viSignals = /[ăâđêôơưáàảạãắằẳẵặấầẩẫậếềễệốồổỗộớờởỡợứừửữự]/i;
  if (viSignals.test(sample)) return 'vi';
  const viWords = [' và ', ' không ', ' những ', ' của ', ' cho ', ' có '];
  if (viWords.some(w => sample.includes(w))) return 'vi';
  const enWords = [' the ', ' and ', ' is ', ' you ', ' to ', ' of '];
  if (enWords.some(w => sample.includes(w))) return 'en';
  return 'en';
};

// -------------------- PROFANITY CHECK --------------------
const PROFANITY_EN = ['fuck', 'shit', 'bitch', 'asshole', 'damn'];
const PROFANITY_VI = ['đụ', 'đcm', 'đm', 'đụ má', 'địt', 'địt mẹ', 'đĩ'];
const containsProfanity = (text: string, lang: 'en' | 'vi') =>
  text && (lang === 'vi' ? PROFANITY_VI : PROFANITY_EN).some(w => text.toLowerCase().includes(w));

// -------------------- CALL AI MODEL --------------------
const callModel = async (prompt: string, options?: { json?: boolean }) => {
  if (!hasKey()) return null;
  try {
    const res = await ai!.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: options?.json ? { responseMimeType: 'application/json' } : undefined,
    });
    return res.text || null;
  } catch (err) {
    console.error('AI Error:', err);
    return null;
  }
};

// -------------------- FEATURE GROUP 1 — STORY ASSISTANT --------------------
export async function generateSynopsis(keywords: string[], language: 'auto' | 'en' | 'vi' = 'auto') {
  if (keywords.length < 1) throw new Error('Provide at least 1 keyword');
  const joined = keywords.join(', ');
  const lang = language === 'auto' ? detectLanguageFromText(joined) : language;

  const prompt = lang === 'vi'
    ? `Bạn là trợ lý viết truyện. Tạo mô tả truyện 2-4 câu dựa trên từ khóa: ${joined}. Không thêm chi tiết ngoài từ khóa. Trả về JSON { "synopsis": "..." }.`
    : `You are a story assistant. Generate a concise 2-4 sentence story description using these keywords: ${joined}. Do NOT add extra details. Return JSON { "synopsis": "..." }.`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '{}');
    if (parsed.synopsis) return { language: lang, synopsis: parsed.synopsis };
  } catch { }

  // fallback deterministic
  return { language: lang, synopsis: lang === 'vi' ? `${joined} — Một câu chuyện khám phá ${joined}.` : `${joined} — A short story exploring ${joined}.` };
}

export async function suggestChapterTitles(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const prompt = lang === 'vi'
    ? `Đọc chương và gợi ý 3-5 tiêu đề ngắn gọn (dưới 5 từ), phù hợp tone + nội dung. Trả về JSON array: ["title1","title2",...]. Văn bản: "${text.substring(0,2000)}"`
    : `Read this chapter and suggest 3-5 concise titles (<=5 words) matching tone + content. Return JSON array: ["title1","title2",...]. Text: "${text.substring(0,2000)}"`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '[]');
    if (Array.isArray(parsed)) return { language: lang, titles: parsed.slice(0,5) };
  } catch { }

  const fallback = text.slice(0, 60);
  return { language: lang, titles: lang === 'vi' ? [`${fallback} (khởi đầu)`, `Bước ngoặt`, `Cao trào`] : [`${fallback} (Intro)`, 'Turning Point', 'Climax'] };
}

export async function rewriteSection(text: string, tone: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const tones = { soft: { en: 'soft', vi: 'nhẹ nhàng' }, action: { en: 'action', vi: 'hành động' }, poetic: { en: 'poetic', vi: 'trữ tình' } };
  if (!tones[tone as keyof typeof tones]) throw new Error('Invalid tone');
  const toneLabel = lang === 'vi' ? tones[tone as keyof typeof tones].vi : tones[tone as keyof typeof tones].en;

  const prompt = lang === 'vi'
    ? `Viết lại đoạn văn sau theo tông ${toneLabel}. Giữ nguyên ý nghĩa, chỉ thay đổi phong cách. Trả JSON: { "rewritten": "..." }. Văn bản: "${text}"`
    : `Rewrite paragraph in ${toneLabel} tone. Keep meaning, change style only. Return JSON: { "rewritten": "..." }. Paragraph: "${text}"`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '{}');
    if (parsed.rewritten) return { language: lang, rewritten: parsed.rewritten };
  } catch { }

  return { language: lang, rewritten: text };
}

export async function suggestPlotTwists(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const prompt = lang === 'vi'
    ? `Dựa trên nội dung sau, gợi ý 3 plot twist từ tinh tế đến kịch tính, không mâu thuẫn sự kiện. Trả JSON: { "twists": ["twist1","twist2","twist3"] }. Văn bản: "${text.substring(0,2000)}"`
    : `Based on this story, suggest 3 plot twists (subtle to dramatic) consistent with events. Return JSON: { "twists": ["twist1","twist2","twist3"] }. Text: "${text.substring(0,2000)}"`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '{}');
    if (parsed.twists && Array.isArray(parsed.twists)) return { language: lang, twists: parsed.twists.slice(0,3) };
  } catch { }

  const fallback = lang === 'vi' ? ['Người quen không phải người quen','Bản thân là mục tiêu','Sự thật lớn dần lộ ra'] : ['A familiar face betrays the hero','Protagonist is the target','Hidden truth revealed'];
  return { language: lang, twists: fallback };
}

export async function characterLogicCheck(text: string, profile: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const all = `${profile}\n---\n${text}`;
  const lang = language === 'auto' ? detectLanguageFromText(all) : language;
  const prompt = lang === 'vi'
    ? `Dựa trên hồ sơ nhân vật và nội dung, liệt kê nơi nhân vật hành xử không hợp với tính cách, giải thích lý do, đề xuất sửa chữa ngắn gọn. Trả JSON: { "issues":[{ "location","reason","fix" }] }. Hồ sơ:\n${profile}\nNội dung:\n${text.substring(0,2000)}`
    : `Check character consistency. List out-of-profile behaviors, explain, propose concise fixes. Return JSON: { "issues":[{ "location","reason","fix" }] }. Profile:\n${profile}\nText:\n${text.substring(0,2000)}`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '{}');
    if (parsed.issues && Array.isArray(parsed.issues)) return { language: lang, issues: parsed.issues };
  } catch { }

  return { language: lang, issues: [] };
}

// -------------------- FEATURE GROUP 2 — TAGGING --------------------
export async function generateHashtags(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const prompt = lang === 'vi'
    ? `Tạo 5-15 hashtag ngắn gọn (không dấu cách) phản ánh chủ đề, nhân vật, tâm trạng, bối cảnh. Trả JSON: { "tags": ["#tag1",...] }. Văn bản: ${text.substring(0,1200)}`
    : `Generate 5-15 concise hashtags (no spaces) reflecting theme, characters, mood, setting. Return JSON: { "tags": ["#tag1",...] }. Text: ${text.substring(0,1200)}`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '{}');
    if (parsed.tags && Array.isArray(parsed.tags)) return { language: lang, tags: parsed.tags.slice(0,15) };
  } catch { }

  return { language: lang, tags: ['#drama','#adventure','#romance','#fantasy','#mystery'] };
}

export async function suggestGenres(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const prompt = lang === 'vi'
    ? `Chỉ ra 1-3 thể loại phù hợp với nội dung, trả JSON array: ["Genre1","Genre2"]. Nội dung: ${text.substring(0,1200)}`
    : `Identify 1-3 genres matching text. Return JSON array: ["Genre1","Genre2"]. Text: ${text.substring(0,1200)}`;

  const out = await callModel(prompt, { json: true });
  try {
    const parsed = JSON.parse(out || '[]');
    if (Array.isArray(parsed)) return { language: lang, genres: parsed.slice(0,3) };
  } catch { }

  return { language: lang, genres: text.includes('love') || text.includes('yêu') ? ['Romance'] : ['Fantasy'] };
}

// -------------------- FEATURE GROUP 3 — MODERATION --------------------
export async function moderateContent(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const issues: string[] = [];
  if (containsProfanity(text, lang)) issues.push('offensive_language');

  const violence = ['kill','murder','blood','slaughter','violence','beat'];
  const violenceVi = ['giết','máu','đánh','hành hung','thảm sát'];
  const sexual = ['sex','sexual','rape','incest'];
  const sexualVi = ['tình dục','hiếp dâm','quan hệ tình dục','ấu dâm'];
  const hate = ['hate','nazi','racist','supremacy'];
  const political = ['election','government','vote','president','chính phủ','bầu cử'];

  const s = text.toLowerCase();
  if (violence.some(w=>s.includes(w)) || violenceVi.some(w=>s.includes(w))) issues.push('violence');
  if (sexual.some(w=>s.includes(w)) || sexualVi.some(w=>s.includes(w))) issues.push('sexual_content');
  if (s.includes('minor')||s.includes('underage')||s.includes('trẻ em')||s.includes('vị thành niên')) issues.push('sexual_content_involving_minors');
  if (hate.some(w=>s.includes(w))) issues.push('hate_speech');
  if (political.some(w=>s.includes(w))) issues.push('political_content');

  let risk: 'low'|'medium'|'high' = 'low';
  if (issues.length >=3 || issues.includes('sexual_content_involving_minors')) risk='high';
  else if (issues.length===2) risk='medium';

  const fixPrompt = lang==='vi'
    ? `Đoạn văn sau có thể nhạy cảm: ${text.substring(0,400)}. Viết lại ngắn gọn, giữ ý, loại bỏ nội dung nhạy cảm.`
    : `This text may contain sensitive content: ${text.substring(0,400)}. Provide concise safe rewrite preserving meaning.`;

  const suggestion = (await callModel(fixPrompt)) || (lang==='vi'?'Viết lại để loại bỏ nội dung nhạy cảm':'Rewrite to remove sensitive content');
  return { language: lang, issues, risk, recommended_fix: suggestion.trim() };
}

// -------------------- FEATURE GROUP 4 — SUMMARY --------------------
export async function summarizeStory(fullText: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language==='auto'?detectLanguageFromText(fullText):language;
  const prompt = lang==='vi'
    ? `Tóm tắt truyện 3-5 câu, nêu sự kiện chính, nhân vật, cung đoạn. Trả JSON: { "summary": "..." }. Nội dung: ${fullText.substring(0,4000)}`
    : `Summarize story 3-5 sentences, highlight main events, characters, arcs. Return JSON: { "summary": "..." }. Text: ${fullText.substring(0,4000)}`;

  const out = await callModel(prompt, { json:true });
  try { const parsed = JSON.parse(out||'{}'); if(parsed.summary) return { language: lang, summary: parsed.summary }; } catch {}

  return { language: lang, summary: lang==='vi'?'Tóm tắt ngắn gọn — cốt truyện, bước ngoặt.':'Short summary: plot and turning points.' };
}

export async function fastRecap(chapterText: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language==='auto'?detectLanguageFromText(chapterText):language;
  const prompt = lang==='vi'
    ? `Tạo 3-6 đầu mục tóm tắt sự kiện thực tế trong chương. KHÔNG thêm chi tiết. Trả JSON: { "bullets":["..."] }. Văn bản: ${chapterText.substring(0,2000)}`
    : `Create 3-6 bullet points summarizing events in this chapter. Do not add details. Return JSON: { "bullets":["..."] }. Text: ${chapterText.substring(0,2000)}`;

  const out = await callModel(prompt, { json:true });
  try { const parsed = JSON.parse(out||'{}'); if(parsed.bullets && Array.isArray(parsed.bullets)) return { language: lang, bullets: parsed.bullets.slice(0,6) }; } catch {}

  return { language: lang, bullets: lang==='vi'?['Sự kiện 1','Sự kiện 2']:['Event 1','Event 2'] };
}

export default {
  detectLanguageFromText,
  generateSynopsis,
  suggestChapterTitles,
  rewriteSection,
  suggestPlotTwists,
  characterLogicCheck,
  generateHashtags,
  suggestGenres,
  moderateContent,
  summarizeStory,
  fastRecap,
};
