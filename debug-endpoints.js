// Script para probar todos los endpoints críticos
import axios from 'axios';

const BASE_URL = 'http://localhost:2117/api';

const testEndpoints = async () => {
  console.log('🔍 Probando endpoints críticos...\n');

  const endpoints = [
    { method: 'GET', url: '/test', description: 'Health check' },
    { method: 'GET', url: '/rooms', description: 'Obtener habitaciones', auth: true },
    { method: 'GET', url: '/reservations', description: 'Obtener reservas', auth: true },
    { method: 'GET', url: '/reports/general', description: 'Reportes generales', auth: true },
    { method: 'GET', url: '/reports/reservations', description: 'Reportes reservas', auth: true },
    { method: 'GET', url: '/reports/rooms', description: 'Reportes habitaciones', auth: true },
  ];

  // Primero hacer login para obtener token
  let token = null;
  try {
    console.log('🔐 Intentando login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@admin.com',
      password: 'admin123'
    });
    token = loginRes.data.token;
    console.log('✅ Login exitoso\n');
  } catch (error) {
    console.log('❌ Error en login:', error.response?.data || error.message);
    console.log('ℹ️ Asegúrate de tener un usuario admin creado\n');
  }

  // Probar cada endpoint
  for (const endpoint of endpoints) {
    try {
      const config = {
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.url}`,
      };

      if (endpoint.auth && token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const response = await axios(config);
      console.log(`✅ ${endpoint.method} ${endpoint.url} - ${endpoint.description}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data).substring(0, 100)}...\n`);
    } catch (error) {
      console.log(`❌ ${endpoint.method} ${endpoint.url} - ${endpoint.description}`);
      console.log(`   Status: ${error.response?.status || 'NETWORK_ERROR'}`);
      console.log(`   Error: ${error.response?.data?.message || error.message}\n`);
    }
  }
};

testEndpoints();
