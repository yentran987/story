
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jybokwtczjztqjdwmoww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5Ym9rd3Rjemp6dHFqZHdtb3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDk5MjgsImV4cCI6MjA3OTg4NTkyOH0.MUSJtEhhZfjyyVMPI1Jdtrvx7dk_Y84xxBrGG0KGua4';

export const supabase = createClient(supabaseUrl, supabaseKey);
