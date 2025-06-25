// 🔧 SCRIPT DE DIAGNÓSTICO RÁPIDO
// Ejecutar en la consola del navegador para diagnosticar problemas

console.log('🔍 DIAGNÓSTICO DE CONECTIVIDAD');

// Test 1: Verificar variables de entorno
console.log('📝 Variables de entorno:');
console.log('import.meta.env.PROD:', import.meta.env.PROD);
console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);

// Test 2: Verificar token de autenticación
console.log('🔐 Token de autenticación:');
const token = localStorage.getItem('token');
console.log('Token presente:', !!token);
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expirado:', payload.exp < Date.now() / 1000);
  } catch (e) {
    console.log('Token inválido:', e);
  }
}

// Test 3: Probar petición directa
console.log('🌐 Probando peticiones...');

// Test con fetch directo
fetch('/api/test')
  .then(res => res.json())
  .then(data => console.log('✅ /api/test (proxy):', data))
  .catch(err => console.log('❌ /api/test (proxy):', err));

// Test con URL completa
fetch('http://localhost:2117/api/test')
  .then(res => res.json())
  .then(data => console.log('✅ localhost:2117/api/test:', data))
  .catch(err => console.log('❌ localhost:2117/api/test:', err));

// Test con autenticación
if (token) {
  fetch('/api/rooms', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      console.log('🏠 /api/rooms status:', res.status);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    })
    .then(data => console.log('✅ /api/rooms data:', data?.length || 0, 'rooms'))
    .catch(err => console.log('❌ /api/rooms error:', err));
}

console.log('🔍 Diagnóstico completado. Revisar logs arriba.');
