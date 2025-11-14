import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './menuLateral.css';

function MenuLateral() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, hasPermission, user } = useAuth();

    // Função para limpar o token e redirecionar para o Login
    const handleLogout = () => {
        logout();
        navigate('/'); // Redireciona para a rota de Login
    };

    // Função auxiliar para verificar se o item do menu deve ser exibido
    const canAccess = (allowedProfiles) => {
        return hasPermission(allowedProfiles);
    };

    return (
        <div className="menu-lateral-container">
            <div className="barberix-logo">
                BARBERIX
            </div>

            {/* Exibe o perfil do usuário logado */}
            {user && (
                <div className="user-info">
                    <small>Logado como:</small>
                    <strong>{user.email}</strong>
                    <span className="user-role">
                        {user.perfil?.nomePerfil || user.perfil}
                    </span>
                </div>
            )}
            
            <nav className="menu-links">
                {/* 1. Visão Geral - Todos podem acessar */}
                <Link to="/home" className={`menu-item ${location.pathname === '/home' ? 'active' : ''}`}>
                    <span className="icon">🏠</span> Home
                </Link>
                
                {/* 2. Fila de Atendimentos - ADMIN, GERENTE, ATENDENTE, BARBEIRO */}
                {canAccess(['ADMIN', 'GERENTE', 'ATENDENTE', 'BARBEIRO']) && (
                    <Link to="/fila" className={`menu-item ${location.pathname === '/fila' ? 'active' : ''}`}>
                        <span className="icon">📋</span> Fila de Atendimentos
                    </Link>
                )}
                
                {/* 3. Agendamentos - ADMIN, GERENTE, ATENDENTE, BARBEIRO */}
                {canAccess(['ADMIN', 'GERENTE', 'ATENDENTE', 'BARBEIRO']) && (
                    <Link to="/agendamentos" className={`menu-item ${location.pathname === '/agendamentos' ? 'active' : ''}`}>
                        <span className="icon">📅</span> Agendamentos
                    </Link>
                )}

                <div className="menu-separator">Gestão</div>

                {/* 4. Clientes - ADMIN, GERENTE, ATENDENTE */}
                {canAccess(['ADMIN', 'GERENTE', 'ATENDENTE']) && (
                    <Link to="/clientes" className={`menu-item ${location.pathname === '/clientes' ? 'active' : ''}`}>
                        <span className="icon">🧑‍🤝‍🧑</span> Clientes
                    </Link>
                )}

                {/* 5. Usuários - Apenas ADMIN */}
                {canAccess(['ADMIN']) && (
                    <Link to="/usuario" className={`menu-item ${location.pathname === '/usuario' ? 'active' : ''}`}>
                        <span className="icon">👤</span> Usuários
                    </Link>
                )}
                
                {/* 6. Barbeiros - ADMIN, GERENTE */}
                {canAccess(['ADMIN', 'GERENTE']) && (
                    <Link to="/barbeiros" className={`menu-item ${location.pathname === '/barbeiros' ? 'active' : ''}`}>
                        <span className="icon">✂️</span> Barbeiros
                    </Link>
                )}
                
                {/* 7. Serviços - ADMIN, GERENTE */}
                {canAccess(['ADMIN', 'GERENTE']) && (
                    <Link to="/servicos" className={`menu-item ${location.pathname === '/servicos' ? 'active' : ''}`}>
                        <span className="icon">✨</span> Serviços
                    </Link>
                )}

                {/* ...item de Perfis removido... */}

                {/* Pagamentos - ADMIN, GERENTE, ATENDENTE */}
                {canAccess(['ADMIN', 'GERENTE', 'ATENDENTE']) && (
                    <Link to="/pagamentos" className={`menu-item ${location.pathname === '/pagamentos' ? 'active' : ''}`}>
                        <span className="icon">💳</span> Pagamentos
                    </Link>
                )}
            </nav>

            <div className="logout-container">
                <button onClick={handleLogout} className="logout-button">
                    <span className="icon">🚪</span> Sair
                </button>
            </div>
        </div>
    );
}

export default MenuLateral;