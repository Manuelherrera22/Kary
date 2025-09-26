-- Script para limpiar y recrear tabla student_activities completamente
-- Ejecutar en Supabase SQL Editor

-- Paso 1: Eliminar todas las políticas RLS problemáticas
DROP POLICY IF EXISTS "Admins can delete activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Psychopedagogues can view activities from their plans" ON student_activities;
DROP POLICY IF EXISTS "Teachers can view their own activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Teachers can insert their own activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Teachers can update their own activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Teachers can delete their own activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Students can view their assigned activities" ON student_activities;
DROP POLICY IF EXISTS "Students can update their activity status" ON student_activities;
DROP POLICY IF EXISTS "Admins can view all activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Admins can insert activity assignments" ON student_activities;
DROP POLICY IF EXISTS "Admins can update activity assignments" ON student_activities;

-- Paso 2: Deshabilitar RLS temporalmente
ALTER TABLE student_activities DISABLE ROW LEVEL SECURITY;

-- Paso 3: Eliminar la tabla completamente
DROP TABLE IF EXISTS student_activities CASCADE;

-- Paso 4: Crear la tabla nueva y limpia
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

-- Paso 5: Verificar que se creó correctamente
SELECT 'Tabla student_activities recreada exitosamente' as resultado;

-- Paso 6: Mostrar todas las columnas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
