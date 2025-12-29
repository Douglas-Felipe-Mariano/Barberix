CREATE DATABASE DB_BARBEARIA;

CREATE TABLE TB_CLIENTE (ClienteId         INT             IDENTITY PRIMARY KEY
						,UsuarioId 	       INT 			   NULL     -- NULL para ser possivel o acesso de clientes sem conta
						,CLI_NOME          VARCHAR(100)    NOT NULL
						,CLI_Telefone      VARCHAR(16)     NOT NULL -- ID do Cliente Convidado (Guest)
						,CLI_Email		   VARCHAR(100)    NOT NULL		UNIQUE
						,CLI_DataCadastro  DATETIME2       NOT NULL     DEFAULT GETDATE()
						,CLI_Endereco      VARCHAR(255)    NULL
						,CONSTRAINT FK_CLIENTE_USUARIO FOREIGN KEY (UsuarioId) REFERENCES TB_USUARIO(UsuarioId));

-- ÍNDICE PARA GARANTIR QUE UM USUÁRIO SÓ POSSA TER UM CLIENTE ASSOCIADO, MAS VARIOS NULLS
CREATE UNIQUE INDEX IX_CLIENTE_USUARIO ON TB_CLIENTE (UsuarioId) WHERE UsuarioId IS NOT NULL;						

-- Deletado com a implementação do Enum no backend
-- CREATE TABLE TB_PERFIL (PerfilId	INT IDENTITY PRIMARY KEY   
-- 					   ,PER_Nome	VARCHAR(30) NOT NULL UNIQUE );

CREATE TABLE TB_USUARIO (UsuarioId         INT              IDENTITY PRIMARY KEY    
						,USU_Perfil	       VARCHAR(30)		NOT NULL -- 'ADMIN', 'BARBEIRO', 'CLIENTE', 'SECRETARIA'
						,USU_Email         VARCHAR(100)     NOT NULL        UNIQUE
						,USU_Senha         VARCHAR(100)     NOT NULL         
						,USU_DataCadastro  DATETIME2        NOT NULL        DEFAULT GETDATE()
						,USU_Status 	   BIT 				NOT NULL  		DEFAULT 1);
					--  Deletado com a implementação do Enum no backend	
					-- ,CONSTRAINT FK_USUARIO_PERFIL   FOREIGN KEY (PerfilId) REFERENCES TB_PERFIL(PerfilId));

CREATE TABLE TB_SERVICO (ServicoId                   INT             PRIMARY KEY     IDENTITY
						,SERV_Nome                   VARCHAR(45)     NOT NULL        UNIQUE
						,SERV_Descricao 			 VARCHAR(255)    NULL
						,SERV_DuracaoMinutos		 INT			 NOT NULL
						,SERV_Preco                  DECIMAL(10,2)   NOT NULL
						,SERV_FotoUrl                VARCHAR(MAX)    NULL
						,SERV_Ativo					 BIT    	 NOT NULL        DEFAULT 1);

CREATE TABLE TB_BARBEIRO (BarbeiroId     INT   		   IDENTITY PRIMARY KEY
						 ,UsuarioId	  	 INT   		   NOT NULL
						 ,BARB_Nome      VARCHAR(100)  NOT NULL
						 ,BARB_Bio		 VARCHAR(500)  NULL
						 ,BARB_FotoUrl   VARCHAR(MAX)  NULL
						 ,BARB_Status	 BIT		   NOT NULL DEFAULT 1
						 ,CONSTRAINT FK_BARBEIRO_USUARIO FOREIGN KEY (UsuarioId) REFERENCES TB_USUARIO(UsuarioId));


