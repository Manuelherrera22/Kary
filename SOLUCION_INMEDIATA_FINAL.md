# 🚨 SOLUCIÓN INMEDIATA - CREAR TABLA AHORA

## 🎯 **PROBLEMA ACTUAL**
- Error 503: Gemini sobrecargado ✅ (ya manejado)
- Error 400: Tabla `student_activities` no existe ❌ (necesita solución)

## 🔧 **SOLUCIÓN EN 3 PASOS**

### **PASO 1: Abrir Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (en el menú lateral)

### **PASO 2: Ejecutar Script**
Copia y pega este código en el SQL Editor:

```sql
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

SELECT 'Tabla creada exitosamente' as resultado;
```

### **PASO 3: Verificar**
Deberías ver el mensaje: `Tabla creada exitosamente`

## ✅ **RESULTADO**
- ✅ Tabla `student_activities` creada
- ✅ Columna `plan_id` disponible
- ✅ Asignación de actividades funcionará
- ✅ Error 400 resuelto

## 🚀 **DESPUÉS DE CREAR LA TABLA**
1. **Recarga tu aplicación** (F5)
2. **Prueba generar una actividad** con IA
3. **Intenta asignarla** a un estudiante
4. **Verifica que no hay errores** en la consola

**¡Ejecuta el script SQL y el problema estará resuelto!** 🎯✨
