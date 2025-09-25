# 📊 Configuración de Base de Datos para Encuestas Kary

## 🎯 Objetivo
Configurar una base de datos en Supabase para recopilar y analizar las respuestas de la encuesta profesional de Kary.

## 🚀 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa la información del proyecto:
   - **Name**: `kary-surveys`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la región más cercana
5. Haz clic en "Create new project"

### 2. Configurar Variables de Entorno
Agrega estas variables a tu archivo `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui
```

**Para obtener estas variables:**
1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia la **Project URL** y **anon public** key
3. Reemplaza los valores en tu archivo `.env`

### 3. Crear las Tablas
Ejecuta el script SQL que está en `create-survey-database.sql`:

1. En Supabase, ve a **SQL Editor**
2. Copia y pega el contenido completo de `create-survey-database.sql`
3. Haz clic en **Run** para ejecutar el script

### 4. Verificar la Configuración
Después de ejecutar el script, deberías ver estas tablas creadas:

- ✅ `survey_responses` - Almacena las respuestas de las encuestas
- ✅ `survey_statistics` - Estadísticas agregadas para análisis rápido

## 📋 Estructura de la Base de Datos

### Tabla `survey_responses`
```sql
- id (UUID) - Identificador único
- created_at (TIMESTAMP) - Fecha de creación
- user_role (TEXT) - Rol del usuario (student, teacher, etc.)
- age_range (TEXT) - Rango de edad
- tech_experience (TEXT) - Experiencia con tecnología
- institution_type (TEXT) - Tipo de institución
- usability_rating (INTEGER) - Rating de facilidad de uso (1-5)
- functionality_rating (INTEGER) - Rating de funcionalidad (1-5)
- design_rating (INTEGER) - Rating de diseño (1-5)
- performance_rating (INTEGER) - Rating de rendimiento (1-5)
- support_rating (INTEGER) - Rating de soporte (1-5)
- positive_feedback (TEXT) - Feedback positivo
- negative_feedback (TEXT) - Feedback negativo
- suggestions (TEXT) - Sugerencias
- recommendation (TEXT) - Nivel de recomendación
- impact_description (TEXT) - Descripción del impacto
- additional_comments (TEXT) - Comentarios adicionales
- session_id (TEXT) - ID de sesión
- completion_time (INTEGER) - Tiempo de completación en segundos
- is_anonymous (BOOLEAN) - Si la respuesta es anónima
```

### Tabla `survey_statistics`
```sql
- id (UUID) - Identificador único
- created_at (TIMESTAMP) - Fecha de creación
- student_count (INTEGER) - Número de estudiantes
- teacher_count (INTEGER) - Número de profesores
- psychopedagogue_count (INTEGER) - Número de psicopedagogos
- parent_count (INTEGER) - Número de padres/madres
- director_count (INTEGER) - Número de directivos
- avg_usability (DECIMAL) - Promedio de facilidad de uso
- avg_functionality (DECIMAL) - Promedio de funcionalidad
- avg_design (DECIMAL) - Promedio de diseño
- avg_performance (DECIMAL) - Promedio de rendimiento
- avg_support (DECIMAL) - Promedio de soporte
- definitely_count (INTEGER) - Respuestas "definitivamente sí"
- probably_count (INTEGER) - Respuestas "probablemente sí"
- neutral_count (INTEGER) - Respuestas neutrales
- probably_not_count (INTEGER) - Respuestas "probablemente no"
- definitely_not_count (INTEGER) - Respuestas "definitivamente no"
- total_responses (INTEGER) - Total de respuestas
- last_updated (TIMESTAMP) - Última actualización
```

## 🔒 Seguridad y Privacidad

### Row Level Security (RLS)
- ✅ Habilitado en ambas tablas
- ✅ Permite inserción anónima para encuestas
- ✅ Solo administradores pueden leer respuestas individuales
- ✅ Estadísticas son públicas para análisis

### Políticas de Seguridad
```sql
-- Permitir inserción anónima
CREATE POLICY "Allow anonymous survey submissions" ON survey_responses
    FOR INSERT WITH CHECK (true);

-- Solo administradores pueden leer respuestas
CREATE POLICY "Allow admin read access" ON survey_responses
    FOR SELECT USING (auth.role() = 'admin');

-- Estadísticas públicas
CREATE POLICY "Allow read access to statistics" ON survey_statistics
    FOR SELECT USING (true);
```

## 📊 Características Implementadas

### ✅ Funcionalidades Principales
- **Formulario Multi-paso**: Encuesta profesional con 7 pasos
- **Validación de Datos**: Validación completa antes de envío
- **Diseño Atractivo**: Colores emerald/teal/cyan en lugar de negro
- **Integración Supabase**: Envío automático a base de datos
- **Estadísticas en Tiempo Real**: Actualización automática de estadísticas
- **Anonimato**: Respuestas completamente anónimas
- **Responsive**: Funciona en todos los dispositivos

### ✅ Mejoras Visuales
- **Gradientes Modernos**: Emerald → Teal → Cyan
- **Iconos Coloridos**: Iconos con gradientes para cada rol
- **Animaciones Suaves**: Transiciones y hover effects
- **Estados de Carga**: Indicadores de progreso y loading
- **Feedback Visual**: Toast notifications para éxito/error

### ✅ Análisis de Datos
- **Estadísticas Automáticas**: Trigger que actualiza estadísticas
- **Distribución por Rol**: Conteo por tipo de usuario
- **Ratings Promedio**: Promedio de cada categoría
- **Análisis de Recomendaciones**: Distribución de recomendaciones
- **Tiempo de Completación**: Tracking del tiempo de respuesta

## 🧪 Testing

### Probar la Encuesta
1. Abre la aplicación Kary
2. Busca el botón "Hacer Encuesta" (con gradiente emerald/teal/cyan)
3. Completa todos los pasos
4. Verifica que se envíe correctamente
5. Revisa las estadísticas en tiempo real

### Verificar en Supabase
1. Ve a **Table Editor** en Supabase
2. Revisa la tabla `survey_responses` para ver nuevas respuestas
3. Revisa la tabla `survey_statistics` para ver estadísticas actualizadas

## 🚀 Próximos Pasos

### Funcionalidades Adicionales (Opcionales)
- [ ] Dashboard de administración para ver respuestas detalladas
- [ ] Exportación de datos a CSV/Excel
- [ ] Gráficos avanzados con Chart.js
- [ ] Notificaciones por email cuando se reciben respuestas
- [ ] Filtros avanzados por fecha, rol, etc.
- [ ] API endpoints para integración externa

### Mejoras de UX
- [ ] Guardado automático de progreso
- [ ] Modo offline con sincronización posterior
- [ ] Múltiples idiomas para la encuesta
- [ ] Personalización de colores por institución

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Verifica las variables de entorno** en `.env`
2. **Revisa la consola** del navegador para errores
3. **Verifica la conexión** a Supabase en el dashboard
4. **Ejecuta el script SQL** completo sin errores

## 🎉 ¡Listo!

Una vez completados estos pasos, tendrás:
- ✅ Base de datos configurada en Supabase
- ✅ Formulario de encuesta con diseño atractivo
- ✅ Integración completa con la base de datos
- ✅ Estadísticas en tiempo real
- ✅ Sistema de encuestas profesional funcionando

¡La encuesta está lista para recopilar feedback valioso de los usuarios de Kary! 🚀
