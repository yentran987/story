import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jybokwtczjztqjdwmoww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Ym9rd3Rjemp6dHFqZHdtb3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk5MjgsImV4cCI6MjA3OTg4NTkyOH0.MUSJtEhhZfjyyVMPI1Jdtrvx7dk_Y84xxBrGG0KGua4';

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { data, error } = await supabase.from('stories').select('*').order('story_id', { ascending: false }).limit(100);
  if (error) {
    console.error('Error listing stories', error);
    process.exit(1);
  }
  console.log('Latest stories (top 100):', data.map(d => ({ story_id: d.story_id, title: (d.Tiltle_story ?? d.title_story ?? d.Title_story) || 'N/A', total_chapters: d.total_chapters })));
})();
