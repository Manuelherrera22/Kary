# 🔧 Configuración de Gemini AI - Solución de Problemas

## 🚨 Problema Detectado

El sistema ha detectado que la API key de Gemini AI no está configurada correctamente. Esto es normal en un entorno de desarrollo y se puede solucionar fácilmente.

## ✅ Solución Paso a Paso

### **1. Obtener API Key de Gemini**

1. **Ve a Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Inicia sesión** con tu cuenta de Google
3. **Haz clic en "Create API Key"**
4. **Copia la API key** generada (comienza con "AIza...")

### **2. Configurar la API Key**

#### **Opción A: Archivo .env (Recomendado)**
1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega la siguiente línea:
   ```
   VITE_GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Reemplaza `tu_api_key_aqui` con tu API key real
4. Reinicia el servidor de desarrollo (`npm run dev`)

#### **Opción B: Configuración Temporal**
1. Ve al Dashboard de Administrador
2. Busca la tarjeta "Pruebas de Gemini AI"
3. Haz clic en "Configurar API Key"
4. Ingresa tu API key en el campo
5. Haz clic en "Configurar API Key"

### **3. Verificar la Configuración**

#### **Método 1: Panel de Pruebas**
1. Ve al Dashboard de Administrador
2. Busca la tarjeta "Pruebas de Gemini AI"
3. Haz clic en "Prueba Rápida"
4. Debería mostrar "✅ Prueba rápida: PASÓ"

#### **Método 2: Consola del Navegador**
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Ejecuta: `await testGeminiAI("quick")`
4. Debería mostrar "✅ Prueba rápida: PASÓ"

#### **Método 3: Chat Universal**
1. Ve a cualquier dashboard
2. Busca el botón de chat de Gemini AI
3. Escribe un mensaje
4. Debería responder con contenido real en lugar de mensajes de error

## 🔍 Verificación de la Configuración

### **Archivo .env Correcto**
```env
# Configuración de Gemini AI
VITE_GEMINI_API_KEY=AIzaSyC...tu_api_key_real_aqui

# Otras configuraciones (opcional)
VITE_APP_NAME=Kary Platform
VITE_APP_VERSION=1.0.0
```

### **Verificar Variables de Entorno**
En la consola del navegador, ejecuta:
```javascript
console.log('API Key configurada:', import.meta.env.VITE_GEMINI_API_KEY ? 'Sí' : 'No');
```

## 🚨 Errores Comunes y Soluciones

### **Error: "API key not valid"**
- **Causa**: La API key es incorrecta o está mal copiada
- **Solución**: Verifica que la API key esté correctamente copiada desde Google AI Studio

### **Error: "API key not configured"**
- **Causa**: No se ha configurado la variable de entorno
- **Solución**: Crea el archivo `.env` con la API key o usa la configuración temporal

### **Error: "Invalid API key format"**
- **Causa**: La API key no tiene el formato correcto
- **Solución**: Asegúrate de que la API key comience con "AIza" y tenga al menos 39 caracteres

### **Error: "Quota exceeded"**
- **Causa**: Has excedido el límite de uso de la API
- **Solución**: Espera hasta el próximo período de facturación o actualiza tu plan

## 📊 Estado del Sistema

### **Modo Demo (Sin API Key)**
- ✅ Sistema funciona con datos mock
- ✅ Todas las funciones están disponibles
- ⚠️ Las respuestas son predefinidas
- ⚠️ No hay personalización real

### **Modo Real (Con API Key)**
- ✅ Sistema funciona con Gemini AI real
- ✅ Respuestas personalizadas y contextuales
- ✅ Análisis inteligente de datos
- ✅ Chat interactivo real

## 🎯 Próximos Pasos

Una vez configurada la API key:

1. **Ejecuta la Suite Completa de Pruebas**
   ```javascript
   await testGeminiAI("full")
   ```

2. **Prueba cada Dashboard**
   - Profesor: Insights de clase
   - Estudiante: Recomendaciones personalizadas
   - Padres: Análisis familiar
   - Psicopedagogo: Análisis de casos
   - Administrador: Reportes institucionales

3. **Verifica el Chat Universal**
   - Escribe mensajes en cada dashboard
   - Verifica que las respuestas sean contextuales
   - Prueba las preguntas rápidas

4. **Prueba el Sistema de Actividades**
   - Genera actividades dinámicas
   - Verifica el análisis de respuestas
   - Prueba la personalización

## 📞 Soporte Adicional

Si continúas teniendo problemas:

1. **Revisa los Logs**: Consola del navegador y terminal
2. **Verifica la Configuración**: Archivo .env y variables de entorno
3. **Prueba la API Key**: Directamente en Google AI Studio
4. **Contacta al Administrador**: Con detalles específicos del error

## 🎉 ¡Configuración Completada!

Una vez que la API key esté configurada correctamente:

- ✅ Todas las funciones de IA estarán operativas
- ✅ El sistema será verdaderamente inteligente
- ✅ Las respuestas serán personalizadas y contextuales
- ✅ La experiencia educativa será optimizada

**¡Tu sistema Kary estará completamente funcional con Gemini AI!** 🚀✨
