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

  const viSignals = /[ăâđêôơưáàảạãắằẳẵặấầẩẫậếềễệốồổỗộớờởỡợứừửữự]/i;
  if (viSignals.test(sample)) return "vi";

  const viWords = [" và ", " không ", " những ", " của ", " cho ", " có "];
  if (viWords.some((w) => sample.includes(w))) return "vi";

  const enWords = [" the ", " and ", " is ", " you ", " to ", " of "];
  if (enWords.some((w) => sample.includes(w))) return "en";

  return "en";
};

/* ============================================================
   CORE MODEL CALLER WITH ERROR HANDLING
============================================================ */

const callModel = async (prompt: string, json = false): Promise<string | null> => {
  if (!hasKey()) {
    console.error("AI API key not configured");
    return null;
  }
  
  try {
    const res = await ai!.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: json ? { responseMimeType: "application/json" } : undefined,
    });
    return res.text || null;
  } catch (err) {
    console.error("AI generation error:", err);
    return null;
  }
};

/* ============================================================
   FEATURE GROUP 1: AI STORY ASSISTANT
============================================================ */

/**
 * Generate story synopsis from keywords
 * Input: 3-5 keywords
 * Output: 2-4 sentence description matching keywords and implied genre
 */
export async function generateSynopsis(
  keywords: string[],
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; synopsis: string } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(keywords.join(" ")) : language;
  
  const prompt = detectedLang === "vi"
    ? `Viết mô tả truyện ngắn 2-4 câu dựa trên các từ khóa sau: ${keywords.join(", ")}. 
       Mô tả phải:
       - Kết hợp TẤT CẢ các từ khóa một cách tự nhiên
       - Phù hợp với thể loại được ngụ ý
       - Hấp dẫn và súc tích
       - KHÔNG thêm chi tiết không liên quan
       Chỉ trả về mô tả, không giải thích.`
    : `Write a 2-4 sentence story description based on these keywords: ${keywords.join(", ")}.
       The description must:
       - Naturally incorporate ALL keywords
       - Match the implied genre
       - Be engaging and concise
       - NOT add unrelated details
       Return only the description, no explanations.`;

  const result = await callModel(prompt);
  if (!result) return null;

  return {
    language: detectedLang,
    synopsis: result.trim()
  };
}

/**
 * Suggest chapter titles based on content
 * Input: chapter text
 * Output: 3-5 title suggestions reflecting tone and content
 */
export async function suggestChapterTitles(
  chapterText: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; titles: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(chapterText) : language;
  const excerpt = chapterText.substring(0, 2000);
  
  const prompt = detectedLang === "vi"
    ? `Dựa trên nội dung chương sau, đề xuất 5 tiêu đề chương khác nhau:

${excerpt}

Yêu cầu:
- Mỗi tiêu đề phải phản ánh chính xác nội dung và tông điệu
- Đa dạng về phong cách (trực tiếp, ẩn dụ, kịch tính)
- Độ dài: 3-8 từ
- Trả về dưới dạng danh sách, mỗi tiêu đề một dòng, không đánh số`
    : `Based on the following chapter content, suggest 5 different chapter titles:

${excerpt}

Requirements:
- Each title must accurately reflect the content and tone
- Vary the style (direct, metaphorical, dramatic)
- Length: 3-8 words
- Return as a list, one title per line, no numbering`;

  const result = await callModel(prompt);
  if (!result) return null;

  const titles = result
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^\d+[\.\)]/))
    .slice(0, 5);

  return {
    language: detectedLang,
    titles
  };
}

/**
 * Rewrite text with specific tone
 * Input: text + tone (soft/action/lyrical)
 * Output: rewritten text maintaining meaning
 */
