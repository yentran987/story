import { GoogleGenAI } from "@google/genai";

/* ============================================================
   INIT SETUP
============================================================ */

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";
let ai: GoogleGenAI | null = apiKey ? new GoogleGenAI({ apiKey }) : null;
const hasKey = () => !!apiKey && !!ai;

/* ============================================================
   LANGUAGE DETECTION
============================================================ */

export const detectLanguageFromText = (text?: string): "vi" | "en" => {
  if (!text) return "en";
  const sample = text.slice(0, 3000).toLowerCase();

  const viSignals =
    /[ăâđêôơưáàảạãắằẳẵặấầẩẫậếềễệốồổỗộớờởỡợứừửữự]/i;
  if (viSignals.test(sample)) return "vi";

  const viWords = [" và ", " không ", " những ", " của ", " cho ", " có "];
  if (viWords.some((w) => sample.includes(w))) return "vi";

  const enWords = [" the ", " and ", " is ", " you ", " to ", " of "];
  if (enWords.some((w) => sample.includes(w))) return "en";

  return "en";
};

/* ============================================================
   CORE MODEL CALLER
============================================================ */

const callModel = async (prompt: string, json = false) => {
  if (!hasKey()) return null;
  try {
    const res = await ai!.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: json ? { responseMimeType: "application/json" } : undefined,
    });
    return res.text || null;
  } catch (err) {
    console.error("AI error:", err);
    return null;
  }
};

/* ============================================================
   FEATURE: REWRITE SELECTED TEXT
============================================================ */

export async function rewriteText(selectedText: string) {
  const lang = detectLanguageFromText(selectedText);

  const prompt =
    lang === "vi"
      ? `Viết lại đoạn văn sau theo cách hay hơn, giữ nguyên ý nghĩa, không thêm chi tiết: "${selectedText}"`
      : `Rewrite the following text to be clearer and more engaging, keep meaning identical: "${selectedText}"`;

  const out = await callModel(prompt);
  return { language: lang, rewritten: out?.trim() || selectedText };
}

/* ============================================================
   FEATURE: PLOT TWIST — DỰA VÀO NỘI DUNG ĐANG CHỌN
============================================================ */

export async function generatePlotTwist(text: string) {
  const lang = detectLanguageFromText(text);

  const prompt =
    lang === "vi"
      ? `Dựa trên đoạn văn sau, gợi ý 3 plot twist hợp lý, không phá vỡ logic:
${text.substring(0, 2000)}`
      : `Based on the text below, suggest 3 logical plot twists (consistent, not contradictory):
${text.substring(0, 2000)}`;

  const out = await callModel(prompt);

  const list = out
    ? out.split(/\n|,|;|-/).map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : [];

  return { language: lang, twists: list };
}

/* ============================================================
   FEATURE: FULL STORY SUMMARY
============================================================ */

export async function summarizeFullText(fullText: string) {
  const lang = detectLanguageFromText(fullText);

  const prompt =
    lang === "vi"
      ? `Tóm tắt toàn bộ nội dung sau trong 3-5 câu, không thêm chi tiết:
${fullText.substring(0, 4000)}`
      : `Summarize the following text in 3–5 sentences without adding new details:
${fullText.substring(0, 4000)}`;

  const out = await callModel(prompt);
  return { language: lang, summary: out?.trim() || "" };
}

/* ============================================================
   FEATURE: CONTENT MODERATION (CHECK FULL TEXT)
============================================================ */

export async function moderateFullText(text: string) {
  const lang = detectLanguageFromText(text);

  const prompt =
    lang === "vi"
      ? `Kiểm tra nội dung dưới đây xem có bạo lực nghiêm trọng, tình dục, 18+, trẻ vị thành niên hay nội dung nhạy cảm không. Nếu an toàn trả về "Approved". Nếu không, mô tả ngắn lý do:
${text.substring(0, 1500)}`
      : `Check the following text for explicit content, severe violence, sexual content, or minors. 
If safe, reply "Approved". If unsafe, briefly explain why:
${text.substring(0, 1500)}`;

  const out = await callModel(prompt);
  return { language: lang, result: out?.trim() || "Approved" };
}

/* ============================================================
   FEATURE: AUTO TAG + GENRE
============================================================ */

export async function autoTagStory(content: string) {
  const lang = detectLanguageFromText(content);

  const prompt =
    lang === "vi"
      ? `Phân tích đoạn truyện sau và trả về JSON gồm: 
{
  "genre": "...",
  "tags": ["...", "..."]
}
Nội dung: "${content.substring(0, 1000)}"`
      : `Analyze the story below and return JSON:
{
  "genre": "...",
  "tags": ["...", "..."]
}
Text: "${content.substring(0, 1000)}"`;

  const out = await callModel(prompt, true);

  try {
    return JSON.parse(out || "{}");
  } catch {
    return { genre: "General", tags: ["Story"] };
  }
}

/* ============================================================
   EXPORT — DÙNG NHƯ 1 API DUY NHẤT
============================================================ */

export default {
  detectLanguageFromText,
  rewriteText,
  generatePlotTwist,
  summarizeFullText,
  moderateFullText,
  autoTagStory,
};
