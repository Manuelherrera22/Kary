-- Script simple para eliminar políticas RLS problemáticas
-- Ejecutar en Supabase SQL Editor

-- Eliminar todas las políticas RLS de student_activities
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

-- Deshabilitar RLS temporalmente
ALTER TABLE student_activities DISABLE ROW LEVEL SECURITY;

-- Verificar que se eliminaron las políticas
SELECT 'Políticas RLS eliminadas exitosamente' as resultado;

-- Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
