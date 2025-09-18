-- Script seguro para corregir columnas faltantes sin errores de NOT NULL
-- Este script agrega las columnas de forma segura, manejando datos existentes

-- Verificar y agregar columnas faltantes en user_profiles
DO $$ 
BEGIN
    -- Agregar columnas que pueden estar faltando en user_profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'academic_risk') THEN
        ALTER TABLE user_profiles ADD COLUMN academic_risk TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'emotional_risk') THEN
        ALTER TABLE user_profiles ADD COLUMN emotional_risk TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'diagnostic_summary') THEN
        ALTER TABLE user_profiles ADD COLUMN diagnostic_summary TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'preferred_language') THEN
        ALTER TABLE user_profiles ADD COLUMN preferred_language TEXT DEFAULT 'es';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'timezone') THEN
        ALTER TABLE user_profiles ADD COLUMN timezone TEXT DEFAULT 'UTC';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'notifications_enabled') THEN
        ALTER TABLE user_profiles ADD COLUMN notifications_enabled BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE user_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en teacher_observations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_observations' AND column_name = 'context') THEN
        ALTER TABLE teacher_observations ADD COLUMN context TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_observations' AND column_name = 'updated_at') THEN
        ALTER TABLE teacher_observations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en support_plans
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'description') THEN
        ALTER TABLE support_plans ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'priority') THEN
        ALTER TABLE support_plans ADD COLUMN priority TEXT DEFAULT 'medium';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'support_plans' AND column_name = 'updated_at') THEN
        ALTER TABLE support_plans ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en learning_resources
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_resources' AND column_name = 'difficulty_level') THEN
        ALTER TABLE learning_resources ADD COLUMN difficulty_level TEXT DEFAULT 'beginner';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_resources' AND column_name = 'subject') THEN
        ALTER TABLE learning_resources ADD COLUMN subject TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_resources' AND column_name = 'grade_level') THEN
        ALTER TABLE learning_resources ADD COLUMN grade_level TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_resources' AND column_name = 'created_by') THEN
        ALTER TABLE learning_resources ADD COLUMN created_by UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_resources' AND column_name = 'is_public') THEN
        ALTER TABLE learning_resources ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_resources' AND column_name = 'updated_at') THEN
        ALTER TABLE learning_resources ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en recursos_asignados
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recursos_asignados' AND column_name = 'due_date') THEN
        ALTER TABLE recursos_asignados ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recursos_asignados' AND column_name = 'status') THEN
        ALTER TABLE recursos_asignados ADD COLUMN status TEXT DEFAULT 'assigned';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recursos_asignados' AND column_name = 'notes') THEN
        ALTER TABLE recursos_asignados ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en tracking_data
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracking_data' AND column_name = 'emotional_state') THEN
        ALTER TABLE tracking_data ADD COLUMN emotional_state TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracking_data' AND column_name = 'activity_type') THEN
        ALTER TABLE tracking_data ADD COLUMN activity_type TEXT;
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en evaluations (SIN NOT NULL inicialmente)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'evaluator_id') THEN
        ALTER TABLE evaluations ADD COLUMN evaluator_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'evaluation_type') THEN
        ALTER TABLE evaluations ADD COLUMN evaluation_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'subject') THEN
        ALTER TABLE evaluations ADD COLUMN subject TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'score') THEN
        ALTER TABLE evaluations ADD COLUMN score DECIMAL(5,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'max_score') THEN
        ALTER TABLE evaluations ADD COLUMN max_score DECIMAL(5,2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'comments') THEN
        ALTER TABLE evaluations ADD COLUMN comments TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'evaluation_date') THEN
        ALTER TABLE evaluations ADD COLUMN evaluation_date DATE;
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en appointments (SIN NOT NULL inicialmente)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_type') THEN
        ALTER TABLE appointments ADD COLUMN appointment_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'scheduled_date') THEN
        ALTER TABLE appointments ADD COLUMN scheduled_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'duration_minutes') THEN
        ALTER TABLE appointments ADD COLUMN duration_minutes INTEGER DEFAULT 60;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'status') THEN
        ALTER TABLE appointments ADD COLUMN status TEXT DEFAULT 'scheduled';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'notes') THEN
        ALTER TABLE appointments ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'updated_at') THEN
        ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Verificar y agregar columnas faltantes en notifications
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'user_id') THEN
        ALTER TABLE notifications ADD COLUMN user_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'title') THEN
        ALTER TABLE notifications ADD COLUMN title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'message') THEN
        ALTER TABLE notifications ADD COLUMN message TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'type') THEN
        ALTER TABLE notifications ADD COLUMN type TEXT DEFAULT 'info';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'is_read') THEN
        ALTER TABLE notifications ADD COLUMN is_read BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Ahora actualizar valores NULL con valores por defecto
