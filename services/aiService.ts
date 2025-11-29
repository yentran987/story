import { GoogleGenAI } from "@google/genai";

// Use either GEMINI_API_KEY or API_KEY env var for compatibility
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) ai = new GoogleGenAI({ apiKey });

const hasKey = () => !!apiKey && !!ai;

// Language detection helper — returns 'vi' or 'en'
export const detectLanguageFromText = (text?: string): 'vi' | 'en' => {
  if (!text) return 'en';
  const sample = text.slice(0, 4000).toLowerCase();

  // quick Vietnamese signals
  const viSignals = /[ăâđêôơưáàảạãắằẳẵặấầẩẫậếềễệốồổỗộớờởỡợứừửữự]/i;
  if (viSignals.test(sample)) return 'vi';
  const viWords = [' và ', ' không ', ' những ', ' của ', ' cho ', ' có '];
  for (const w of viWords) if (sample.includes(w)) return 'vi';

  // English signals
  const enWords = [' the ', ' and ', ' is ', ' you ', ' to ', ' of '];
  for (const w of enWords) if (sample.includes(w)) return 'en';

  // default to English
  return 'en';
};

// Basic blocked / sensitive keywords lists
const PROFANITY_EN = ['fuck', 'shit', 'bitch', 'asshole', 'damn'];
const PROFANITY_VI = ['đụ', 'đcm', 'đm', 'đụ má', 'địt', 'địt mẹ', 'đĩ'];

const containsProfanity = (text: string, lang: 'en' | 'vi') => {
  if (!text) return false;
  const s = text.toLowerCase();
  const list = lang === 'vi' ? PROFANITY_VI : PROFANITY_EN;
  return list.some(w => s.includes(w));
};

// Helper: call AI model if available, otherwise return null to indicate fallback should be used
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
    console.error('ai error', err);
    return null;
  }
};

/* ----------------------- FEATURE GROUP 1 — STORY ASSISTANT ----------------------- */

export async function generateSynopsis(keywords: string[], language: 'auto' | 'en' | 'vi' = 'auto') {
  const joined = keywords.join(', ');
  const lang = language === 'auto' ? detectLanguageFromText(joined) : language;

  // validation
  if (keywords.length < 1) throw new Error('Provide at least 1 keyword');

  const promptEn = `You are a helpful story writing assistant. Produce a concise 2-4 sentence story description (no more) that uses these keywords and matches the implied genre/style: ${joined}. Do NOT add details beyond the keyword context or invent characters not suggested by the keywords. Respond in English.`;
  const promptVi = `Bạn là một trợ lý viết truyện. Tạo phần mô tả truyện ngắn gọn (2-4 câu) dựa trên các từ khóa: ${joined}. KHÔNG thêm chi tiết ngoài ngữ cảnh từ khóa, và viết bằng tiếng Việt.`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) return { language: lang, synopsis: modelOut.trim() };

  // Fallback deterministic output to help offline dev
  if (lang === 'vi') {
    return { language: 'vi', synopsis: `${joined} — Một câu chuyện khám phá ${joined} với cảm xúc sâu sắc, đầy xung đột và điểm nhấn bất ngờ.` };
  }
  return { language: 'en', synopsis: `${joined} — A short story exploring ${joined}, with emotional conflict, tension, and an unexpected turn.` };
}

export async function suggestChapterTitles(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const promptEn = `Read this chapter text and suggest 3-5 short, punchy titles that match its tone and content. Titles should be concise and not longer than 5 words. Text: "${text.substring(0,2000)}"`;
  const promptVi = `Đọc nội dung chương và gợi ý 3-5 tiêu đề ngắn, phù hợp với tông và nội dung. Mỗi tiêu đề ngắn gọn (dưới 5 từ). Văn bản: "${text.substring(0,2000)}"`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) {
    // Attempt to split by newline or commas
    const list = modelOut.split(/\n|\r|,|;/).map(s => s.trim()).filter(Boolean).slice(0,5);
    return { language: lang, titles: list };
  }

  // fallback simple heuristics
  const sample = text.slice(0, 60);
  if (lang === 'vi') return { language: 'vi', titles: [`${sample} (khởi đầu)`, `Bước ngoặt`, `Cao trào`] };
  return { language: 'en', titles: [`${sample} (Intro)`, 'Turning Point', 'Climax'] };
}

