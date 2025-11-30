import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jybokwtczjztqjdwmoww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Ym9rd3Rjemp6dHFqZHdtb3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk5MjgsImV4cCI6MjA3OTg4NTkyOH0.MUSJtEhhZfjyyVMPI1Jdtrvx7dk_Y84xxBrGG0KGua4';

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  // fetch all rows from both table candidates and compute counts locally
  const { data: rows1, error: err1 } = await supabase.from('Chapters').select('story_id, chapter_id');
  if (err1) console.warn('Could not read Chapters table:', err1.message || err1);
  const { data: rows2, error: err2 } = await supabase.from('chapters').select('story_id, chapter_id');
  if (err2) console.warn('Could not read chapters table:', err2.message || err2);

  const all = [...(rows1 || []), ...(rows2 || [])];
  const counts = {};
  for (const r of all) {
    const sid = r.story_id;
    counts[sid] = (counts[sid] || 0) + 1;
  }
  // print counts for story ids 19..48
  // Print counts for story ids 19..48, show zero for missing
  console.log('Chapters counts for story ids 19..48:');
  for (let id = 19; id <= 48; id++) {
    console.log(id, counts[id] || 0);
  }
})();
