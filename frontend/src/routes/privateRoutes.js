// src/routes/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MenuLateral from '../pages/menuLateral/menuLateral';

/**
 * Componente que protege rotas com autenticação e autorização
 * @param {Component} element - Componente da página a ser renderizada
 * @param {Array} allowedProfiles - Lista de perfis permitidos (ex: ['ADMIN', 'GERENTE'])
 */
const PrivateRoute = ({ element: Element, allowedProfiles = [], ...rest }) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();

  // Aguarda o carregamento do contexto
  if (loading) {
    return <div>Carregando...</div>;
  }

  // 1. Verifica se está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/" replace />; 
  }

  // 2. Verifica se tem permissão para acessar esta rota
  if (!hasPermission(allowedProfiles)) {
    // Redireciona para uma página de acesso negado ou volta para home
    return (
      <div style={{ minHeight: '100vh' }}>
        <MenuLateral />
        <div className="page-content-with-menu" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>🚫 Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta página.</p>
          <p>Entre em contato com o administrador do sistema.</p>
        </div>
      </div>
    );
  }

  // 3. Se estiver autenticado e autorizado, renderiza o Menu e o Conteúdo
  return (
    <div style={{ minHeight: '100vh' }}>
      <MenuLateral /> 
      <div className="page-content-with-menu" style={{ padding: '0', boxSizing: 'border-box' }}>
        <Element {...rest} />
      </div>
    </div>
  );
};

export default PrivateRoute;