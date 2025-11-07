// src/pages/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

// URL da API de autenticação
const API_URL_LOGIN = 'http://localhost:8080/api/auth/login'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log('=== TENTATIVA DE LOGIN ===');
    console.log('Email:', formData.email);
    console.log('Senha:', formData.senha);

    try {
      // Envia email e senha para o endpoint de login
      const response = await axios.post(API_URL_LOGIN, {
        email: formData.email,
        senha: formData.senha
      });

      console.log('Resposta do backend:', response.data);

      // Armazena informações do usuário no localStorage
      const userData = {
        usuarioId: response.data.usuarioId,
        email: response.data.email,
        perfil: response.data.perfil
      };
      
      console.log('Salvando no localStorage:', userData);
      localStorage.setItem('usuario', JSON.stringify(userData));
      
      // Salva token de autenticação (necessário para o PrivateRoute)
      localStorage.setItem('authToken', 'authenticated');
      
      console.log('Redirecionando para /home...');
      // Redireciona para a home
      navigate('/home');

    } catch (err) {
      console.error("Erro no login:", err);
      console.error("Resposta de erro:", err.response);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Acesso ao Sistema</h2>
      
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;