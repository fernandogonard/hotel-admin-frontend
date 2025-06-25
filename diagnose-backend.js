// Script de diagnóstico rápido del backend
import axios from 'axios';

const diagnose = async () => {
  console.log('🔍 Diagnosticando backend...\n');
  
  const tests = [
    {
      name: 'Health Check Simple',
      url: 'http://localhost:2117/api/test',
      timeout: 5000,
      auth: false
    },
    {
      name: 'Ping al puerto',
      url: 'http://localhost:2117',
      timeout: 3000,
      auth: false
    },
    {
      name: 'Login Admin',
      url: 'http://localhost:2117/api/auth/login',
      timeout: 5000,
      method: 'POST',
      data: { email: 'admin@admin.com', password: 'admin123' },
      auth: false
    },
    {
      name: 'Obtener Habitaciones',
      url: 'http://localhost:2117/api/rooms',
      timeout: 10000,
      auth: true
    },
    {
      name: 'Obtener Reservas',
      url: 'http://localhost:2117/api/reservations',
      timeout: 10000,
      auth: true
    },
    {
      name: 'Reportes Generales',
      url: 'http://localhost:2117/api/reports/general',
      timeout: 5000,
      auth: true
    }
  ];

  let token = null;

  for (const test of tests) {
    try {
      console.log(`⏳ Probando: ${test.name}`);
      const start = Date.now();
      
      const config = {
        method: test.method || 'GET',
        url: test.url,
        timeout: test.timeout,
        headers: { 'Accept': 'application/json' }
      };

      if (test.data) {
        config.data = test.data;
        config.headers['Content-Type'] = 'application/json';
      }

      if (test.auth && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios(config);
      
      const duration = Date.now() - start;
      console.log(`✅ ${test.name}: ${response.status} (${duration}ms)`);
      
      // Guardar token del login
      if (test.name === 'Login Admin' && response.data.token) {
        token = response.data.token;
        console.log(`   Token obtenido: ${token.substring(0, 20)}...`);
      } else {
        console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
      console.log('');
      
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.code || error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data).substring(0, 100)}`);
      }
      console.log('');
    }
  }

  // Verificar si el proceso está corriendo
  console.log('🔍 Para verificar si el backend está corriendo:');
  console.log('   Windows: netstat -an | findstr :2117');
  console.log('   Linux/Mac: lsof -i :2117');
  console.log('\n💡 Si no responde, reinicia el backend:');
  console.log('   cd hotel-admin-backend');
  console.log('   npm start');
};

diagnose();
