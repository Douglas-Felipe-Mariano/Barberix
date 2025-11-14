import React, { useState, useEffect } from 'react';
import axios from '../../services/api'; 
import './barbeiro.css';

// URL base da API
const API_URL_BARBEIROS = 'http://localhost:8080/api/barbeiros';
const API_URL_USUARIOS = 'http://localhost:8080/api/usuarios';
const API_URL_HORARIOS = 'http://localhost:8080/api/horarios';

function Barbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [barbeiroEditando, setBarbeiroEditando] = useState(null); 
  const [formData, setFormData] = useState({
    nome: '',
    usuarioId: '',
    status: 1
  });
  const [horariosModalAberto, setHorariosModalAberto] = useState(false);
  const [barbeiroRecemCriado, setBarbeiroRecemCriado] = useState(null);
  const [novoHorario, setNovoHorario] = useState({
    diaSemana: '',
    horaInicio: '',
    horaFim: '',
    ativo: true,
    aplicarEm: 'APENAS' // 'APENAS' | 'SEG_SEX' | 'TODOS'
  });
  const [novoHorarioModalAberto, setNovoHorarioModalAberto] = useState(false);
  const [novoHorarioTarget, setNovoHorarioTarget] = useState(null);
  const [horariosList, setHorariosList] = useState([]);
  const [horarioEditando, setHorarioEditando] = useState(null);
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
      const data = response.data || [];
      // buscar horários de cada barbeiro em paralelo e anexar ao objeto
      const withHorarios = await Promise.all(data.map(async (b) => {
        try {
          const r = await axios.get(`${API_URL_HORARIOS}/barbeiro/${b.barbeiroId}`);
          const horarios = r.data || [];
          return { ...b, horarios: sortHorarios(horarios) };
        } catch (e) {
          // se falhar, retorna sem horários (não bloqueia lista)
          return { ...b, horarios: [] };
        }
      }));
      setBarbeiros(withHorarios);
    } catch (err) {
      console.error("Erro ao buscar barbeiros:", err);
      setError("Não foi possível carregar os dados dos barbeiros.");
    } finally {
      setLoading(false);
    }
  };

  // Formata um resumo curto dos horários para exibir na tabela
  const formatHorariosResumo = (horarios) => {
    if (!horarios || horarios.length === 0) return 'Nenhum';
    const sorted = sortHorarios(horarios);
    const parts = sorted.map(h => `${h.diaSemana.slice(0,3)} ${h.horaInicio}-${h.horaFim}`);
    if (parts.length <= 2) return parts.join('; ');
    return `${parts.slice(0,2).join('; ')} (+${parts.length - 2})`;
  };

  // Ordena horários por dia da semana e hora de início
  const sortHorarios = (horarios) => {
    if (!horarios || horarios.length === 0) return [];
    const ordem = {
      'SEGUNDA': 1,
      'TERCA': 2,
      'QUARTA': 3,
      'QUINTA': 4,
      'SEXTA': 5,
      'SABADO': 6,
      'DOMINGO': 7
    };
    return horarios.slice().sort((a, b) => {
      const da = ordem[a.diaSemana] || 99;
      const db = ordem[b.diaSemana] || 99;
      if (da !== db) return da - db;
      // Ordena também por hora de início quando mesmo dia
      if (a.horaInicio && b.horaInicio) return a.horaInicio.localeCompare(b.horaInicio);
      return 0;
    });
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
        const res = await axios.post(API_URL_BARBEIROS, dadosParaEnviar);
        const criado = res?.data;
        // abrir modal de horários para permitir adicionar turnos
        if (criado && criado.barbeiroId) {
          setBarbeiroRecemCriado(criado);
          setHorariosModalAberto(true);
        }
      }
      resetForm();
      await fetchBarbeiros();
    } catch (err) {
      console.error("Erro na operação:", err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || `Erro ao ${barbeiroEditando ? 'editar' : 'cadastrar'} barbeiro.`);
    }
  };

  // Horários: criar horário para barbeiro
  const handleHorarioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNovoHorario({
      ...novoHorario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const criarHorario = async (targetBarbeiroId) => {
    const barbeiroId = targetBarbeiroId || (barbeiroRecemCriado?.barbeiroId) || (barbeiroEditando?.barbeiroId);
    if (!barbeiroId) return;
    try {
      // define os dias conforme a opção aplicarEm
      let dias = [];
      if (novoHorario.aplicarEm === 'SEG_SEX') {
        dias = ['SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA'];
      } else if (novoHorario.aplicarEm === 'TODOS') {
        dias = ['SEGUNDA','TERCA','QUARTA','QUINTA','SEXTA','SABADO','DOMINGO'];
      } else {
        // apenas um dia selecionado
        if (!novoHorario.diaSemana) {
          setError('Selecione um dia da semana.');
          return;
        }
        dias = [novoHorario.diaSemana];
      }

      // criar um horário por dia (em paralelo)
      const posts = dias.map(dia => {
        const payload = {
          barbeiro: { barbeiroId: barbeiroId },
          diaSemana: dia,
          horaInicio: novoHorario.horaInicio,
          horaFim: novoHorario.horaFim,
          ativo: novoHorario.ativo
        };
        return axios.post(API_URL_HORARIOS, payload);
      });

      await Promise.all(posts);
      // limpa formulário de horário
      setNovoHorario({ diaSemana: '', horaInicio: '', horaFim: '', ativo: true, aplicarEm: 'APENAS' });
      // atualizar lista de horários se estivermos no contexto de edição
      if (barbeiroEditando) await fetchHorariosBarbeiro(barbeiroEditando.barbeiroId);
      if (barbeiroRecemCriado) await fetchBarbeiros();
    } catch (err) {
      console.error('Erro ao criar horário:', err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || 'Erro ao criar horário.');
    }
  };

  const abrirNovoHorarioModal = (targetId) => {
    const id = targetId || (barbeiroEditando?.barbeiroId) || (barbeiroRecemCriado?.barbeiroId);
    setNovoHorarioTarget(id);
    setNovoHorarioModalAberto(true);
  };

  const fecharNovoHorarioModal = () => {
    setNovoHorarioModalAberto(false);
    setNovoHorarioTarget(null);
    setNovoHorario({ diaSemana: '', horaInicio: '', horaFim: '', ativo: true, aplicarEm: 'APENAS' });
  };

  const handleSaveHorario = async () => {
    if (!novoHorarioTarget) {
      setError('Barbeiro não definido para novo horário.');
      return;
    }
    try {
      await criarHorario(novoHorarioTarget);
      fecharNovoHorarioModal();
    } catch (e) {
      // criarHorario já seta o error
    }
  };

  const fetchHorariosBarbeiro = async (barbeiroId) => {
    try {
      const res = await axios.get(`${API_URL_HORARIOS}/barbeiro/${barbeiroId}`);
      const horarios = res.data || [];
      setHorariosList(sortHorarios(horarios));
    } catch (err) {
      console.error('Erro ao buscar horários do barbeiro:', err.response ? err.response.data : err.message);
      setHorariosList([]);
    }
  };

  const startEditarHorario = (horario) => {
    setHorarioEditando(horario);
    setNovoHorario({
      diaSemana: horario.diaSemana || '',
      horaInicio: horario.horaInicio || '',
      horaFim: horario.horaFim || '',
      ativo: horario.ativo === undefined ? true : horario.ativo,
      aplicarEm: 'APENAS'
    });
  };

  const atualizarHorario = async () => {
    if (!horarioEditando) return;
    try {
      const payload = {
        barbeiro: { barbeiroId: horarioEditando.barbeiro?.barbeiroId || barbeiroEditando?.barbeiroId },
        diaSemana: novoHorario.diaSemana,
        horaInicio: novoHorario.horaInicio,
        horaFim: novoHorario.horaFim,
        ativo: novoHorario.ativo
      };
      await axios.put(`${API_URL_HORARIOS}/${horarioEditando.horarioId}`, payload);
      setHorarioEditando(null);
      setNovoHorario({ diaSemana: '', horaInicio: '', horaFim: '', ativo: true, aplicarEm: 'APENAS' });
      if (barbeiroEditando) await fetchHorariosBarbeiro(barbeiroEditando.barbeiroId);
    } catch (err) {
      console.error('Erro ao atualizar horário:', err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || 'Erro ao atualizar horário.');
    }
  };

  const deletarHorario = async (horarioId) => {
    try {
      await axios.delete(`${API_URL_HORARIOS}/${horarioId}`);
      if (barbeiroEditando) await fetchHorariosBarbeiro(barbeiroEditando.barbeiroId);
      if (barbeiroRecemCriado) await fetchBarbeiros();
    } catch (err) {
      console.error('Erro ao deletar horário:', err.response ? err.response.data : err.message);
      setError(err.normalizedMessage || err.response?.data?.message || 'Erro ao deletar horário.');
    }
  };

  const fecharModalHorarios = () => {
    setHorariosModalAberto(false);
    setBarbeiroRecemCriado(null);
    setNovoHorario({ diaSemana: '', horaInicio: '', horaFim: '', ativo: true, aplicarEm: 'APENAS' });
  };
  
  const handleEdit = (barbeiro) => {
    setBarbeiroEditando(barbeiro);
    setFormData({
      nome: barbeiro.nome,
      usuarioId: barbeiro.usuario?.usuarioId || '',
      status: barbeiro.status,
    });
    // carregar horários desse barbeiro
    fetchHorariosBarbeiro(barbeiro.barbeiroId);
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
      setError(err.normalizedMessage || err.response?.data?.message || "Erro ao deletar barbeiro.");
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
                    <th>Horários</th>
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
                        <div className="horarios-resumo">
                          {formatHorariosResumo(barbeiro.horarios)}
                        </div>
                      </td>
                      <td>
                        <button type="button" className="btn-editar" onClick={() => handleEdit(barbeiro)}>Editar</button>
                        <button type="button" className="btn-excluir" onClick={() => handleDelete(barbeiro.barbeiroId)}>Excluir</button>
                        <button type="button" className="btn-horarios" onClick={() => handleEdit(barbeiro)} style={{marginLeft: '6px'}}>Horários</button>
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
                    
                    {/* --- Horários de Trabalho do Barbeiro (edição) --- */}
                    {barbeiroEditando && (
                      <div className="horarios-section">
                        <h4>Horários de Trabalho</h4>
                        {horariosList.length === 0 && <p>Nenhum horário cadastrado para este barbeiro.</p>}

                        {horariosList.length > 0 && (
                          <table className="horarios-table">
                            <thead>
                              <tr>
                                <th>Dia</th>
                                <th>Início</th>
                                <th>Fim</th>
                                <th>Ativo</th>
                                <th>Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {horariosList.map(h => (
                                <tr key={h.horarioId}>
                                  <td>{h.diaSemana}</td>
                                  <td>{h.horaInicio}</td>
                                  <td>{h.horaFim}</td>
                                  <td>{h.ativo ? 'Sim' : 'Não'}</td>
                                  <td>
                                    <button type="button" className="btn-editar" onClick={() => startEditarHorario(h)}>Editar</button>
                                    <button type="button" className="btn-excluir" onClick={() => deletarHorario(h.horarioId)}>Excluir</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        <div className="horario-form">
                          <h5>{horarioEditando ? 'Editar Horário' : 'Adicionar Horário'}</h5>
                          <div className="form-row">
                            <div className="form-group">
                              <label>Aplicar em</label>
                              <select name="aplicarEm" value={novoHorario.aplicarEm} onChange={handleHorarioChange}>
                                <option value="APENAS">Apenas um dia</option>
                                <option value="SEG_SEX">Segunda a Sexta</option>
                                <option value="TODOS">Todos os dias</option>
                              </select>
                              {novoHorario.aplicarEm === 'APENAS' && (
                                <select name="diaSemana" value={novoHorario.diaSemana} onChange={handleHorarioChange} required>
                                  <option value="">Selecione o dia</option>
                                  <option value="SEGUNDA">Segunda</option>
                                  <option value="TERCA">Terça</option>
                                  <option value="QUARTA">Quarta</option>
                                  <option value="QUINTA">Quinta</option>
                                  <option value="SEXTA">Sexta</option>
                                  <option value="SABADO">Sábado</option>
                                  <option value="DOMINGO">Domingo</option>
                                </select>
                              )}
                            </div>

                            <div className="form-group">
                              <label>Hora Início</label>
                              <input type="time" name="horaInicio" value={novoHorario.horaInicio} onChange={handleHorarioChange} required />
                            </div>

                            <div className="form-group">
                              <label>Hora Fim</label>
                              <input type="time" name="horaFim" value={novoHorario.horaFim} onChange={handleHorarioChange} required />
                            </div>

                            <div className="form-group">
                              <label className="checkbox-label">
                                <input type="checkbox" name="ativo" checked={novoHorario.ativo} onChange={handleHorarioChange} /> Ativo
                              </label>
                            </div>
                          </div>

                          <div className="form-actions">
                            {horarioEditando ? (
                              <button type="button" className="btn-salvar" onClick={atualizarHorario}>Salvar Horário</button>
                            ) : (
                              <button type="button" className="btn-salvar" onClick={() => abrirNovoHorarioModal(barbeiroEditando?.barbeiroId)}>Adicionar Horário</button>
                            )}
                            {horarioEditando && (
                              <button type="button" className="btn-cancelar" onClick={() => { setHorarioEditando(null); setNovoHorario({ diaSemana: '', horaInicio: '', horaFim: '', ativo: true, aplicarEm: 'APENAS' }); }}>Cancelar</button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div> {/* .modal-body */}

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
          
          {/* Mini-modal para adicionar horário (mais limpo) */}
          {novoHorarioModalAberto && (
            <div className="modal-overlay" onClick={fecharNovoHorarioModal}>
              <div className="mini-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Adicionar Horário</h3>
                  <button className="modal-close" onClick={fecharNovoHorarioModal}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Aplicar em</label>
                    <select name="aplicarEm" value={novoHorario.aplicarEm} onChange={handleHorarioChange}>
                      <option value="APENAS">Apenas um dia</option>
                      <option value="SEG_SEX">Segunda a Sexta</option>
                      <option value="TODOS">Todos os dias</option>
                    </select>
                    {novoHorario.aplicarEm === 'APENAS' && (
                      <select name="diaSemana" value={novoHorario.diaSemana} onChange={handleHorarioChange} required>
                        <option value="">Selecione o dia</option>
                        <option value="SEGUNDA">Segunda</option>
                        <option value="TERCA">Terça</option>
                        <option value="QUARTA">Quarta</option>
                        <option value="QUINTA">Quinta</option>
                        <option value="SEXTA">Sexta</option>
                        <option value="SABADO">Sábado</option>
                        <option value="DOMINGO">Domingo</option>
                      </select>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Hora Início</label>
                    <input type="time" name="horaInicio" value={novoHorario.horaInicio} onChange={handleHorarioChange} required />
                  </div>
                  <div className="form-group">
                    <label>Hora Fim</label>
                    <input type="time" name="horaFim" value={novoHorario.horaFim} onChange={handleHorarioChange} required />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="ativo" checked={novoHorario.ativo} onChange={handleHorarioChange} /> Ativo
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancelar" onClick={fecharNovoHorarioModal}>Cancelar</button>
                  <button type="button" className="btn-salvar" onClick={handleSaveHorario}>Salvar Horário</button>
                </div>
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
 
          {/* Modal de Horários ao criar barbeiro */}
          {horariosModalAberto && barbeiroRecemCriado && (
            <div className="modal-overlay" onClick={fecharModalHorarios}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Adicionar Horários - {barbeiroRecemCriado.nome}</h3>
                  <button className="modal-close" onClick={fecharModalHorarios}>&times;</button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Dia da Semana</label>
                    <select name="aplicarEm" value={novoHorario.aplicarEm} onChange={handleHorarioChange}>
                      <option value="APENAS">Apenas um dia</option>
                      <option value="SEG_SEX">Segunda a Sexta</option>
                      <option value="TODOS">Todos os dias</option>
                    </select>
                    {novoHorario.aplicarEm === 'APENAS' && (
                      <select name="diaSemana" value={novoHorario.diaSemana} onChange={handleHorarioChange} required>
                        <option value="">Selecione o dia</option>
                        <option value="SEGUNDA">Segunda</option>
                        <option value="TERCA">Terça</option>
                        <option value="QUARTA">Quarta</option>
                        <option value="QUINTA">Quinta</option>
                        <option value="SEXTA">Sexta</option>
                        <option value="SABADO">Sábado</option>
                        <option value="DOMINGO">Domingo</option>
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Hora Início</label>
                    <input type="time" name="horaInicio" value={novoHorario.horaInicio} onChange={handleHorarioChange} required />
                  </div>

                  <div className="form-group">
                    <label>Hora Fim</label>
                    <input type="time" name="horaFim" value={novoHorario.horaFim} onChange={handleHorarioChange} required />
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="ativo" checked={novoHorario.ativo} onChange={handleHorarioChange} /> Ativo
                    </label>
                  </div>

                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancelar" onClick={fecharModalHorarios}>Fechar</button>
                  <button type="button" className="btn-salvar" onClick={criarHorario}>Adicionar Horário</button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}   

export default Barbeiros;