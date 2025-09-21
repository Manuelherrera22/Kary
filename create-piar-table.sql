-- Script para crear la tabla PIARs en Supabase
-- Ejecutar este script en el SQL Editor de Supabase cuando quieras usar datos reales

-- Crear tabla PIARs
CREATE TABLE IF NOT EXISTS piars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'review_pending')),
    
    -- Información diagnóstica (JSONB para flexibilidad)
    diagnostic_info JSONB NOT NULL DEFAULT '{}',
    
    -- Necesidades específicas (JSONB array)
    specific_needs JSONB NOT NULL DEFAULT '[]',
    
    -- Ajustes razonables (JSONB array)
    reasonable_adjustments JSONB NOT NULL DEFAULT '[]',
    
    -- Objetivos (JSONB array)
    goals JSONB NOT NULL DEFAULT '[]',
    
    -- Estrategias de enseñanza (JSONB array)
    teaching_strategies JSONB NOT NULL DEFAULT '[]',
    
    -- Actividades recomendadas (JSONB array)
    recommended_activities JSONB NOT NULL DEFAULT '[]',
    
    -- Seguimiento de progreso (JSONB)
    progress_tracking JSONB NOT NULL DEFAULT '{}'
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_piars_student_id ON piars(student_id);
CREATE INDEX IF NOT EXISTS idx_piars_created_by ON piars(created_by);
CREATE INDEX IF NOT EXISTS idx_piars_status ON piars(status);
CREATE INDEX IF NOT EXISTS idx_piars_created_at ON piars(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE piars ENABLE ROW LEVEL SECURITY;

-- Política para que los psicopedagogos puedan ver todos los PIARs
CREATE POLICY "Psychopedagogues can view all PIARs" ON piars
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'psychopedagogue'
        )
    );

-- Política para que los psicopedagogos puedan crear PIARs
CREATE POLICY "Psychopedagogues can create PIARs" ON piars
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'psychopedagogue'
        )
        AND created_by = auth.uid()
    );

-- Política para que los psicopedagogos puedan actualizar PIARs
CREATE POLICY "Psychopedagogues can update PIARs" ON piars
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'psychopedagogue'
        )
    );

-- Política para que los profesores puedan ver PIARs de sus estudiantes
CREATE POLICY "Teachers can view student PIARs" ON piars
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'teacher'
        )
    );

-- Política para que los padres puedan ver PIARs de sus hijos
CREATE POLICY "Parents can view child PIARs" ON piars
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM parent_student_links psl
            JOIN user_profiles up ON up.id = psl.parent_id
            WHERE up.id = auth.uid() 
            AND up.role = 'parent'
            AND psl.student_id = piars.student_id
        )
    );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_piars_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_piars_updated_at
    BEFORE UPDATE ON piars
    FOR EACH ROW
    EXECUTE FUNCTION update_piars_updated_at();

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO piars (
    student_id,
    created_by,
    diagnostic_info,
    specific_needs,
    reasonable_adjustments,
    goals,
    progress_tracking
) VALUES (
    (SELECT id FROM user_profiles WHERE role = 'student' LIMIT 1),
    (SELECT id FROM user_profiles WHERE role = 'psychopedagogue' LIMIT 1),
    '{
        "learning_style": "visual",
        "attention_span": "medium",
        "reading_level": "intermediate",
        "math_level": "intermediate",
        "social_skills": "developing",
        "emotional_regulation": "developing",
        "physical_needs": "none",
        "communication_style": "verbal_preferred"
    }',
    '[
        {
            "category": "academic",
            "need": "reading_support",
            "description": "Necesita apoyo adicional en comprensión lectora",
            "priority": "high",
            "strategies": ["lectura guiada", "materiales visuales", "repetición"]
        }
    ]',
    '[
        {
            "type": "instructional",
            "adjustment": "extended_time",
            "description": "Tiempo extendido para tareas de lectura",
            "implementation": "Proporcionar 50% más tiempo para actividades de comprensión lectora"
        }
    ]',
    '[
        {
            "id": "goal-1",
            "description": "Mejorar comprensión lectora en un 30%",
            "target_date": "2024-06-30",
            "progress": 45,
            "strategies": ["lectura diaria", "preguntas de comprensión", "material visual"]
        }
    ]',
    '{
        "last_assessment": "2024-03-15",
        "next_review": "2024-04-15",
        "overall_progress": 60,
        "areas_improving": ["atención", "comprensión lectora"],
        "areas_needing_work": ["interacción social", "tiempo de concentración"]
    }'
) ON CONFLICT DO NOTHING;

-- Comentarios sobre la tabla
COMMENT ON TABLE piars IS 'Tabla para almacenar Planes Individuales de Ajustes Razonables (PIAR)';
COMMENT ON COLUMN piars.diagnostic_info IS 'Información diagnóstica del estudiante en formato JSON';
COMMENT ON COLUMN piars.specific_needs IS 'Necesidades específicas identificadas en formato JSON array';
COMMENT ON COLUMN piars.reasonable_adjustments IS 'Ajustes razonables implementados en formato JSON array';
COMMENT ON COLUMN piars.goals IS 'Objetivos del PIAR en formato JSON array';
COMMENT ON COLUMN piars.teaching_strategies IS 'Estrategias de enseñanza personalizadas en formato JSON array';
COMMENT ON COLUMN piars.recommended_activities IS 'Actividades recomendadas basadas en el PIAR en formato JSON array';
COMMENT ON COLUMN piars.progress_tracking IS 'Seguimiento del progreso del estudiante en formato JSON';
