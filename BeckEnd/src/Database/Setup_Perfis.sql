-- ============================================
-- SCRIPT DE PADRONIZAÇÃO DE PERFIS
-- ============================================
-- Use este script para padronizar os nomes dos perfis no banco de dados

-- OPÇÃO 1: Criar perfis padronizados (se ainda não existem)
-- ============================================
IF NOT EXISTS (SELECT 1 FROM TB_PERFIL WHERE PER_Nome = 'ADMIN')
BEGIN
    INSERT INTO TB_PERFIL (PER_Nome) VALUES ('ADMIN');
    PRINT 'Perfil ADMIN criado com sucesso!';
END
ELSE
    PRINT 'Perfil ADMIN já existe.';

IF NOT EXISTS (SELECT 1 FROM TB_PERFIL WHERE PER_Nome = 'GERENTE')
BEGIN
    INSERT INTO TB_PERFIL (PER_Nome) VALUES ('GERENTE');
    PRINT 'Perfil GERENTE criado com sucesso!';
END
ELSE
    PRINT 'Perfil GERENTE já existe.';

IF NOT EXISTS (SELECT 1 FROM TB_PERFIL WHERE PER_Nome = 'ATENDENTE')
BEGIN
    INSERT INTO TB_PERFIL (PER_Nome) VALUES ('ATENDENTE');
    PRINT 'Perfil ATENDENTE criado com sucesso!';
END
ELSE
    PRINT 'Perfil ATENDENTE já existe.';

IF NOT EXISTS (SELECT 1 FROM TB_PERFIL WHERE PER_Nome = 'BARBEIRO')
BEGIN
    INSERT INTO TB_PERFIL (PER_Nome) VALUES ('BARBEIRO');
    PRINT 'Perfil BARBEIRO criado com sucesso!';
END
ELSE
    PRINT 'Perfil BARBEIRO já existe.';

GO

-- ============================================
-- OPÇÃO 2: Atualizar perfis existentes com nomes antigos
-- ============================================
-- Descomente as linhas abaixo se você já tem perfis com nomes diferentes

-- Atualizar "administrador" para "ADMIN"
-- UPDATE TB_PERFIL SET PER_Nome = 'ADMIN' WHERE UPPER(PER_Nome) = 'ADMINISTRADOR';

-- Atualizar "gerente" para "GERENTE"
-- UPDATE TB_PERFIL SET PER_Nome = 'GERENTE' WHERE UPPER(PER_Nome) IN ('GERENTE', 'Gerente');

-- Atualizar "atendente" para "ATENDENTE"
-- UPDATE TB_PERFIL SET PER_Nome = 'ATENDENTE' WHERE UPPER(PER_Nome) IN ('ATENDENTE', 'Atendente');

-- Atualizar "barbeiro" para "BARBEIRO"
-- UPDATE TB_PERFIL SET PER_Nome = 'BARBEIRO' WHERE UPPER(PER_Nome) IN ('BARBEIRO', 'Barbeiro');

GO

-- ============================================
-- VERIFICAR PERFIS ATUAIS
-- ============================================
PRINT '';
PRINT '=== PERFIS CADASTRADOS NO SISTEMA ===';
SELECT PerfilId, PER_Nome AS 'Nome do Perfil' 
FROM TB_PERFIL 
ORDER BY PerfilId;

GO

-- ============================================
-- CRIAR USUÁRIOS DE TESTE (se não existirem)
-- ============================================
-- IMPORTANTE: A senha precisa estar criptografada no backend
-- Por enquanto, usando senha em texto plano (será criptografada no login)

-- Usuário ADMIN
IF NOT EXISTS (SELECT 1 FROM TB_USUARIO WHERE USU_Email = 'admin@barberix.com')
BEGIN
    DECLARE @AdminPerfilId INT = (SELECT PerfilId FROM TB_PERFIL WHERE PER_Nome = 'ADMIN');
    
    IF @AdminPerfilId IS NOT NULL
    BEGIN
        INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
        VALUES (@AdminPerfilId, 'admin@barberix.com', 'senha123', 1);
        PRINT 'Usuário admin@barberix.com criado com sucesso!';
    END
    ELSE
        PRINT 'ERRO: Perfil ADMIN não encontrado. Crie o perfil primeiro.';
