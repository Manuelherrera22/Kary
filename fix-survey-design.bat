@echo off
echo 🎨 Aplicando mejoras de diseño visual a la encuesta...
echo.

echo 📁 Verificando directorio...
cd /d "C:\Users\Corvus\Desktop\Kary"

echo 📋 Verificando estado de Git...
git status

echo.
echo 📦 Agregando archivos modificados...
git add src/components/FeedbackModal.jsx

echo.
echo 💾 Haciendo commit...
git commit -m "🎨 FIX: Mejorar diseño visual de la encuesta - Tema claro y texto visible

✨ Cambios implementados:
- Cambiar tema oscuro por diseño claro y atractivo
- Fondo principal: gradiente slate-50 → white → emerald-50
- Header con gradiente emerald-500 → teal-500 → cyan-500
- Contenido principal con fondo blanco semi-transparente

🔧 Correcciones de visibilidad:
- Campos Select: fondo blanco, texto slate-800, bordes emerald
- Campos Textarea: fondo blanco, texto slate-800, placeholders visibles
- Labels: texto slate-700 con font-medium para mejor contraste
- Botones de navegación: bordes y texto mejorados

🎯 Mejoras visuales:
- Tarjetas de evaluación con fondo blanco sólido
- Indicadores de progreso con gradientes emerald-teal
- Hover effects en elementos interactivos
- Mejor contraste en todos los elementos de texto

✅ Problemas resueltos:
- ❌ Tema negro → ✅ Diseño claro y moderno
- ❌ Texto invisible en campos → ✅ Texto completamente visible
- ❌ Contraste pobre → ✅ Contraste excelente en todos los elementos"

echo.
echo 🚀 Subiendo a GitHub...
git push origin main

echo.
echo ✅ ¡Mejoras de diseño aplicadas exitosamente!
echo 📊 La encuesta ahora tiene:
echo    - Tema claro y atractivo (sin negro)
echo    - Texto completamente visible en todos los campos
echo    - Mejor contraste y legibilidad
echo    - Diseño moderno con gradientes emerald/teal/cyan
echo.
echo 🌐 Verifica el deployment en Netlify
pause
