/**
 * EXEMPLOS PRÁTICOS DE USO DO SISTEMA DE PERMISSÕES
 * 
 * Este arquivo contém exemplos de como usar o sistema de controle
 * de acesso em diferentes situações.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import RequirePermission, { ShowByRole } from '../components/RequirePermission';

// ========================================
// EXEMPLO 1: Usar o hook useAuth
// ========================================
function ExemploComHook() {
    const { user, hasPermission, logout } = useAuth();

    return (
        <div>
            <h2>Bem-vindo, {user?.email}</h2>
            <p>Seu perfil: {user?.perfil?.nomePerfil}</p>

            {/* Verificar permissão inline */}
            {hasPermission(['ADMIN']) && (
                <button onClick={() => console.log('Ação exclusiva do admin')}>
                    🔒 Botão Admin
                </button>
            )}

            {hasPermission(['ADMIN', 'GERENTE']) && (
                <button onClick={() => console.log('Ação para admin e gerente')}>
                    ⚙️ Configurações Avançadas
                </button>
            )}

            <button onClick={logout}>Sair</button>
        </div>
    );
}

// ========================================
// EXEMPLO 2: Usar o componente RequirePermission
// ========================================
function ExemploComComponente() {
    return (
        <div>
            <h1>Minha Página</h1>

            {/* Seção visível apenas para ADMIN */}
            <RequirePermission allowedProfiles={['ADMIN']}>
                <div className="admin-section">
                    <h2>Painel Administrativo</h2>
                    <button>Gerenciar Usuários</button>
                    <button>Ver Logs</button>
                </div>
            </RequirePermission>

            {/* Seção visível para ADMIN e GERENTE */}
            <RequirePermission allowedProfiles={['ADMIN', 'GERENTE']}>
                <div className="management-section">
                    <h2>Gestão</h2>
                    <button>Relatórios</button>
                    <button>Configurações</button>
                </div>
            </RequirePermission>

            {/* Seção visível para todos os perfis específicos */}
            <RequirePermission allowedProfiles={['ADMIN', 'GERENTE', 'ATENDENTE']}>
                <div className="staff-section">
                    <h2>Área da Equipe</h2>
                    <button>Ver Agenda</button>
                </div>
            </RequirePermission>
        </div>
    );
}

// ========================================
// EXEMPLO 3: Usar ShowByRole para conteúdo diferente
// ========================================
function ExemploComShowByRole() {
    return (
        <div>
            <h1>Dashboard</h1>

            <ShowByRole
                admin={
                    <div>
                        <h2>Dashboard Administrativo</h2>
                        <p>Você tem acesso total ao sistema</p>
                        <ul>
                            <li>Gerenciar usuários</li>
                            <li>Configurar sistema</li>
                            <li>Ver todos os relatórios</li>
                        </ul>
                    </div>
                }
                gerente={
                    <div>
                        <h2>Dashboard do Gerente</h2>
                        <p>Gerencie sua equipe e recursos</p>
                        <ul>
                            <li>Gerenciar barbeiros</li>
                            <li>Ver agendamentos</li>
                            <li>Relatórios financeiros</li>
                        </ul>
                    </div>
                }
                atendente={
                    <div>
                        <h2>Dashboard do Atendente</h2>
                        <p>Gerencie clientes e agendamentos</p>
                        <ul>
                            <li>Cadastrar clientes</li>
                            <li>Fazer agendamentos</li>
                            <li>Ver agenda do dia</li>
                        </ul>
                    </div>
                }
                barbeiro={
                    <div>
                        <h2>Sua Agenda</h2>
                        <p>Veja seus próximos atendimentos</p>
                        <ul>
                            <li>Próximos clientes</li>
                            <li>Horários livres</li>
                        </ul>
                    </div>
                }
                defaultContent={
                    <div>
                        <h2>Acesso Restrito</h2>
                        <p>Você não tem permissão para acessar esta área</p>
                    </div>
                }
            />
        </div>
    );
}

