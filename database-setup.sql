-- Kary Educational Platform - Database Schema Setup
-- Este script crea todas las tablas necesarias para el proyecto Kary

-- 1. Tabla de perfiles de usuarios
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'psychopedagogue', 'admin', 'directive', 'program_coordinator')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    grade TEXT,
    admission_date DATE,
    avatar_url TEXT,
    academic_risk TEXT,
    emotional_risk TEXT,
    diagnostic_summary TEXT,
    preferred_language TEXT DEFAULT 'es',
    timezone TEXT DEFAULT 'UTC',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Asignaciones profesor-estudiante
CREATE TABLE IF NOT EXISTS teacher_student_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, student_id)
);

-- 3. Enlaces padre-estudiante
CREATE TABLE IF NOT EXISTS parent_student_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    student_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    relationship TEXT DEFAULT 'parent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_user_id, student_user_id)
);

-- 4. Mapeo psicopedagogo-estudiante
CREATE TABLE IF NOT EXISTS psychopedagogue_student_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    psychopedagogue_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    student_user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(psychopedagogue_user_id, student_user_id)
);

-- 5. Observaciones de profesores
CREATE TABLE IF NOT EXISTS teacher_observations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    observation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    situation TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Planes de apoyo
CREATE TABLE IF NOT EXISTS support_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    support_goal TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Recursos de aprendizaje
CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('video', 'document', 'exercise', 'game', 'assessment', 'other')),
    url TEXT,
    content TEXT,
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    subject TEXT,
    grade_level TEXT,
    created_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Recursos asignados
CREATE TABLE IF NOT EXISTS recursos_asignados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES learning_resources(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue')),
    notes TEXT,
    UNIQUE(student_id, resource_id)
);

-- 9. Datos de seguimiento emocional
CREATE TABLE IF NOT EXISTS tracking_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    emotional_state TEXT,
    notes TEXT,
    activity_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Evaluaciones
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    evaluator_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    evaluation_type TEXT NOT NULL,
    subject TEXT,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    comments TEXT,
    evaluation_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Citas/Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    appointment_type TEXT NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher ON teacher_student_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_student ON teacher_student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_parent_links_parent ON parent_student_links(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_links_student ON parent_student_links(student_user_id);
CREATE INDEX IF NOT EXISTS idx_psychopedagogue_mapping_psychopedagogue ON psychopedagogue_student_mapping(psychopedagogue_user_id);
CREATE INDEX IF NOT EXISTS idx_psychopedagogue_mapping_student ON psychopedagogue_student_mapping(student_user_id);
CREATE INDEX IF NOT EXISTS idx_observations_student ON teacher_observations(student_id);
CREATE INDEX IF NOT EXISTS idx_support_plans_student ON support_plans(student_id);
CREATE INDEX IF NOT EXISTS idx_tracking_data_student ON tracking_data(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Políticas RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_student_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE psychopedagogue_student_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE recursos_asignados ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS (permitir acceso a usuarios autenticados)
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teacher_observations_updated_at BEFORE UPDATE ON teacher_observations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_plans_updated_at BEFORE UPDATE ON support_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
