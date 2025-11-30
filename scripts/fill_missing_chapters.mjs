import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jybokwtczjztqjdwmoww.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Ym9rd3Rjemp6dHFqZHdtb3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk5MjgsImV4cCI6MjA3OTg4NTkyOH0.MUSJtEhhZfjyyVMPI1Jdtrvx7dk_Y84xxBrGG0KGua4';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Create placeholder content in same language as story summary/title
const detectLanguageFromText = (text) => {
  if (!text) return 'en';
  const s = text.toLowerCase();
  if (/[ăâđêôơưáàảạãắằẳẵặấầẩẫậếềễệốồổỗộớờởỡợứừửữự]|\b(và|không|những|của|có)\b/.test(s)) return 'vi';
  return 'en';
};

const STORIES_RANGE = { start: 19, end: 48 };
const TARGET_CHAPTERS = 10;

async function getChapterCount(storyId) {
  // Prefer 'Chapters' table first
  try {
    const { data, error } = await supabase.from('Chapters').select('*').eq('story_id', storyId);
    if (!error && data) return data.length;
  } catch (e) {}
  try {
    const { data, error } = await supabase.from('chapters').select('*').eq('story_id', storyId);
    if (!error && data) return data.length;
  } catch (e) {}
  return 0;
}

async function insertPlaceholderChapters(storyId, count, baseTitle, language = 'en') {
  const rows = [];
  for (let i = 1; i <= count; i++) {
    const title = language === 'vi' ? `Chương ${i}: ${baseTitle} (Nội dung tạm)` : `Chapter ${i}: ${baseTitle} (Placeholder)`;
    const content = language === 'vi'
      ? `Nội dung tóm tắt tạm cho ${baseTitle} — chương ${i}. Đây là phần nội dung đại diện để hoàn thành số chương.`
      : `Placeholder content for ${baseTitle} — chapter ${i}. This is filler content to reach target chapter count.`;
    rows.push({ story_id: storyId, chapter_number: i, chapter_title: title, content });
  }

  // Try both table candidates
  for (const t of ['Chapters', 'chapters']) {
    try {
      const res = await supabase.from(t).insert(rows);
      if (!res.error) return true;
    } catch (e) { /* ignore */ }
  }
  return false;
}

async function run() {
  const results = [];
  for (let id = STORIES_RANGE.start; id <= STORIES_RANGE.end; id++) {
    const count = await getChapterCount(id);
    if (count >= TARGET_CHAPTERS) {
      results.push({ id, before: count, inserted: 0 });
      continue;
    }

    // fetch story title/summary for language detection
    const { data: storyRows } = await supabase.from('stories').select('*').eq('story_id', id).limit(1).maybeSingle();
    const title = storyRows?.Tiltle_story || storyRows?.title_story || storyRows?.Title_story || storyRows?.title || `Story ${id}`;
    const summary = storyRows?.synopsis || storyRows?.summary || '';
    const lang = detectLanguageFromText(title + ' ' + summary);

    const toInsert = TARGET_CHAPTERS - count;
    console.log(`Story ${id}: has ${count} chapters. Adding ${toInsert} placeholder chapters (lang=${lang})`);
    const ok = await insertPlaceholderChapters(id, toInsert, title, lang);
    results.push({ id, before: count, inserted: ok ? toInsert : 0 });
    // gentle pause
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('Done. Summary:', results);
}

run().catch(err => { console.error(err); process.exit(1); });
