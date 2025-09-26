-- Crear tabla student_activities para asignar actividades a estudiantes
-- Esta tabla almacena las actividades asignadas por los profesores a los estudiantes

CREATE TABLE IF NOT EXISTS student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificadores principales
    activity_id UUID NOT NULL,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    plan_id UUID,
    
    -- Información básica de la actividad
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    
    -- Metadatos de la actividad
    duration INTEGER, -- en minutos
    difficulty TEXT CHECK (difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
    priority TEXT CHECK (priority IN ('Baja', 'Media', 'Alta')),
    category TEXT,
    subject TEXT,
    grade_level TEXT,
    
    -- Contenido educativo
    materials TEXT[], -- Array de materiales
    adaptations TEXT,
    instructions TEXT,
    assessment TEXT,
    
    -- Información pedagógica
    learning_style TEXT,
    cognitive_domain TEXT,
    
    -- Información de IA
    ai_generated BOOLEAN DEFAULT false,
    generated_by TEXT,
    based_on_plan TEXT,
    based_on_recommendations JSONB,
    
    -- Estado y fechas
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'cancelled')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_teacher_id ON student_activities(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_plan_id ON student_activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_status ON student_activities(status);
CREATE INDEX IF NOT EXISTS idx_student_activities_assigned_at ON student_activities(assigned_at);
CREATE INDEX IF NOT EXISTS idx_student_activities_due_date ON student_activities(due_date);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_student_activities_updated_at ON student_activities;
CREATE TRIGGER update_student_activities_updated_at
    BEFORE UPDATE ON student_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS

-- Política para que los profesores puedan ver sus propias asignaciones
CREATE POLICY "Teachers can view their own activity assignments" ON student_activities
    FOR SELECT
    USING (auth.uid() = teacher_id);

-- Política para que los profesores puedan insertar actividades que asignan
CREATE POLICY "Teachers can insert their own activity assignments" ON student_activities
    FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- Política para que los profesores puedan actualizar sus propias asignaciones
CREATE POLICY "Teachers can update their own activity assignments" ON student_activities
    FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Política para que los profesores puedan eliminar sus propias asignaciones
CREATE POLICY "Teachers can delete their own activity assignments" ON student_activities
    FOR DELETE
    USING (auth.uid() = teacher_id);

-- Política para que los estudiantes puedan ver sus actividades asignadas
CREATE POLICY "Students can view their assigned activities" ON student_activities
    FOR SELECT
    USING (auth.uid() = student_id);

-- Política para que los estudiantes puedan actualizar el estado de sus actividades
CREATE POLICY "Students can update their activity status" ON student_activities
    FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (
        auth.uid() = student_id AND
        -- Solo permitir actualizar ciertos campos
        (OLD.status IS DISTINCT FROM NEW.status OR
         OLD.updated_at IS DISTINCT FROM NEW.updated_at)
    );

-- Política para administradores (pueden ver todo)
CREATE POLICY "Admins can view all activity assignments" ON student_activities
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Política para administradores (pueden insertar)
CREATE POLICY "Admins can insert activity assignments" ON student_activities
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Política para administradores (pueden actualizar)
CREATE POLICY "Admins can update activity assignments" ON student_activities
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Política para administradores (pueden eliminar)
CREATE POLICY "Admins can delete activity assignments" ON student_activities
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin'
        )
    );

-- Política para psicopedagogos (pueden ver actividades relacionadas con sus planes)
CREATE POLICY "Psychopedagogues can view activities from their plans" ON student_activities
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM support_plans sp
            JOIN user_profiles up ON up.id = auth.uid()
            WHERE sp.id = student_activities.plan_id
            AND up.role = 'psychopedagogue'
            AND sp.generated_by = auth.uid()
        )
    );

-- Comentarios para documentación
COMMENT ON TABLE student_activities IS 'Tabla para almacenar actividades asignadas por profesores a estudiantes';
COMMENT ON COLUMN student_activities.activity_id IS 'ID único de la actividad (puede ser UUID generado)';
COMMENT ON COLUMN student_activities.student_id IS 'ID del estudiante al que se asigna la actividad';
COMMENT ON COLUMN student_activities.teacher_id IS 'ID del profesor que asigna la actividad';
COMMENT ON COLUMN student_activities.plan_id IS 'ID del plan de apoyo relacionado (opcional)';
COMMENT ON COLUMN student_activities.materials IS 'Array de materiales necesarios para la actividad';
COMMENT ON COLUMN student_activities.based_on_recommendations IS 'JSON con las recomendaciones aplicadas';
COMMENT ON COLUMN student_activities.status IS 'Estado actual de la actividad: assigned, in_progress, completed, cancelled';
COMMENT ON COLUMN student_activities.ai_generated IS 'Indica si la actividad fue generada por IA';
COMMENT ON COLUMN student_activities.generated_by IS 'Sistema o usuario que generó la actividad';

-- Insertar datos de ejemplo (opcional)
INSERT INTO student_activities (
    activity_id,
    student_id,
    teacher_id,
    title,
    description,
    objective,
    duration,
    difficulty,
    priority,
    subject,
    materials,
    adaptations,
    instructions,
    assessment,
    ai_generated,
    generated_by,
    status
) VALUES (
    gen_random_uuid(),
    (SELECT id FROM user_profiles WHERE role = 'student' LIMIT 1),
    (SELECT id FROM user_profiles WHERE role = 'teacher' LIMIT 1),
    'Actividad de Ejemplo',
    'Esta es una actividad de ejemplo para probar el sistema',
    'Objetivo de ejemplo para la actividad',
    30,
    'Intermedio',
    'Media',
    'Matemáticas',
    ARRAY['Material 1', 'Material 2'],
    'Adaptaciones específicas para el estudiante',
    'Instrucciones paso a paso para realizar la actividad',
    'Método de evaluación de la actividad',
    true,
    'Sistema de Ejemplo',
    'assigned'
) ON CONFLICT DO NOTHING;

-- Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;
