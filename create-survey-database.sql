-- Crear tabla para encuestas profesionales de Kary
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Información del rol
    user_role TEXT NOT NULL CHECK (user_role IN ('student', 'teacher', 'psychopedagogue', 'parent', 'director')),
    
    -- Información personal
    age_range TEXT,
    tech_experience TEXT,
    institution_type TEXT,
    
    -- Evaluación general (ratings 1-5)
    usability_rating INTEGER CHECK (usability_rating >= 1 AND usability_rating <= 5),
    functionality_rating INTEGER CHECK (functionality_rating >= 1 AND functionality_rating <= 5),
    design_rating INTEGER CHECK (design_rating >= 1 AND design_rating <= 5),
    performance_rating INTEGER CHECK (performance_rating >= 1 AND performance_rating <= 5),
    support_rating INTEGER CHECK (support_rating >= 1 AND support_rating <= 5),
    
    -- Feedback detallado
    positive_feedback TEXT,
    negative_feedback TEXT,
    suggestions TEXT,
    
    -- Recomendaciones
    recommendation TEXT CHECK (recommendation IN ('definitely', 'probably', 'neutral', 'probably-not', 'definitely-not')),
    impact_description TEXT,
    additional_comments TEXT,
    
    -- Metadatos
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Campos adicionales para análisis
    completion_time INTEGER, -- tiempo en segundos
    is_anonymous BOOLEAN DEFAULT true
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_survey_responses_role ON public.survey_responses(user_role);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON public.survey_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_recommendation ON public.survey_responses(recommendation);

-- Crear tabla para estadísticas de encuestas
CREATE TABLE IF NOT EXISTS public.survey_statistics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Estadísticas por rol
    student_count INTEGER DEFAULT 0,
    teacher_count INTEGER DEFAULT 0,
    psychopedagogue_count INTEGER DEFAULT 0,
    parent_count INTEGER DEFAULT 0,
    director_count INTEGER DEFAULT 0,
    
    -- Promedios de ratings
    avg_usability DECIMAL(3,2),
    avg_functionality DECIMAL(3,2),
    avg_design DECIMAL(3,2),
    avg_performance DECIMAL(3,2),
    avg_support DECIMAL(3,2),
    
    -- Distribución de recomendaciones
    definitely_count INTEGER DEFAULT 0,
    probably_count INTEGER DEFAULT 0,
    neutral_count INTEGER DEFAULT 0,
    probably_not_count INTEGER DEFAULT 0,
    definitely_not_count INTEGER DEFAULT 0,
    
    -- Metadatos
    total_responses INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_statistics ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- Permitir inserción anónima para encuestas
CREATE POLICY "Allow anonymous survey submissions" ON public.survey_responses
    FOR INSERT WITH CHECK (true);

-- Permitir lectura solo para administradores (opcional)
CREATE POLICY "Allow admin read access" ON public.survey_responses
    FOR SELECT USING (auth.role() = 'admin');

-- Política para estadísticas (solo lectura para todos)
CREATE POLICY "Allow read access to statistics" ON public.survey_statistics
    FOR SELECT USING (true);

-- Función para actualizar estadísticas automáticamente
CREATE OR REPLACE FUNCTION update_survey_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estadísticas cuando se inserta una nueva respuesta
    INSERT INTO public.survey_statistics (
        student_count,
        teacher_count,
        psychopedagogue_count,
        parent_count,
        director_count,
        avg_usability,
        avg_functionality,
        avg_design,
        avg_performance,
        avg_support,
        definitely_count,
        probably_count,
        neutral_count,
        probably_not_count,
        definitely_not_count,
        total_responses,
        last_updated
    )
    SELECT 
        COUNT(*) FILTER (WHERE user_role = 'student'),
        COUNT(*) FILTER (WHERE user_role = 'teacher'),
        COUNT(*) FILTER (WHERE user_role = 'psychopedagogue'),
        COUNT(*) FILTER (WHERE user_role = 'parent'),
        COUNT(*) FILTER (WHERE user_role = 'director'),
        AVG(usability_rating),
        AVG(functionality_rating),
        AVG(design_rating),
        AVG(performance_rating),
        AVG(support_rating),
        COUNT(*) FILTER (WHERE recommendation = 'definitely'),
        COUNT(*) FILTER (WHERE recommendation = 'probably'),
        COUNT(*) FILTER (WHERE recommendation = 'neutral'),
        COUNT(*) FILTER (WHERE recommendation = 'probably-not'),
        COUNT(*) FILTER (WHERE recommendation = 'definitely-not'),
        COUNT(*),
        NOW()
    FROM public.survey_responses
    ON CONFLICT (id) DO UPDATE SET
        student_count = EXCLUDED.student_count,
        teacher_count = EXCLUDED.teacher_count,
        psychopedagogue_count = EXCLUDED.psychopedagogue_count,
        parent_count = EXCLUDED.parent_count,
        director_count = EXCLUDED.director_count,
        avg_usability = EXCLUDED.avg_usability,
        avg_functionality = EXCLUDED.avg_functionality,
        avg_design = EXCLUDED.avg_design,
        avg_performance = EXCLUDED.avg_performance,
        avg_support = EXCLUDED.avg_support,
        definitely_count = EXCLUDED.definitely_count,
        probably_count = EXCLUDED.probably_count,
        neutral_count = EXCLUDED.neutral_count,
        probably_not_count = EXCLUDED.probably_not_count,
        definitely_not_count = EXCLUDED.definitely_not_count,
        total_responses = EXCLUDED.total_responses,
        last_updated = EXCLUDED.last_updated;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar estadísticas automáticamente
CREATE TRIGGER trigger_update_survey_statistics
    AFTER INSERT ON public.survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_survey_statistics();

-- Comentarios en las tablas
COMMENT ON TABLE public.survey_responses IS 'Almacena las respuestas de la encuesta profesional de Kary';
COMMENT ON TABLE public.survey_statistics IS 'Estadísticas agregadas de las encuestas para análisis rápido';

-- Comentarios en columnas importantes
COMMENT ON COLUMN public.survey_responses.user_role IS 'Rol del usuario: student, teacher, psychopedagogue, parent, director';
COMMENT ON COLUMN public.survey_responses.usability_rating IS 'Rating de facilidad de uso (1-5)';
COMMENT ON COLUMN public.survey_responses.functionality_rating IS 'Rating de funcionalidad (1-5)';
COMMENT ON COLUMN public.survey_responses.design_rating IS 'Rating de diseño y estética (1-5)';
COMMENT ON COLUMN public.survey_responses.performance_rating IS 'Rating de rendimiento (1-5)';
COMMENT ON COLUMN public.survey_responses.support_rating IS 'Rating de soporte técnico (1-5)';
COMMENT ON COLUMN public.survey_responses.recommendation IS 'Nivel de recomendación: definitely, probably, neutral, probably-not, definitely-not';
