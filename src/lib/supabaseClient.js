import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iypwcvjncttbffwjpodg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cHdjdmpuY3R0YmZmd2pwb2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODQxODMsImV4cCI6MjA2MzQ2MDE4M30.tE5qBjeNjdIOdLT3x5nj3SMJmhq0igJG7AcJdBP0S6o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);