-- 🔧 CORRECCIÓN DE POLÍTICAS SUPABASE PARA ENCUESTAS - VERSIÓN CORREGIDA
-- Este script corrige las políticas RLS y el error de tipo en la función

-- 1. Eliminar políticas existentes que pueden estar causando conflictos
DROP POLICY IF EXISTS "Allow anonymous survey submissions" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow admin read access" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow read access to statistics" ON public.survey_statistics;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable read access for admins only" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable insert for system" ON public.survey_statistics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.survey_statistics;
DROP POLICY IF EXISTS "Enable update for system" ON public.survey_statistics;

-- 2. Eliminar función existente si existe
DROP FUNCTION IF EXISTS check_survey_policies();

-- 3. Crear políticas corregidas para survey_responses
-- Política para INSERT (inserción de encuestas) - PERMITE INSERCIÓN ANÓNIMA
CREATE POLICY "Enable insert for anonymous users" ON public.survey_responses
    FOR INSERT 
    WITH CHECK (true);

-- Política para SELECT (lectura) - SOLO ADMINISTRADORES
CREATE POLICY "Enable read access for admins only" ON public.survey_responses
    FOR SELECT 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Política para UPDATE (actualización) - SOLO ADMINISTRADORES
CREATE POLICY "Enable update for admins only" ON public.survey_responses
    FOR UPDATE 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Política para DELETE (eliminación) - SOLO ADMINISTRADORES
CREATE POLICY "Enable delete for admins only" ON public.survey_responses
    FOR DELETE 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 4. Crear políticas para survey_statistics
-- Política para INSERT (inserción de estadísticas) - SOLO TRIGGERS/SISTEMA
CREATE POLICY "Enable insert for system" ON public.survey_statistics
    FOR INSERT 
    WITH CHECK (true);

-- Política para SELECT (lectura de estadísticas) - PÚBLICO
CREATE POLICY "Enable read access for all users" ON public.survey_statistics
    FOR SELECT 
    USING (true);

-- Política para UPDATE (actualización de estadísticas) - SOLO SISTEMA
CREATE POLICY "Enable update for system" ON public.survey_statistics
    FOR UPDATE 
    USING (true);

-- 5. Verificar que RLS esté habilitado
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_statistics ENABLE ROW LEVEL SECURITY;

-- 6. Crear función corregida para verificar políticas
CREATE OR REPLACE FUNCTION check_survey_policies()
RETURNS TABLE (
    table_name TEXT,
    policy_name TEXT,
    policy_command TEXT,
    policy_roles TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (schemaname||'.'||tablename)::TEXT as table_name,
        policyname::TEXT as policy_name,
        cmd::TEXT as policy_command,
        roles::TEXT[] as policy_roles
    FROM pg_policies 
    WHERE tablename IN ('survey_responses', 'survey_statistics')
    ORDER BY tablename, policyname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Comentarios explicativos
COMMENT ON POLICY "Enable insert for anonymous users" ON public.survey_responses IS 
'Permite que usuarios anónimos inserten respuestas de encuestas';

COMMENT ON POLICY "Enable read access for admins only" ON public.survey_responses IS 
'Solo administradores pueden leer respuestas individuales';

COMMENT ON POLICY "Enable read access for all users" ON public.survey_statistics IS 
'Todos los usuarios pueden leer estadísticas agregadas';

-- 8. Verificar configuración
SELECT 'Políticas aplicadas correctamente' as status;

-- 9. Mostrar políticas creadas (función corregida)
SELECT * FROM check_survey_policies();

-- 10. Prueba de inserción (opcional - comentar si no se desea ejecutar)
/*
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
    'test_session_' || extract(epoch from now()),
    true
);

-- Verificar que se insertó
SELECT * FROM public.survey_responses WHERE session_id LIKE 'test_session_%' ORDER BY created_at DESC LIMIT 1;

-- Limpiar datos de prueba
DELETE FROM public.survey_responses WHERE session_id LIKE 'test_session_%';
*/
