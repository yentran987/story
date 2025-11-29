import { GoogleGenAI } from "@google/genai";

// Use either GEMINI_API_KEY or API_KEY env var
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) ai = new GoogleGenAI({ apiKey });

const hasKey = () => !!apiKey && !!ai;

// Language detection helper
export const detectLanguageFromText = (text?: string): 'vi' | 'en' => {
  if (!text) return 'en';
  const sample = text.slice(0, 4000).toLowerCase();
  const viSignals = /[ăâđêôơưáàảạãắằẳẵặấầẩẫậếềễệốồổỗộớờởỡợứừửữự]/i;
  if (viSignals.test(sample)) return 'vi';
  const viWords = [' và ', ' không ', ' những ', ' của ', ' cho ', ' có '];
  for (const w of viWords) if (sample.includes(w)) return 'vi';
  const enWords = [' the ', ' and ', ' is ', ' you ', ' to ', ' of '];
  for (const w of enWords) if (sample.includes(w)) return 'en';
  return 'en';
};

// Profanity lists
const PROFANITY_EN = ['fuck', 'shit', 'bitch', 'asshole', 'damn'];
const PROFANITY_VI = ['đụ', 'đcm', 'đm', 'đụ má', 'địt', 'địt mẹ', 'đĩ'];
const containsProfanity = (text: string, lang: 'en' | 'vi') => {
  if (!text) return false;
  const s = text.toLowerCase();
  const list = lang === 'vi' ? PROFANITY_VI : PROFANITY_EN;
  return list.some(w => s.includes(w));
};

// Helper: call AI model
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
    console.error('AI error:', err);
    return null;
  }
};

/* ----------------------- FEATURE GROUP 1 — STORY ASSISTANT ----------------------- */

export async function generateSynopsis(keywords: string[], language: 'auto' | 'en' | 'vi' = 'auto') {
  if (!keywords.length) throw new Error('Provide at least 1 keyword');
  const joined = keywords.join(', ');
  const lang = language === 'auto' ? detectLanguageFromText(joined) : language;
  const promptEn = `You are a story assistant. Write a 2-4 sentence story description using these keywords: ${joined}. Keep genre/style implied. Do NOT add unrelated details. Respond in English.`;
  const promptVi = `Bạn là trợ lý viết truyện. Viết mô tả truyện 2-4 câu dựa trên từ khóa: ${joined}. Giữ phong cách/genre phù hợp, KHÔNG thêm chi tiết ngoài ngữ cảnh.`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) return { language: lang, synopsis: modelOut.trim() };

  // fallback: generate simple descriptive sentence from keywords
  return { language: lang, synopsis: lang === 'vi' ? `Câu chuyện về ${joined}, với các sự kiện và cảm xúc nổi bật.` : `A story about ${joined}, highlighting key events and emotions.` };
}

export async function suggestChapterTitles(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const promptEn = `Suggest 3-5 concise chapter titles (max 5 words) that match the tone and content of the following text: ${text.substring(0,2000)}`;
  const promptVi = `Gợi ý 3-5 tiêu đề chương ngắn gọn (dưới 5 từ) phù hợp tông và nội dung: ${text.substring(0,2000)}`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) {
    const list = modelOut.split(/\n|,|;|-/).map(s => s.trim()).filter(Boolean).slice(0,5);
    return { language: lang, titles: list };
  }

  // fallback: use first phrase as tentative titles
  const snippet = text.substring(0, 50).replace(/\n/g,' ');
  return { language: lang, titles: [snippet, snippet+' (Part 2)', snippet+' (Climax)'] };
}

export async function rewriteSection(text: string, tone: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const tones: Record<string, {en: string, vi: string}> = { soft: {en:'soft', vi:'nhẹ nhàng'}, action:{en:'action', vi:'hành động'}, poetic:{en:'poetic', vi:'trữ tình'} };
  if (!tones[tone]) throw new Error('Invalid tone');
  const toneLabel = lang==='vi'?tones[tone].vi:tones[tone].en;
  const promptEn = `Rewrite the paragraph below in a ${toneLabel} tone. Keep meaning identical. Paragraph: "${text}"`;
  const promptVi = `Viết lại đoạn sau theo tông ${toneLabel}, giữ nguyên ý nghĩa: "${text}"`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) return { language: lang, rewritten: modelOut.trim() };

  // fallback: slight punctuation transform
  return { language: lang, rewritten: text.replace(/\./g,'…') };
}