UPDATE evaluations SET evaluation_type = 'general' WHERE evaluation_type IS NULL;
UPDATE evaluations SET evaluation_date = CURRENT_DATE WHERE evaluation_date IS NULL;
UPDATE appointments SET appointment_type = 'consultation' WHERE appointment_type IS NULL;
UPDATE appointments SET scheduled_date = NOW() WHERE scheduled_date IS NULL;

-- Ahora agregar las restricciones NOT NULL
DO $$ 
BEGIN
    -- Agregar restricciones NOT NULL a evaluations
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'evaluation_type' AND is_nullable = 'YES') THEN
        ALTER TABLE evaluations ALTER COLUMN evaluation_type SET NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'evaluations' AND column_name = 'evaluation_date' AND is_nullable = 'YES') THEN
        ALTER TABLE evaluations ALTER COLUMN evaluation_date SET NOT NULL;
    END IF;
    
    -- Agregar restricciones NOT NULL a appointments
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_type' AND is_nullable = 'YES') THEN
        ALTER TABLE appointments ALTER COLUMN appointment_type SET NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'scheduled_date' AND is_nullable = 'YES') THEN
        ALTER TABLE appointments ALTER COLUMN scheduled_date SET NOT NULL;
    END IF;
    
    -- Agregar restricciones NOT NULL a notifications
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'title' AND is_nullable = 'YES') THEN
        ALTER TABLE notifications ALTER COLUMN title SET NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'message' AND is_nullable = 'YES') THEN
        ALTER TABLE notifications ALTER COLUMN message SET NOT NULL;
    END IF;
END $$;

-- Agregar restricciones CHECK después de agregar las columnas
DO $$ 
BEGIN
    -- Agregar restricciones CHECK a support_plans
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'support_plans_priority_check') THEN
        ALTER TABLE support_plans ADD CONSTRAINT support_plans_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
    END IF;
    
    -- Agregar restricciones CHECK a learning_resources
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'learning_resources_difficulty_check') THEN
        ALTER TABLE learning_resources ADD CONSTRAINT learning_resources_difficulty_check CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'));
    END IF;
    
    -- Agregar restricciones CHECK a recursos_asignados
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'recursos_asignados_status_check') THEN
        ALTER TABLE recursos_asignados ADD CONSTRAINT recursos_asignados_status_check CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue'));
    END IF;
    
    -- Agregar restricciones CHECK a appointments
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'appointments_status_check') THEN
        ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled'));
    END IF;
    
    -- Agregar restricciones CHECK a notifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'notifications_type_check') THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('info', 'warning', 'error', 'success'));
    END IF;
END $$;

-- Crear índices si no existen
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

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers si no existen
DO $$ 
BEGIN
    -- Trigger para user_profiles
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
        CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para teacher_observations
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_teacher_observations_updated_at') THEN
        CREATE TRIGGER update_teacher_observations_updated_at BEFORE UPDATE ON teacher_observations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para support_plans
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_plans_updated_at') THEN
        CREATE TRIGGER update_support_plans_updated_at BEFORE UPDATE ON support_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para learning_resources
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_learning_resources_updated_at') THEN
        CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Trigger para appointments
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_appointments_updated_at') THEN
        CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Mensaje de confirmación
SELECT 'Database columns fixed safely!' as status;
