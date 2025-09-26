-- Script simplificado para crear tabla student_activities
-- Ejecutar paso a paso para evitar errores

-- Paso 1: Crear la tabla básica primero
CREATE TABLE IF NOT EXISTS student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id UUID NOT NULL,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    plan_id UUID, -- Hacer opcional inicialmente
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    duration INTEGER,
    difficulty TEXT,
    priority TEXT,
    category TEXT,
    subject TEXT,
    grade_level TEXT,
    materials TEXT[],
    adaptations TEXT,
    instructions TEXT,
    assessment TEXT,
    learning_style TEXT,
    cognitive_domain TEXT,
    ai_generated BOOLEAN DEFAULT false,
    generated_by TEXT,
    based_on_plan TEXT,
    based_on_recommendations JSONB,
    status TEXT DEFAULT 'assigned',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 2: Verificar que la tabla se creó
SELECT 'Tabla student_activities creada exitosamente' as resultado;

-- Paso 3: Ver las columnas de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
