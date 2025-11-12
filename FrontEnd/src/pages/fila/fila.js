import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './fila.css';

function Fila() {
    const { user } = useAuth();
    const [agendamentos, setAgendamentos] = useState([]);
    const [barbeiros, setBarbeiros] = useState([]);
    const [barbeiroSelecionado, setBarbeiroSelecionado] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [horaAtual, setHoraAtual] = useState(new Date());

    useEffect(() => {
        carregarDados();
        
        // Atualizar hora a cada minuto para recalcular status
        const interval = setInterval(() => {
            setHoraAtual(new Date());
        }, 60000); // 60 segundos

        return () => clearInterval(interval);
    }, []);

    // Quando os barbeiros carregarem, verificar se é BARBEIRO e setar filtro
    useEffect(() => {
        if (user && user.perfil === 'BARBEIRO' && barbeiros.length > 0) {
            // Encontrar o barbeiro vinculado ao usuário logado
            const barbeiroLogado = barbeiros.find(b => b.usuario?.usuarioId === user.usuarioId);
            if (barbeiroLogado) {
                setBarbeiroSelecionado(barbeiroLogado.barbeiroId.toString());
            }
        }
    }, [user, barbeiros]);

    const carregarDados = async () => {
        setLoading(true);
        try {
            // Buscar agendamentos de hoje
            const hoje = new Date().toLocaleDateString('en-CA');
            const dataHoraISO = `${hoje}T00:00:00`;
            const agendamentosRes = await axios.get(`http://localhost:8080/api/agendamentos/data/${dataHoraISO}`);
            
            // Buscar barbeiros
            const barbeirosRes = await axios.get('http://localhost:8080/api/barbeiros');
            
            // Ordenar agendamentos por horário
            const agendamentosOrdenados = agendamentosRes.data.sort((a, b) => {
                return new Date(a.dataAgendada) - new Date(b.dataAgendada);
            });

            setAgendamentos(agendamentosOrdenados);
            setBarbeiros(barbeirosRes.data);
        } catch (err) {
            console.error("Erro ao carregar fila:", err);
            // no UI state atualmente; adicionar setError caso queira um alerta
        } finally {
            setLoading(false);
        }
    };

    // Determinar status do agendamento baseado na hora
    const getStatus = (dataAgendada) => {
        const agora = horaAtual;
        const horarioAgendamento = new Date(dataAgendada);
        const diffMinutos = (horarioAgendamento - agora) / (1000 * 60);

        if (diffMinutos < -30) {
            return 'concluido'; // Passou há mais de 30 min
        } else if (diffMinutos < 0) {
            return 'atrasado'; // Passou mas há menos de 30 min
        } else if (diffMinutos <= 15) {
            return 'proximo'; // Próximo (até 15 min)
        } else if (diffMinutos <= 60) {
            return 'breve'; // Em breve (até 1h)
        } else {
            return 'aguardando'; // Aguardando
        }
    };

    // Filtrar agendamentos
    const agendamentosFiltrados = agendamentos.filter(ag => {
        if (barbeiroSelecionado === 'todos') return true;
        return ag.barbeiro?.barbeiroId === parseInt(barbeiroSelecionado);
    });

    // Encontrar próximo atendimento
    const proximoIndex = agendamentosFiltrados.findIndex(ag => {
        const status = getStatus(ag.dataAgendada);
        return status === 'proximo' || status === 'breve';
    });

    // Estatísticas
    const totalAtendimentos = agendamentosFiltrados.length;
    const concluidos = agendamentosFiltrados.filter(ag => getStatus(ag.dataAgendada) === 'concluido').length;
    const pendentes = totalAtendimentos - concluidos;

    return (
        <div className="fila-container">
            <div className="fila-header">
                <h1>📋 Fila de Atendimentos</h1>
                <p className="fila-data">Hoje - {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>

            {/* Estatísticas */}
            <div className="fila-stats">
                <div className="stat-card">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{totalAtendimentos}</span>
                </div>
                <div className="stat-card pendentes">
                    <span className="stat-label">Pendentes</span>
                    <span className="stat-value">{pendentes}</span>
                </div>
                <div className="stat-card concluidos">
                    <span className="stat-label">Concluídos</span>
                    <span className="stat-value">{concluidos}</span>
                </div>
            </div>

            {/* Filtro de Barbeiro */}
            <div className="fila-filtro">
                <label>Filtrar por Barbeiro:</label>
                <select 
                    value={barbeiroSelecionado} 
                    onChange={(e) => setBarbeiroSelecionado(e.target.value)}
                    disabled={user?.perfil === 'BARBEIRO'} // Desabilita para barbeiros
                >
                    {user?.perfil !== 'BARBEIRO' && <option value="todos">Todos os Barbeiros</option>}
                    {barbeiros.map(b => (
                        <option key={b.barbeiroId} value={b.barbeiroId}>{b.nome}</option>
                    ))}
                </select>
                {user?.perfil === 'BARBEIRO' && (
                    <span className="filtro-info">🔒 Visualizando apenas seus agendamentos</span>
                )}
            </div>

            {/* Fila de Atendimentos */}
            {loading ? (
                <p className="loading">Carregando fila...</p>
            ) : agendamentosFiltrados.length === 0 ? (
                <div className="fila-vazia">
                    <span className="emoji">🎉</span>
                    <p>Nenhum agendamento para hoje!</p>
                </div>
            ) : (
                <div className="fila-lista">
                    {agendamentosFiltrados.map((ag, index) => {
                        const status = getStatus(ag.dataAgendada);
                        const isProximo = index === proximoIndex;
                        const dataHora = new Date(ag.dataAgendada);
                        const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div 
                                key={ag.agendamentoId} 
                                className={`fila-item ${status} ${isProximo ? 'proximo-destaque' : ''}`}
                            >
                                <div className="fila-item-header">
                                    <span className="fila-numero">#{index + 1}</span>
                                    <span className={`fila-status-badge ${status}`}>
                                        {status === 'concluido' && '✓ Concluído'}
                                        {status === 'atrasado' && '⚠️ Atrasado'}
                                        {status === 'proximo' && '🔥 AGORA'}
                                        {status === 'breve' && '⏰ Em breve'}
                                        {status === 'aguardando' && '⏳ Aguardando'}
                                    </span>
                                    <span className="fila-horario">{hora}</span>
                                </div>

                                <div className="fila-item-body">
                                    <div className="fila-info">
                                        <div className="info-row">
                                            <span className="info-label">👤 Cliente:</span>
                                            <span className="info-value">{ag.cliente?.nome || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">✂️ Barbeiro:</span>
                                            <span className="info-value">{ag.barbeiro?.nome || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">💈 Serviço:</span>
                                            <span className="info-value">{ag.servico?.nome || 'N/A'}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">⏱️ Duração:</span>
                                            <span className="info-value">{ag.servico?.duracaoMinutos || 0} min</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">💰 Valor:</span>
                                            <span className="info-value valor">R$ {parseFloat(ag.valor).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {isProximo && (
                                    <div className="proximo-alert">
                                        🎯 PRÓXIMO ATENDIMENTO
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Botão de Atualizar */}
            <button className="btn-atualizar" onClick={carregarDados}>
                🔄 Atualizar Fila
            </button>
        </div>
    );
}

export default Fila;
