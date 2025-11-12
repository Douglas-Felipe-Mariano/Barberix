// src/pages/Login.js

import React, { useState } from 'react';
import axios from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './login.css';

// URL da API de autenticação
const API_URL_LOGIN = '/auth/login'; 

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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

    try {
      // Envia email e senha para o endpoint de login
      const response = await axios.post(API_URL_LOGIN, {
        email: formData.email,
        senha: formData.senha
      });

      console.log('Resposta do backend:', response.data);

      // Armazena informações do usuário usando o AuthContext
      const userData = {
        usuarioId: response.data.usuarioId,
        email: response.data.email,
        perfil: response.data.perfil
      };
      
      console.log('Login realizado com sucesso:', userData);
      console.log('Perfil do usuário:', userData.perfil?.nomePerfil || userData.perfil);
      
      // Usa a função login do contexto
      login(userData);
      
      console.log('Redirecionando para /home...');
      // Redireciona para a home
      navigate('/home');

    } catch (err) {
      console.error("Erro no login:", err);
      console.error("Resposta de erro:", err.response);
      
      // Prefer normalized message from interceptor or fallback to known fields
      const msg = err.normalizedMessage || err.response?.data?.message || 'Erro ao conectar com o servidor. Tente novamente.';
      setError(msg);
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