-- Script para corregir la vista students
-- Este script elimina cualquier conflicto y crea la vista correctamente

-- 1. Eliminar la vista si existe y hay conflictos
DROP VIEW IF EXISTS students CASCADE;

-- 2. Crear la vista students correctamente
CREATE VIEW students AS
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

-- 3. Crear una tabla students si es necesario (alternativa a la vista)
-- Comentado por ahora, pero se puede usar si la vista no funciona
/*
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    status TEXT DEFAULT 'active',
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

-- Crear función para sincronizar la tabla students con user_profiles
CREATE OR REPLACE FUNCTION sync_students_table()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Insertar o actualizar en la tabla students
        INSERT INTO students (
            id, full_name, email, role, status, grade, admission_date, 
            avatar_url, academic_risk, emotional_risk, diagnostic_summary,
            preferred_language, timezone, notifications_enabled, created_at, updated_at
        ) VALUES (
            NEW.id, NEW.full_name, NEW.email, NEW.role, NEW.status, NEW.grade, NEW.admission_date,
            NEW.avatar_url, NEW.academic_risk, NEW.emotional_risk, NEW.diagnostic_summary,
            NEW.preferred_language, NEW.timezone, NEW.notifications_enabled, NEW.created_at, NEW.updated_at
        )
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            role = EXCLUDED.role,
            status = EXCLUDED.status,
            grade = EXCLUDED.grade,
            admission_date = EXCLUDED.admission_date,
            avatar_url = EXCLUDED.avatar_url,
            academic_risk = EXCLUDED.academic_risk,
            emotional_risk = EXCLUDED.emotional_risk,
            diagnostic_summary = EXCLUDED.diagnostic_summary,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            notifications_enabled = EXCLUDED.notifications_enabled,
            updated_at = EXCLUDED.updated_at;
    ELSIF TG_OP = 'DELETE' THEN
        -- Eliminar de la tabla students
        DELETE FROM students WHERE id = OLD.id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para sincronizar automáticamente
CREATE TRIGGER sync_students_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_profiles
    FOR EACH ROW
    WHEN (NEW.role = 'student' OR OLD.role = 'student')
    EXECUTE FUNCTION sync_students_table();
*/

-- 4. Verificar que la vista se creó correctamente
SELECT 'students view created successfully!' as status;

-- 5. Probar la vista
SELECT COUNT(*) as student_count FROM students;
