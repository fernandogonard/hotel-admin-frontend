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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        <p style={styles.description}>Ingresa tus credenciales para continuar.</p>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          style={{
            ...styles.loginButton,
            opacity: !email || !password || loading ? 0.5 : 1,
            cursor: !email || !password || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
        <div style={{ marginTop: '16px' }}>
          <a
            href="#"
            style={{ color: '#2563EB', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => alert('Funcionalidad de restablecimiento de contraseña próximamente.')}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 16px',
  },
  card: {
    backgroundColor: '#fff',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #93c5fd',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: '16px',
  },
  description: {
    color: '#6b7280',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  loginButton: {
    marginTop: '24px',
    backgroundColor: '#2563EB',
    color: '#fff',
    fontWeight: '500',
    padding: '12px 30px',
    borderRadius: '16px',
    fontSize: '14px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  },
};

export default Login;
