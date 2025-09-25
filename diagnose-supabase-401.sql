-- 🔍 DIAGNÓSTICO COMPLETO DEL ERROR 401 EN SUPABASE
-- Este script ayuda a identificar la causa real del problema

-- 1. Verificar que las tablas existen
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN ('survey_responses', 'survey_statistics')
ORDER BY tablename;

-- 2. Verificar políticas actuales
SELECT 
    schemaname||'.'||tablename as table_name,
    policyname as policy_name,
    cmd as policy_command,
    roles as policy_roles,
    qual as policy_condition,
    with_check as policy_check
FROM pg_policies 
WHERE tablename IN ('survey_responses', 'survey_statistics')
ORDER BY tablename, policyname;

-- 3. Verificar permisos de la clave anónima
SELECT 
    current_user as current_user,
    session_user as session_user,
    current_database() as current_database;

-- 4. Verificar configuración de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    forcerowsecurity as force_rls
FROM pg_tables 
WHERE tablename IN ('survey_responses', 'survey_statistics');

-- 5. Probar inserción directa (esto debería funcionar)
INSERT INTO public.survey_responses (
    user_role,
    age_range,
    tech_experience,
    institution_type,
    usability_rating,
    functionality_rating,
    design_rating,
    performance_rating,
    support_rating,
    recommendation,
    session_id,
    is_anonymous
) VALUES (
    'student',
    '18-25',
    'intermediate',
    'public-school',
    4,
    4,
    5,
    4,
    3,
    'probably',
    'diagnostic_test_' || extract(epoch from now()),
    true
);

-- 6. Verificar que se insertó
SELECT 
    id,
    user_role,
    session_id,
    created_at,
    is_anonymous
FROM public.survey_responses 
WHERE session_id LIKE 'diagnostic_test_%' 
ORDER BY created_at DESC 
LIMIT 1;

-- 7. Verificar estadísticas
SELECT 
    total_responses,
    student_count,
    teacher_count,
    last_updated
FROM public.survey_statistics 
ORDER BY last_updated DESC 
LIMIT 1;

-- 8. Limpiar datos de prueba
DELETE FROM public.survey_responses WHERE session_id LIKE 'diagnostic_test_%';

-- 9. Verificar configuración de Supabase
SELECT 
    'Supabase Configuration Check' as check_type,
    'Anon key should be configured' as requirement,
    'Check Settings > API in Supabase dashboard' as action;
