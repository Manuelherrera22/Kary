-- Agregar todas las columnas faltantes a student_activities
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas que faltan
DO $$
BEGIN
    -- Verificar y agregar assigned_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'assigned_at'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Columna assigned_at agregada';
    ELSE
        RAISE NOTICE '✅ assigned_at ya existe';
    END IF;

    -- Verificar y agregar due_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'due_date'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Columna due_date agregada';
    ELSE
        RAISE NOTICE '✅ due_date ya existe';
    END IF;

    -- Verificar y agregar created_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Columna created_at agregada';
    ELSE
        RAISE NOTICE '✅ created_at ya existe';
    END IF;

    -- Verificar y agregar updated_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Columna updated_at agregada';
    ELSE
        RAISE NOTICE '✅ updated_at ya existe';
    END IF;

    -- Verificar y agregar plan_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'plan_id'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN plan_id UUID;
        RAISE NOTICE '✅ Columna plan_id agregada';
    ELSE
        RAISE NOTICE '✅ plan_id ya existe';
    END IF;

    -- Verificar y agregar ai_generated
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'ai_generated'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN ai_generated BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Columna ai_generated agregada';
    ELSE
        RAISE NOTICE '✅ ai_generated ya existe';
    END IF;

    -- Verificar y agregar generated_by
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'generated_by'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN generated_by TEXT;
        RAISE NOTICE '✅ Columna generated_by agregada';
    ELSE
        RAISE NOTICE '✅ generated_by ya existe';
    END IF;

    -- Verificar y agregar status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'student_activities' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE student_activities 
        ADD COLUMN status TEXT DEFAULT 'assigned';
        RAISE NOTICE '✅ Columna status agregada';
    ELSE
        RAISE NOTICE '✅ status ya existe';
    END IF;

END $$;

-- Verificar resultado final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
