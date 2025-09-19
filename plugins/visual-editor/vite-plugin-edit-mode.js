import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { EDIT_MODE_STYLES, POPUP_STYLES } from './visual-editor-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default function inlineEditDevPlugin() {
  return {
    name: 'vite:inline-edit-dev',
    apply: 'serve',
    transformIndexHtml() {
      const scriptPath = resolve(__dirname, 'edit-mode-script.js');
      let scriptContent = readFileSync(scriptPath, 'utf-8');
      
      // Reemplazar la importación con el contenido real
      scriptContent = scriptContent.replace(
        "import { POPUP_STYLES } from './visual-editor-config.js';",
        `const POPUP_STYLES = \`${POPUP_STYLES}\`;`
      );

      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: scriptContent,
          injectTo: 'body'
        },
        {
          tag: 'style',
          children: EDIT_MODE_STYLES,
          injectTo: 'head'
        }
      ];
    }
  };
}
