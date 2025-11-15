# 💈 Barberix - Sistema de Agendamento para Barbearias

Este repositório contém o código-fonte completo (Full-Stack) do projeto Barberix, um sistema de gerenciamento e agendamento para barbearias.

O projeto é estruturado como um **monorepo**, contendo duas aplicações principais:
* `/backEnd`: A API RESTful construída com Spring Boot.
* `/frontEnd`: A aplicação do cliente (SPA) construída com React.

## 🎯 Problema e Objetivos
O projeto resolve a "dor" de pequenas e médias barbearias que ainda dependem de métodos manuais (como cadernos ou WhatsApp) para gerenciar agendamentos. Isso gera conflitos de horário, "no-shows" (faltas) e nenhuma visão de faturamento.

Nosso **objetivo** é centralizar a operação, permitindo que clientes façam o auto-agendamento online e que os gerentes tenham uma visão clara do negócio através de relatórios.

## [cite_start]⚙️ Stack Tecnológica (Arquitetura) 

* **Backend (Pasta `/backEnd`):**
    * Java (JDK 21)
    * Spring Boot (v3.x.x)
    * Spring Web (API RESTful)
    * Spring Data JPA (Persistência)
    * Spring Security (Autenticação e Autorização)
    * SQL Server (Banco de Dados de Produção)
    * H2 (Banco de Testes em memória)
    * Springdoc (Swagger) (Documentação da API)
    * Maven (Gerenciador de Dependências)

* **Frontend (Pasta `/frontEnd`):**
    * React 18
    * React Router DOM (Roteamento)
    * Axios (Cliente HTTP)

## 🚀 Instruções de Instalação e Execução

Para rodar este projeto localmente, você precisará ter o **JDK 21** e o **Node.js (v18+)** instalados.

### 1. Backend (API Spring) 

O backend é a "cozinha". Ele precisa estar rodando para que o frontend funcione.

```bash
# 1. Clone o repositório
git clone [SEU_LINK_DO_GITHUB]
cd projeto-barbearia/backEnd

# 2. (Primeira vez) Limpe e instale as dependências do Maven
# (Isso pode levar alguns minutos)
./mvnw clean install -U

# 3. Configure o banco (Opcional - Produção)
# O projeto está configurado para rodar com o banco H2 em memória (não precisa instalar nada).
# Para usar o SQL Server (como nas imagens), edite o 'application.properties'
# com a sua URL de conexão, usuário e senha.

# 4. Rode a API
./mvnw spring-boot:run
