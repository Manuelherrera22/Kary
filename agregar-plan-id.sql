-- Agregar columna plan_id si no existe
-- Ejecutar en Supabase SQL Editor

-- Verificar si plan_id existe
DO $$
BEGIN
    -- Verificar si la columna plan_id existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'plan_id'
    ) THEN
        -- Agregar la columna plan_id
        ALTER TABLE student_activities 
        ADD COLUMN plan_id UUID;
        
        RAISE NOTICE '✅ Columna plan_id agregada exitosamente';
    ELSE
        RAISE NOTICE '✅ La columna plan_id ya existe';
    END IF;
END $$;

-- Verificar resultado
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'student_activities' 
            AND column_name = 'plan_id'
        ) 
        THEN '✅ plan_id está disponible'
        ELSE '❌ plan_id no está disponible'
    END as resultado;
