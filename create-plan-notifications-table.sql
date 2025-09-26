-- Crear tabla para notificaciones de planes de apoyo enviados
CREATE TABLE IF NOT EXISTS plan_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL,
  student_id UUID NOT NULL,
  teacher_id UUID REFERENCES user_profiles(id),
  teacher_email TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_as_pdf BOOLEAN DEFAULT false,
  sent_by UUID REFERENCES user_profiles(id) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_plan_notifications_plan_id ON plan_notifications(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_notifications_student_id ON plan_notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_plan_notifications_teacher_id ON plan_notifications(teacher_id);
CREATE INDEX IF NOT EXISTS idx_plan_notifications_sent_by ON plan_notifications(sent_by);
CREATE INDEX IF NOT EXISTS idx_plan_notifications_sent_at ON plan_notifications(sent_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE plan_notifications ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver sus propias notificaciones
CREATE POLICY "Users can view their own plan notifications" ON plan_notifications
  FOR SELECT USING (
    auth.uid() = sent_by OR 
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin', 'psychopedagogue')
    )
  );

-- Política para que los psicopedagogos puedan crear notificaciones
CREATE POLICY "Psychopedagogues can create plan notifications" ON plan_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('psychopedagogue', 'admin', 'super_admin')
    )
  );

-- Política para que los usuarios puedan actualizar el estado de sus notificaciones
CREATE POLICY "Users can update notification status" ON plan_notifications
  FOR UPDATE USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin', 'psychopedagogue')
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_plan_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_plan_notifications_updated_at
  BEFORE UPDATE ON plan_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_plan_notifications_updated_at();

-- Comentarios para documentar la tabla
COMMENT ON TABLE plan_notifications IS 'Registro de notificaciones de planes de apoyo enviados a profesores';
COMMENT ON COLUMN plan_notifications.plan_id IS 'ID del plan de apoyo generado';
COMMENT ON COLUMN plan_notifications.student_id IS 'ID del estudiante para quien se generó el plan';
COMMENT ON COLUMN plan_notifications.teacher_id IS 'ID del profesor destinatario (opcional si se usa email personalizado)';
COMMENT ON COLUMN plan_notifications.teacher_email IS 'Email del profesor destinatario';
COMMENT ON COLUMN plan_notifications.teacher_name IS 'Nombre del profesor destinatario';
COMMENT ON COLUMN plan_notifications.subject IS 'Asunto del email enviado';
COMMENT ON COLUMN plan_notifications.message IS 'Mensaje del email enviado';
COMMENT ON COLUMN plan_notifications.sent_as_pdf IS 'Indica si se envió el plan como PDF adjunto';
COMMENT ON COLUMN plan_notifications.sent_by IS 'ID del usuario que envió el plan';
COMMENT ON COLUMN plan_notifications.sent_at IS 'Fecha y hora de envío';
COMMENT ON COLUMN plan_notifications.status IS 'Estado de la notificación: sent, delivered, read, failed';
