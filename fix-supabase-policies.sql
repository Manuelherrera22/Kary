-- 🔧 CORRECCIÓN DE POLÍTICAS SUPABASE PARA ENCUESTAS
-- Este script corrige las políticas RLS que están causando el error 401

-- 1. Eliminar políticas existentes que pueden estar causando conflictos
DROP POLICY IF EXISTS "Allow anonymous survey submissions" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow admin read access" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow read access to statistics" ON public.survey_statistics;

-- 2. Crear políticas corregidas para survey_responses
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

-- 3. Crear políticas para survey_statistics
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

-- 4. Verificar que RLS esté habilitado
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_statistics ENABLE ROW LEVEL SECURITY;

-- 5. Crear función para verificar políticas (opcional - para debugging)
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
        schemaname||'.'||tablename as table_name,
        policyname as policy_name,
        cmd as policy_command,
        roles as policy_roles
    FROM pg_policies 
    WHERE tablename IN ('survey_responses', 'survey_statistics')
    ORDER BY tablename, policyname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Comentarios explicativos
COMMENT ON POLICY "Enable insert for anonymous users" ON public.survey_responses IS 
'Permite que usuarios anónimos inserten respuestas de encuestas';

COMMENT ON POLICY "Enable read access for admins only" ON public.survey_responses IS 
'Solo administradores pueden leer respuestas individuales';

COMMENT ON POLICY "Enable read access for all users" ON public.survey_statistics IS 
'Todos los usuarios pueden leer estadísticas agregadas';

-- 7. Verificar configuración
SELECT 'Políticas aplicadas correctamente' as status;

-- 8. Mostrar políticas creadas
SELECT * FROM check_survey_policies();
