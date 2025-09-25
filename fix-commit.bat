@echo off
echo 🔧 Ejecutando corrección de importación de Supabase...
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
git commit -m "🔧 FIX: Corregir importación de supabaseClient en surveyService

- Cambiar importación de './supabaseClient' a '@/lib/supabaseClient'
- Resolver error de build en Netlify
- El archivo supabaseClient.js está en src/lib/, no en src/services/"

echo.
echo 🚀 Subiendo a GitHub...
git push origin main

echo.
echo ✅ ¡Corrección completada!
echo 📊 Verifica el deployment en Netlify
pause
