// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirecionar o usuário
import './login.css'; // Crie este arquivo para estilizar

// URL de autenticação do seu Backend (AJUSTE CONFORME SEU BACKEND)
const AUTH_URL = 'http://localhost:5000/api/auth/login'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '', // Corresponde ao USU_Email
    senha: ''  // Corresponde ao USU_Senha
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook do React Router para navegação

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // 🚨 CHAMADA POST para a API de Login
      const response = await axios.post(AUTH_URL, {
        USU_Email: formData.email,
        USU_Senha: formData.senha,
      });

      // 1. Assumindo que o backend retorna um token JWT
      const token = response.data.token; 
      
      // 2. Armazena o token para futuras requisições (localStorage é o mais comum)
      localStorage.setItem('authToken', token);
      
      // 3. Redireciona para o Dashboard após login bem-sucedido
        navigate('/home'); 

    } catch (err) {
      console.error("Erro no login:", err);
      // Exibe a mensagem de erro da API (se existir) ou uma genérica
      setError('Credenciais inválidas. Tente novamente.'); 
    }
  };

  return (
    <div className="login-container">
      <h2>Acesso Barbeiro/Administrador</h2>
      
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
}

export default Login;