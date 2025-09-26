# 🚨 SOLUCIÓN INMEDIATA: Error "column plan_id does not exist"

## 🎯 **PROBLEMA ACTUAL**
```
ERROR: 42703: column "plan_id" does not exist
```

## 🔧 **SOLUCIÓN PASO A PASO**

### **Paso 1: Verificar Estado Actual**
Ejecuta primero este script para ver qué tablas existen:

```sql
-- Copia y pega este código en el SQL Editor de Supabase
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### **Paso 2: Crear Tabla Básica**
Si `student_activities` no existe, ejecuta este script simple:

```sql
-- Script básico sin políticas RLS
DROP TABLE IF EXISTS student_activities CASCADE;

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
```

### **Paso 3: Verificar Creación**
```sql
-- Verificar que la tabla se creó
SELECT 'Tabla student_activities creada' as status;
SELECT COUNT(*) as columnas FROM information_schema.columns WHERE table_name = 'student_activities';
```

### **Paso 4: Habilitar RLS (Opcional)**
```sql
-- Solo si quieres seguridad adicional
ALTER TABLE student_activities ENABLE ROW LEVEL SECURITY;

-- Política básica para permitir todo (temporal)
CREATE POLICY "Allow all operations" ON student_activities
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## 🚀 **INSTRUCCIONES RÁPIDAS**

1. **Abre Supabase Dashboard**
2. **Ve a SQL Editor**
3. **Ejecuta el Paso 1** (verificar tablas)
4. **Ejecuta el Paso 2** (crear tabla básica)
5. **Ejecuta el Paso 3** (verificar creación)
6. **Prueba la asignación** de actividades

## ✅ **RESULTADO ESPERADO**

Después de ejecutar estos pasos:
- ✅ Tabla `student_activities` creada
- ✅ Columna `plan_id` disponible
- ✅ Asignación de actividades funcionando
- ✅ Sin errores en la consola

## 🔍 **VERIFICACIÓN FINAL**

```sql
-- Verificar que plan_id existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'student_activities' 
AND column_name = 'plan_id';
```

**¡Ejecuta estos scripts en orden y el error se resolverá!** 🎯✨
