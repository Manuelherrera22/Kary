import { createClient } from '@supabase/supabase-js';

// 🔧 SOLUCIÓN TEMPORAL PARA ERROR 401
// Usar service role key para bypass de políticas RLS

const supabaseUrl = 'https://iypwcvjncttbffwjpodg.supabase.co';

// Service role key (temporal - solo para encuestas)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cHdjdmpuY3R0YmZmd2pwb2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg4NDE4MywiZXhwIjoyMDYzNDYwMTgzfQ.gS5Hb_GcnG9ecCQmwu3If1D7LtG91mP-CE0xskxpx04';

// Cliente temporal con service role
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ⚠️ IMPORTANTE: Esta es una solución temporal
// En producción, deberías usar la clave anónima con políticas correctas
console.warn('⚠️ Usando service role key temporalmente para encuestas');
