import React, { useState, useEffect } from 'react';
import axios from '../../services/api'; 
import './clientes.css'; 
import paymentsService from '../../services/payments';
import PaymentList from '../../components/PaymentList';

// URL base da sua API de Clientes
const API_URL = 'http://localhost:8080/api/clientes'; 

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null); 
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null); 
  // Estado para modal de pagamentos por cliente
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [paymentsForClient, setPaymentsForClient] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsClientSelected, setPaymentsClientSelected] = useState(null);

  // --- Implementação do FETCH (READ/GET) ---
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
        // 🚨 GET: Busca todos os clientes
        const response = await axios.get(API_URL);
        setClientes(response.data);
    } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setError(err.normalizedMessage || err.response?.data?.message || "Não foi possível carregar os dados dos clientes.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchClientes(); 
  }, []);

  const openPaymentsModal = async (cliente) => {
    setPaymentsClientSelected(cliente);
    setShowPaymentsModal(true);
    setPaymentsLoading(true);
    try {
      const list = await paymentsService.list();
      setPaymentsForClient(list.filter(p => String(p.clienteId) === String(cliente.clienteId)));
    } catch (err) {
      console.error('Erro ao carregar pagamentos do cliente', err);
      setPaymentsForClient([]);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const refreshPaymentsForClient = async () => {
    if (!paymentsClientSelected) return;
    setPaymentsLoading(true);
    try {
      const list = await paymentsService.list();
      setPaymentsForClient(list.filter(p => String(p.clienteId) === String(paymentsClientSelected.clienteId)));
    } catch (err) {
      console.error(err);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const closePaymentsModal = () => {
    setShowPaymentsModal(false);
    setPaymentsForClient([]);
    setPaymentsClientSelected(null);
  };

  // --- Implementação do handleChange, resetForm e handleEdit ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Aplica máscara de telefone
    if (name === 'telefone') {
      const apenasNumeros = value.replace(/\D/g, '');
      let telefoneFormatado = apenasNumeros;
      
      if (apenasNumeros.length <= 11) {
        telefoneFormatado = apenasNumeros
          .replace(/^(\d{2})(\d)/g, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
      
      setFormData({
        ...formData,
        [name]: telefoneFormatado,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', telefone: '', email: '', endereco: '' });
    setClienteEditando(null);
    setModalAberto(false);
  }

  const handleEdit = (cliente) => {
    setClienteEditando(cliente);
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco || '',
    });
    setModalAberto(true);
  };
  
  // --- Implementação do handleSubmit (CREATE/UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove a máscara do telefone antes de enviar para o backend
      const dadosParaEnviar = {
        ...formData,
        telefone: formData.telefone.replace(/\D/g, '') // Remove tudo que não é dígito
      };

      if (clienteEditando) {
        // 🚨 UPDATE (PUT): Edição
        await axios.put(`${API_URL}/${clienteEditando.clienteId}`, dadosParaEnviar);
      } else {
        // 🚨 CREATE (POST): Cadastro
        await axios.post(API_URL, dadosParaEnviar);
      }
      resetForm();
      await fetchClientes(); // Recarrega os dados
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || `Erro ao ${clienteEditando ? 'editar' : 'cadastrar'} cliente.`);
    }
  };
  
  // --- Implementação do handleDelete (DELETE) ---
  const handleDelete = (clienteId) => {
    const cliente = clientes.find(c => c.clienteId === clienteId);
    setClienteParaExcluir(cliente);
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL}/${clienteParaExcluir.clienteId}`);
      await fetchClientes();
      setModalExcluirAberto(false);
      setClienteParaExcluir(null);
    } catch (err) {
      console.error("Erro ao deletar cliente:", err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || "Erro ao deletar cliente.");
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirAberto(false);
    setClienteParaExcluir(null);
  };

  // Função para formatar telefone na exibição
  const formatarTelefone = (telefone) => {
    if (!telefone) return 'N/A';
    const apenasNumeros = telefone.replace(/\D/g, '');
    return apenasNumeros
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  // --- ESTRUTURA VISUAL (JSX) COMPLETA ---
  return (
    <div className="clientes-container">
      <h1>Gerenciamento de Clientes</h1>
      
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

              {/* Formulário de Cadastro/Edição */}
              <div className="form-section">
                <h3>{clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                <form onSubmit={handleSubmit}>
                  
                  <div className="form-inputs-container">
                      <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
                      <input 
                        type="tel" 
                        name="telefone" 
                        placeholder="(00) 00000-0000" 
                        value={formData.telefone} 
                        onChange={handleChange} 
                        maxLength="15"
                        required 
                      />
                      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <input type="text" name="endereco" placeholder="Endereço (Opcional)" value={formData.endereco} onChange={handleChange} />
                  
                  <button type="submit">{clienteEditando ? 'Salvar Edição' : 'Cadastrar'}</button>
                  
                  {clienteEditando && (
                    <button type="button" onClick={resetForm}>
                      Cancelar Edição
                    </button>
                  )}
                </form>
              </div>

              {/* Tabela de Clientes */}
              <div className="table-section">
                <h3>Lista de Clientes</h3>
                
                {loading && <p>Carregando clientes...</p>}

                {!loading && clientes.length === 0 && <p>Nenhum cliente cadastrado.</p>}

                {!loading && clientes.length > 0 && (
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nome</th>
                          <th>Telefone</th>
                          <th>Email</th>
                          <th>Endereço</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.map((cliente) => (
                          <tr key={cliente.clienteId}>
                            <td>{cliente.clienteId}</td>
                            <td>{cliente.nome}</td>
                            <td>{formatarTelefone(cliente.telefone)}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.endereco || 'N/A'}</td>
                            <td>
                              <button className="btn-editar" onClick={() => handleEdit(cliente)}>Editar</button>
                              <button className="btn-excluir" onClick={() => handleDelete(cliente.clienteId)}>Excluir</button>
                              <button className="btn-cancelar" style={{marginLeft:8}} onClick={() => openPaymentsModal(cliente)}>Ver Pagamentos</button>
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
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Editar Cliente</h3>
                      <button className="modal-close" onClick={resetForm}>&times;</button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label htmlFor="nome">Nome</label>
                          <input 
                            type="text" 
                            id="nome" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="telefone">Telefone</label>
                          <input 
                            type="tel" 
                            id="telefone" 
                            name="telefone" 
                            placeholder="(00) 00000-0000"
                            value={formData.telefone} 
                            onChange={handleChange} 
                            maxLength="15"
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="endereco">Endereço</label>
                          <input 
                            type="text" 
                            id="endereco" 
                            name="endereco" 
                            value={formData.endereco} 
                            onChange={handleChange} 
                          />
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
              {modalExcluirAberto && clienteParaExcluir && (
                <div className="modal-overlay" onClick={cancelarExclusao}>
                  <div className="modal-content modal-confirmacao" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header-confirmacao">
                      <div className="icone-alerta">⚠️</div>
                      <h3>Confirmar Exclusão</h3>
                    </div>
                    
                    <div className="modal-body-confirmacao">
                      <p>Tem certeza que deseja excluir este cliente?</p>
                      <div className="info-cliente">
                        <strong>ID:</strong> {clienteParaExcluir.clienteId}<br/>
                        <strong>Nome:</strong> {clienteParaExcluir.nome}<br/>
                        <strong>Email:</strong> {clienteParaExcluir.email}<br/>
                        <strong>Telefone:</strong> {formatarTelefone(clienteParaExcluir.telefone)}
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

              {/* Modal: Pagamentos do Cliente (front-only) */}
              {showPaymentsModal && paymentsClientSelected && (
                <div className="modal-overlay" onClick={closePaymentsModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Pagamentos de {paymentsClientSelected.nome}</h3>
                      <button className="modal-close" onClick={closePaymentsModal}>&times;</button>
                    </div>
                    <div className="modal-body">
                      <PaymentList pagamentos={paymentsForClient} loading={paymentsLoading} onRefresh={refreshPaymentsForClient} />
                    </div>
                    <div className="modal-footer">
                      <button className="btn-cancelar" onClick={closePaymentsModal}>Fechar</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
  );
}   

export default Clientes;