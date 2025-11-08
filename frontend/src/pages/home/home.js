import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';

function Home() {
    const [agendamentosHoje, setAgendamentosHoje] = useState([]);
    const [kpis, setKpis] = useState({
        totalHoje: 0,
        faturamento: 0,
        barbeiros: 0
    });

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            // Buscar agendamentos de hoje
            const hoje = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD no timezone local
            const dataHoraISO = `${hoje}T00:00:00`; // Adiciona hora para LocalDateTime
            const agendamentosRes = await axios.get(`http://localhost:8080/api/agendamentos/data/${dataHoraISO}`, {
                withCredentials: false
            });
            const agendamentos = agendamentosRes.data;
            
            // Buscar barbeiros ativos
            const barbeirosRes = await axios.get('http://localhost:8080/api/barbeiros', {
                withCredentials: false
            });
            const barbeiros = barbeirosRes.data;
            
            // Calcular KPIs
            const totalHoje = agendamentos.length;
            const faturamento = agendamentos.reduce((sum, ag) => sum + parseFloat(ag.valor || 0), 0);
            const barbeirosAtivos = barbeiros.filter(b => b.status === 1).length;
            
            setAgendamentosHoje(agendamentos);
            setKpis({
                totalHoje,
                faturamento,
                barbeiros: barbeirosAtivos
            });
        } catch (err) {
            console.error("Erro ao carregar dados da home:", err);
        }
    };

    return (
        <div className="home-container">
            <h1>Visão Geral da Barbearia</h1>

            {/* Cards de Indicadores */}
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

                    {/* Agendamentos do Dia */}
                    <h2>Agenda para Hoje ({new Date().toLocaleDateString('pt-BR')})</h2>
                    
                    {agendamentosHoje.length === 0 ? (
                        <div className="agenda-list">
                            <div className="agenda-empty">
                                <span>📅</span>
                                <p>Nenhum agendamento para hoje</p>
                            </div>
                        </div>
                    ) : (
                        <div className="agenda-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Horário</th>
                                        <th>Cliente</th>
                                        <th>Barbeiro</th>
                                        <th>Serviço</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agendamentosHoje.map(ag => {
                                        const dataHora = new Date(ag.dataAgendada);
                                        const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                        
                                        return (
                                            <tr key={ag.agendamentoId}>
                                                <td><strong>{hora}</strong></td>
                                                <td>{ag.cliente?.nome || 'N/A'}</td>
                                                <td>{ag.barbeiro?.nome || 'N/A'}</td>
                                                <td>{ag.servico?.nome || 'N/A'}</td>
                                                <td>R$ {parseFloat(ag.valor).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
        </div>
    );
}

export default Home;