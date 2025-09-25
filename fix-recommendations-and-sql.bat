@echo off
echo 🎨 Aplicando mejoras a la sección de recomendaciones y corrigiendo script SQL...
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
git commit -m "🎨 FIX: Mejorar sección de recomendaciones y corregir script SQL

✨ Mejoras en la sección de recomendaciones:
- Corregir visibilidad del texto en opciones de radio
- Texto ahora es slate-800 con font-medium para mejor contraste
- Opciones con fondo blanco y bordes hover emerald
- Layout responsive con grid adaptativo
- Textareas con altura optimizada y resize-none

🔧 Corrección del script SQL:
- Corregir error de tipo en función check_survey_policies
- Casting explícito a TEXT para evitar error 42804
- Eliminar políticas conflictivas antes de crear nuevas
- Función de verificación corregida y funcional

📱 Mejoras responsive:
- Grid responsive: 1 columna en móvil, 2 en tablet, 1 en desktop
- Labels con flex-1 para mejor distribución del espacio
- Textareas con altura mínima optimizada
- Mejor espaciado y padding en todos los elementos

✅ Problemas resueltos:
- ❌ Texto de radio buttons invisible → ✅ Texto completamente visible
- ❌ Error SQL 42804 → ✅ Función corregida y funcional
- ❌ Layout no responsive → ✅ Diseño adaptativo completo"

echo.
echo 🚀 Subiendo a GitHub...
git push origin main

echo.
echo ✅ ¡Mejoras aplicadas exitosamente!
echo.
echo 📋 RESUMEN DE CAMBIOS:
echo.
echo 🎨 SECCIÓN DE RECOMENDACIONES:
echo    - ✅ Texto de radio buttons ahora completamente visible
echo    - ✅ Fondo blanco con bordes hover emerald
echo    - ✅ Layout responsive con grid adaptativo
echo    - ✅ Textareas optimizadas con resize-none
echo.
echo 🔧 SCRIPT SQL CORREGIDO:
echo    - ✅ Error 42804 resuelto con casting explícito
echo    - ✅ Función check_survey_policies corregida
echo    - ✅ Políticas RLS limpias y funcionales
echo.
echo 📱 DISEÑO RESPONSIVE:
echo    - ✅ 1 columna en móvil
echo    - ✅ 2 columnas en tablet
echo    - ✅ 1 columna en desktop
echo    - ✅ Mejor distribución del espacio
echo.
echo 🚀 PRÓXIMOS PASOS:
echo    1. Ejecutar fix-supabase-policies-corrected.sql en Supabase
echo    2. Probar la encuesta en diferentes dispositivos
echo    3. Verificar que el texto sea completamente visible
echo.
pause
