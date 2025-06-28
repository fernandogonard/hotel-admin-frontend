import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/corona.css';

function Login() {
  const navigate = useNavigate();
  const { login, user, storageError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'receptionist') {
        navigate('/receptionist-dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div style={{ padding: 32 }}>Cargando autenticación...</div>;
  }

  if (storageError) {
    return (
      <div style={{ color: 'red', padding: 32 }}>
        <h2>Error de seguridad</h2>
        <p>No se puede acceder al almacenamiento local del navegador.<br />
        Por favor, revisa la configuración de privacidad o prueba en otro navegador.</p>
        <pre>{storageError}</pre>
      </div>
    );
  }

  if (user) return null;

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }
    setFormLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        // La redirección se maneja automáticamente en useEffect
        console.log('✅ Login exitoso');
      } else {
        setError(result.message || 'Error de autenticación');
      }
    } catch (error) {
      setError('Error de conexión. Verifica tu red e intenta nuevamente.');
      console.error('❌ Error en login:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--corona-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="corona-card" style={{ minWidth: 340, maxWidth: 400 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16, textAlign: 'center', color: 'var(--corona-primary)' }}>Hotel Admin</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="email" style={{ fontWeight: 600 }}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="corona-input"
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="password" style={{ fontWeight: 600 }}>Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="corona-input"
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div style={{
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '14px',
              marginTop: '8px'
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="corona-btn"
            style={{ width: '100%', marginTop: 8, opacity: !email || !password || formLoading ? 0.5 : 1, cursor: !email || !password || formLoading ? 'not-allowed' : 'pointer' }}
            disabled={!email || !password || formLoading}
          >
            {formLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
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
