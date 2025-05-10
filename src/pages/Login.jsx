import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya hay token, redirige automáticamente según el rol
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/me');
          const role = res.data.user.role;
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'receptionist') {
            navigate('/receptionist-dashboard');
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
    };
    checkToken();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      const role = response.data.user.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'receptionist') {
        navigate('/receptionist-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      // Mostrar mensaje de error del backend si existe
      if (error.response && error.response.data && error.response.data.message) {
        alert('❌ ' + error.response.data.message);
      } else {
        alert('❌ Credenciales incorrectas.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div className="card" style={{ minWidth: 320, maxWidth: 380 }}>
        <h1 style={{ textAlign: 'center' }}>Iniciar Sesión</h1>
        <p style={{ color: 'var(--color-subtitle)', marginBottom: 24, textAlign: 'center' }}>Ingresa tus credenciales para continuar.</p>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          className="btn"
          style={{ opacity: !email || !password || loading ? 0.5 : 1, cursor: !email || !password || loading ? 'not-allowed' : 'pointer', marginTop: 16 }}
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <a
            href="#"
            style={{ color: 'var(--color-link)', fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => alert('Funcionalidad de restablecimiento de contraseña próximamente.')}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