// ========================================
// EXEMPLO 4: Tabela com ações condicionais
// ========================================
function ExemploTabelaComPermissoes() {
    const { hasPermission } = useAuth();
    
    const clientes = [
        { id: 1, nome: 'João Silva', telefone: '11 99999-9999' },
        { id: 2, nome: 'Maria Santos', telefone: '11 88888-8888' },
    ];

    const handleEdit = (cliente) => {
        console.log('Editando:', cliente);
    };

    const handleDelete = (cliente) => {
        console.log('Excluindo:', cliente);
    };

    return (
        <div>
            <h1>Clientes</h1>

            {/* Botão de adicionar visível para ADMIN, GERENTE e ATENDENTE */}
            {hasPermission(['ADMIN', 'GERENTE', 'ATENDENTE']) && (
                <button onClick={() => console.log('Adicionar cliente')}>
                    + Novo Cliente
                </button>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td>{cliente.nome}</td>
                            <td>{cliente.telefone}</td>
                            <td>
                                {/* Editar: ADMIN, GERENTE, ATENDENTE */}
                                {hasPermission(['ADMIN', 'GERENTE', 'ATENDENTE']) && (
                                    <button onClick={() => handleEdit(cliente)}>
                                        ✏️ Editar
                                    </button>
                                )}

                                {/* Excluir: Apenas ADMIN */}
                                {hasPermission(['ADMIN']) && (
                                    <button onClick={() => handleDelete(cliente)}>
                                        🗑️ Excluir
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ========================================
// EXEMPLO 5: Formulário com campos condicionais
// ========================================
function ExemploFormularioCondicional() {
    const { user, hasPermission } = useAuth();

    return (
        <form>
            <h2>Criar Agendamento</h2>

            {/* Campos visíveis para todos */}
            <div>
                <label>Cliente:</label>
                <select>
                    <option>Selecione...</option>
                </select>
            </div>

            <div>
                <label>Serviço:</label>
                <select>
                    <option>Selecione...</option>
                </select>
            </div>

            {/* Campo de desconto: apenas ADMIN e GERENTE */}
            {hasPermission(['ADMIN', 'GERENTE']) && (
                <div>
                    <label>Desconto (%):</label>
                    <input type="number" min="0" max="100" />
                </div>
            )}

            {/* Campo de observações internas: apenas ADMIN e GERENTE */}
            <RequirePermission allowedProfiles={['ADMIN', 'GERENTE']}>
                <div>
                    <label>Observações Internas:</label>
                    <textarea placeholder="Visível apenas para gestão"></textarea>
                </div>
            </RequirePermission>

            {/* Status do agendamento: todos menos BARBEIRO */}
            {hasPermission(['ADMIN', 'GERENTE', 'ATENDENTE']) && (
                <div>
                    <label>Status:</label>
                    <select>
                        <option>Confirmado</option>
                        <option>Aguardando</option>
                        <option>Cancelado</option>
                    </select>
                </div>
            )}

            <button type="submit">Salvar Agendamento</button>
        </form>
    );
}

// ========================================
// EXEMPLO 6: Verificar permissão antes de ação
// ========================================
function ExemploVerificacaoAntesDeAcao() {
    const { hasPermission } = useAuth();

    const handleDeleteAll = () => {
        // Verificar permissão antes de executar ação sensível
        if (!hasPermission(['ADMIN'])) {
            alert('Você não tem permissão para esta ação!');
            return;
        }

        if (window.confirm('Tem certeza que deseja excluir TUDO?')) {
            console.log('Excluindo tudo...');
        }
    };

    const handleExportData = () => {
        if (!hasPermission(['ADMIN', 'GERENTE'])) {
            alert('Apenas gestores podem exportar dados.');
            return;
        }

        console.log('Exportando dados...');
    };

    return (
        <div>
            <button onClick={handleExportData}>
                📊 Exportar Dados
            </button>

            <button onClick={handleDeleteAll}>
                🗑️ Excluir Tudo
            </button>
        </div>
    );
}

// ========================================
// EXEMPLO 7: Buscar dados diferentes por perfil
// ========================================
function ExemploCarregamentoPorPerfil() {
    const { user } = useAuth();
    const [agendamentos, setAgendamentos] = React.useState([]);

    React.useEffect(() => {
        const carregarAgendamentos = async () => {
            const perfil = user?.perfil?.nomePerfil || user?.perfil;
            
            let url = 'http://localhost:8080/api/agendamentos';

            // BARBEIRO vê apenas seus próprios agendamentos
            if (perfil === 'BARBEIRO') {
                url += `/barbeiro/${user.usuarioId}`;
            }
            // ATENDENTE vê agendamentos do dia
            else if (perfil === 'ATENDENTE') {
                const hoje = new Date().toISOString().split('T')[0];
                url += `/data/${hoje}`;
            }
            // ADMIN e GERENTE vêem todos
            
            try {
                // const response = await axios.get(url);
                // setAgendamentos(response.data);
                console.log('Carregando de:', url);
            } catch (error) {
                console.error('Erro ao carregar:', error);
            }
        };

        if (user) {
            carregarAgendamentos();
        }
    }, [user]);

    return (
        <div>
            <h2>Meus Agendamentos</h2>
            {/* Renderizar lista */}
        </div>
    );
}

export {
    ExemploComHook,
    ExemploComComponente,
    ExemploComShowByRole,
    ExemploTabelaComPermissoes,
    ExemploFormularioCondicional,
    ExemploVerificacaoAntesDeAcao,
    ExemploCarregamentoPorPerfil
};
