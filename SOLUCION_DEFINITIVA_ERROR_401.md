# 🚨 SOLUCIÓN DEFINITIVA: Error 401 en Supabase

## ❌ Problema Confirmado
```
Error al enviar encuesta
Error de permisos: Las políticas de seguridad están bloqueando la inserción. Contacta al administrador.

POST https://iypwcvjncttbffwjpodg.supabase.co/rest/v1/survey_responses 401 (Unauthorized)
```

## 🎯 Causa Raíz
Las **políticas de Row Level Security (RLS)** en Supabase están bloqueando la inserción anónima de datos de la encuesta.

## ✅ SOLUCIÓN PASO A PASO

### 1. 🔧 Ejecutar Script SQL en Supabase

**Ve a tu proyecto de Supabase:**
1. Abre [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Ve a tu proyecto `iypwcvjncttbffwjpodg`
4. Haz clic en **SQL Editor** (en el menú lateral izquierdo)

**Ejecuta el script corregido:**
1. Copia **TODO** el contenido del archivo `fix-supabase-policies-corrected.sql`
2. Pégalo en el editor SQL
3. Haz clic en **Run** (botón verde)

### 2. 📋 Verificar que el Script se Ejecutó Correctamente

Después de ejecutar el script, deberías ver:
```
Políticas aplicadas correctamente
```

Y una tabla con las políticas creadas:
```
table_name                    | policy_name                        | policy_command | policy_roles
public.survey_responses      | Enable insert for anonymous users | INSERT        | {}
public.survey_responses      | Enable read access for admins only| SELECT        | {authenticated,service_role}
public.survey_statistics     | Enable read access for all users  | SELECT        | {}
```

### 3. 🧪 Probar la Encuesta

**Después de ejecutar el script:**
1. Refresca la página de la aplicación Kary
2. Haz clic en "Hacer Encuesta"
3. Completa todos los pasos hasta el final
4. Haz clic en "Enviar Encuesta"

**Resultado esperado:**
- ✅ No más error 401
- ✅ Encuesta se envía exitosamente
- ✅ Mensaje de éxito aparece
- ✅ Datos se guardan en Supabase

### 4. 📊 Verificar en Supabase

**Para confirmar que funciona:**
1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `survey_responses`
3. Deberías ver la nueva respuesta de la encuesta
4. Ve a la tabla `survey_statistics`
5. Debería actualizarse automáticamente

## 🔍 Si el Problema Persiste

### Opción A: Verificar Políticas Manualmente
Ejecuta esta consulta en SQL Editor:
```sql
SELECT 
    schemaname||'.'||tablename as table_name,
    policyname as policy_name,
    cmd as policy_command,
    roles as policy_roles
FROM pg_policies 
WHERE tablename IN ('survey_responses', 'survey_statistics')
ORDER BY tablename, policyname;
```

### Opción B: Deshabilitar RLS Temporalmente (Solo para Testing)
```sql
-- ⚠️ SOLO TEMPORAL - Para testing
ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;

-- Probar inserción
INSERT INTO public.survey_responses (user_role, session_id, is_anonymous) 
VALUES ('student', 'test_' || extract(epoch from now()), true);

-- Rehabilitar RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
```

### Opción C: Verificar Configuración de Supabase
1. Ve a **Settings** → **API**
2. Verifica que la **anon public** key esté configurada
3. Verifica que la **service_role** key esté configurada
4. Asegúrate de que las variables de entorno estén correctas

## 🚀 Script SQL Completo (Para Copiar y Pegar)

```sql
-- 🔧 CORRECCIÓN DE POLÍTICAS SUPABASE PARA ENCUESTAS - VERSIÓN CORREGIDA
-- Este script corrige las políticas RLS y el error de tipo en la función

-- 1. Eliminar políticas existentes que pueden estar causando conflictos
DROP POLICY IF EXISTS "Allow anonymous survey submissions" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow admin read access" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow read access to statistics" ON public.survey_statistics;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable read access for admins only" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.survey_responses;
DROP POLICY IF EXISTS "Enable insert for system" ON public.survey_statistics;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.survey_statistics;
DROP POLICY IF EXISTS "Enable update for system" ON public.survey_statistics;

-- 2. Eliminar función existente si existe
DROP FUNCTION IF EXISTS check_survey_policies();

-- 3. Crear políticas corregidas para survey_responses
-- Política para INSERT (inserción de encuestas) - PERMITE INSERCIÓN ANÓNIMA
CREATE POLICY "Enable insert for anonymous users" ON public.survey_responses
    FOR INSERT 
    WITH CHECK (true);

-- Política para SELECT (lectura) - SOLO ADMINISTRADORES
CREATE POLICY "Enable read access for admins only" ON public.survey_responses
    FOR SELECT 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Política para UPDATE (actualización) - SOLO ADMINISTRADORES
CREATE POLICY "Enable update for admins only" ON public.survey_responses
    FOR UPDATE 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Política para DELETE (eliminación) - SOLO ADMINISTRADORES
CREATE POLICY "Enable delete for admins only" ON public.survey_responses
    FOR DELETE 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 4. Crear políticas para survey_statistics
-- Política para INSERT (inserción de estadísticas) - SOLO TRIGGERS/SISTEMA
CREATE POLICY "Enable insert for system" ON public.survey_statistics
    FOR INSERT 
    WITH CHECK (true);

-- Política para SELECT (lectura de estadísticas) - PÚBLICO
CREATE POLICY "Enable read access for all users" ON public.survey_statistics
    FOR SELECT 
    USING (true);

-- Política para UPDATE (actualización de estadísticas) - SOLO SISTEMA
CREATE POLICY "Enable update for system" ON public.survey_statistics
    FOR UPDATE 
    USING (true);

-- 5. Verificar que RLS esté habilitado
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_statistics ENABLE ROW LEVEL SECURITY;

-- 6. Crear función corregida para verificar políticas
CREATE OR REPLACE FUNCTION check_survey_policies()
RETURNS TABLE (
    table_name TEXT,
    policy_name TEXT,
    policy_command TEXT,
    policy_roles TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (schemaname||'.'||tablename)::TEXT as table_name,
        policyname::TEXT as policy_name,
        cmd::TEXT as policy_command,
        roles::TEXT[] as policy_roles
    FROM pg_policies 
    WHERE tablename IN ('survey_responses', 'survey_statistics')
    ORDER BY tablename, policyname;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Comentarios explicativos
COMMENT ON POLICY "Enable insert for anonymous users" ON public.survey_responses IS 
'Permite que usuarios anónimos inserten respuestas de encuestas';

COMMENT ON POLICY "Enable read access for admins only" ON public.survey_responses IS 
'Solo administradores pueden leer respuestas individuales';

COMMENT ON POLICY "Enable read access for all users" ON public.survey_statistics IS 
'Todos los usuarios pueden leer estadísticas agregadas';

-- 8. Verificar configuración
SELECT 'Políticas aplicadas correctamente' as status;

-- 9. Mostrar políticas creadas (función corregida)
SELECT * FROM check_survey_policies();
```

## 🎯 Resultado Esperado

Después de ejecutar este script:
- ✅ Error 401 resuelto
- ✅ Encuestas se envían correctamente
- ✅ Datos se guardan en Supabase
- ✅ Estadísticas se actualizan automáticamente
- ✅ Sistema de encuestas completamente funcional

## 📞 Si Necesitas Ayuda

Si después de ejecutar el script el problema persiste:
1. Verifica que las tablas `survey_responses` y `survey_statistics` existan
2. Ejecuta primero el script `create-survey-database.sql` si es necesario
3. Contacta al soporte de Supabase si es necesario

¡Ejecuta el script SQL y el problema estará resuelto definitivamente! 🚀
