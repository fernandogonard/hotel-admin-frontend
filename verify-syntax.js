  // Verificar sintaxis del archivo useAuth.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

console.log('🔍 Verificando sintaxis de useAuth.js...');

try {
  // Simular importación del archivo
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const useAuthPath = path.join(__dirname, 'src/hooks/useAuth.js');
  const content = fs.readFileSync(useAuthPath, 'utf8');
  
  // Verificar que no hay caracteres extraños o problemas obvios
  const lines = content.split('\n');
  console.log(`✅ Archivo tiene ${lines.length} líneas`);
  
  // Verificar la línea 223 específicamente
  if (lines[222]) {
    console.log(`✅ Línea 223: "${lines[222]}"`);
  } else {
    console.log('✅ La línea 223 no existe (el archivo es más corto)');
  }
  
  // Verificar paréntesis y llaves balanceadas
  const openParens = (content.match(/\(/g) || []).length;
  const closeParens = (content.match(/\)/g) || []).length;
  const openBraces = (content.match(/\{/g) || []).length;
  const closeBraces = (content.match(/\}/g) || []).length;
  
  console.log(`Paréntesis: ${openParens} abrir, ${closeParens} cerrar`);
  console.log(`Llaves: ${openBraces} abrir, ${closeBraces} cerrar`);
  
  if (openParens === closeParens && openBraces === closeBraces) {
    console.log('✅ Paréntesis y llaves están balanceadas');
  } else {
    console.log('❌ Paréntesis o llaves no están balanceadas');
  }
  
  console.log('✅ Verificación completada');
  
} catch (error) {
  console.error('❌ Error verificando archivo:', error.message);
}
