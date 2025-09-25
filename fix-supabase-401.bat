@echo off
echo 🔧 Solucionando error 401 de Supabase - Políticas RLS...
echo.

echo 📁 Verificando directorio...
cd /d "C:\Users\Corvus\Desktop\Kary"

echo 📋 Verificando estado de Git...
git status

echo.
echo 📦 Agregando archivos...
git add .

echo.
echo 💾 Haciendo commit...
git commit -m "🔧 FIX: Solucionar error 401 de Supabase - Políticas RLS

❌ Problema identificado:
- Error 401 al enviar encuestas a Supabase
- Políticas de Row Level Security bloqueando inserción anónima

✅ Solución implementada:
- Script SQL para corregir políticas RLS (fix-supabase-policies.sql)
- Manejo mejorado de errores en surveyService.js
- Logging detallado para debugging
- Manejo específico de códigos de error de Supabase

🔧 Archivos creados/modificados:
- fix-supabase-policies.sql: Script para corregir políticas
- SOLUCION_ERROR_401_SUPABASE.md: Instrucciones detalladas
- src/services/surveyService.js: Manejo mejorado de errores

📋 Políticas corregidas:
- Enable insert for anonymous users: Permite inserción anónima
- Enable read access for admins only: Solo admins pueden leer respuestas
- Enable read access for all users: Estadísticas públicas

🚀 Próximos pasos:
1. Ejecutar fix-supabase-policies.sql en Supabase
2. Probar envío de encuesta
3. Verificar que datos se guarden correctamente"

echo.
echo 🚀 Subiendo a GitHub...
git push origin main

echo.
echo ✅ ¡Solución aplicada exitosamente!
echo.
echo 📋 PRÓXIMOS PASOS IMPORTANTES:
echo.
echo 1. 🔧 EJECUTAR EN SUPABASE:
echo    - Ve a supabase.com
echo    - Abre tu proyecto iypwcvjncttbffwjpodg
echo    - Ve a SQL Editor
echo    - Copia y pega el contenido de fix-supabase-policies.sql
echo    - Haz clic en Run
echo.
echo 2. 🧪 PROBAR ENCUESTA:
echo    - Abre la aplicación Kary
echo    - Haz clic en 'Hacer Encuesta'
echo    - Completa todos los pasos
echo    - Verifica que se envíe sin error 401
echo.
echo 3. 📊 VERIFICAR DATOS:
echo    - Ve a Table Editor en Supabase
echo    - Revisa la tabla survey_responses
echo    - Deberías ver la nueva respuesta
echo.
echo 🎯 El error 401 debería estar resuelto después de ejecutar el script SQL
pause
