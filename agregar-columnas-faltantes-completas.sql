-- Script para agregar solo las columnas que faltan
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas que faltan
ALTER TABLE student_activities 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS learning_style TEXT,
ADD COLUMN IF NOT EXISTS cognitive_domain TEXT,
ADD COLUMN IF NOT EXISTS based_on_plan TEXT,
ADD COLUMN IF NOT EXISTS based_on_recommendations JSONB;

-- Verificar que se agregaron
SELECT 'Columnas faltantes agregadas exitosamente' as resultado;

-- Verificar que todas las columnas existen
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_activities' AND column_name = 'category') 
        THEN '✅ category existe'
        ELSE '❌ category NO existe'
    END as category_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_activities' AND column_name = 'grade_level') 
        THEN '✅ grade_level existe'
        ELSE '❌ grade_level NO existe'
    END as grade_level_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_activities' AND column_name = 'learning_style') 
        THEN '✅ learning_style existe'
        ELSE '❌ learning_style NO existe'
    END as learning_style_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_activities' AND column_name = 'cognitive_domain') 
        THEN '✅ cognitive_domain existe'
        ELSE '❌ cognitive_domain NO existe'
    END as cognitive_domain_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_activities' AND column_name = 'based_on_plan') 
        THEN '✅ based_on_plan existe'
        ELSE '❌ based_on_plan NO existe'
    END as based_on_plan_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_activities' AND column_name = 'based_on_recommendations') 
        THEN '✅ based_on_recommendations existe'
        ELSE '❌ based_on_recommendations NO existe'
    END as based_on_recommendations_status;

-- Mostrar todas las columnas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
