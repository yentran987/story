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
    return { genre: (genres.genres && genres.genres[0]) || 'General', tags: tags.tags };
  },

  async summarizeText(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    // For compatibility the old API returned a free text summary; we return the summary paragraph.
    const res = await summarizeStory(text, language);
    return res.summary;
  },

  async moderateContent(text: string, language: 'auto' | 'en' | 'vi' = 'auto') {
    // Return the structured moderation object but keep the old status/message shape for backwards compatibility
    const res = await aiModerate(text, language);
    // map to old status + message + language
    const status = res.issues && res.issues.length > 0 ? 'flagged' : 'approved';
    const message = `Issues: ${res.issues.join(', ') || 'none'}. Risk: ${res.risk}. Recommended fix: ${res.recommended_fix}`;
    return { status, message, language: res.language, details: res };
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