export async function rewriteWithTone(
  text: string,
  tone: "soft" | "action" | "lyrical" | "nhẹ nhàng" | "hành động" | "trữ tình",
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; rewritten: string } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(text) : language;
  
  const toneMap: Record<string, { vi: string; en: string }> = {
    soft: { vi: "nhẹ nhàng, tình cảm", en: "soft and emotional" },
    "nhẹ nhàng": { vi: "nhẹ nhàng, tình cảm", en: "soft and emotional" },
    action: { vi: "hành động, nhanh nhịp, kịch tính", en: "action-packed and fast-paced" },
    "hành động": { vi: "hành động, nhanh nhịp, kịch tính", en: "action-packed and fast-paced" },
    lyrical: { vi: "trữ tình, thơ mộng", en: "lyrical and poetic" },
    "trữ tình": { vi: "trữ tình, thơ mộng", en: "lyrical and poetic" }
  };

  const toneDescription = toneMap[tone]?.[detectedLang] || (detectedLang === "vi" ? "tự nhiên" : "natural");
  
  const prompt = detectedLang === "vi"
    ? `Viết lại đoạn văn sau theo phong cách ${toneDescription}:

${text}

Yêu cầu:
- GIỮ NGUYÊN ý nghĩa và nội dung chính
- CHỈ thay đổi cách diễn đạt và phong cách
- KHÔNG thêm chi tiết mới
- Phù hợp với tông điệu được yêu cầu
Chỉ trả về đoạn văn đã viết lại.`
    : `Rewrite the following text in a ${toneDescription} style:

${text}

Requirements:
- PRESERVE the original meaning and content
- ONLY change the expression and style
- DO NOT add new details
- Match the requested tone
Return only the rewritten text.`;

  const result = await callModel(prompt);
  if (!result) return null;

  return {
    language: detectedLang,
    rewritten: result.trim()
  };
}

/**
 * Generate plot twist suggestions
 * Input: story context
 * Output: 3 twist suggestions (subtle to dramatic)
 */
export async function generatePlotTwists(
  context: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; twists: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(context) : language;
  const excerpt = context.substring(0, 2000);
  
  const prompt = detectedLang === "vi"
    ? `Dựa trên ngữ cảnh truyện sau, đề xuất 3 plot twist:

${excerpt}

Yêu cầu:
- Twist 1: Tinh tế, bất ngờ nhẹ
- Twist 2: Trung bình, thay đổi hướng câu chuyện
- Twist 3: Kịch tính, đảo ngược hoàn toàn
- Mỗi twist phải PHÙ HỢP với logic đã có
- KHÔNG mâu thuẫn với nội dung hiện tại
- Mỗi twist 1-2 câu
Trả về 3 twist, mỗi twist một dòng.`
    : `Based on the following story context, suggest 3 plot twists:

${excerpt}

Requirements:
- Twist 1: Subtle, light surprise
- Twist 2: Medium, changes story direction
- Twist 3: Dramatic, complete reversal
- Each twist must FIT existing logic
- NO contradictions with current content
- Each twist 1-2 sentences
Return 3 twists, one per line.`;

  const result = await callModel(prompt);
  if (!result) return null;

  const twists = result
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^(Twist \d+|Plot twist \d+):/i))
    .slice(0, 3);

  return {
    language: detectedLang,
    twists
  };
}

/**
 * Check character consistency
 * Input: story text + character profile
 * Output: inconsistencies found with explanations and fixes
 */
