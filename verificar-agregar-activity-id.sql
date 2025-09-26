-- Script simple para verificar y agregar activity_id
-- Ejecutar en Supabase SQL Editor

-- Verificar si la tabla existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'student_activities') 
        THEN '✅ La tabla student_activities EXISTE'
        ELSE '❌ La tabla student_activities NO EXISTE'
    END as tabla_status;

-- Verificar si activity_id existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'student_activities' 
            AND column_name = 'activity_id'
        ) 
        THEN '✅ La columna activity_id EXISTE'
        ELSE '❌ La columna activity_id NO EXISTE'
    END as activity_id_status;

-- Si activity_id no existe, agregarlo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'activity_id'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN activity_id UUID NOT NULL DEFAULT gen_random_uuid();
        
        RAISE NOTICE '✅ Columna activity_id agregada exitosamente';
    ELSE
        RAISE NOTICE '✅ La columna activity_id ya existe';
    END IF;
END $$;

-- Verificar resultado final
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'student_activities' 
            AND column_name = 'activity_id'
        ) 
        THEN '✅ activity_id está disponible'
        ELSE '❌ activity_id no está disponible'
    END as resultado_final;
