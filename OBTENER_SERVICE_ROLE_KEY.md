# 🔑 OBTENER SERVICE ROLE KEY DE SUPABASE

## 🎯 Para Solucionar el Error 401

### 1. 🔧 Obtener la Service Role Key

**Ve a tu proyecto de Supabase:**
1. Abre [supabase.com](https://supabase.com)
2. Ve a tu proyecto `iypwcvjncttbffwjpodg`
3. Ve a **Settings** → **API**
4. Copia la **service_role** key (NO la anon key)

### 2. 📝 Actualizar el Archivo

**Reemplaza en `src/lib/supabaseClient-temp.js`:**
```javascript
// Reemplaza esta línea:
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Con tu service role key real:
const supabaseServiceKey = 'TU_SERVICE_ROLE_KEY_AQUI';
```

### 3. 🚀 Probar la Encuesta

**Después de actualizar la key:**
1. Refresca la aplicación
2. Completa la encuesta
3. Verifica que se envíe sin error 401

### 4. ⚠️ IMPORTANTE

**Esta es una solución temporal:**
- La service role key tiene permisos completos
- Solo úsala para encuestas
- En producción, configura correctamente la clave anónima

### 5. 🔒 Solución Permanente

**Para una solución permanente:**
1. Ve a **Settings** → **API** en Supabase
2. Verifica que la **anon public** key esté configurada
3. Ejecuta el script de políticas RLS
4. Cambia de vuelta a `supabaseClient.js`

## 🎯 Resultado Esperado

Después de usar la service role key:
- ✅ Error 401 resuelto
- ✅ Encuestas se envían correctamente
- ✅ Datos se guardan en Supabase
- ✅ Sistema funcionando temporalmente

¡Obtén la service role key y actualiza el archivo! 🚀