export async function checkCharacterConsistency(
  storyText: string,
  characterProfile: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{
  language: "vi" | "en";
  issues: Array<{ location: string; reason: string; fix: string }>;
} | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(storyText) : language;
  const excerpt = storyText.substring(0, 3000);
  
  const prompt = detectedLang === "vi"
    ? `Phân tích tính nhất quán của nhân vật trong câu chuyện:

HỒ SƠ NHÂN VẬT:
${characterProfile}

NỘI DUNG TRUYỆN:
${excerpt}

Nhiệm vụ:
- Tìm các hành vi/lời nói KHÔNG phù hợp với tính cách
- Giải thích TẠI SAO không phù hợp
- Đề xuất cách sửa

Trả về JSON:
{
  "issues": [
    {
      "location": "mô tả vị trí trong truyện",
      "reason": "giải thích mâu thuẫn",
      "fix": "gợi ý sửa"
    }
  ]
}

Nếu không có vấn đề, trả về: {"issues": []}`
    : `Analyze character consistency in the story:

CHARACTER PROFILE:
${characterProfile}

STORY CONTENT:
${excerpt}

Task:
- Find behaviors/dialogue that DON'T match personality
- Explain WHY it's inconsistent
- Suggest how to fix

Return JSON:
{
  "issues": [
    {
      "location": "location description in story",
      "reason": "explanation of contradiction",
      "fix": "suggested fix"
    }
  ]
}

If no issues, return: {"issues": []}`;

  const result = await callModel(prompt, true);
  if (!result) return null;

  try {
    const parsed = JSON.parse(result);
    return {
      language: detectedLang,
      issues: parsed.issues || []
    };
  } catch {
    return { language: detectedLang, issues: [] };
  }
}

/* ============================================================
   FEATURE GROUP 2: AI AUTO-TAGGING
============================================================ */

/**
 * Generate hashtags from story content
 * Input: story/chapter text
 * Output: 5-15 relevant hashtags
 */
export async function generateHashtags(
  content: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; tags: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(content) : language;
  const excerpt = content.substring(0, 1500);
  
  const prompt = detectedLang === "vi"
    ? `Phân tích nội dung sau và tạo 10-15 hashtag phù hợp:

${excerpt}

Hashtag phải liên quan đến:
- Chủ đề chính
- Tâm trạng/cảm xúc
- Nhân vật/mối quan hệ
- Bối cảnh/setting
- Thể loại

Yêu cầu:
- Mỗi hashtag 1-3 từ
- Bắt đầu bằng #
- Tiếng Việt không dấu hoặc tiếng Anh
- Mỗi hashtag một dòng`
    : `Analyze the following content and create 10-15 relevant hashtags:

${excerpt}

Hashtags should relate to:
- Main themes
- Mood/emotions
- Characters/relationships
- Setting/context
- Genre

Requirements:
- Each hashtag 1-3 words
- Start with #
- One hashtag per line`;

  const result = await callModel(prompt);
  if (!result) return null;

  const tags = result
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("#"))
    .slice(0, 15);

  return {
    language: detectedLang,
    tags
  };
}

/**
 * Suggest genres based on content
 * Input: story/chapter text
 * Output: 1-3 genre suggestions
 */
export async function suggestGenres(
  content: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; genres: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(content) : language;
  const excerpt = content.substring(0, 1500);
  
  const prompt = detectedLang === "vi"
    ? `Phân tích nội dung và xác định 1-3 thể loại phù hợp nhất:

${excerpt}

Các thể loại có thể: Romance, Fantasy, Sci-Fi, Mystery, Horror, Thriller, Drama, Adventure, Historical, Contemporary

Trả về JSON:
{
  "genres": ["thể loại 1", "thể loại 2"]
}

Chỉ chọn thể loại THỰC SỰ phù hợp với nội dung.`
    : `Analyze the content and identify 1-3 most suitable genres:

${excerpt}

Possible genres: Romance, Fantasy, Sci-Fi, Mystery, Horror, Thriller, Drama, Adventure, Historical, Contemporary

Return JSON:
{
  "genres": ["genre 1", "genre 2"]
}

Only choose genres that TRULY match the content.`;

  const result = await callModel(prompt, true);
  if (!result) return null;

  try {
    const parsed = JSON.parse(result);
    return {
      language: detectedLang,
      genres: parsed.genres || []
    };
  } catch {
    return { language: detectedLang, genres: [] };
  }
}

/**
 * Combined auto-tag function (genres + tags)
 */
