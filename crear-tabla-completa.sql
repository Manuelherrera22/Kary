-- Script para crear tabla student_activities con TODAS las columnas que necesita el servicio
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Eliminar tabla completamente si existe
DROP TABLE IF EXISTS student_activities CASCADE;

-- Paso 2: Crear tabla con TODAS las columnas que necesita el servicio
CREATE TABLE student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id UUID NOT NULL,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    plan_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    duration INTEGER,
    difficulty TEXT,
    priority TEXT,
    category TEXT,                    -- Faltaba en scripts anteriores
    subject TEXT,
    grade_level TEXT,                 -- Faltaba en scripts anteriores
    materials TEXT,                   -- Cambiado de TEXT[] a TEXT
    adaptations TEXT,
    instructions TEXT,
    assessment TEXT,
    learning_style TEXT,              -- Faltaba en scripts anteriores
    cognitive_domain TEXT,            -- Faltaba en scripts anteriores
    ai_generated BOOLEAN DEFAULT false,
    generated_by TEXT,
    based_on_plan TEXT,              -- Faltaba en scripts anteriores
    based_on_recommendations JSONB,  -- Faltaba en scripts anteriores
    status TEXT DEFAULT 'assigned',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 3: Verificar que se creó correctamente
SELECT 'Tabla student_activities creada con TODAS las columnas necesarias' as resultado;

-- Paso 4: Verificar que todas las columnas existen
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;

-- Paso 5: Contar total de columnas
SELECT COUNT(*) as total_columnas 
FROM information_schema.columns 
WHERE table_name = 'student_activities';

-- Paso 6: Verificar columnas específicas que faltaban
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
