// src/routes/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import MenuLateral from '../pages/menuLateral/menuLateral';

// Define a largura do menu lateral
const MENU_WIDTH = '250px'; 

// Este componente recebe o componente da página a ser renderizada (Element)
const PrivateRoute = ({ element: Element, ...rest }) => {
  
  // 1. REGRA DE SEGURANÇA: Verifica se o token existe (Mock de autenticação)
  // Em um sistema real, você também verificaria a validade do token.
  const isAuthenticated = localStorage.getItem('authToken');

  // Se NÃO estiver autenticado, redireciona para o Login ('/' é a rota de Login)
  if (!isAuthenticated) {
    // Usamos 'replace' para evitar que o usuário volte para a rota restrita com o botão Voltar
    return <Navigate to="/" replace />; 
  }

  // 2. LAYOUT: Se estiver autenticado, renderiza o Menu e o Conteúdo da Página
  return (
    <div style={{ minHeight: '100vh' }}>
      
      {/* O MENU É RENDERIZADO UMA ÚNICA VEZ AQUI */}
      <MenuLateral /> 
      
      {/* O CONTEÚDO DA TELA */}
      <div style={{ 
        marginLeft: '250px',
        padding: '0',
        boxSizing: 'border-box'
      }}>
        <Element {...rest} /> {/* Renderiza a página (Home, Clientes, etc.) */}
      </div>
    </div>
  );
};

export default PrivateRoute;