export async function autoTagStory(
  content: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; genre: string; tags: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(content) : language;
  const excerpt = content.substring(0, 1500);
  
  const prompt = detectedLang === "vi"
    ? `Phân tích truyện và trả về thể loại + tags:

${excerpt}

Trả về JSON:
{
  "genre": "một thể loại chính phù hợp nhất",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Genre có thể: Romance, Fantasy, Sci-Fi, Mystery, Horror, Thriller, Drama, Adventure
Tags: 5-8 từ khóa mô tả nội dung`
    : `Analyze the story and return genre + tags:

${excerpt}

Return JSON:
{
  "genre": "most suitable main genre",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Genre options: Romance, Fantasy, Sci-Fi, Mystery, Horror, Thriller, Drama, Adventure
Tags: 5-8 keywords describing the content`;

  const result = await callModel(prompt, true);
  if (!result) return null;

  try {
    const parsed = JSON.parse(result);
    return {
      language: detectedLang,
      genre: parsed.genre || "General",
      tags: parsed.tags || []
    };
  } catch {
    return { language: detectedLang, genre: "General", tags: [] };
  }
}

/* ============================================================
   FEATURE GROUP 3: CONTENT MODERATION
============================================================ */

/**
 * Moderate content for safety issues
 * Input: text content
 * Output: detected issues, risk level, and fix suggestions
 */
export async function moderateContent(
  content: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{
  status: "approved" | "flagged";
  language: "vi" | "en";
  message: string;
  issues?: string[];
  risk?: "low" | "medium" | "high";
  suggestedFix?: string;
} | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(content) : language;
  const excerpt = content.substring(0, 2000);
  
  const prompt = detectedLang === "vi"
    ? `Kiểm tra nội dung sau để phát hiện vấn đề an toàn:

${excerpt}

Phát hiện:
- Nội dung tình dục 18+
- Bạo lực nghiêm trọng
- Ngôn từ căm thét/phân biệt đối xử
- Quấy rối
- Trẻ vị thành niên trong ngữ cảnh tình dục
- Nội dung chính trị nhạy cảm
- Ngôn ngữ xúc phạm

Trả về JSON:
{
  "status": "approved" hoặc "flagged",
  "issues": ["danh sách vấn đề phát hiện"],
  "risk": "low/medium/high",
  "message": "mô tả ngắn gọn",
  "suggestedFix": "gợi ý viết lại an toàn hơn (nếu có vấn đề)"
}

Nếu an toàn: {"status": "approved", "issues": [], "risk": "low", "message": "Nội dung an toàn"}`
    : `Check the following content for safety issues:

${excerpt}

Detect:
- Explicit sexual content (18+)
- Severe violence
- Hate speech/discrimination
- Harassment
- Minors in sexual context
- Sensitive political content
- Offensive language

Return JSON:
{
  "status": "approved" or "flagged",
  "issues": ["list of detected issues"],
  "risk": "low/medium/high",
  "message": "brief description",
  "suggestedFix": "suggestion for safer rewrite (if issues found)"
}

If safe: {"status": "approved", "issues": [], "risk": "low", "message": "Content is safe"}`;

  const result = await callModel(prompt, true);
  if (!result) return null;

  try {
    const parsed = JSON.parse(result);
    return {
      status: parsed.status || "approved",
      language: detectedLang,
      message: parsed.message || (detectedLang === "vi" ? "Nội dung an toàn" : "Content is safe"),
      issues: parsed.issues,
      risk: parsed.risk,
      suggestedFix: parsed.suggestedFix
    };
  } catch {
    return {
      status: "approved",
      language: detectedLang,
      message: detectedLang === "vi" ? "Không thể phân tích" : "Unable to analyze"
    };
  }
}

/* ============================================================
   FEATURE GROUP 4: SUMMARY TOOLS
============================================================ */

/**
 * Generate full story summary
 * Input: complete story text
 * Output: concise summary with key events and character arcs
 */
