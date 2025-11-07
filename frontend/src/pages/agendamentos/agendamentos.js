import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './agendamentos.css';

import MenuLateral from '../menuLateral/menuLateral';

// URLs das APIs
const API_URL_AGENDAMENTOS = 'http://localhost:8080/api/agendamentos';
const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';
const API_URL_BARBEIROS = 'http://localhost:8080/api/barbeiros';
const API_URL_SERVICOS = 'http://localhost:8080/api/servicos';

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    barbeiroId: '',
    servicoId: '',
    dataAgendada: '',
    hora: '',
  });
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar agendamentos
  const fetchAgendamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL_AGENDAMENTOS);
      setAgendamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
      setError("Não foi possível carregar os agendamentos.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes, barbeiros e serviços
  const fetchDadosRelacionados = async () => {
    try {
      const [clientesRes, barbeirosRes, servicosRes] = await Promise.all([
        axios.get(API_URL_CLIENTES),
        axios.get(API_URL_BARBEIROS),
        axios.get(API_URL_SERVICOS)
      ]);
      setClientes(clientesRes.data);
      setBarbeiros(barbeirosRes.data);
      setServicos(servicosRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados relacionados:", err);
    }
  };

  useEffect(() => {
    fetchDadosRelacionados();
    fetchAgendamentos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Formata data YYYY-MM-DD para exibição DD/MM/YYYY
  const formatarDataInput = (dataISO) => {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const resetForm = () => {
    setFormData({ clienteId: '', barbeiroId: '', servicoId: '', dataAgendada: '', hora: '' });
    setAgendamentoEditando(null);
    setModalAberto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Concatena data e hora no formato ISO 8601
      const dataHoraCompleta = `${formData.dataAgendada}T${formData.hora}:00`;
      
      // Busca o serviço selecionado para pegar o preço
      const servicoSelecionado = servicos.find(s => s.servicoId === parseInt(formData.servicoId));
      
      const dadosParaEnviar = {
        cliente: { clienteId: parseInt(formData.clienteId) },
        barbeiro: { barbeiroId: parseInt(formData.barbeiroId) },
        servico: { servicoId: parseInt(formData.servicoId) },
        dataAgendada: dataHoraCompleta,
        valor: servicoSelecionado?.preco || 0
      };

      if (agendamentoEditando) {
        // UPDATE (PUT)
        await axios.put(`${API_URL_AGENDAMENTOS}/${agendamentoEditando.agendamentoId}`, dadosParaEnviar);
      } else {
        // CREATE (POST)
        await axios.post(API_URL_AGENDAMENTOS, dadosParaEnviar);
      }
      resetForm();
      await fetchAgendamentos();
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(`Erro ao ${agendamentoEditando ? 'editar' : 'cadastrar'} agendamento.`);
    }
  };
  
  const handleEdit = (agendamento) => {
    // Separa data e hora do campo dataAgendada
    const dataAgendada = new Date(agendamento.dataAgendada);
    const data = dataAgendada.toISOString().substring(0, 10);
    const hora = dataAgendada.toTimeString().substring(0, 5);
    
    setAgendamentoEditando(agendamento);
    setFormData({
      clienteId: agendamento.cliente?.clienteId || '',
      barbeiroId: agendamento.barbeiro?.barbeiroId || '',
      servicoId: agendamento.servico?.servicoId || '',
      dataAgendada: data,
      hora: hora,
    });
    setModalAberto(true);
  };
  
  const handleDelete = (agendamentoId) => {
    const agendamento = agendamentos.find(a => a.agendamentoId === agendamentoId);
    setAgendamentoParaExcluir(agendamento);
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL_AGENDAMENTOS}/${agendamentoParaExcluir.agendamentoId}`);
      await fetchAgendamentos();
      setModalExcluirAberto(false);
      setAgendamentoParaExcluir(null);
    } catch (err) {
      console.error("Erro ao deletar agendamento:", err.response ? err.response.data : err.message);
      setError("Erro ao deletar agendamento.");
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirAberto(false);
    setAgendamentoParaExcluir(null);
  };
  
  // Função auxiliar para formatar a data/hora para exibição
  const formatarDataHora = (isoString) => {
    if (!isoString) return 'N/A';
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }) + ' às ' + data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="agendamentos-container">
      <h1>Gerenciamento de Agendamentos</h1>

      {error && (
        <div className="error-message-bar" style={{
            backgroundColor: 'var(--color-danger)', 
            color: 'var(--color-background-card)', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '15px'
        }}>
            {error}
        </div>
      )}

      {/* --- Formulário de Cadastro --- */}
      <div className="form-section agendamento-form">
            <h3>Novo Agendamento</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-grid">
                {/* Cliente */}
                <div className="form-group-inline">
                  <label>Cliente</label>
                  <select name="clienteId" value={formData.clienteId} onChange={handleChange} required>
                    <option value="">-- Selecione o Cliente --</option>
                    {clientes.map(c => <option key={c.clienteId} value={c.clienteId}>{c.nome}</option>)}
                  </select>
                </div>
                
                {/* Barbeiro */}
                <div className="form-group-inline">
                  <label>Barbeiro</label>
                  <select name="barbeiroId" value={formData.barbeiroId} onChange={handleChange} required>
                    <option value="">-- Selecione o Barbeiro --</option>
                    {barbeiros.map(b => <option key={b.barbeiroId} value={b.barbeiroId}>{b.nome}</option>)}
                  </select>
                </div>
                
                {/* Serviço */}
                <div className="form-group-inline">
                  <label>Serviço</label>
                  <select name="servicoId" value={formData.servicoId} onChange={handleChange} required>
                    <option value="">-- Selecione o Serviço --</option>
                    {servicos.map(s => <option key={s.servicoId} value={s.servicoId}>{s.nome} ({s.duracaoMinutos}min - R$ {parseFloat(s.preco).toFixed(2)})</option>)}
                  </select>
                </div>
                
                {/* Data e Hora */}
                <div className="form-group-inline">
                  <label>Data do Agendamento</label>
                  <input 
                    type="date" 
                    name="dataAgendada" 
                    value={formData.dataAgendada} 
                    onChange={handleChange} 
                    lang="pt-BR"
                    required 
                  />
                </div>
                
                <div className="form-group-inline">
                  <label>Horário</label>
                  <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
                </div>
              </div>
              
              <button type="submit">Agendar</button>
            </form>
          </div>

          {/* --- Tabela de Agendamentos --- */}
          <div className="table-section">
            <h3>Próximos Agendamentos</h3>
            
            {loading && <p>Carregando agendamentos...</p>}

            {!loading && agendamentos.length === 0 && <p>Nenhum agendamento cadastrado.</p>}

            {!loading && agendamentos.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data e Hora</th>
                    <th>Cliente</th>
                    <th>Barbeiro</th>
                    <th>Serviço</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map((agendamento) => (
                    <tr key={agendamento.agendamentoId}>
                      <td>{agendamento.agendamentoId}</td>
                      <td>{formatarDataHora(agendamento.dataAgendada)}</td>
                      <td>{agendamento.cliente?.nome || 'N/A'}</td>
                      <td>{agendamento.barbeiro?.nome || 'N/A'}</td>
                      <td>{agendamento.servico?.nome || 'N/A'}</td>
                      <td>R$ {parseFloat(agendamento.valor).toFixed(2)}</td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEdit(agendamento)}>Editar</button>
                        <button className="btn-excluir" onClick={() => handleDelete(agendamento.agendamentoId)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Modal de Edição */}
          {modalAberto && (
            <div className="modal-overlay" onClick={resetForm}>
              <div className="modal-content modal-agendamento" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Editar Agendamento</h3>
                  <button className="modal-close" onClick={resetForm}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="clienteId">Cliente</label>
                      <select id="clienteId" name="clienteId" value={formData.clienteId} onChange={handleChange} required>
                        <option value="">-- Selecione o Cliente --</option>
                        {clientes.map(c => <option key={c.clienteId} value={c.clienteId}>{c.nome}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="barbeiroId">Barbeiro</label>
                      <select id="barbeiroId" name="barbeiroId" value={formData.barbeiroId} onChange={handleChange} required>
                        <option value="">-- Selecione o Barbeiro --</option>
                        {barbeiros.map(b => <option key={b.barbeiroId} value={b.barbeiroId}>{b.nome}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="servicoId">Serviço</label>
                      <select id="servicoId" name="servicoId" value={formData.servicoId} onChange={handleChange} required>
                        <option value="">-- Selecione o Serviço --</option>
                        {servicos.map(s => <option key={s.servicoId} value={s.servicoId}>{s.nome} ({s.duracaoMinutos}min - R$ {parseFloat(s.preco).toFixed(2)})</option>)}
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="dataAgendada">Data</label>
                        <input 
                          type="date" 
                          id="dataAgendada" 
                          name="dataAgendada" 
                          value={formData.dataAgendada} 
                          onChange={handleChange} 
                          lang="pt-BR"
                          required 
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="hora">Hora</label>
                        <input type="time" id="hora" name="hora" value={formData.hora} onChange={handleChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-cancelar" onClick={resetForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-salvar">
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Exclusão */}
          {modalExcluirAberto && agendamentoParaExcluir && (
            <div className="modal-overlay" onClick={cancelarExclusao}>
              <div className="modal-content modal-confirmacao" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-confirmacao">
                  <div className="icone-alerta">⚠️</div>
                  <h3>Confirmar Exclusão</h3>
                </div>
                
                <div className="modal-body-confirmacao">
                  <p>Tem certeza que deseja excluir o agendamento?</p>
                  <div className="info-agendamento">
                    <strong>ID:</strong> {agendamentoParaExcluir.agendamentoId}<br/>
                    <strong>Data/Hora:</strong> {formatarDataHora(agendamentoParaExcluir.dataAgendada)}<br/>
                    <strong>Cliente:</strong> {agendamentoParaExcluir.cliente?.nome}<br/>
                    <strong>Barbeiro:</strong> {agendamentoParaExcluir.barbeiro?.nome}<br/>
                    <strong>Serviço:</strong> {agendamentoParaExcluir.servico?.nome}<br/>
                    <strong>Valor:</strong> R$ {parseFloat(agendamentoParaExcluir.valor).toFixed(2)}
                  </div>
                  <p className="aviso-exclusao">⚠️ Esta ação não poderá ser desfeita!</p>
                </div>

                <div className="modal-footer-confirmacao">
                  <button type="button" className="btn-nao" onClick={cancelarExclusao}>
                    Não, Cancelar
                  </button>
                  <button type="button" className="btn-sim" onClick={confirmarExclusao}>
                    Sim, Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}   

export default Agendamentos;