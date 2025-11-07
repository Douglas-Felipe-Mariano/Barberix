import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './menuLateral.css';

function MenuLateral() {
    const navigate = useNavigate();
    const location = useLocation();

    // Função para limpar o token e redirecionar para o Login
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('usuario');
        navigate('/'); // Redireciona para a rota de Login
    };

    return (
        <div className="menu-lateral-container">
            <div className="barberix-logo">
                BARBERIX
            </div>
            
            <nav className="menu-links">
                {/* 1. Visão Geral */}
                <Link to="/home" className={`menu-item ${location.pathname === '/home' ? 'active' : ''}`}>
                    <span className="icon">🏠</span> Home
                </Link>
                
                {/* 2. Agendamentos */}
                <Link to="/agendamentos" className={`menu-item ${location.pathname === '/agendamentos' ? 'active' : ''}`}>
                    <span className="icon">📅</span> Agendamentos
                </Link>

                <div className="menu-separator">Gestão</div>

                {/* 3. CRUD Clientes */}
                <Link to="/clientes" className={`menu-item ${location.pathname === '/clientes' ? 'active' : ''}`}>
                    <span className="icon">🧑‍🤝‍🧑</span> Clientes
                </Link>

                {/* 3. CRUD Clientes */}
                <Link to="/usuario" className={`menu-item ${location.pathname === '/usuario' ? 'active' : ''}`}>
                    <span className="icon">👤</span> Usuarios
                </Link>                
                
                {/* 4. CRUD Barbeiros */}
                <Link to="/barbeiros" className={`menu-item ${location.pathname === '/barbeiros' ? 'active' : ''}`}>
                    <span className="icon">✂️</span> Barbeiros
                </Link>
                
                {/* 5. CRUD Serviços */}
                <Link to="/servicos" className={`menu-item ${location.pathname === '/servicos' ? 'active' : ''}`}>
                    <span className="icon">✨</span> Serviços
                </Link>

                {/* 6. CRUD Perfis (Admin) */}
                <Link to="/perfis" className={`menu-item ${location.pathname === '/perfis' ? 'active' : ''}`}>
                    <span className="icon">🛡️</span> Perfis
                </Link>
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