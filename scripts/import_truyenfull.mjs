#!/usr/bin/env node
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// Supabase config (same as services/supabase.ts)
const SUPABASE_URL = 'https://jybokwtczjztqjdwmoww.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Ym9rd3Rjemp6dHFqZHdtb3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk5MjgsImV4cCI6MjA3OTg4NTkyOH0.MUSJtEhhZfjyyVMPI1Jdtrvx7dk_Y84xxBrGG0KGua4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CLI args
const argv = Object.fromEntries(process.argv.slice(2).map(a => {
  const [k, v] = a.split('=');
  return [k.replace(/^--/, ''), v ?? true];
}));

const MAX_SERIES = Number(argv.count || argv.c || 10);
const CHAPTERS_ARG = argv.chapters || argv.ch || argv.chap || argv.chaps;
const CHAPTERS_PER_SERIES = CHAPTERS_ARG ? Number(CHAPTERS_ARG) : undefined;
const MIN_CHAPTERS = Number(argv['min-chapters'] || argv.min || 10);
const MAX_CHAPTERS = Number(argv['max-chapters'] || argv.max || 25);
const WRITE = !!argv.write || !!argv.w;

const BASE = 'https://truyenfull.vision';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const UA = 'StoryWeaveImporter/1.0 (+https://github.com/)';