END
ELSE
    PRINT 'Usuário admin@barberix.com já existe.';

-- Usuário GERENTE
IF NOT EXISTS (SELECT 1 FROM TB_USUARIO WHERE USU_Email = 'gerente@barberix.com')
BEGIN
    DECLARE @GerentePerfilId INT = (SELECT PerfilId FROM TB_PERFIL WHERE PER_Nome = 'GERENTE');
    
    IF @GerentePerfilId IS NOT NULL
    BEGIN
        INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
        VALUES (@GerentePerfilId, 'gerente@barberix.com', 'senha123', 1);
        PRINT 'Usuário gerente@barberix.com criado com sucesso!';
    END
    ELSE
        PRINT 'ERRO: Perfil GERENTE não encontrado. Crie o perfil primeiro.';
END
ELSE
    PRINT 'Usuário gerente@barberix.com já existe.';

-- Usuário ATENDENTE
IF NOT EXISTS (SELECT 1 FROM TB_USUARIO WHERE USU_Email = 'atendente@barberix.com')
BEGIN
    DECLARE @AtendentePerfilId INT = (SELECT PerfilId FROM TB_PERFIL WHERE PER_Nome = 'ATENDENTE');
    
    IF @AtendentePerfilId IS NOT NULL
    BEGIN
        INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
        VALUES (@AtendentePerfilId, 'atendente@barberix.com', 'senha123', 1);
        PRINT 'Usuário atendente@barberix.com criado com sucesso!';
    END
    ELSE
        PRINT 'ERRO: Perfil ATENDENTE não encontrado. Crie o perfil primeiro.';
END
ELSE
    PRINT 'Usuário atendente@barberix.com já existe.';

-- Usuário BARBEIRO
IF NOT EXISTS (SELECT 1 FROM TB_USUARIO WHERE USU_Email = 'barbeiro@barberix.com')
BEGIN
    DECLARE @BarbeiroPerfilId INT = (SELECT PerfilId FROM TB_PERFIL WHERE PER_Nome = 'BARBEIRO');
    
    IF @BarbeiroPerfilId IS NOT NULL
    BEGIN
        INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
        VALUES (@BarbeiroPerfilId, 'barbeiro@barberix.com', 'senha123', 1);
        PRINT 'Usuário barbeiro@barberix.com criado com sucesso!';
    END
    ELSE
        PRINT 'ERRO: Perfil BARBEIRO não encontrado. Crie o perfil primeiro.';
END
ELSE
    PRINT 'Usuário barbeiro@barberix.com já existe.';

GO

-- ============================================
-- VERIFICAR USUÁRIOS CRIADOS
-- ============================================
PRINT '';
PRINT '=== USUÁRIOS CADASTRADOS NO SISTEMA ===';
SELECT 
    u.UsuarioId,
    u.USU_Email AS 'Email',
    p.PER_Nome AS 'Perfil',
    CASE WHEN u.USU_Status = 1 THEN 'Ativo' ELSE 'Inativo' END AS 'Status'
FROM TB_USUARIO u
INNER JOIN TB_PERFIL p ON u.PerfilId = p.PerfilId
ORDER BY p.PerfilId, u.UsuarioId;

GO

-- ============================================
-- CONSULTAS ÚTEIS PARA MANUTENÇÃO
-- ============================================

-- Ver todos os perfis e quantos usuários tem em cada
PRINT '';
PRINT '=== DISTRIBUIÇÃO DE USUÁRIOS POR PERFIL ===';
SELECT 
    p.PER_Nome AS 'Perfil',
    COUNT(u.UsuarioId) AS 'Quantidade de Usuários'
FROM TB_PERFIL p
LEFT JOIN TB_USUARIO u ON p.PerfilId = u.PerfilId
GROUP BY p.PER_Nome
ORDER BY COUNT(u.UsuarioId) DESC;
