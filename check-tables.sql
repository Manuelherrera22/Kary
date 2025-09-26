-- Script para verificar tablas existentes en la base de datos

-- Ver todas las tablas que existen
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar si student_activities existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'student_activities') 
        THEN 'La tabla student_activities EXISTE'
        ELSE 'La tabla student_activities NO EXISTE'
    END as tabla_status;

-- Si existe, ver sus columnas
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
