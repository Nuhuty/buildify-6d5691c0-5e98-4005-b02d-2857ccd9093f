
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://awonvjfsdaautmfjllaq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b252amZzZGFhdXRtZmpsbGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NDEzMzcsImV4cCI6MjA2MzAxNzMzN30.yUY5hKojcypBuJze0BU3Xb3OaDu_3hGv6UZ3dO2ZTmg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);