export async function suggestPlotTwists(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language === 'auto' ? detectLanguageFromText(text) : language;
  const promptEn = `Given this story/chapter text, suggest 3 possible plot twists consistent with the text (subtle→dramatic). Text: ${text.substring(0,2000)}`;
  const promptVi = `Dựa trên nội dung, gợi ý 3 plot twist từ tinh tế → kịch tính, KHÔNG mâu thuẫn: ${text.substring(0,2000)}`;

  const modelOut = await callModel(lang === 'vi' ? promptVi : promptEn);
  if (modelOut) {
    const twists = modelOut.split(/\n|,|;|-/).map(s=>s.trim()).filter(Boolean).slice(0,3);
    return { language: lang, twists };
  }

  // fallback: generate based on keywords in text
  const words = text.split(/\s+/).slice(0,5).join(' ');
  return { language: lang, twists: lang==='vi'? [`Sự thật về ${words}`, `Bất ngờ với ${words}`, `Người thật sự là ${words}`] : [`Secret about ${words}`, `Unexpected twist involving ${words}`, `The real identity of ${words}`] };
}

export async function characterLogicCheck(text: string, profile: string, language: 'auto' | 'en' | 'vi' = 'auto') {
  const lang = language==='auto'?detectLanguageFromText(text+profile):language;
  const promptEn = `Check character consistency. Return JSON {issues:[{location,reason,fix}]}. Profile: ${profile}. Text: ${text.substring(0,2000)}`;
  const promptVi = `Kiểm tra tính logic nhân vật. Trả về JSON {issues:[{location,reason,fix}]}. Hồ sơ: ${profile}. Nội dung: ${text.substring(0,2000)}`;

  const jsonText = await callModel(lang==='vi'?promptVi:promptEn,{json:true});
  if (jsonText) {
    try { const parsed = JSON.parse(jsonText); return { language: lang, issues: parsed.issues||[] }; } 
    catch { /* fallback below */ }
  }
  // fallback: naive heuristic
  const issues:any[]=[];
  if(profile.toLowerCase().includes('brave') && text.toLowerCase().includes('runs away')) {
    issues.push({location:'chapter mismatch', reason:'Brave character flees', fix:'Show hesitant behavior instead of fleeing completely'});
  }
  return { language: lang, issues };
}

/* ----------------------- FEATURE GROUP 2 — TAGGING ----------------------- */