CREATE TABLE TB_AGENDAMENTO (AgendamentoId					INT IDENTITY PRIMARY KEY
							,ClienteId					    INT				NOT NULL
							,ServicoId						INT				NOT NULL
							,BarbeiroId						INT				NOT NULL
							,AGEND_DataAgendada				DATETIME2		NOT NULL
							,AGEND_DataRegistroAgendamento  DATETIME2		NOT NULL DEFAULT GETDATE()
							,AGEND_Valor					DECIMAL(10,2)   NOT NULL
							,AGEND_StatusPagamento			VARCHAR(20)     NOT NULL DEFAULT ('PENDENTE')
							,AGEND_FormaPagamento			VARCHAR(20)     NULL
							,AGEND_DataPagamento			DATETIME2	    NULL
							,AGEND_MotivoCancelamento		VARCHAR(200)    NULL
							,CONSTRAINT FK_AGENDAMENTO_CLIENTE  FOREIGN KEY (ClienteId)  REFERENCES TB_CLIENTE(ClienteId)
							,CONSTRAINT FK_AGENDAMENTO_SERVICO  FOREIGN KEY (ServicoId)  REFERENCES TB_SERVICO(ServicoId)
							,CONSTRAINT FK_AGENDAMENTO_BARBEIRO FOREIGN KEY (BarbeiroId) REFERENCES TB_BARBEIRO(BarbeiroId)
							-- UM BARBEIRO NÃO PODE TER DOIS AGENDAMENTOS NA MESMA DATA E HORA
							,CONSTRAINT UQ_BARBEIRO_AGENDAMENTO UNIQUE		 (BarbeiroId, AGEND_DataAgendada));

CREATE TABLE TB_AVALIACAO (AvaliacaoId		INT IDENTITY PRIMARY KEY
						  ,AgendamentoId	INT NOT NULL UNIQUE 
						  ,AVAL_Nota		INT NOT NULL CHECK (AVAL_Nota BETWEEN 1 AND 5)
						  ,AVAL_Comentario  VARCHAR(500) NULL
						  ,AVAL_Data        DATETIME2 NOT NULL DEFAULT GETDATE()
						  ,CONSTRAINT FK_AVALIACAO_AGENDAMENTO FOREIGN KEY (AgendamentoId) REFERENCES TB_AGENDAMENTO(AgendamentoId));

CREATE TABLE TB_FINANCEIRO (LancamentoId    INT IDENTITY PRIMARY KEY
    					   ,AgendamentoId   INT NULL, -- Se for NULL, é uma despesa avulsa (ex: conta de luz)
    					   ,FIN_Tipo        VARCHAR(10) NOT NULL, -- 'RECEITA' ou 'DESPESA'
    					   ,FIN_Descricao   VARCHAR(200) NOT NULL,
    					   ,FIN_Valor       DECIMAL(10,2) NOT NULL,
    					   ,FIN_Data        DATETIME2 DEFAULT GETDATE(),
    					   ,CONSTRAINT FK_FINANCEIRO_AGENDAMENTO FOREIGN KEY (AgendamentoId) REFERENCES TB_AGENDAMENTO(AgendamentoId));						  
						   
CREATE TABLE TB_HORARIO_TRABALHO (HorarioId 		INT 		IDENTITY PRIMARY KEY
								 ,BarbeiroId		INT 		NOT NULL
								 ,HT_DiaSemana		VARCHAR(20)	NOT NULL
								 ,HT_HoraInicio		TIME		NOT NULL
								 ,HT_HoraFim		TIME		NOT NULL
								 ,HT_Ativo			BIT 		NOT NULL DEFAULT 1
								 ,CONSTRAINT FK_HORARIO_BARBEIRO FOREIGN KEY (BarbeiroId) REFERENCES TB_BARBEIRO (BarbeiroId)
								  ON DELETE CASCADE);							

CREATE TABLE TB_TOKEN_SSITEMA (TokenId				INT 		 IDENTITY PRIMARY KEY
							  ,UsuarioId			INT 		 NOT NULL
							  ,TKN_Token			VARCHAR(255) NOT NULL UNIQUE
							  ,TKN_Tipo				VARCHAR(50)  NOT NULL	-- 'RESET_SENHA', 'CONFIRMACAO_EMAIL', etc.
							  ,TKN_DataExpiracao    DATETIME2	 NOT NULL
							  ,CONSTRAINT FK_TOKEN_USUARIO FOREIGN KEY (UsuarioId) REFERENCES TB_USUARIO(UsuarioId));	

CREATE TABLE TB_LOGS (LogId        INT IDENTITY PRIMARY KEY,
    				 ,UsuarioId    INT NULL,
    				 ,LOG_Acao     VARCHAR(MAX) NOT NULL,
    				 ,LOG_Data     DATETIME2 DEFAULT GETDATE(),
    				 ,LOG_Entidade VARCHAR(50)
);							  							   