export async function summarizeStory(
  fullText: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; summary: string; keyEvents?: string[]; characterArcs?: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(fullText) : language;
  const excerpt = fullText.substring(0, 5000);
  
  const prompt = detectedLang === "vi"
    ? `Tóm tắt câu chuyện sau:

${excerpt}

Trả về JSON:
{
  "summary": "tóm tắt tổng quan 3-5 câu",
  "keyEvents": ["sự kiện 1", "sự kiện 2", "sự kiện 3"],
  "characterArcs": ["diễn biến nhân vật 1", "diễn biến nhân vật 2"]
}

Yêu cầu:
- Tóm tắt phải súc tích nhưng đầy đủ ý chính
- KHÔNG thêm chi tiết không có trong văn bản
- Nêu rõ các sự kiện quan trọng
- Mô tả sự phát triển của nhân vật chính`
    : `Summarize the following story:

${excerpt}

Return JSON:
{
  "summary": "concise 3-5 sentence overview",
  "keyEvents": ["event 1", "event 2", "event 3"],
  "characterArcs": ["character development 1", "character development 2"]
}

Requirements:
- Summary must be concise but complete
- DO NOT add details not in the text
- List key events clearly
- Describe main character development`;

  const result = await callModel(prompt, true);
  if (!result) return null;

  try {
    const parsed = JSON.parse(result);
    return {
      language: detectedLang,
      summary: parsed.summary || "",
      keyEvents: parsed.keyEvents,
      characterArcs: parsed.characterArcs
    };
  } catch {
    return { language: detectedLang, summary: result.trim() };
  }
}

/**
 * Generate fast chapter recap
 * Input: chapter text
 * Output: 3-6 bullet points of key events
 */
export async function generateFastRecap(
  chapterText: string,
  language: "auto" | "en" | "vi" = "auto"
): Promise<{ language: "vi" | "en"; bullets: string[] } | null> {
  const detectedLang = language === "auto" ? detectLanguageFromText(chapterText) : language;
  const excerpt = chapterText.substring(0, 2000);
  
  const prompt = detectedLang === "vi"
    ? `Tạo bản tóm tắt nhanh cho chương sau bằng 3-6 điểm chính:

${excerpt}

Yêu cầu:
- Mỗi điểm 1 câu ngắn gọn
- Chỉ nêu sự kiện XẢY RA trong chương
- KHÔNG phát minh chi tiết
- Theo thứ tự thời gian
Trả về danh sách, mỗi điểm một dòng, không đánh số.`
    : `Create a fast recap for the following chapter in 3-6 key points:

${excerpt}

Requirements:
- Each point is one concise sentence
- Only state events that HAPPEN in the chapter
- DO NOT invent details
- Follow chronological order
Return as a list, one point per line, no numbering.`;

  const result = await callModel(prompt);
  if (!result) return null;

  const bullets = result
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^\d+[\.\)]/))
    .slice(0, 6);

  return {
    language: detectedLang,
    bullets
  };
}

/* ============================================================
   UNIFIED FUNCTION FOR EDITOR (generateStoryIdeas)
============================================================ */

/**
 * Generate story ideas based on type
 * This is the function called by the editor
 */
export async function generateStoryIdeas(
  context: string,
  type: "twist" | "rewrite",
  language: "auto" | "en" | "vi" = "auto"
): Promise<string | null> {
  if (type === "twist") {
    const result = await generatePlotTwists(context, language);
    if (!result) return null;
    return result.twists.join("\n\n");
  } else if (type === "rewrite") {
    const result = await rewriteWithTone(context, "soft", language);
    if (!result) return null;
    return result.rewritten;
  }
  return null;
}

/* ============================================================
   EXPORT ALL FUNCTIONS
============================================================ */

export const unifiedAIService = {
  // Language detection
  detectLanguageFromText,
  
  // Story assistant
  generateSynopsis,
  suggestChapterTitles,
  rewriteWithTone,
  generatePlotTwists,
  checkCharacterConsistency,
  generateStoryIdeas,
  
  // Auto-tagging
  generateHashtags,
  suggestGenres,
  autoTagStory,
  
  // Moderation
  moderateContent,
  
  // Summary
  summarizeStory,
  generateFastRecap
};

export default unifiedAIService;