export async function generateHashtags(text: string, language: 'auto'|'en'|'vi'='auto') {
  const lang = language==='auto'?detectLanguageFromText(text):language;
  const promptEn = `Produce 5-15 hashtags for theme, characters, mood, setting. Text: ${text.substring(0,1200)}`;
  const promptVi = `Tạo 5-15 hashtag cho chủ đề, nhân vật, tâm trạng, bối cảnh: ${text.substring(0,1200)}`;
  const out = await callModel(lang==='vi'?promptVi:promptEn);
  if(out){
    const tags = out.split(/,|\n/).map(s=>s.replace(/#/g,'').trim()).filter(Boolean).slice(0,15).map(t=>`#${t.replace(/\s+/g,'')}`);
    return { language: lang, tags };
  }
  // fallback: extract first words
  const firstWords = text.split(/\s+/).slice(0,5).map(w=>`#${w.replace(/\W/g,'')}`);
  return { language: lang, tags: firstWords };
}

export async function suggestGenres(text:string, language:'auto'|'en'|'vi'='auto'){
  const lang = language==='auto'?detectLanguageFromText(text):language;
  const promptEn=`Suggest 1-3 genres as JSON array. Text: ${text.substring(0,1200)}`;
  const promptVi=`Gợi ý 1-3 thể loại, trả về JSON array. Text: ${text.substring(0,1200)}`;
  const out = await callModel(lang==='vi'?promptVi:promptEn,{json:true});
  if(out){try{const parsed=JSON.parse(out); if(Array.isArray(parsed)) return {language:lang,genres:parsed.slice(0,3)}; if(parsed.genres) return {language:lang,genres:parsed.genres.slice(0,3)}}catch{}}
  // fallback: detect keywords
  const guess = text.toLowerCase().includes('love')||text.toLowerCase().includes('yêu')?['Romance']:['Fantasy'];
  return {language:lang,genres:guess};
}

/* ----------------------- FEATURE GROUP 3 — MODERATION ----------------------- */

export async function moderateContent(text:string,language:'auto'|'en'|'vi'='auto'){
  const lang = language==='auto'?detectLanguageFromText(text):language;
  const issues:string[]=[];
  if(containsProfanity(text,lang)) issues.push('offensive_language');
  const violence = ['kill','murder','blood','slaughter','violence','beat'];
  const violenceVi = ['giết','máu','đánh','hành hung','thảm sát'];
  const sexual=['sex','sexual','rape','incest'];
  const sexualVi=['tình dục','hiếp dâm','quan hệ tình dục','ấu dâm'];
  const hate=['hate','nazi','racist','supremacy'];
  const s=text.toLowerCase();
  if(violence.concat(violenceVi).some(w=>s.includes(w))) issues.push('violence');
  if(sexual.concat(sexualVi).some(w=>s.includes(w))) issues.push('sexual_content');
  if(s.includes('minor')||s.includes('underage')||s.includes('trẻ em')||s.includes('vị thành niên')) issues.push('sexual_content_involving_minors');
  if(hate.some(w=>s.includes(w))) issues.push('hate_speech');
  const political=['election','government','vote','president','chính phủ','bầu cử'];
  if(political.some(w=>s.includes(w))) issues.push('political_content');
  let risk:'low'|'medium'|'high'='low';
  if(issues.length>=3||issues.includes('sexual_content_involving_minors')) risk='high';
  else if(issues.length===2) risk='medium';
  const fixPromptEn=`Provide safe concise rewrite preserving meaning: ${text.substring(0,400)}`;
  const fixPromptVi=`Viết lại ngắn gọn, giữ ý, loại bỏ nội dung nhạy cảm: ${text.substring(0,400)}`;
  const suggestion=await callModel(lang==='vi'?fixPromptVi:fixPromptEn) || (lang==='vi'?'Viết lại để an toàn':'Rewrite to safe content');
  return {language:lang,issues,risk,recommended_fix:suggestion.trim()};
}

/* ----------------------- FEATURE GROUP 4 — SUMMARY & FAST RECAP ----------------------- */

export async function summarizeStory(fullText:string,language:'auto'|'en'|'vi'='auto'){
  const lang = language==='auto'?detectLanguageFromText(fullText):language;
  const promptEn=`Summarize story in 3-5 sentences, highlight main events and character arcs. Text: ${fullText.substring(0,4000)}`;
  const promptVi=`Tóm tắt truyện 3-5 câu, nêu sự kiện chính và cung đoạn: ${fullText.substring(0,4000)}`;
  const out=await callModel(lang==='vi'?promptVi:promptEn);
  if(out) return {language:lang,summary:out.trim()};
  // fallback: generate summary based on first sentences
  const snippet = fullText.split('.').slice(0,3).join('.');
  return {language:lang,summary:snippet};
}

export async function fastRecap(chapterText:string,language:'auto'|'en'|'vi'='auto'){
  const lang=language==='auto'?detectLanguageFromText(chapterText):language;
  const promptEn=`Create 3-6 bullet points summarizing events in this chapter. Do NOT add new details. Text: ${chapterText.substring(0,2000)}`;
  const promptVi=`Tạo 3-6 bullet points tóm tắt sự kiện thực tế trong chương, KHÔNG thêm chi tiết: ${chapterText.substring(0,2000)}`;
  const out = await callModel(lang==='vi'?promptVi:promptEn);
  if(out){
    const bullets = out.split(/\n|\r|\d+\.|-/).map(s=>s.trim()).filter(Boolean).slice(0,6);
    return {language:lang,bullets};
  }
  // fallback: create bullets from first sentences
  const sentences = chapterText.split('.').slice(0,6).map(s=>s.trim()).filter(Boolean);
  return {language:lang,bullets:sentences};
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
