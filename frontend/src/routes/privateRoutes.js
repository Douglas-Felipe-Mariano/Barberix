// src/routes/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import MenuLateral from '../pages/menuLateral/menuLateral'; // 🚨 Ajustado para o seu caminho

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
    <div style={{ display: 'flex' }}>
      
      {/* O MENU É RENDERIZADO UMA ÚNICA VEZ AQUI */}
      <MenuLateral /> 
      
      {/* O CONTEÚDO DA TELA É EMPURRADO PELA MARGEM */}
      <div 
        className="page-content-wrapper" // Classe nova e clara para este wrapper
        style={{ marginLeft: MENU_WIDTH, width: `calc(100% - ${MENU_WIDTH})` }}>
          
        <Element {...rest} /> {/* Renderiza a página (Home, Clientes, etc.) */}
      </div>
    </div>
  );
};

export default PrivateRoute;