import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jybokwtczjztqjdwmoww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Ym9rd3Rjemp6dHFqZHdtb3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk5MjgsImV4cCI6MjA3OTg4NTkyOH0.MUSJtEhhZfjyyVMPI1Jdtrvx7dk_Y84xxBrGG0KGua4';

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    console.log('Fetching stories...');
    const { data: stories, error: sErr } = await supabase.from('stories').select('*').limit(5);
    if (sErr) {
      console.error('Stories error:', sErr);
    } else {
      console.log('Stories:', stories);
    }

    console.log('\nFetching chapters using candidates...');
    for (const tbl of ['chapters','Chapters']) {
      const { data: ch, error: chErr } = await supabase.from(tbl).select('*').limit(5);
      if (chErr) {
        console.error(`Table ${tbl} error:`, chErr);
      } else {
        console.log(`Table ${tbl} rows:`, ch);
      }
    }

    // Attempt a safe test insert and cleanup (to verify write permissions)
    console.log('\nAttempting a test insert (will delete afterwards)');
    const candidates = ['title_story','Title_story','Tiltle_story','TitleStory'];
    let inserted = false;
    for (const key of candidates) {
      const payload = { [key]: 'Test insert from script ' + Date.now(), author: 'script-test', rating: 0, total_chapters: 1, total_reads: 0, synopsis: 'temporary test' };
      const { data: insertData, error: insertErr } = await supabase.from('stories').insert(payload).select('story_id').maybeSingle();
      if (insertErr) {
        console.error(`Insert with ${key} failed:`, insertErr.message || insertErr);
        // continue to next key if missing-column error
        const msg = String(insertErr?.message || '');
        if (!/could not find the .* column|column .* does not exist|unknown column/i.test(msg)) {
          // stop on non-schema error
          break;
        }
        continue;
      }

      console.log(`Insert succeeded with ${key}:`, insertData);
      inserted = true;
      const id = insertData?.story_id;
      if (id) {
        const { error: delErr } = await supabase.from('stories').delete().eq('story_id', id);
        if (delErr) console.error('Cleanup delete failed:', delErr);
        else console.log('Cleanup: deleted test story', id);
      }
      break;
    }
    if (!inserted) console.log('No candidate key succeeded for insert.');
  } catch (err) {
    console.error('Unexpected error:', err);
  }
})();
