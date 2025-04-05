import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("✅ Login exitoso:", data);
        
        // Guardamos en context
        setUser(data.user);
        setToken(data.token);

        // Guardamos también en localStorage (opcional)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según rol
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.user.role === "recepcionista") {
          navigate("/recepcion/dashboard");
        } else {
          navigate("/");
        }

      } else {
        console.error("❌ Error de login:", data.message || data);
        alert("Credenciales incorrectas o usuario no encontrado");
      }

    } catch (error) {
      console.error("❌ Error de conexión con el backend:", error);
      alert("Error del servidor o conexión");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
