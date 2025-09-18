-- Script para crear las tablas faltantes que están causando errores
-- Este script crea las tablas que el código está intentando usar

-- 1. Tabla student_activities (actividades de estudiantes)
CREATE TABLE IF NOT EXISTS student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    support_plan_id UUID REFERENCES support_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT DEFAULT 'assignment' CHECK (activity_type IN ('assignment', 'exercise', 'assessment', 'project', 'other')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent_to_student', 'in_progress', 'completed', 'overdue', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    instructions TEXT,
    resources TEXT[], -- Array de URLs o referencias a recursos
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear vista 'students' como alias de user_profiles para estudiantes
CREATE OR REPLACE VIEW students AS
SELECT 
    id,
    full_name,
    email,
    role,
    status,
    grade,
    admission_date,
    avatar_url,
    academic_risk,
    emotional_risk,
    diagnostic_summary,
    preferred_language,
    timezone,
    notifications_enabled,
    created_at,
    updated_at
FROM user_profiles 
WHERE role = 'student';

-- 3. Agregar columnas faltantes a support_plans si no existen
DO $$ 
BEGIN
    -- Agregar columnas que pueden estar faltando en support_plans
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'plan_json') THEN
        ALTER TABLE support_plans ADD COLUMN plan_json JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'support_strategy') THEN
        ALTER TABLE support_plans ADD COLUMN support_strategy TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'type') THEN
        ALTER TABLE support_plans ADD COLUMN type TEXT DEFAULT 'emotional';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'assigned') THEN
        ALTER TABLE support_plans ADD COLUMN assigned BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'assigned_at') THEN
        ALTER TABLE support_plans ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'responsible_person') THEN
        ALTER TABLE support_plans ADD COLUMN responsible_person UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Crear índices para las nuevas tablas
CREATE INDEX IF NOT EXISTS idx_student_activities_student ON student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_teacher ON student_activities(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_support_plan ON student_activities(support_plan_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_status ON student_activities(status);
CREATE INDEX IF NOT EXISTS idx_student_activities_due_date ON student_activities(due_date);

-- 5. Habilitar RLS en las nuevas tablas
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas RLS básicas para student_activities
CREATE POLICY "Users can view their own activities" ON student_activities 
    FOR SELECT USING (
        auth.uid() = student_id OR 
        auth.uid() = teacher_id OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'psychopedagogue', 'program_coordinator', 'directive')
        )
    );

CREATE POLICY "Teachers can insert activities for their students" ON student_activities 
    FOR INSERT WITH CHECK (
        auth.uid() = teacher_id AND
        EXISTS (
            SELECT 1 FROM teacher_student_assignments 
            WHERE teacher_id = auth.uid() AND student_id = student_activities.student_id
        )
    );

CREATE POLICY "Teachers can update their activities" ON student_activities 
    FOR UPDATE USING (auth.uid() = teacher_id);

-- 7. Crear trigger para updated_at en student_activities
CREATE TRIGGER update_student_activities_updated_at 
    BEFORE UPDATE ON student_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Agregar restricciones CHECK a support_plans
DO $$ 
BEGIN
    -- Agregar restricciones CHECK a support_plans
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'support_plans_type_check') THEN
        ALTER TABLE support_plans ADD CONSTRAINT support_plans_type_check CHECK (type IN ('emotional', 'academic', 'behavioral', 'social', 'other'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'support_plans_status_check') THEN
        ALTER TABLE support_plans ADD CONSTRAINT support_plans_status_check CHECK (status IN ('active', 'completed', 'paused', 'cancelled'));
    END IF;
END $$;

-- 9. Crear función para obtener estudiantes de un profesor
CREATE OR REPLACE FUNCTION get_teacher_students(teacher_uuid UUID)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    grade TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id,
        up.full_name,
        up.email,
        up.grade,
        up.status
    FROM user_profiles up
    INNER JOIN teacher_student_assignments tsa ON up.id = tsa.student_id
    WHERE tsa.teacher_id = teacher_uuid
    AND up.role = 'student'
    AND up.status = 'active'
    ORDER BY up.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Crear función para obtener actividades de un estudiante
CREATE OR REPLACE FUNCTION get_student_activities(student_uuid UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    activity_type TEXT,
    status TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    teacher_name TEXT,
    support_goal TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sa.id,
        sa.title,
        sa.description,
        sa.activity_type,
        sa.status,
        sa.due_date,
        sa.completed_at,
        up.full_name as teacher_name,
        sp.support_goal
    FROM student_activities sa
    LEFT JOIN user_profiles up ON sa.teacher_id = up.id
    LEFT JOIN support_plans sp ON sa.support_plan_id = sp.id
    WHERE sa.student_id = student_uuid
    ORDER BY sa.due_date ASC NULLS LAST, sa.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensaje de confirmación
SELECT 'Missing tables created successfully!' as status;
