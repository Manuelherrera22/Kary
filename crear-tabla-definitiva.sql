-- Script DEFINITIVO para crear tabla student_activities
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Eliminar tabla completamente si existe
DROP TABLE IF EXISTS student_activities CASCADE;

-- Paso 2: Crear tabla desde cero con todas las columnas necesarias
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
    subject TEXT,
    materials TEXT,
    adaptations TEXT,
    instructions TEXT,
    assessment TEXT,
    ai_generated BOOLEAN DEFAULT false,
    generated_by TEXT,
    status TEXT DEFAULT 'assigned',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 3: Verificar que se creó correctamente
SELECT 'Tabla student_activities creada exitosamente' as resultado;

-- Paso 4: Verificar que activity_id existe
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

-- Paso 5: Mostrar todas las columnas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;

-- Paso 6: Insertar un registro de prueba
INSERT INTO student_activities (
    activity_id,
    student_id,
    teacher_id,
    title,
    description,
    objective,
    duration,
    difficulty,
    priority,
    subject,
    materials,
    adaptations,
    instructions,
    assessment,
    ai_generated,
    generated_by,
    status
) VALUES (
    gen_random_uuid(),
    gen_random_uuid(),
    gen_random_uuid(),
    'Actividad de Prueba',
    'Esta es una actividad de prueba para verificar que la tabla funciona',
    'Objetivo de prueba',
    30,
    'Intermedio',
    'Media',
    'Matemáticas',
    'Material de prueba',
    'Adaptación de prueba',
    'Instrucción de prueba',
    'Evaluación de prueba',
    true,
    'Sistema de Prueba',
    'assigned'
);

-- Paso 7: Verificar que se insertó correctamente
SELECT 'Registro de prueba insertado exitosamente' as resultado;
SELECT COUNT(*) as total_registros FROM student_activities;
