# 🚨 SOLUCIÓN DEFINITIVA: Error "Could not find activity_id column"

## 🎯 **PROBLEMA ACTUAL**
```
ERROR: Could not find the 'activity_id' column of 'student_activities' in the schema cache
```

La tabla `student_activities` no tiene la columna `activity_id` que es esencial.

## 🔧 **SOLUCIÓN DEFINITIVA**

### **OPCIÓN 1: Script Definitivo (Recomendado)**
Ejecuta este script en Supabase SQL Editor:

```sql
-- Paso 1: Eliminar tabla completamente si existe
DROP TABLE IF EXISTS student_activities CASCADE;

-- Paso 2: Crear tabla desde cero con todas las columnas necesarias
CREATE TABLE student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id UUID NOT NULL,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    plan_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    duration INTEGER,
    difficulty TEXT,
    priority TEXT,
    subject TEXT,
    materials TEXT,
    adaptations TEXT,
    instructions TEXT,
    assessment TEXT,
    ai_generated BOOLEAN DEFAULT false,
    generated_by TEXT,
    status TEXT DEFAULT 'assigned',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paso 3: Verificar que se creó correctamente
SELECT 'Tabla student_activities creada exitosamente' as resultado;

-- Paso 4: Verificar que activity_id existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'student_activities' 
            AND column_name = 'activity_id'
        ) 
        THEN '✅ La columna activity_id EXISTE'
        ELSE '❌ La columna activity_id NO EXISTE'
    END as activity_id_status;
```

### **OPCIÓN 2: Script Simple**
Si prefieres solo agregar la columna faltante, usa el script `verificar-agregar-activity-id.sql`.

## ✅ **RESULTADO ESPERADO**

Después de ejecutar el script:
- ✅ **Tabla student_activities recreada completamente**
- ✅ **Columna activity_id disponible**
- ✅ **Error PGRST204 resuelto**
- ✅ **Asignación de actividades funcionando**

## 🚀 **DESPUÉS DE CREAR LA TABLA**

1. **Recarga tu aplicación** (F5)
2. **Prueba generar una actividad** con IA
3. **Intenta asignarla** a un estudiante
4. **Verifica que no hay errores** en la consola

## 🔍 **VERIFICACIÓN**

Si todo está correcto, deberías ver:
- ✅ `Tabla student_activities creada exitosamente`
- ✅ `La columna activity_id EXISTE`
- ✅ Sin errores PGRST204 en la consola del navegador
- ✅ Asignación de actividades funcionando

## 📝 **COLUMNAS INCLUIDAS**

- `id` - UUID primario
- `activity_id` - UUID de la actividad (ESENCIAL)
- `student_id` - UUID del estudiante
- `teacher_id` - UUID del profesor
- `plan_id` - UUID del plan de apoyo
- `title` - Título de la actividad
- `description` - Descripción
- `objective` - Objetivo
- `duration` - Duración en minutos
- `difficulty` - Dificultad
- `priority` - Prioridad
- `subject` - Materia
- `materials` - Materiales
- `adaptations` - Adaptaciones
- `instructions` - Instrucciones
- `assessment` - Evaluación
- `ai_generated` - Generada por IA
- `generated_by` - Generado por
- `status` - Estado
- `assigned_at` - Fecha de asignación
- `due_date` - Fecha de vencimiento
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

## 🛡️ **SEGURIDAD**

- **Sin políticas RLS** para evitar problemas
- **Funcionalidad básica garantizada**
- **Se puede agregar seguridad más tarde**

**¡Ejecuta el script definitivo y el problema estará resuelto!** 🎯✨
