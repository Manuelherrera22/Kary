# 🔧 SOLUCIÓN: Error 401 en Supabase - Políticas RLS

## ❌ Problema Identificado
```
Failed to load resource: the server responded with a status of 401 ()
URL: iypwcvjncttbffwjpodg.supabase.co/rest/v1/survey_responses
```

## 🎯 Causa del Problema
El error 401 indica que las **políticas de Row Level Security (RLS)** en Supabase están bloqueando la inserción de datos de la encuesta.

## ✅ Solución Paso a Paso

### 1. Ejecutar Script de Corrección en Supabase

**Ve a tu proyecto de Supabase:**
1. Abre [supabase.com](https://supabase.com)
2. Ve a tu proyecto `iypwcvjncttbffwjpodg`
3. Ve a **SQL Editor**
4. Copia y pega el contenido completo de `fix-supabase-policies.sql`
5. Haz clic en **Run** para ejecutar el script

### 2. Verificar que las Tablas Existen

Si las tablas no existen, primero ejecuta el script `create-survey-database.sql`:

```sql
-- Ejecutar primero si las tablas no existen
-- (contenido de create-survey-database.sql)
```

### 3. Verificar Políticas Aplicadas

Después de ejecutar el script de corrección, ejecuta esta consulta para verificar:

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

**Deberías ver estas políticas:**

| Tabla | Política | Comando | Descripción |
|-------|----------|---------|-------------|
| survey_responses | Enable insert for anonymous users | INSERT | ✅ Permite inserción anónima |
| survey_responses | Enable read access for admins only | SELECT | ✅ Solo admins pueden leer |
| survey_statistics | Enable read access for all users | SELECT | ✅ Estadísticas públicas |

### 4. Probar la Conexión

Ejecuta esta consulta de prueba:

```sql
-- Insertar datos de prueba
INSERT INTO public.survey_responses (
    user_role,
    age_range,
    tech_experience,
    institution_type,
    usability_rating,
    functionality_rating,
    design_rating,
    performance_rating,
    support_rating,
    recommendation,
    session_id,
    is_anonymous
) VALUES (
    'student',
    '18-25',
    'intermediate',
    'public-school',
    4,
    4,
    5,
    4,
    3,
    'probably',
    'test_session_123',
    true
);

-- Verificar que se insertó
SELECT * FROM public.survey_responses WHERE session_id = 'test_session_123';

-- Limpiar datos de prueba
DELETE FROM public.survey_responses WHERE session_id = 'test_session_123';
```

## 🔍 Diagnóstico Adicional

### Si el Error Persiste

**1. Verificar configuración de RLS:**
```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('survey_responses', 'survey_statistics');
```

**2. Verificar permisos de la clave anónima:**
```sql
-- Verificar que la clave anónima tiene permisos
SELECT current_user, session_user;
```

**3. Verificar configuración de Supabase:**
- Ve a **Settings** → **API**
- Verifica que la **anon public** key esté configurada correctamente
- Verifica que la **service_role** key esté configurada

### Configuración Alternativa (Si es Necesario)

Si las políticas siguen fallando, puedes temporalmente deshabilitar RLS:

```sql
-- ⚠️ SOLO TEMPORAL - Deshabilitar RLS para testing
ALTER TABLE public.survey_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_statistics DISABLE ROW LEVEL SECURITY;

-- Probar inserción
INSERT INTO public.survey_responses (user_role, session_id, is_anonymous) 
VALUES ('student', 'test_123', true);

-- Rehabilitar RLS después del testing
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_statistics ENABLE ROW LEVEL SECURITY;
```

## 🚀 Verificación Final

### 1. Probar en la Aplicación
1. Abre la aplicación Kary
2. Haz clic en "Hacer Encuesta"
3. Completa todos los pasos
4. Verifica que se envíe sin errores

### 2. Verificar en Supabase
1. Ve a **Table Editor**
2. Revisa la tabla `survey_responses`
3. Deberías ver la nueva respuesta

### 3. Verificar Estadísticas
1. Revisa la tabla `survey_statistics`
2. Debería actualizarse automáticamente

## 📞 Si el Problema Persiste

### Opción 1: Contactar Soporte de Supabase
- Ve a [supabase.com/support](https://supabase.com/support)
- Explica el problema con las políticas RLS

### Opción 2: Usar Service Role Key (Temporal)
```javascript
// En src/lib/supabaseClient.js - SOLO TEMPORAL
const supabaseServiceKey = 'tu_service_role_key_aqui';
const supabase = createClient(supabaseUrl, supabaseServiceKey);
```

### Opción 3: Verificar Variables de Entorno
```bash
# Verificar que estas variables estén configuradas
VITE_SUPABASE_URL=https://iypwcvjncttbffwjpodg.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

## 🎯 Resultado Esperado

Después de aplicar la solución:
- ✅ Error 401 resuelto
- ✅ Encuestas se envían correctamente
- ✅ Datos se guardan en Supabase
- ✅ Estadísticas se actualizan automáticamente
- ✅ Sistema de encuestas completamente funcional

¡Ejecuta el script `fix-supabase-policies.sql` y el problema estará resuelto! 🚀
