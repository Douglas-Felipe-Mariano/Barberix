import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Para buscar os dados reais
import './home.css';
import MenuLateral from '../menuLateral/menuLateral'; 

function Home() {
    const [agendamentosHoje, setAgendamentosHoje] = useState([]);
    const [kpis, setKpis] = useState({
        totalHoje: 0,
        faturamento: 0,
        barbeiros: 0
    });
    // ... (Função useEffect para buscar KIPs e Agendamentos de hoje)

    return (
        <div className="app-layout-container">
            <MenuLateral />
            <div className="page-content-with-menu">
                <div className="home-container">
                    <h1>Visão Geral da Barbearia</h1>

                    {/* --- 2. Cards de Indicadores --- */}
                    <div className="content-section">
                        <div className="info-card">
                            <h3>Agendamentos de Hoje</h3>
                            <p className="value">{kpis.totalHoje}</p>
                        </div>
                        <div className="info-card">
                            <h3>Faturamento Previsto</h3>
                            <p className="value">R$ {kpis.faturamento.toFixed(2)}</p>
                        </div>
                        <div className="info-card">
                            <h3>Barbeiros Ativos</h3>
                            <p className="value">{kpis.barbeiros}</p>
                        </div>
                    </div>

                    {/* --- 1. Agendamentos do Dia --- */}
                    <h2 style={{ marginTop: '40px' }}>Agenda para Hoje ({new Date().toLocaleDateString('pt-BR')})</h2>
                    
                    {agendamentosHoje.length === 0 ? (
                        <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum agendamento confirmado para hoje.</p>
                    ) : (
                        <div className="agenda-list">
                            {/* Você pode usar uma lista ou tabela menor aqui */}
                            {/* ... (Mapear e renderizar agendamentos) ... */}
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default Home;