const fetchText = async (url) => {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText} for ${url}`);
  return await r.text();
};

// heuristic: find story links on homepage
async function discoverStories(limit = 10) {
  console.log('Discovering stories from', BASE);
  const html = await fetchText(BASE);
  const $ = load(html);
  const anchors = [];

  // common places: article h3 a, list rows, h3 a.story, .list-story a
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    // normalize absolute link
    const abs = href.startsWith('http') ? href : (href.startsWith('/') ? BASE + href : BASE + '/' + href);
    // ensure candidate is on the truyenfull.vision domain (avoid other sites with 'truyen' in their host)
    try {
      const parsed = new URL(abs);
      if (!parsed.hostname.includes('truyenfull.vision') && !abs.startsWith(BASE)) return;
    } catch (e) {
      return; // skip invalid urls
    }
    // target only story pages (heuristic: contain '/truyen')
    if (/truyen/i.test(abs) && !/chap|chuong|tag|page|the-loai|danh-sach/i.test(abs)) {
      anchors.push(abs.split('#')[0]);
    }
  });

  const uniq = [...new Set(anchors)];
  console.log('Found', uniq.length, 'candidate story links — taking top', limit);
  return uniq.slice(0, limit);
}

async function parseStoryPage(url) {
  console.log('Fetching story page:', url);
  const html = await fetchText(url);
  const $ = load(html);

  // title heuristics
  let title = $('meta[property="og:title"]').attr('content') || $('h1').first().text().trim() || $('title').text();
  title = title ? title.split('|')[0].trim() : '';

  const author = $("*[class*='author']").text().trim() || ($("meta[name='author']").attr('content') || '').trim();
  const summary = $('meta[name="description"]').attr('content') || $('div#noidungm, div#chapter-content, .description, .summary, .desc').first().text().trim();
  const cover = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || '';

  // find chapters list
  const chapters = [];
  // common selectors
  const candidates = ['.list-chapter a', '.chapter-list a', 'ul.list-chapter a', '#chapter a', '.buttons a', '.list-chuong a', '.lst-ch a', '.chapter a', 'a[href*="/chuong-"]', 'a[href*="/chuong-"]'];
  for (const sel of candidates) {
    $(sel).each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (!href) return;
      let abs = href.startsWith('http') ? href : (href.startsWith('/') ? BASE + href : BASE + '/' + href);
      // normalize
      abs = abs.split('#')[0];
      if (!chapters.find(c => c.url === abs)) chapters.push({ title: text || `Chapter ${chapters.length+1}`, url: abs });
    });
    if (chapters.length) break;
  }

  // fallback: search for links that contain '/chuong' or '/chuong-'
  if (!chapters.length) {
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && /chuong|chapter|chap/i.test(href) && href.includes('/')) {
        const abs = href.startsWith('http') ? href : (href.startsWith('/') ? BASE + href : BASE + '/' + href);
        if (!chapters.find(c => c.url === abs)) chapters.push({ title: text || `Chapter ${chapters.length+1}`, url: abs });
      }
    });
  }

  return { title, author, summary, cover, chapters };
}

async function fetchChapterContent(url) {
  try {
    const html = await fetchText(url);
    const $ = load(html);
    // try common selectors for content
    const selectors = ['#chapter-content', '.chapter-content', '.reading-content', '#noidungm', '.entry-content', '.chapter-c'];
    let content = '';
    for (const sel of selectors) {
      const t = $(sel).text().trim();
      if (t && t.length > content.length) content = t;
    }
    // if still empty, take longest text block
    if (!content) {
      let longest = '';
      $('div, p').each((i, el) => { const t = $(el).text().trim(); if (t.length > longest.length) longest = t; });
      content = longest || '';
    }
    return content;
  } catch (err) {
    console.warn('Failed to fetch chapter', url, err.message);
    return '';
  }
}

// Insert into Supabase using the same defensive title keys used elsewhere
async function insertStoryToDb(story) {
  const titleCandidates = ['title_story', 'Title_story', 'Tiltle_story', 'TitleStory'];
  // Try detected column first (detect existing column)
  try {
    const { data: sample, error: sampleErr } = await supabase.from('stories').select('*').limit(1).maybeSingle();
    let detected = null;
    if (!sampleErr && sample) {
      const keys = Object.keys(sample);
      detected = keys.find(k => /title/i.test(k) || /tilt|tilt?e/i.test(k));
    }
    if (detected) titleCandidates.unshift(detected);
  } catch (err) {
    /* ignore */
  }

  // Check for duplicate by title
  try {
    const { data: existing } = await supabase.from('stories').select('story_id').ilike('title_story', story.title).limit(1).maybeSingle();
    if (existing && existing.story_id) {
      console.log('Skipping — story with same title already exists id=', existing.story_id);
      return existing.story_id;
    }
  } catch (e) { /* ignore */ }

  let insertedId = null;
  for (const key of titleCandidates) {
    const payload = {
      [key]: story.title,
      author: story.author || 'Unknown',
      rating: 0,
      total_chapters: story.chapters.length,
      total_reads: 0,
      synopsis: story.summary || '',
      genre: story.genre || '',
      status: story.completed ? 'completed' : 'ongoing',
      tags: (story.tags || []).join(',')
    };

    const resp = await supabase.from('stories').insert(payload).select('story_id').maybeSingle();
    if (!resp.error && resp.data && resp.data.story_id) {
      insertedId = resp.data.story_id;
      console.log('Inserted story id=', insertedId, 'titleKey=', key);
      break;
    }

    // If error says column missing, try next
    const msg = String(resp.error?.message || '');
    if (resp.error && !/could not find the .* column|column .* does not exist|unknown column/i.test(msg)) {
      console.error('Insert failed:', resp.error.message || resp.error);
      throw resp.error;
    }
  }

  if (!insertedId) throw new Error('Could not insert story (no title candidate matched)');

  // Insert chapters into either table name
  const chaptersToInsert = story.chapters.map((c, idx) => ({ story_id: insertedId, chapter_number: idx + 1, chapter_title: c.title, content: c.content }));
  let chErr = null;
  for (const tbl of ['chapters', 'Chapters']) {
    const r = await supabase.from(tbl).insert(chaptersToInsert);
    if (r.error) { chErr = r.error; continue; }
    chErr = null; break;
  }
  if (chErr) throw chErr;

  return insertedId;
}

// Main: discover -> scrape -> insert
async function run() {
  console.log(`Importer: discover=${MAX_SERIES}, chaptersPerSeries=${CHAPTERS_PER_SERIES}, write=${WRITE}`);
  const list = await discoverStories(MAX_SERIES * 2); // get extras
  const stories = [];
  for (let i = 0; i < list.length && stories.length < MAX_SERIES; i++) {
    try {
      const storyMeta = await parseStoryPage(list[i]);

      // fetch chapters (limited)
      // Determine per-story chapter count: either fixed CHAPTERS_PER_SERIES or random between MIN_CHAPTERS..MAX_CHAPTERS
      const chaptersNeeded = typeof CHAPTERS_PER_SERIES === 'number' && !Number.isNaN(CHAPTERS_PER_SERIES)
        ? CHAPTERS_PER_SERIES
        : Math.floor(Math.random() * (MAX_CHAPTERS - MIN_CHAPTERS + 1)) + MIN_CHAPTERS;
      const chapterList = storyMeta.chapters.slice(0, chaptersNeeded);
      const chapters = [];
      for (let j = 0; j < chapterList.length && chapters.length < CHAPTERS_PER_SERIES; j++) {
        const ch = chapterList[j];
        await delay(800); // gentle
        const content = await fetchChapterContent(ch.url);
        chapters.push({ id: `${i}-${j}`, title: ch.title || `Chapter ${j+1}`, content });
      }

      const story = {
        title: storyMeta.title || `Untitled ${i+1}`,
        author: storyMeta.author || 'Unknown',
        summary: storyMeta.summary || '',
        coverUrl: storyMeta.cover || '',
        genre: '',
        tags: [],
        chapters,
      };

      stories.push(story);
      console.log(`Prepared story ${stories.length}/${MAX_SERIES}:`, story.title);
      await delay(900);
    } catch (err) {
      console.warn('Skipping candidate due to parse error:', list[i], err.message);
      await delay(700);
    }
  }

  console.log(`Prepared ${stories.length} stories for import`);
  if (!WRITE) {
    console.log('Dry-run mode — not writing to DB');
    console.log(JSON.stringify(stories.slice(0,3), null, 2));
    return;
  }

  // Insert stories
  for (const s of stories) {
    try {
      console.log('Inserting story:', s.title.slice(0,120));
      const id = await insertStoryToDb(s);
      console.log('Inserted story id:', id);
      await delay(400);
    } catch (err) {
      console.error('Failed to insert:', s.title, err.message || err);
    }
  }

  console.log('Import complete.');
}

// Start
run().catch(err => { console.error('Importer error', err); process.exit(1); });
