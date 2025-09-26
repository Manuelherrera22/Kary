-- Verificar estructura de la tabla student_activities existente
-- Ejecutar en Supabase SQL Editor

-- Ver todas las columnas de la tabla
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;

-- Verificar que plan_id existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'student_activities' 
            AND column_name = 'plan_id'
        ) 
        THEN '✅ La columna plan_id EXISTE'
        ELSE '❌ La columna plan_id NO EXISTE'
    END as plan_id_status;

-- Contar total de columnas
SELECT COUNT(*) as total_columnas 
FROM information_schema.columns 
WHERE table_name = 'student_activities';
