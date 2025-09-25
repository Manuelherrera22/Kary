#!/usr/bin/env node

// 🔧 Script para quitar referencias a "Gemini" de la interfaz
// Mantiene toda la funcionalidad pero cambia los nombres mostrados

const fs = require('fs');
const path = require('path');

// Archivos a modificar
const filesToUpdate = [
  'src/components/UniversalGeminiChat.jsx',
  'src/components/GeminiChatAssistant.jsx',
  'src/components/GeminiConfigHelper.jsx',
  'src/components/GeminiResultsPanel.jsx',
  'src/components/GeminiTestPanel.jsx',
  'src/components/TeacherGeminiInsights.jsx',
  'src/components/ai/GeminiStatusCard.jsx',
  'src/components/IntelligentAssistantChat.jsx',
  'src/components/ResponsiveAssistantChat.jsx',
  'src/components/SpectacularSupportPlanGenerator.jsx'
];

// Reemplazos a realizar
const replacements = [
  // Títulos y textos de interfaz
  { from: /Gemini/g, to: 'IA' },
  { from: /gemini/g, to: 'ia' },
  { from: 'Asistente Gemini', to: 'Asistente IA' },
  { from: 'Chat Gemini', to: 'Chat IA' },
  { from: 'Configuración Gemini', to: 'Configuración IA' },
  { from: 'Panel Gemini', to: 'Panel IA' },
  { from: 'Insights Gemini', to: 'Insights IA' },
  { from: 'Estado Gemini', to: 'Estado IA' },
  { from: 'Test Gemini', to: 'Test IA' },
  { from: 'Resultados Gemini', to: 'Resultados IA' },
  
  // Textos descriptivos
  { from: 'Powered by Gemini', to: 'Powered by IA' },
  { from: 'Gemini AI', to: 'IA Avanzada' },
  { from: 'Gemini Pro', to: 'IA Pro' },
  { from: 'Gemini Flash', to: 'IA Flash' },
  
  // Mensajes y tooltips
  { from: 'Conectando con Gemini', to: 'Conectando con IA' },
  { from: 'Gemini está disponible', to: 'IA está disponible' },
  { from: 'Gemini no está disponible', to: 'IA no está disponible' },
  { from: 'Configurar Gemini', to: 'Configurar IA' },
  { from: 'Probar Gemini', to: 'Probar IA' },
  
  // Clases CSS y IDs
  { from: 'gemini-', to: 'ai-' },
  { from: 'Gemini', to: 'AI' }
];

function updateFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Aplicar reemplazos
    replacements.forEach(replacement => {
      const newContent = content.replace(replacement.from, replacement.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
    } else {
      console.log(`➖ Sin cambios: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error en ${filePath}:`, error.message);
  }
}

// Ejecutar actualizaciones
console.log('🔧 Quitando referencias a "Gemini" de la interfaz...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✅ Proceso completado!');
console.log('📋 Verifica que la funcionalidad siga funcionando correctamente.');
console.log('⚠️  Los servicios internos siguen usando Gemini pero la interfaz ya no lo menciona.');
