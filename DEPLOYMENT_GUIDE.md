# 🚀 Guía de Despliegue - Kary Platform

## ✅ Estado Actual
- ✅ **API de Gemini configurada** y funcionando
- ✅ **Aplicación construida** correctamente
- ✅ **Servidor de desarrollo** funcionando en `http://localhost:3000/`
- ✅ **Configuración de Netlify** lista para despliegue

## 🎯 Despliegue en Netlify

### Opción 1: Despliegue Automático (Recomendado)

1. **Conecta tu repositorio a Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `Kary`

2. **Configuración automática:**
   - Netlify detectará automáticamente el archivo `netlify.toml`
   - Las variables de entorno se configurarán automáticamente
   - El despliegue se realizará automáticamente

3. **¡Listo!** Tu aplicación estará disponible en la URL proporcionada por Netlify

### Opción 2: Despliegue Manual

1. **Construye la aplicación:**
   ```bash
   npm run build
   ```

2. **Sube la carpeta `dist` a Netlify:**
   - Arrastra y suelta la carpeta `dist` en el dashboard de Netlify
   - O usa el CLI de Netlify:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## 🔧 Configuración de Variables de Entorno

### En Netlify Dashboard:
1. Ve a **Site settings > Environment variables**
2. Agrega:
   - `VITE_GEMINI_API_KEY` = `AIzaSyBfQj3LxYUtLngyn3YPGJXiVs4xa0yb7QU`
   - `VITE_DEFAULT_AI_PROVIDER` = `gemini`

### En netlify.toml (ya configurado):
```toml
[build.environment]
  VITE_GEMINI_API_KEY = "AIzaSyBfQj3LxYUtLngyn3YPGJXiVs4xa0yb7QU"
  VITE_DEFAULT_AI_PROVIDER = "gemini"
```

## 🏃‍♂️ Desarrollo Local

### Iniciar servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000/`

### Construir para producción:
```bash
npm run build
```

### Previsualizar build de producción:
```bash
npm run preview
```

## 📁 Archivos de Configuración Creados

- ✅ `.env` - Variables de entorno locales
- ✅ `netlify.toml` - Configuración de Netlify
- ✅ `_headers` - Headers de seguridad
- ✅ `_redirects` - Reglas de redirección para SPA
- ✅ `ENVIRONMENT_SETUP.md` - Documentación detallada

## 🔍 Verificación

### ✅ Pruebas Realizadas:
- [x] Dependencias instaladas correctamente
- [x] Aplicación se construye sin errores
- [x] Servidor de desarrollo funciona
- [x] Conexión con Gemini API exitosa
- [x] Variables de entorno configuradas
- [x] Archivos de Netlify creados

### 🌐 URLs:
- **Desarrollo local:** `http://localhost:3000/`
- **Producción:** URL proporcionada por Netlify

## 🚨 Solución de Problemas

### Si el despliegue falla:
1. Verifica que todas las dependencias estén en `package.json`
2. Asegúrate de que las variables de entorno estén configuradas
3. Revisa los logs de Netlify para errores específicos

### Si Gemini no funciona:
1. Verifica que `VITE_GEMINI_API_KEY` esté configurada
2. Comprueba que la API key sea válida
3. Revisa la consola del navegador para errores

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs de Netlify
2. Verifica la consola del navegador
3. Consulta `ENVIRONMENT_SETUP.md` para más detalles

---

## 🎉 ¡Tu aplicación está lista para funcionar!

**Estado:** ✅ **FUNCIONANDO**
**API Gemini:** ✅ **CONFIGURADA**
**Netlify:** ✅ **LISTO PARA DESPLEGAR**
