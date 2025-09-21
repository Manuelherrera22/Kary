# Instrucciones de Configuración del Sistema PIAR

## 🚀 Configuración Actual

El sistema PIAR está configurado para usar **datos mock** por defecto, lo que significa que funciona inmediatamente sin necesidad de configuración adicional de base de datos.

## 📋 Cómo Cambiar a Modo Real (Supabase)

### Paso 1: Crear la Tabla en Supabase

1. **Acceder a Supabase Dashboard**:
   - Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecciona tu proyecto

2. **Ejecutar el Script SQL**:
   - Ve a "SQL Editor" en el menú lateral
   - Copia y pega el contenido completo del archivo `create-piar-table.sql`
   - Haz clic en "Run" para ejecutar el script

3. **Verificar la Creación**:
   - Ve a "Table Editor" en el menú lateral
   - Deberías ver la tabla `piars` en la lista

### Paso 2: Actualizar la Configuración

1. **Editar el archivo de configuración**:
   ```javascript
   // Archivo: src/config/piarConfig.js
   
   export const PIAR_CONFIG = {
     // Cambiar de true a false
     USE_MOCK_DATA: false,
     
     // Resto de la configuración permanece igual
     // ...
   };
   ```

2. **Reiniciar la aplicación**:
   - Detén el servidor de desarrollo (Ctrl+C)
   - Ejecuta `npm run dev` nuevamente

### Paso 3: Verificar el Funcionamiento

1. **Abrir la aplicación** en el navegador
2. **Iniciar sesión** como psicopedagogo
3. **Ir a la tab "PIARs"**
4. **Verificar que no aparezca el badge "Modo Demo"**

## 🔧 Configuración Avanzada

### Personalizar Datos Mock

Si quieres modificar los datos de ejemplo:

```javascript
// Archivo: src/hooks/usePIARData.js
// Busca la constante MOCK_PIARS y modifica los datos según necesites
```

### Ajustar Configuración de UI

```javascript
// Archivo: src/config/piarConfig.js
export const PIAR_CONFIG = {
  // ... otras configuraciones
  
  UI_CONFIG: {
    // Cambiar duración de animaciones
    ANIMATION_DURATION: 500,
    
    // Cambiar número de elementos por página
    ITEMS_PER_PAGE: 20,
    
    // Habilitar/deshabilitar logs de debug
    DEBUG_LOGS: false,
    
    // ... otras configuraciones
  }
};
```

## 🚨 Solución de Problemas

### Error: "Could not find a relationship between 'piars' and 'user_profiles'"

**Causa**: La tabla `piars` no existe o las relaciones no están configuradas correctamente.

**Solución**:
1. Ejecutar el script `create-piar-table.sql` completo
2. Verificar que la tabla `user_profiles` existe
3. Verificar que las políticas RLS están configuradas

### Error: "Row-level security policy violation"

**Causa**: Las políticas de seguridad están bloqueando el acceso.

**Solución**:
1. Verificar que el usuario tiene el rol correcto
2. Revisar las políticas RLS en Supabase
3. Temporalmente deshabilitar RLS para testing (NO recomendado en producción)

### Los datos no se guardan

**Causa**: Problemas de permisos o configuración de Supabase.

**Solución**:
1. Verificar que `USE_MOCK_DATA: false` en la configuración
2. Verificar que las políticas RLS permiten INSERT/UPDATE
3. Revisar los logs de la consola del navegador

## 📊 Estructura de la Tabla PIARs

La tabla `piars` incluye los siguientes campos:

- `id`: UUID único del PIAR
- `student_id`: Referencia al estudiante
- `created_by`: Referencia al psicopedagogo que creó el PIAR
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización
- `status`: Estado del PIAR (active, inactive, review_pending)
- `diagnostic_info`: Información diagnóstica (JSONB)
- `specific_needs`: Necesidades específicas (JSONB array)
- `reasonable_adjustments`: Ajustes razonables (JSONB array)
- `goals`: Objetivos del PIAR (JSONB array)
- `teaching_strategies`: Estrategias de enseñanza (JSONB array)
- `recommended_activities`: Actividades recomendadas (JSONB array)
- `progress_tracking`: Seguimiento del progreso (JSONB)

## 🔐 Políticas de Seguridad

El sistema incluye las siguientes políticas RLS:

- **Psychopedagogues**: Pueden crear, leer y actualizar todos los PIARs
- **Teachers**: Pueden leer PIARs de sus estudiantes
- **Parents**: Pueden leer PIARs de sus hijos
- **Students**: No tienen acceso directo (a través de padres/profesores)

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs**: Abrir la consola del navegador (F12)
2. **Verificar configuración**: Confirmar que `USE_MOCK_DATA` está configurado correctamente
3. **Probar modo mock**: Temporalmente cambiar a `USE_MOCK_DATA: true` para verificar que el sistema funciona
4. **Revisar Supabase**: Verificar que la tabla existe y las políticas están configuradas

---

**Sistema PIAR v1.0** - Configuración y Solución de Problemas
