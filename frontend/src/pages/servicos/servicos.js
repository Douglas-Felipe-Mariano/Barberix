import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './servicos.css';

import MenuLateral from '../menuLateral/menuLateral';

// URL base da API
const API_URL = 'http://localhost:8080/api/servicos';

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [servicoEditando, setServicoEditando] = useState(null); 
  const [formData, setFormData] = useState({
    nome: '',
    duracaoMinutos: '',
    preco: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar serviços da API
  const fetchServicos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setServicos(response.data);
    } catch (err) {
      console.error("Erro ao buscar serviços:", err);
      setError("Não foi possível carregar os dados dos serviços.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ nome: '', duracaoMinutos: '', preco: '' });
    setServicoEditando(null);
    setModalAberto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        nome: formData.nome,
        duracaoMinutos: parseInt(formData.duracaoMinutos),
        preco: parseFloat(formData.preco)
      };

      if (servicoEditando) {
        // UPDATE (PUT)
        await axios.put(`${API_URL}/${servicoEditando.servicoId}`, dadosParaEnviar);
      } else {
        // CREATE (POST)
        await axios.post(API_URL, dadosParaEnviar);
      }
      resetForm();
      await fetchServicos();
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(`Erro ao ${servicoEditando ? 'editar' : 'cadastrar'} serviço.`);
    }
  };
  
  const handleEdit = (servico) => {
    setServicoEditando(servico);
    setFormData({
      nome: servico.nome,
      duracaoMinutos: servico.duracaoMinutos,
      preco: servico.preco,
    });
    setModalAberto(true);
  };
  
  const handleDelete = (servicoId) => {
    const servico = servicos.find(s => s.servicoId === servicoId);
    setServicoParaExcluir(servico);
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL}/${servicoParaExcluir.servicoId}`);
      await fetchServicos();
      setModalExcluirAberto(false);
      setServicoParaExcluir(null);
    } catch (err) {
      console.error("Erro ao deletar serviço:", err.response ? err.response.data : err.message);
      setError("Erro ao deletar serviço.");
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirAberto(false);
    setServicoParaExcluir(null);
  };

  return (
    <div className="app-layout-container">
      <MenuLateral />
      
      <div className="page-content-with-menu">
        <div className="servicos-container">
          <h1>Gerenciamento de Serviços</h1>

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

          {/* --- Formulário de Cadastro/Edição --- */}
          <div className="form-section">
            <h3>{servicoEditando ? 'Editar Serviço' : 'Novo Serviço'}</h3>
            <form onSubmit={handleSubmit}>
              
              <div className="form-inputs-container">
                <input 
                  type="text" 
                  name="nome" 
                  placeholder="Nome do Serviço" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                />
                <input 
                  type="number" 
                  name="duracaoMinutos" 
                  placeholder="Duração (minutos)" 
                  value={formData.duracaoMinutos} 
                  onChange={handleChange} 
                  required 
                  min="1" 
                />
                <input 
                  type="number" 
                  name="preco" 
                  placeholder="Preço (R$)" 
                  value={formData.preco} 
                  onChange={handleChange} 
                  required 
                  step="0.01" 
                  min="0" 
                />
              </div>
              
              <button type="submit">{servicoEditando ? 'Salvar Edição' : 'Cadastrar'}</button>
              
              {servicoEditando && (
                <button type="button" onClick={resetForm}>
                  Cancelar Edição
                </button>
              )}
            </form>
          </div>

          {/* --- Tabela de Serviços --- */}
          <div className="table-section">
            <h3>Lista de Serviços</h3>
            
            {loading && <p>Carregando serviços...</p>}

            {!loading && servicos.length === 0 && <p>Nenhum serviço cadastrado.</p>}

            {!loading && servicos.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Duração (min)</th>
                    <th>Preço (R$)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicos.map((servico) => (
                    <tr key={servico.servicoId}>
                      <td>{servico.servicoId}</td>
                      <td>{servico.nome}</td>
                      <td>{servico.duracaoMinutos} min</td>
                      <td>R$ {parseFloat(servico.preco).toFixed(2)}</td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEdit(servico)}>Editar</button>
                        <button className="btn-excluir" onClick={() => handleDelete(servico.servicoId)}>Excluir</button>
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
              <h3>Editar Serviço</h3>
              <button className="modal-close" onClick={resetForm}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="nome">Nome do Serviço</label>
                  <input 
                    type="text" 
                    id="nome"
                    name="nome" 
                    placeholder="Nome do Serviço" 
                    value={formData.nome} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="duracaoMinutos">Duração (minutos)</label>
                  <input 
                    type="number" 
                    id="duracaoMinutos"
                    name="duracaoMinutos" 
                    placeholder="Duração em minutos" 
                    value={formData.duracaoMinutos} 
                    onChange={handleChange} 
                    required 
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preco">Preço (R$)</label>
                  <input 
                    type="number" 
                    id="preco"
                    name="preco" 
                    placeholder="Preço (ex: 45.00)" 
                    value={formData.preco} 
                    onChange={handleChange} 
                    required 
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>              <div className="modal-footer">
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
      {modalExcluirAberto && servicoParaExcluir && (
        <div className="modal-overlay" onClick={cancelarExclusao}>
          <div className="modal-content modal-confirmacao" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-confirmacao">
              <div className="icone-alerta">⚠️</div>
              <h3>Confirmar Exclusão</h3>
            </div>
            
            <div className="modal-body-confirmacao">
              <p>Tem certeza que deseja excluir o serviço?</p>
              <div className="info-servico">
                <strong>ID:</strong> {servicoParaExcluir.servicoId}<br/>
                <strong>Nome:</strong> {servicoParaExcluir.nome}<br/>
                <strong>Duração:</strong> {servicoParaExcluir.duracaoMinutos} minutos<br/>
                <strong>Preço:</strong> R$ {parseFloat(servicoParaExcluir.preco).toFixed(2)}
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
      </div>
    </div>
  );
}   

export default Servicos;