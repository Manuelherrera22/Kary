-- Script simple para agregar columnas esenciales faltantes
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas esenciales que faltan
ALTER TABLE student_activities 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS plan_id UUID,
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generated_by TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'assigned';

-- Verificar que se agregaron
SELECT 'Columnas agregadas exitosamente' as resultado;

-- Mostrar todas las columnas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
