import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  const [role, setRole] = useState('');

  const handleLogin = () => {
    if (role === 'admin') {
      navigate('/admin-dashboard'); // Redirigir al panel de admin
    } else if (role === 'receptionist') {
      navigate('/reception-dashboard'); // Redirigir al panel de recepcionista
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar Sesión</h1>
        <p style={styles.description}>Selecciona tu rol para continuar.</p>

        <div style={styles.buttonContainer}>
          <button
            onClick={() => setRole('admin')}
            style={{
              ...styles.button,
              backgroundColor: role === 'admin' ? '#1E40AF' : '#2563EB',
            }}
          >
            Administrador
          </button>
          <button
            onClick={() => setRole('receptionist')}
            style={{
              ...styles.button,
              backgroundColor: role === 'receptionist' ? '#1E40AF' : '#2563EB',
            }}
          >
            Recepcionista
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={!role}
          style={{
            ...styles.loginButton,
            opacity: !role ? 0.5 : 1,
            cursor: !role ? 'not-allowed' : 'pointer',
          }}
        >
          Iniciar Sesión
        </button>
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '16px',
    color: '#fff',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    border: 'none',
    cursor: 'pointer',
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