export async function rewriteSection(text: string, tone: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  // tone mapping
  const allowedTones = {
    soft: { en: 'soft', vi: 'nhẹ nhàng' },
    action: { en: 'action', vi: 'hành động' },
    poetic: { en: 'poetic', vi: 'trữ tình' }
  } as const;

  const applyTone = (t: string) => {
    if (!Object.keys(allowedTones).includes(t)) throw new Error('Invalid tone');
    return lang === 'vi' ? allowedTones[t as keyof typeof allowedTones].vi : allowedTones[t as keyof typeof allowedTones].en;
  };

  const toneLabel = applyTone(tone);
  const promptEn = `Rewrite the paragraph below in a ${toneLabel} tone. Keep the exact meaning and facts; change only style and phrasing. Paragraph: "${text}"`;
  const promptVi = `Viết lại đoạn văn sau theo tông ${toneLabel}. Giữ nguyên ý nghĩa, chỉ thay đổi phong cách và cách diễn đạt. Văn bản: "${text}"`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) return { language: lang, rewritten: modelOut.trim() };

  // fallback: tiny stylized transformation
  if (lang === 'vi') return { language: 'vi', rewritten: text.replace(/\.|,$/g, '…') };
  return { language: 'en', rewritten: text }; // safe fallback
}

export async function suggestPlotTwists(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const promptEn = `Given this story/chapter text, produce 3 possible plot twists that are consistent with the text — ordered from subtle to dramatic. Do not contradict established facts. Text: "${text.substring(0,2000)}"`;
  const promptVi = `Dựa trên nội dung sau, gợi ý 3 plot twist có thể xảy ra, từ tinh tế đến kịch tính. KHÔNG mâu thuẫn với sự kiện đã nêu. Văn bản: "${text.substring(0,2000)}"`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) {
    const items = modelOut.split(/\n|\r|\d+\.|\-\s/).map(s => s.trim()).filter(Boolean).slice(0,3);
    return { language: lang, twists: items };
  }

  // fallback
  return { language: lang, twists: lang === 'vi' ? ['Người quen không phải là người quen', 'Bản thân là mục tiêu', 'Sự thật lớn dần lộ ra'] : ['A familiar face betrays the hero', 'The protagonist is the target', 'A hidden truth is revealed'] };
}

export async function characterLogicCheck(text: string, profile: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const all = `${profile}\n---\n${text}`;
  const lang = language === 'auto' ? detectLanguageFromText(all) : language;
  const promptEn = `You are a literary editor checking character consistency. Given character profile and story text below, list where the character acts out-of-profile, explain why each instance is inconsistent, and propose concise fixes that preserve story meaning. Return JSON: { issues: [{ location: string, reason: string, fix: string }] }\n\nPROFILE:\n${profile}\n\nTEXT:\n${text.substring(0,2000)}`;
  const promptVi = `Bạn là biên tập viên. Dựa trên hồ sơ nhân vật và nội dung truyện, liệt kê nơi nhân vật hành xử không phù hợp với tính cách, giải thích lý do và đề xuất sửa chữa ngắn gọn giữ nguyên ý. Trả về JSON: { issues: [{ location, reason, fix }] }.\n\nHỒ SƠ:\n${profile}\n\nNỘI DUNG:\n${text.substring(0,2000)}`;

  const jsonText = await callModel(lang === 'vi' ? promptVi : promptEn, { json: true });
  if (jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      return { language: lang, issues: parsed.issues || [] };
    } catch (err) {
      // continue to fallback
    }
  }

  // fallback: naive heuristic — detect contradictions by presence of opposite words
  const issues: any[] = [];
  const lower = text.toLowerCase();
  if (profile.toLowerCase().includes('brave') && lower.includes('runs away')) {
    issues.push({ location: 'chapter mismatch', reason: 'Character labeled brave but flees in a scene', fix: 'Show internal conflict or change behavior to hesitant rather than fleeing completely' });
  }
  return { language: lang, issues };
}

/* ----------------------- FEATURE GROUP 2 — TAGGING ----------------------- */

