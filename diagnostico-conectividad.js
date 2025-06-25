// Diagnóstico de conectividad backend - frontend
// Ejecutar desde la consola del navegador en http://localhost:5173

console.log('🔍 DIAGNÓSTICO DE CONECTIVIDAD - FRONTEND A BACKEND');
console.log('================================================');

async function diagnosticarConectividad() {
  const endpoints = [
    { name: 'Test directo backend', url: 'http://localhost:2117/api/test' },
    { name: 'Test proxy frontend', url: '/api/test' },
    { name: 'Rooms directo backend', url: 'http://localhost:2117/api/rooms' },
    { name: 'Rooms proxy frontend', url: '/api/rooms' },
    { name: 'Reports directo backend', url: 'http://localhost:2117/api/reports/general' },
    { name: 'Reports proxy frontend', url: '/api/reports/general' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🌐 Probando: ${endpoint.name}`);
      console.log(`   URL: ${endpoint.url}`);
      
      const startTime = Date.now();
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'no-token'}`
        }
      });
      const endTime = Date.now();
      
      const text = await response.text();
      
      console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
      console.log(`   ⏱️  Tiempo: ${endTime - startTime}ms`);
      console.log(`   📝 Respuesta: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🔚 Diagnóstico completado');
}

// Ejecutar automáticamente
diagnosticarConectividad();
