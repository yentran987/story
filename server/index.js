#!/usr/bin/env node
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Minimal language detection — matches aiService heuristic (JS copy)
const detectLanguageFromText = (text) => {
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

// Very small set of helpers to produce deterministic output when no AI key is present
const simpleSynopsis = (keywords, lang) => {
  const joined = keywords.join(', ');
  if (lang === 'vi') return `${joined} — Một câu chuyện khám phá ${joined} với cảm xúc mạnh mẽ và điểm nhấn bất ngờ.`;
  return `${joined} — A short story exploring ${joined} with emotional conflict and an unexpected turn.`;
};

app.post('/api/ai/story', (req, res) => {
  // action: synopsis | chapterTitles | rewrite | twist | characterCheck
  const { action, keywords, text, tone, profile } = req.body || {};
  const payloadText = text || (Array.isArray(keywords) ? keywords.join(' ') : keywords || '');
  const lang = detectLanguageFromText(payloadText);

  if (action === 'synopsis') {
    const k = Array.isArray(keywords) ? keywords : (typeof keywords === 'string' ? keywords.split(/,|;/).map(s=>s.trim()).filter(Boolean) : []);
    return res.json({ language: lang, synopsis: simpleSynopsis(k.length ? k : ['keywords'], lang) });
  }

  if (action === 'chapterTitles') {
    const sample = (text || '').slice(0, 60);
    const titles = lang === 'vi'
      ? [`${sample} (Khởi đầu)`, 'Bước ngoặt', 'Cao trào']
      : [`${sample} (Intro)`, 'Turning Point', 'Climax'];
    return res.json({ language: lang, titles });
  }

  if (action === 'rewrite') {
    // Very small stylistic rewrite for offline/demo
    if (!text) return res.status(400).json({ error: 'missing text' });
    const rewritten = lang === 'vi' ? `${text.trim()} (đã chỉnh sửa theo tông ${tone || 'nhẹ nhàng'})` : `${text.trim()} (rewritten in ${tone || 'soft'} tone)`;
    return res.json({ language: lang, rewritten });
  }

  if (action === 'twist') {
    const arr = lang === 'vi'
      ? ['Kẻ thân thiết phản bội', 'Người bị cho là an toàn thực ra là kẻ chủ mưu', 'Sự thật lớn hé lộ khiến mọi thứ thay đổi']
      : ['A trusted ally betrays', 'The assumed-safe character is the mastermind', 'A hidden truth changes everything'];
    return res.json({ language: lang, twists: arr });
  }

  if (action === 'characterCheck') {
    // naive check sample — real server should use the AI model
    const issues = [];
    if (profile && profile.toLowerCase().includes('brave') && text && text.toLowerCase().includes('runs away')) {
      issues.push({ location: 'chapter1', reason: 'unnatural behavior for brave archetype', fix: 'Add internal conflict or explanation for fear' });
    }
    return res.json({ language: lang, issues });
  }

  return res.status(400).json({ error: 'unknown action' });
});

app.post('/api/ai/tags', (req, res) => {
  const { text, action } = req.body || {};
  const lang = detectLanguageFromText(text || '');
  if (action === 'genres') {
    const guess = (text||'').includes('love') || (text||'').includes('yêu') ? ['Romance'] : ['Fantasy'];
    return res.json({ language: lang, genres: guess });
  }

  // default -> hashtags
  // quick heuristic tags
  const tags = ['#story', '#fiction', '#characters', '#plot', '#mood'].slice(0, 10);
  return res.json({ language: lang, tags });
});

app.post('/api/ai/moderate', (req, res) => {
  const { text } = req.body || {};
  const lang = detectLanguageFromText(text || '');
  const issues = [];
  const s = (text || '').toLowerCase();
  if (s.match(/fuck|đụ|đm|shit|địt/)) issues.push('offensive_language');
  if (s.match(/rape|hiếp dâm|giết|murder|kill|máu/)) issues.push('violence_or_sexual');
  if (s.match(/child|trẻ em|underage|ấu dâm/)) issues.push('sexual_content_involving_minors');
  const risk = issues.includes('sexual_content_involving_minors') ? 'high' : (issues.length >= 2 ? 'medium' : (issues.length === 1 ? 'low' : 'low'));
  const recommended_fix = issues.length ? (lang === 'vi' ? 'Hãy viết lại để loại bỏ nội dung nhạy cảm / từ tục tĩu.' : 'Rewrite to remove explicit/sensitive content and offensive language.') : (lang === 'vi' ? 'Không có vấn đề rõ ràng.' : 'No issues detected.');
  res.json({ language: lang, issues, risk, recommended_fix });
});

app.post('/api/ai/summary', (req, res) => {
  const { action, text } = req.body || {};
  const lang = detectLanguageFromText(text || '');
  if (action === 'fastRecap') {
    // Try to extract up to 4 meaningful sentences from the text as bullets.
    if (text && text.trim().length > 0) {
      const s = text.trim();
      // split into sentences by ., ! or ? followed by space
      const parts = s.split(/(?<=[.!?])\s+/).map(p => p.trim()).filter(Boolean);
      const bullets = parts.slice(0, 4).map(p => p.length > 140 ? p.slice(0,137).trim() + '...' : p);
      if (bullets.length) return res.json({ language: lang, bullets });
    }
    const bullets = [(lang==='vi'?'Sự kiện 1':'Event 1'), (lang==='vi'?'Sự kiện 2':'Event 2'), (lang==='vi'?'Sự kiện 3':'Event 3')];
    return res.json({ language: lang, bullets });
  }
  // story summary
  return res.json({ language: lang, summary: (lang==='vi' ? 'Tóm tắt truyện ngắn gọn' : 'Concise story summary') });
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`AI server listening on http://localhost:${port}/api/ai/*`));
