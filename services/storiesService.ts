import { supabase } from './supabase';
import type { Story, Chapter } from '../types';

type DbStoryRow = {
  story_id: number | null;
  // columns may vary; be defensive about title capitalization/typos
  [key: string]: any;
  author?: string | null;
  rating?: number | null;
  total_chapters?: number | null;
  total_reads?: number | null;
  synopsis?: string | null;
  genre?: string | null;
  status?: string | null;
  tags?: string | null; // stored as comma-separated text
};

const mapRowToStory = (row: DbStoryRow): Story => {
  const title = findTitle(row) || '';
  return {
    id: String(row.story_id ?? ''),
    title,
    author: row.author ?? 'Unknown',
    coverUrl: `https://picsum.photos/300/450?seed=${row.story_id ?? Math.random()}`,
    genre: row.genre ?? 'General',
    tags: (row.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    summary: row.synopsis ?? '',
    rating: Number(row.rating ?? 0),
    views: Number(row.total_reads ?? 0),
    chapters: [],
    completed: (row.status ?? '').toLowerCase() === 'completed',
  } as Story;
};
const findTitle = (row: DbStoryRow) => {
  // attempt to find a property that contains "title" (case-insensitive) or common typos
  const keys = Object.keys(row);
  const titleKey = keys.find(k => /title/i.test(k)) || keys.find(k => /tilt|tilt?e/i.test(k)) || 'title_story';
  return String(row[titleKey] ?? '');
};

export const storiesService = {
  async detectTitleColumn(): Promise<string | null> {
    // try to read one row and inspect keys to detect a title-like column
    const { data, error } = await supabase.from('stories').select('*').limit(1).maybeSingle();
    if (error || !data) return null;
    const keys = Object.keys(data as Record<string, any>);
    const found = keys.find(k => /title/i.test(k)) || keys.find(k => /tilt|tilt?e/i.test(k));
    return found ?? null;
  },
  async listStories(): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('*');

    if (error) throw error;
    return (data || []).map(mapRowToStory);
  },

  async getStory(storyId: string | number): Promise<Story | null> {
    const idNum = Number(storyId);

    const { data: rows, error } = await supabase
      .from('stories')
      .select('*')
      .eq('story_id', idNum)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!rows) return null;

    const story = mapRowToStory(rows);

    // fetch chapters (ordered by chapter_number)
    // Some Supabase setups use capitalized table names (e.g., 'Chapters') or lowercase. Try both.
    let chapters: any[] | null = null;
    let chErr: any = null;
    const chapterTableCandidates = ['chapters', 'Chapters'];
    for (const t of chapterTableCandidates) {
      const resp = await supabase.from(t).select('chapter_id, chapter_number, chapter_title, content, created_at, release_date').eq('story_id', idNum).order('chapter_number', { ascending: true });
      if (resp.error) {
        // if table not found try next
        chErr = resp.error;
        continue;
      }
      chapters = resp.data as any[];
      chErr = null;
      break;
    }

    if (chErr) throw chErr;

    story.chapters = (chapters || []).map((c: any) => ({
      id: String(c.chapter_id ?? c.chapter_number ?? Math.random()),
      title: c.chapter_title ?? `Chapter ${c.chapter_number}`,
      content: c.content ?? ''
    } as Chapter));

    return story;
  },

  async createStory(story: Story) {
    // insert into stories table - rely on DB auto PK
    const tags = (story.tags || []).join(',');
    // Try to detect which title-like column exists so we don't send unknown column names
    const detected = await this.detectTitleColumn();
    const titleCandidates = detected ? [detected] : ['title_story', 'Title_story', 'Tiltle_story', 'TitleStory'];
    let data: any = null;
    let error: any = null;

    for (const titleKey of titleCandidates) {
      const payload: any = {
        [titleKey]: story.title,
        author: story.author,
        rating: story.rating || 0,
        total_chapters: story.chapters?.length ?? 0,
        total_reads: story.views || 0,
        synopsis: story.summary ?? '',
        genre: story.genre ?? '',
        status: story.completed ? 'completed' : 'draft',
        tags
      };

      const resp = await supabase.from('stories').insert(payload).select('story_id').maybeSingle();
      data = resp.data;
      error = resp.error;

      if (!error) {
        // success
        break;
      }

      // if the error explicitly complains about missing column, try next candidate
      const msg = String(error?.message || '');
      if (!/could not find the .* column|column .* does not exist|unknown column/i.test(msg)) {
        // some other error (permission, validation) - stop trying further
        break;
      }
    }

    if (error) throw error;

    const createdId = data?.story_id;

    // insert chapters
    if (createdId && story.chapters && story.chapters.length) {
      const toInsert = story.chapters.map((c, idx) => ({
        story_id: createdId,
        chapter_number: idx + 1,
        chapter_title: c.title,
        content: c.content
      }));
      // Insert into chapters table; try both candidate names.
      let chError: any = null;
      for (const t of ['chapters','Chapters']) {
        const resp = await supabase.from(t).insert(toInsert);
        if (resp.error) {
          chError = resp.error;
          continue;
        }
        chError = null;
        break;
      }
      if (chError) throw chError;
    }

    return String(createdId);
  },

  async updateStory(story: Story) {
    const idNum = Number(story.id);
    if (!idNum) throw new Error('Invalid story id');

    const tags = (story.tags || []).join(',');
    // When updating, try writing title to the correct title column; avoid sending columns that don't exist.
    const titleCandidates = ['title_story', 'Title_story', 'Tiltle_story', 'TitleStory'];
    let error: any = null;

    // detect for update too
    const detectedForUpdate = await this.detectTitleColumn();
    const updateCandidates = detectedForUpdate ? [detectedForUpdate] : titleCandidates;

    for (const titleKey of updateCandidates) {
      const payload: any = {
        [titleKey]: story.title,
        author: story.author,
        rating: story.rating || 0,
        total_chapters: story.chapters?.length ?? 0,
        total_reads: story.views || 0,
        synopsis: story.summary ?? '',
        genre: story.genre ?? '',
        status: story.completed ? 'completed' : 'draft',
        tags
      };

      const resp = await supabase.from('stories').update(payload).eq('story_id', idNum);
      error = resp.error;
      if (!error) break;

      const msg = String(error?.message || '');
      if (!/could not find the .* column|column .* does not exist|unknown column/i.test(msg)) {
        // propagate non-column errors immediately
        break;
      }
    }

    if (error) throw error;

    // For simplicity: delete existing chapters for the story and re-insert to keep numbering in sync
    // delete existing chapters, try both table naming variants
    let delErr: any = null;
    for (const t of ['chapters','Chapters']) {
      const resp = await supabase.from(t).delete().eq('story_id', idNum);
      if (resp.error) { delErr = resp.error; continue; }
      delErr = null; break;
    }
    if (delErr) throw delErr;

    if (story.chapters && story.chapters.length) {
      const toInsert = story.chapters.map((c, idx) => ({
        story_id: idNum,
        chapter_number: idx + 1,
        chapter_title: c.title,
        content: c.content
      }));
      // Try to insert to either case variant of the chapters table
      let chErr2: any = null;
      for (const t of ['chapters','Chapters']) {
        const resp = await supabase.from(t).insert(toInsert);
        if (resp.error) { chErr2 = resp.error; continue; }
        chErr2 = null; break;
      }
      if (chErr2) throw chErr2;
    }

    return true;
  },

  async deleteStory(storyId: string | number) {
    const idNum = Number(storyId);
    // delete chapters first
    let chErr: any = null;
    for (const t of ['chapters','Chapters']) {
      const resp = await supabase.from(t).delete().eq('story_id', idNum);
      if (resp.error) { chErr = resp.error; continue; }
      chErr = null; break;
    }
    if (chErr) throw chErr;

    const { error } = await supabase.from('stories').delete().eq('story_id', idNum);
    if (error) throw error;

    return true;
  }
};

export default storiesService;
