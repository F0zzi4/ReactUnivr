import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import Auth from "../firebase/authentication/firebase-appconfig"; // Importa la configurazione di Firebase
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(Auth, email, password);
      navigate('/homepage');
    } catch (err) {
      setError("Errore di login: ");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Accedi</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default LoginForm;