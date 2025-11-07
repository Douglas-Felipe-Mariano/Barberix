import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './perfil.css';

import MenuLateral from '../menuLateral/menuLateral';

// URL base da API
const API_URL = 'http://localhost:8080/api/perfis';

function Perfis() {
  const [perfis, setPerfis] = useState([]);
  const [perfilEditando, setPerfilEditando] = useState(null); 
  const [formData, setFormData] = useState({
    nomePerfil: ''
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [perfilParaExcluir, setPerfilParaExcluir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar perfis da API
  const fetchPerfis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setPerfis(response.data);
    } catch (err) {
      console.error("Erro ao buscar perfis:", err);
      setError("Não foi possível carregar os dados dos perfis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfis();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({ nomePerfil: '' });
    setPerfilEditando(null);
    setModalAberto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (perfilEditando) {
        // UPDATE (PUT)
        await axios.put(`${API_URL}/${perfilEditando.perfilId}`, formData);
      } else {
        // CREATE (POST)
        await axios.post(API_URL, formData);
      }
      resetForm();
      await fetchPerfis();
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(`Erro ao ${perfilEditando ? 'editar' : 'cadastrar'} perfil.`);
    }
  };
  
  const handleEdit = (perfil) => {
    setPerfilEditando(perfil);
    setFormData({
      nomePerfil: perfil.nomePerfil,
    });
    setModalAberto(true);
  };
  
  const handleDelete = (perfilId) => {
    const perfil = perfis.find(p => p.perfilId === perfilId);
    setPerfilParaExcluir(perfil);
    setModalExcluirAberto(true);
  };

  const confirmarExclusao = async () => {
    try {
      await axios.delete(`${API_URL}/${perfilParaExcluir.perfilId}`);
      await fetchPerfis();
      setModalExcluirAberto(false);
      setPerfilParaExcluir(null);
    } catch (err) {
      console.error("Erro ao deletar perfil:", err.response ? err.response.data : err.message);
      setError("Erro ao deletar perfil.");
    }
  };

  const cancelarExclusao = () => {
    setModalExcluirAberto(false);
    setPerfilParaExcluir(null);
  };

  return (
    <div className="app-layout-container">
      <MenuLateral />

      <div className="page-content-with-menu">
        <div className="perfis-container">
          <h1>Gerenciamento de Perfis</h1>

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
            <h3>{perfilEditando ? 'Editar Perfil' : 'Novo Perfil'}</h3>
            <form onSubmit={handleSubmit}>
              
              <input 
                type="text" 
                name="nomePerfil" 
                placeholder="Nome do Perfil (ex: Barbeiro, Admin)" 
                value={formData.nomePerfil} 
                onChange={handleChange} 
                required 
              />
              
              <button type="submit">{perfilEditando ? 'Salvar Edição' : 'Cadastrar'}</button>
              
              {perfilEditando && (
                <button type="button" onClick={resetForm}>
                  Cancelar Edição
                </button>
              )}
            </form>
          </div>

          {/* --- Tabela de Perfis --- */}
          <div className="table-section">
            <h3>Lista de Perfis</h3>
            
            {loading && <p>Carregando perfis...</p>}

            {!loading && perfis.length === 0 && <p>Nenhum perfil cadastrado.</p>}

            {!loading && perfis.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome do Perfil</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {perfis.map((perfil) => (
                    <tr key={perfil.perfilId}>
                      <td>{perfil.perfilId}</td>
                      <td>{perfil.nomePerfil}</td>
                      <td>
                        <button className="btn-editar" onClick={() => handleEdit(perfil)}>Editar</button>
                        <button className="btn-excluir" onClick={() => handleDelete(perfil.perfilId)}>Excluir</button>
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
                  <h3>Editar Perfil</h3>
                  <button className="modal-close" onClick={resetForm}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="nomePerfil">Nome do Perfil</label>
                      <input 
                        type="text" 
                        id="nomePerfil"
                        name="nomePerfil" 
                        placeholder="Nome do Perfil (ex: Barbeiro, Admin)" 
                        value={formData.nomePerfil} 
                        onChange={handleChange} 
                        required 
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
          {modalExcluirAberto && perfilParaExcluir && (
            <div className="modal-overlay" onClick={cancelarExclusao}>
              <div className="modal-content modal-confirmacao" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-confirmacao">
                  <div className="icone-alerta">⚠️</div>
                  <h3>Confirmar Exclusão</h3>
                </div>
                
                <div className="modal-body-confirmacao">
                  <p>Tem certeza que deseja excluir o perfil?</p>
                  <div className="info-perfil">
                    <strong>ID:</strong> {perfilParaExcluir.perfilId}<br/>
                    <strong>Nome:</strong> {perfilParaExcluir.nomePerfil}
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

export default Perfis;