export async function generateHashtags(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const promptEn = `From the following text, produce 5-15 concise hashtags (no spaces inside tags) that reflect theme, characters, mood and setting. Return them comma-separated: ${text.substring(0,1200)}`;
  const promptVi = `Từ nội dung sau, tạo 5-15 hashtag ngắn gọn (không dấu cách trong tag) phản ánh chủ đề, nhân vật, tâm trạng và bối cảnh. Trả về dạng danh sách cách nhau bởi dấu phẩy: ${text.substring(0,1200)}`;

  const out = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (out) {
    const tags = out.split(/\,|\n/).map(s => s.replace(/#/g, '').trim()).filter(Boolean).slice(0,15).map(t => (t.startsWith('#') ? t : `#${t.replace(/\s+/g, '')}`));
    return { language: lang, tags };
  }

  // fallback simple tag extraction
  const defaults = ['#drama', '#adventure', '#romance', '#fantasy', '#mystery'];
  return { language: lang, tags: defaults.slice(0, 7) };
}

export async function suggestGenres(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const promptEn = `What 1-3 genres best describe the following text? Answer as a JSON array, e.g. ["Romance","Fantasy"] . Content: ${text.substring(0,1200)}`;
  const promptVi = `Chỉ ra 1-3 thể loại phù hợp với nội dung dưới đây, trả về dưới dạng JSON array. Nội dung: ${text.substring(0,1200)}`;

  const out = await callModel(lang === 'vi' ? promptVi : promptEn, { json: true });
  if (out) {
    try {
      const parsed = JSON.parse(out);
      if (Array.isArray(parsed)) return { language: lang, genres: parsed.slice(0,3) };
      // if object, try to extract
      if (parsed.genres && Array.isArray(parsed.genres)) return { language: lang, genres: parsed.genres.slice(0,3) };
    } catch (err) {
      // fallback
    }
  }

  // fallback
  const guess = text.includes('love') || text.includes('yêu') ? ['Romance'] : ['Fantasy'];
  return { language: lang, genres: guess };
}

/* ----------------------- FEATURE GROUP 3 — MODERATION ----------------------- */

export async function moderateContent(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;

  const issues: string[] = [];

  // profanity
  if (containsProfanity(text, lang)) issues.push('offensive_language');

  const violenceKeywords = ['kill', 'murder', 'blood', 'slaughter', 'violence', 'beat'];
  const violenceKeywordsVi = ['giết', 'máu', 'đánh', 'hành hung', 'thảm sát'];
  const sexualKeywords = ['sex', 'sexual', 'rape', 'sex with', 'incest'];
  const sexualKeywordsVi = ['tình dục', 'hiếp dâm', 'quan hệ tình dục', 'ấu dâm'];
  const hateKeywords = ['hate', 'nazi', 'racist', 'supremacy'];

  const s = text.toLowerCase();
  if (violenceKeywords.some(w => s.includes(w)) || violenceKeywordsVi.some(w => s.includes(w))) issues.push('violence');
  if (sexualKeywords.some(w => s.includes(w)) || sexualKeywordsVi.some(w => s.includes(w))) issues.push('sexual_content');
  if (s.includes('minor') || s.includes('underage') || s.includes('trẻ em') || s.includes('vị thành niên')) issues.push('sexual_content_involving_minors');
  if (hateKeywords.some(w => s.includes(w))) issues.push('hate_speech');

  // political sensitivity heuristic — look for politics words in short list
  const political = ['election', 'government', 'vote', 'president', 'chính phủ', 'bầu cử'];
  if (political.some(w => s.includes(w))) issues.push('political_content');

  // risk scoring simple heuristic
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (issues.length >= 3 || issues.includes('sexual_content_involving_minors')) risk = 'high';
  else if (issues.length === 2) risk = 'medium';

  // recommended fix — brief rewrite suggestion
  const fixPromptEn = `The following text may contain issues: ${text.substring(0,400)}\nProvide a concise safe rewrite that preserves meaning but removes explicit content and lowers risk.`;
  const fixPromptVi = `Đoạn văn sau có thể có nội dung nhạy cảm: ${text.substring(0,400)}\nViết lại ngắn gọn, giữ ý chính nhưng loại bỏ nội dung nhạy cảm và giảm mức rủi ro.`;

  const suggestion = (await callModel(lang === 'vi' ? fixPromptVi : fixPromptEn)) || (lang === 'vi' ? 'Viết lại để loại bỏ chi tiết nhạy cảm.' : 'Rewrite to remove explicit content and sensitive details.');

  return { language: lang, issues, risk, recommended_fix: suggestion.trim() };
}

/* ----------------------- FEATURE GROUP 4 — SUMMARY & FAST RECAP ----------------------- */

export async function summarizeStory(fullText: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(fullText) : language;
  const promptEn = `Summarize the following story into a concise paragraph that highlights main events, characters, and arcs. Keep it tight (3-5 sentences). Text: ${fullText.substring(0,4000)}`;
  const promptVi = `Tóm tắt truyện sau trong 3-5 câu, nêu rõ sự kiện chính, tuyến nhân vật và cung đoạn. Văn bản: ${fullText.substring(0,4000)}`;

  const out = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (out) return { language: lang, summary: out.trim() };

  // fallback
  return { language: lang, summary: lang === 'vi' ? 'Tóm tắt ngắn gọn — cốt truyện, bước ngoặt và kết thúc.' : 'Short summary: plot, turning points, and conclusion.' };
}

export async function fastRecap(chapterText: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(chapterText) : language;
  const promptEn = `Create 3-6 short bullet points summarizing only the events that happened in this chapter. Do NOT add new details. Text: ${chapterText.substring(0,2000)}`;
  const promptVi = `Tạo 3-6 đầu mục ngắn tóm tắt các sự kiện thực tế trong chương này. KHÔNG thêm chi tiết mới. Văn bản: ${chapterText.substring(0,2000)}`;

  const out = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (out) {
    const bullets = out.split(/\n|\r|\d+\.|\-\s/).map(s => s.trim()).filter(Boolean).slice(0,6);
    return { language: lang, bullets };
  }

  // fallback
  return { language: lang, bullets: [lang === 'vi' ? 'Sự kiện 1' : 'Event 1', lang === 'vi' ? 'Sự kiện 2' : 'Event 2'] };
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
