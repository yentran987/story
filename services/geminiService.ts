import aiService, {
  detectLanguageFromText,
  generateSynopsis,
  suggestChapterTitles,
  rewriteSection,
  suggestPlotTwists,
  characterLogicCheck,
  generateHashtags,
  suggestGenres,
  moderateContent as aiModerate,
  summarizeStory,
  fastRecap,
} from './aiService';

// Legacy adapter kept for frontend compatibility — uses the new aiService functions internally.
export const geminiService = {
  // map generateStoryIdeas to the new story-focused APIs.
  async generateStoryIdeas(keywords: string, type: 'outline' | 'twist' | 'rewrite', language: 'auto' | 'en' | 'vi' = 'auto') {
    const kwArr = keywords.split(/,|;/).map(s => s.trim()).filter(Boolean).slice(0,5);
    if (type === 'outline') {
      const res = await generateSynopsis(kwArr, language);
      return res.synopsis;
    }
    if (type === 'twist') {
      const res = await suggestPlotTwists(keywords, language);
      // return first twist as a single text
      return (res.twists && res.twists[0]) || '';
    }
    // rewrite
    const out = await rewriteSection(keywords, 'soft', language);
    return out.rewritten || '';
  },

  async autoTagStory(content: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const tags = await generateHashtags(content, language);
    const genres = await suggestGenres(content, language);
    return { genre: (genres.genres && genres.genres[0]) || 'General', tags: tags.hashtags };
  },

  // New wrappers to expose aiService functions matching the spec
  async generateSynopsis(keywords: string[] | string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const kw = Array.isArray(keywords) ? keywords : String(keywords).split(/,|;/).map(s => s.trim()).filter(Boolean).slice(0,5);
    const res = await generateSynopsis(kw, language);
    return { synopsis: res.synopsis, language: res.language };
  },

  async suggestChapterTitles(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await suggestChapterTitles(text, language);
    return { titles: res.titles || [], language: res.language };
  },

  async rewriteSection(text: string, tone: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await rewriteSection(text, tone, language);
    return { rewritten: res.rewritten || text, language: res.language };
  },

  async suggestPlotTwists(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await suggestPlotTwists(text, language);
    return { twists: res.twists || [], language: res.language };
  },

  async characterLogicCheck(text: string, profile: any, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await characterLogicCheck(text, JSON.stringify(profile || {}), language);
    return { issues: res.issues || [], explanation: res.explanation || '', fix_suggestions: res.fix_suggestions || [], language: res.language };
  },

  async generateHashtags(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await generateHashtags(text, language);
    return { hashtags: res.hashtags || [], language: res.language };
  },

  async suggestGenres(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await suggestGenres(text, language);
    return { genres: res.genres || [], language: res.language };
  },

  async summarizeStory(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await summarizeStory(text, language);
    return { summary: res.summary || '', main_events: res.main_events || [], character_arcs: res.character_arcs || [], language: res.language };
  },

  async fastRecap(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    const res = await fastRecap(text, language);
    return { fast_recap: res.fast_recap || [], language: res.language };
  },

  async summarizeText(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    // For compatibility the old API returned a free text summary; we return the summary paragraph.
    const res = await summarizeStory(text, language);
    return res.summary;
  },

  async moderateContent(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    // Return the structured moderation object but keep the old status/message shape for backwards compatibility
    const res = await aiModerate(text, language);
    // Return structured moderation object as per spec
    return {
      issues: res.issues || [],
      risk_score: (res as any).risk_score || (res as any).risk || 'low',
      recommended_fix: res.recommended_fix || '',
      language: res.language,
      details: res
    };
  },

  // New helpers exposed for any future UI needs (not used directly by current UI yet)
  _internal: {
    detectLanguageFromText,
    generateSynopsis,
    suggestChapterTitles,
    rewriteSection,
    suggestPlotTwists,
    characterLogicCheck,
    generateHashtags,
    suggestGenres,
    summarizeStory,
    fastRecap,
    moderateContent: aiModerate,
  }
};