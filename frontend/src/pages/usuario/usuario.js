import React, { useState, useEffect } from 'react';
import axios from '../../services/api'; 
import './usuario.css';

// URL base da API
const API_URL_USUARIOS = 'http://localhost:8080/api/usuarios';
const API_URL_BARBEIROS = 'http://localhost:8080/api/barbeiros';
// const API_URL_PERFIS = 'http://localhost:8080/api/perfis';

function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  // const [perfis, setPerfis] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null); 
  const [formData, setFormData] = useState({
    perfil: '',
    email: '',
    senha: '',
    status: 1
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar usuários da API
  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL_USUARIOS);
      setUsuarios(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Não foi possível carregar os dados dos usuários.");
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const resetForm = () => {
    setFormData({ perfil: '', email: '', senha: '', status: 1 });
    setUsuarioEditando(null);
    setModalAberto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepara os dados para enviar ao backend
      const dadosParaEnviar = {
        perfil: formData.perfil,
        email: formData.email,
        status: formData.status
      };

      // Se tem senha preenchida, adiciona ao payload
      if (formData.senha) {
        dadosParaEnviar.senha = formData.senha;
      }

      if (usuarioEditando) {
        // UPDATE (PUT): Edição
        await axios.put(`${API_URL_USUARIOS}/${usuarioEditando.usuarioId}`, dadosParaEnviar);
      } else {
        // CREATE (POST): Cadastro - senha é obrigatória
        if (!formData.senha) {
          setError("A senha é obrigatória para novos usuários.");
          return;
        }
        dadosParaEnviar.senha = formData.senha;
        // cria o usuário e captura resposta
        const createRes = await axios.post(API_URL_USUARIOS, dadosParaEnviar);
        const usuarioCriado = createRes?.data;

        // Se perfil for BARBEIRO, cria também o barbeiro associado
        if (formData.perfil === 'BARBEIRO' && usuarioCriado && usuarioCriado.usuarioId) {
          try {
            const nomeBarbeiro = usuarioCriado.email ? usuarioCriado.email.split('@')[0] : usuarioCriado.email || '';
            const barbeiroPayload = {
              nome: nomeBarbeiro,
              usuario: { usuarioId: usuarioCriado.usuarioId },
              status: 1
            };
            await axios.post(API_URL_BARBEIROS, barbeiroPayload);
          } catch (barErr) {
            console.error('Erro ao criar barbeiro automático:', barErr.response ? barErr.response.data : barErr.message);
            // não bloqueia a criação do usuário, mas notifica
            setError('Usuário criado, mas falha ao criar barbeiro automaticamente.');
          }
        }
      }
      resetForm();
      await fetchUsuarios();
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || `Erro ao ${usuarioEditando ? 'editar' : 'cadastrar'} usuário.`);
    }
  };
  
  const handleEdit = (usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      perfil: usuario.perfil || '',
      email: usuario.email,
      senha: '', // NUNCA pré-preencher a senha
      status: usuario.status,
    });
    setModalAberto(true);
  };
  
  const handleDelete = (usuarioId) => {
    const usuario = usuarios.find(u => u.usuarioId === usuarioId);
    setUsuarioParaExcluir(usuario);
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL_USUARIOS}/${usuarioParaExcluir.usuarioId}`);
      await fetchUsuarios();
      setModalExcluirAberto(false);
      setUsuarioParaExcluir(null);
    } catch (err) {
      console.error("Erro ao deletar usuário:", err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || "Erro ao deletar usuário.");
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirAberto(false);
    setUsuarioParaExcluir(null);
  };

  return (
    <div className="usuarios-container">
      <h1>Gerenciamento de Usuários</h1>

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
      <div className="form-section">
        <h3>Novo Usuário</h3>
        <form onSubmit={handleSubmit}>
          
              <div className="form-inputs-container">
                <select name="perfil" value={formData.perfil || ''} onChange={handleChange} required>
                  <option value="">Selecione o Perfil</option>
                  <option value="ADMIN">Admin</option>
                  <option value="BARBEIRO">Barbeiro</option>
                  <option value="CLIENTE">Cliente</option>
                  <option value="ATENDENTE">Atendente</option>
                  <option value="GERENTE">Gerente</option>
                </select>

                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email de Login" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />

                <input 
                  type="password" 
                  name="senha" 
                  placeholder="Senha de Login" 
                  value={formData.senha} 
                  onChange={handleChange} 
                  required 
                />
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
              
              <button type="submit">Cadastrar Usuário</button>
            </form>
          </div>

          {/* --- Tabela de Usuários --- */}
          <div className="table-section">
            <h3>Lista de Usuários</h3>
            
            {loading && <p>Carregando usuários...</p>}

            {!loading && usuarios.length === 0 && <p>Nenhum usuário cadastrado.</p>}

            {!loading && usuarios.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Perfil</th>
                    <th>Email</th>
                    <th>Data Cadastro</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.usuarioId}>
                      <td>{usuario.usuarioId}</td>
                      <td>{usuario.perfil || 'N/A'}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.dataCadastro ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR') : 'N/A'}</td>
                      <td>
                        <span className={`status-badge status-${usuario.status === 1 ? 'ativo' : 'inativo'}`}>
                          {usuario.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEdit(usuario)}>Editar</button>
                        <button className="btn-excluir" onClick={() => handleDelete(usuario.usuarioId)}>Excluir</button>
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
                  <h3>Editar Usuário</h3>
                  <button className="modal-close" onClick={resetForm}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="perfil">Perfil</label>
                      <select id="perfil" name="perfil" value={formData.perfil || ''} onChange={handleChange} required>
                        <option value="">Selecione o Perfil</option>
                        <option value="ADMIN">Admin</option>
                        <option value="BARBEIRO">Barbeiro</option>
                        <option value="CLIENTE">Cliente</option>
                        <option value="ATENDENTE">Atendente</option>
                        <option value="GERENTE">Gerente</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email de Login</label>
                      <input 
                        type="email" 
                        id="email"
                        name="email" 
                        placeholder="Email de Login" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="senha">Nova Senha (opcional)</label>
                      <input 
                        type="password" 
                        id="senha"
                        name="senha" 
                        placeholder="Nova Senha (deixe em branco para manter a atual)" 
                        value={formData.senha} 
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
          {modalExcluirAberto && usuarioParaExcluir && (
            <div className="modal-overlay" onClick={cancelarExclusao}>
              <div className="modal-content modal-confirmacao" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-confirmacao">
                  <div className="icone-alerta">⚠️</div>
                  <h3>Confirmar Exclusão</h3>
                </div>
                
                <div className="modal-body-confirmacao">
                  <p>Tem certeza que deseja excluir o usuário?</p>
                  <div className="info-usuario">
                    <strong>ID:</strong> {usuarioParaExcluir.usuarioId}<br/>
                    <strong>Perfil:</strong> {usuarioParaExcluir.usu_perfil || 'N/A'}<br/>
                    <strong>Email:</strong> {usuarioParaExcluir.email}<br/>
                    <strong>Status:</strong> {usuarioParaExcluir.status === 1 ? 'Ativo' : 'Inativo'}
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

export default Usuario;