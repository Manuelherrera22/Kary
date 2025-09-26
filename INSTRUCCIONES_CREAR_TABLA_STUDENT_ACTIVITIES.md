# 🗄️ CREAR TABLA STUDENT_ACTIVITIES EN SUPABASE

## 🎯 **PROBLEMA IDENTIFICADO**
El error `Could not find the 'activity_id' column of 'student_activities' in the schema cache` indica que la tabla `student_activities` no existe en la base de datos de Supabase.

## 🔧 **SOLUCIÓN REQUERIDA**

### **Paso 1: Ejecutar Script SQL**
Necesitas ejecutar el archivo `create-student-activities-table.sql` en tu base de datos de Supabase.

### **Paso 2: Opciones para Ejecutar el Script**

#### **Opción A: Desde el Dashboard de Supabase**
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `create-student-activities-table.sql`
4. Ejecuta el script

#### **Opción B: Desde la Terminal (si tienes Supabase CLI)**
```bash
supabase db reset
# O
supabase db push
```

#### **Opción C: Desde psql (PostgreSQL directo)**
```bash
psql -h your-host -U postgres -d postgres -f create-student-activities-table.sql
```

## 📋 **LO QUE CREA EL SCRIPT**

### **Tabla Principal:**
- `student_activities` - Tabla principal para actividades asignadas

### **Columnas Principales:**
- `id` - UUID primario
- `activity_id` - UUID único de la actividad
- `student_id` - ID del estudiante
- `teacher_id` - ID del profesor
- `plan_id` - ID del plan de apoyo
- `title`, `description`, `objective` - Información básica
- `duration`, `difficulty`, `priority` - Metadatos
- `materials` - Array de materiales
- `adaptations`, `instructions`, `assessment` - Contenido educativo
- `ai_generated`, `generated_by` - Información de IA
- `status` - Estado de la actividad
- `assigned_at`, `due_date` - Fechas importantes

### **Índices:**
- Índices en `student_id`, `teacher_id`, `plan_id`, `status`, `assigned_at`, `due_date`

### **Políticas RLS:**
- Profesores pueden ver/insertar/actualizar/eliminar sus propias asignaciones
- Estudiantes pueden ver sus actividades asignadas
- Estudiantes pueden actualizar el estado de sus actividades
- Administradores tienen acceso completo
- Psicopedagogos pueden ver actividades de sus planes

### **Funciones y Triggers:**
- Función para actualizar `updated_at` automáticamente
- Trigger para mantener timestamps actualizados

## ✅ **VERIFICACIÓN**

Después de ejecutar el script, puedes verificar que la tabla se creó correctamente:

```sql
-- Verificar que la tabla existe
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'student_activities';

-- Ver las columnas de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
ORDER BY ordinal_position;

-- Verificar las políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'student_activities';
```

## 🚀 **DESPUÉS DE CREAR LA TABLA**

Una vez que hayas ejecutado el script SQL:

1. **Reinicia tu aplicación** para que los cambios se reflejen
2. **Prueba la asignación de actividades** desde el dashboard de profesores
3. **Verifica que no hay más errores** en la consola del navegador

## 📝 **NOTAS IMPORTANTES**

- El script incluye datos de ejemplo opcionales
- Las políticas RLS están configuradas para seguridad
- Los índices mejoran el rendimiento de las consultas
- El trigger mantiene automáticamente los timestamps

**¡Ejecuta el script SQL y el problema estará resuelto!** 🎯✨
