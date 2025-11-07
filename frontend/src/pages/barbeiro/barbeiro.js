import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import './barbeiro.css';

// URL base da API
const API_URL_BARBEIROS = 'http://localhost:8080/api/barbeiros';
const API_URL_USUARIOS = 'http://localhost:8080/api/usuarios';

function Barbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [barbeiroEditando, setBarbeiroEditando] = useState(null); 
  const [formData, setFormData] = useState({
    nome: '',
    usuarioId: '',
    status: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [barbeiroParaExcluir, setBarbeiroParaExcluir] = useState(null);

  // Buscar barbeiros da API
  const fetchBarbeiros = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL_BARBEIROS);
      setBarbeiros(response.data);
    } catch (err) {
      console.error("Erro ao buscar barbeiros:", err);
      setError("Não foi possível carregar os dados dos barbeiros.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuários disponíveis
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(API_URL_USUARIOS);
      setUsuarios(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchBarbeiros();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const resetForm = () => {
    setFormData({ nome: '', usuarioId: '', status: 1 });
    setBarbeiroEditando(null);
    setModalAberto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        nome: formData.nome,
        usuario: { usuarioId: parseInt(formData.usuarioId) },
        status: formData.status
      };

      if (barbeiroEditando) {
        // UPDATE (PUT)
        await axios.put(`${API_URL_BARBEIROS}/${barbeiroEditando.barbeiroId}`, dadosParaEnviar);
      } else {
        // CREATE (POST)
        await axios.post(API_URL_BARBEIROS, dadosParaEnviar);
      }
      resetForm();
      await fetchBarbeiros();
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(`Erro ao ${barbeiroEditando ? 'editar' : 'cadastrar'} barbeiro.`);
    }
  };
  
  const handleEdit = (barbeiro) => {
    setBarbeiroEditando(barbeiro);
    setFormData({
      nome: barbeiro.nome,
      usuarioId: barbeiro.usuario?.usuarioId || '',
      status: barbeiro.status,
    });
    setModalAberto(true);
  };
  
  const handleDelete = (barbeiroId) => {
    const barbeiro = barbeiros.find(b => b.barbeiroId === barbeiroId);
    setBarbeiroParaExcluir(barbeiro);
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL_BARBEIROS}/${barbeiroParaExcluir.barbeiroId}`);
      await fetchBarbeiros();
      setModalExcluirAberto(false);
      setBarbeiroParaExcluir(null);
    } catch (err) {
      console.error("Erro ao deletar barbeiro:", err.response ? err.response.data : err.message);
      setError("Erro ao deletar barbeiro.");
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirAberto(false);
    setBarbeiroParaExcluir(null);
  };

  return (
    <div className="barbeiros-container">
      <h1>Gerenciamento de Barbeiros</h1>

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
        <h3>{barbeiroEditando ? 'Editar Barbeiro' : 'Novo Barbeiro'}</h3>
        <form onSubmit={handleSubmit}>
              
              <div className="form-inputs-container">
                <input 
                  type="text" 
                  name="nome" 
                  placeholder="Nome do Barbeiro" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required 
                />
                <select 
                  name="usuarioId" 
                  value={formData.usuarioId} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">Selecione um Usuário</option>
                  {usuarios.map(usuario => (
                    <option key={usuario.usuarioId} value={usuario.usuarioId}>
                      {usuario.email} - {usuario.perfil?.nomePerfil}
                    </option>
                  ))}
                </select>
              </div>
              
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  name="status" 
                  checked={formData.status === 1} 
                  onChange={handleChange} 
                />
                Ativo (Status)
              </label>
              
              <button type="submit">{barbeiroEditando ? 'Salvar Edição' : 'Cadastrar Barbeiro'}</button>
              
              {barbeiroEditando && (
                <button type="button" onClick={resetForm}>
                  Cancelar Edição
                </button>
              )}
            </form>
          </div>

          {/* --- Tabela de Barbeiros --- */}
          <div className="table-section">
            <h3>Lista de Barbeiros</h3>
            
            {loading && <p>Carregando barbeiros...</p>}

            {!loading && barbeiros.length === 0 && <p>Nenhum barbeiro cadastrado.</p>}

            {!loading && barbeiros.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email de Login</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {barbeiros.map((barbeiro) => (
                    <tr key={barbeiro.barbeiroId}>
                      <td>{barbeiro.barbeiroId}</td>
                      <td>{barbeiro.nome}</td>
                      <td>{barbeiro.usuario?.email || 'N/A'}</td>
                      <td>
                          <span className={`status-badge status-${barbeiro.status === 1 ? 'ativo' : 'inativo'}`}>
                              {barbeiro.status === 1 ? 'Ativo' : 'Inativo'}
                          </span>
                      </td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEdit(barbeiro)}>Editar</button>
                        <button className="btn-excluir" onClick={() => handleDelete(barbeiro.barbeiroId)}>Excluir</button>
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
                  <h3>Editar Barbeiro</h3>
                  <button className="modal-close" onClick={resetForm}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="nome">Nome do Barbeiro</label>
                      <input 
                        type="text" 
                        id="nome"
                        name="nome" 
                        placeholder="Nome do Barbeiro" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="usuarioId">Usuário</label>
                      <select 
                        id="usuarioId"
                        name="usuarioId" 
                        value={formData.usuarioId} 
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Selecione um Usuário</option>
                        {usuarios.map(usuario => (
                          <option key={usuario.usuarioId} value={usuario.usuarioId}>
                            {usuario.email} - {usuario.perfil?.nomePerfil}
                          </option>
                        ))}
                      </select>
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
          {modalExcluirAberto && barbeiroParaExcluir && (
            <div className="modal-overlay" onClick={cancelarExclusao}>
              <div className="modal-content modal-confirmacao" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-confirmacao">
                  <div className="icone-alerta">⚠️</div>
                  <h3>Confirmar Exclusão</h3>
                </div>
                
                <div className="modal-body-confirmacao">
                  <p>Tem certeza que deseja excluir o barbeiro?</p>
                  <div className="info-barbeiro">
                    <strong>ID:</strong> {barbeiroParaExcluir.barbeiroId}<br/>
                    <strong>Nome:</strong> {barbeiroParaExcluir.nome}<br/>
                    <strong>Email:</strong> {barbeiroParaExcluir.usuario?.email || 'N/A'}
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

export default Barbeiros;