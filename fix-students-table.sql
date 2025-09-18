-- Script para corregir el problema de la tabla students
-- Este script elimina la tabla students y crea la vista correctamente

-- 1. Eliminar la tabla students si existe
DROP TABLE IF EXISTS students CASCADE;

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

-- 3. Verificar que la vista se creó correctamente
SELECT 'students view created successfully!' as status;

-- 4. Probar la vista
SELECT COUNT(*) as student_count FROM students;

-- 5. Mostrar la estructura de la vista
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;
