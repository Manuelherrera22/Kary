// Script para configurar nueva API key de Gemini
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 Configurador de API Key de Gemini AI');
console.log('=====================================\n');

console.log('📋 Instrucciones:');
console.log('1. Ve a: https://makersuite.google.com/app/apikey');
console.log('2. Inicia sesión con tu cuenta de Google');
console.log('3. Crea una nueva API key');
console.log('4. Copia la API key generada\n');

rl.question('🔑 Ingresa tu nueva API key de Gemini: ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ Error: Debes ingresar una API key válida');
    rl.close();
    return;
  }

  // Validar formato básico de API key
  if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
    console.log('⚠️ Advertencia: La API key no parece tener el formato correcto');
    console.log('Las API keys de Gemini suelen comenzar con "AIza" y tener al menos 30 caracteres');
    
    rl.question('¿Continuar de todas formas? (y/n): ', (confirm) => {
      if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
        console.log('❌ Configuración cancelada');
        rl.close();
        return;
      }
      updateEnvFile(apiKey.trim());
    });
  } else {
    updateEnvFile(apiKey.trim());
  }
});

function updateEnvFile(apiKey) {
  try {
    // Leer archivo .env actual
    let envContent = '';
    if (fs.existsSync('.env')) {
      envContent = fs.readFileSync('.env', 'utf8');
    }

    // Actualizar o agregar VITE_GEMINI_API_KEY
    const lines = envContent.split('\n');
    let updated = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('VITE_GEMINI_API_KEY=')) {
        lines[i] = `VITE_GEMINI_API_KEY=${apiKey}`;
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      lines.push(`VITE_GEMINI_API_KEY=${apiKey}`);
    }
    
    // Asegurar que VITE_DEFAULT_AI_PROVIDER esté configurado
    let hasProvider = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('VITE_DEFAULT_AI_PROVIDER=')) {
        hasProvider = true;
        break;
      }
    }
    
    if (!hasProvider) {
      lines.push('VITE_DEFAULT_AI_PROVIDER=gemini');
    }
    
    // Escribir archivo actualizado
    const newContent = lines.join('\n');
    fs.writeFileSync('.env', newContent);
    
    console.log('\n✅ API key configurada exitosamente!');
    console.log('📁 Archivo .env actualizado');
    console.log('\n🚀 Próximos pasos:');
    console.log('1. Reinicia el servidor de desarrollo: npm run dev');
    console.log('2. Prueba la integración: node test-gemini-integration.js');
    console.log('3. Verifica que las funciones de IA funcionen en la aplicación');
    
    console.log('\n🎯 Funcionalidades que se activarán:');
    console.log('• Generación de planes de apoyo basados en PIAR');
    console.log('• Generación de actividades personalizadas');
    console.log('• Chat inteligente con Kary');
    console.log('• Insights educativos para todos los roles');
    console.log('• Análisis psicopedagógico automatizado');
    
    console.log('\n🎉 ¡Kary estará completamente funcional con IA real!');
    
  } catch (error) {
    console.error('❌ Error actualizando archivo .env:', error.message);
  }
  
  rl.close();
}
