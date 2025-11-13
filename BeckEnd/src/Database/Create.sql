CREATE DATABASE DB_BARBEARIA;

CREATE TABLE TB_CLIENTE (ClienteId         INT             IDENTITY PRIMARY KEY  
						,CLI_NOME          VARCHAR(100)    NOT NULL
						,CLI_Telefone      VARCHAR(16)     NOT NULL
						,CLI_Email		   VARCHAR(100)    NOT NULL		UNIQUE
						,CLI_DataCadastro  DATETIME2       NOT NULL     DEFAULT GETDATE()
						,CLI_Endereco      VARCHAR(255)    NULL);

-- Deletado com a implementação do Enum no backend
-- CREATE TABLE TB_PERFIL (PerfilId	INT IDENTITY PRIMARY KEY   
-- 					   ,PER_Nome	VARCHAR(30) NOT NULL UNIQUE );

CREATE TABLE TB_USUARIO (UsuarioId         INT              IDENTITY PRIMARY KEY    
						,USU_Perfil	       VARCHAR(30)		NOT NULL
						,USU_Email         VARCHAR(100)     NOT NULL        UNIQUE
						,USU_Senha         VARCHAR(100)     NOT NULL         
						,USU_DataCadastro  DATETIME2        NOT NULL        DEFAULT GETDATE()
						,USU_Status 	   BIT 				NOT NULL  		DEFAULT 1);
					--  Deletado com a implementação do Enum no backend	
					-- ,CONSTRAINT FK_USUARIO_PERFIL   FOREIGN KEY (PerfilId) REFERENCES TB_PERFIL(PerfilId));

CREATE TABLE TB_SERVICO (ServicoId                   INT             PRIMARY KEY     IDENTITY
						,SERV_Nome                   VARCHAR(45)     NOT NULL        UNIQUE
						,SERV_DuracaoMinutos		 INT			 NOT NULL
						,SERV_Preco                  DECIMAL(10,2)   NOT NULL)

CREATE TABLE TB_BARBEIRO (BarbeiroId     INT   		   IDENTITY PRIMARY KEY
						 ,UsuarioId	  	 INT   		   NOT NULL
						 ,BARB_Nome      VARCHAR(100)  NOT NULL
						 ,BARB_Status	 BIT		   NOT NULL DEFAULT 1

						 ,CONSTRAINT FK_BARBEIRO_USUARIO FOREIGN KEY (UsuarioId) REFERENCES TB_USUARIO(UsuarioId));


CREATE TABLE TB_AGENDAMENTO (AgendamentoId					INT IDENTITY PRIMARY KEY
							,ClienteId					    INT				NOT NULL
							,ServicoId						INT				NOT NULL
							,BarbeiroId						INT				NOT NULL
							,AGEND_DataAgendada				DATETIME2		NOT NULL
							,AGEND_DataRegistroAgendamento  DATETIME2		NOT NULL DEFAULT GETDATE()
							,AGEND_Valor					DECIMAL(10,2)   NOT NULL
							,AGEND_StatusPagamento			VARCHAR(20)     NOT NULL DEFAULT ("PENDENTE")
							,AGEND_FormaPagamento			VARCHAR(20)     NULL
							,AGEND_DataPagamento			DATETIME2	    NULL
							,CONSTRAINT FK_AGENDAMENTO_CLIENTE  FOREIGN KEY (ClienteId)  REFERENCES TB_CLIENTE(ClienteId)
							,CONSTRAINT FK_AGENDAMENTO_SERVICO  FOREIGN KEY (ServicoId)  REFERENCES TB_SERVICO(ServicoId)
							,CONSTRAINT FK_AGENDAMENTO_BARBEIRO FOREIGN KEY (BarbeiroId) REFERENCES TB_BARBEIRO(BarbeiroId)
							,CONSTRAINT UQ_BARBEIRO_AGENDAMENTO UNIQUE		 (BarbeiroId, AGEND_DataAgendada)); 

CREATE TABLE TB_HORARIO_TRABALHO (HorarioId 		INT 		IDENTITY PRIMARY KEY
								  ,BarbeiroId		INT 		NOT NULL
								  ,HT_DiaSemana		VARCHAR(20)	NOT NULL
								  ,HT_HoraInicio	TIME		NOT NULL
								  ,HT_HoraFim		TIME		NOT NULL
								  ,HT_Ativo			BIT 		NOT NULL DEFAULT 1
								  ,CONSTRAINT FK_HORARIO_BARBEIRO FOREIGN KEY (BarbeiroId) REFERENCES TB_BARBEIRO (BarbeiroId));							

							