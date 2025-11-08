# 🔒 Sistema de Controle de Acesso por Nível de Usuário

## 📋 Visão Geral

O sistema implementa controle de acesso baseado em **perfis de usuário**, permitindo que diferentes tipos de usuários tenham acesso a funcionalidades específicas.

---

## 👥 Perfis de Usuário

> **💡 NOTA:** O sistema aceita variações de nomes (case-insensitive). Por exemplo:
> - "ADMIN", "admin", "ADMINISTRADOR", "administrador" → todos funcionam como ADMIN
> - Veja: `COMPATIBILIDADE_PERFIS.md` para mais detalhes

### **ADMIN** (Administrador)
- ✅ Acesso total ao sistema
- ✅ Gerenciar usuários
- ✅ Gerenciar perfis
- ✅ Gerenciar barbeiros
- ✅ Gerenciar serviços
- ✅ Gerenciar clientes
- ✅ Gerenciar agendamentos
- ✅ Visualizar dashboard

### **GERENTE**
- ✅ Gerenciar barbeiros
- ✅ Gerenciar serviços
- ✅ Gerenciar clientes
- ✅ Gerenciar agendamentos
- ✅ Visualizar dashboard
- ❌ Gerenciar usuários
- ❌ Gerenciar perfis

### **ATENDENTE**
- ✅ Gerenciar clientes
- ✅ Gerenciar agendamentos
- ✅ Visualizar dashboard
- ❌ Gerenciar barbeiros
- ❌ Gerenciar serviços
- ❌ Gerenciar usuários
- ❌ Gerenciar perfis

### **BARBEIRO**
- ✅ Visualizar agendamentos (apenas seus próprios)
- ✅ Visualizar dashboard
- ❌ Criar/editar agendamentos
- ❌ Gerenciar clientes
- ❌ Todas as outras funcionalidades administrativas

---

## 🛠️ Estrutura de Implementação

### 1. **AuthContext** (`src/context/AuthContext.js`)
Gerencia o estado de autenticação e autorização em todo o aplicativo.

```javascript
import { useAuth } from '../context/AuthContext';

function MeuComponente() {
  const { user, hasPermission, logout } = useAuth();
  
  // Verificar se usuário tem permissão
  if (hasPermission(['ADMIN', 'GERENTE'])) {
    // Renderizar conteúdo
  }
}
```

### 2. **PrivateRoute** (`src/routes/privateRoutes.js`)
Protege rotas verificando autenticação e permissões.

```javascript
<PrivateRoute 
  element={MinhaPage} 
  allowedProfiles={['ADMIN', 'GERENTE']} 
/>
```

### 3. **Menu Dinâmico** (`src/pages/menuLateral/menuLateral.js`)
O menu lateral mostra apenas os itens que o usuário tem permissão para acessar.

---

## 📝 Como Usar

### **Proteger uma Nova Rota**

1. No arquivo `routes.js`, adicione a rota com os perfis permitidos:

```javascript
<Route path="/minha-nova-pagina" element={
  <PrivateRoute 
    element={MinhaNovaPage} 
    allowedProfiles={['ADMIN', 'GERENTE']} 
  />
} />
```

### **Proteger Elementos na Página**

Dentro de um componente, use o hook `useAuth`:

```javascript
import { useAuth } from '../../context/AuthContext';

function MinhaPage() {
  const { hasPermission } = useAuth();
  
  return (
    <div>
      <h1>Minha Página</h1>
      
      {/* Mostrar apenas para ADMIN */}
      {hasPermission(['ADMIN']) && (
        <button>Ação Exclusiva Admin</button>
      )}
      
      {/* Mostrar para ADMIN e GERENTE */}
      {hasPermission(['ADMIN', 'GERENTE']) && (
        <div>Conteúdo para Admin e Gerente</div>
      )}
    </div>
  );
}
```

### **Adicionar Item no Menu**

No arquivo `menuLateral.js`:

```javascript
{canAccess(['ADMIN', 'GERENTE']) && (
  <Link to="/minha-rota" className={`menu-item ${location.pathname === '/minha-rota' ? 'active' : ''}`}>
    <span className="icon">🔧</span> Minha Funcionalidade
  </Link>
)}
```

---

## 🔐 Boas Práticas de Segurança

### ⚠️ **IMPORTANTE**
O controle de acesso no frontend **NÃO É SUFICIENTE** para segurança real. Ele apenas melhora a experiência do usuário.

### ✅ **O que você DEVE fazer:**

1. **Sempre validar permissões no backend**
```java
// Backend - Exemplo Spring Boot
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/usuarios/{id}")
public ResponseEntity<?> deletarUsuario(@PathVariable Integer id) {
    // código
}
```

2. **Verificar token JWT no backend**
```java
// SecurityConfig.java
.requestMatchers("/api/usuarios/**").hasRole("ADMIN")
.requestMatchers("/api/agendamentos/**").hasAnyRole("ADMIN", "GERENTE", "ATENDENTE")
```

3. **Nunca confiar apenas no que vem do frontend**
- Usuários podem manipular o localStorage
- Usuários podem alterar o código JavaScript
- Usuários podem fazer requisições diretas à API

### ❌ **O que NÃO fazer:**

- ❌ Confiar apenas na validação do frontend
- ❌ Armazenar informações sensíveis no localStorage
- ❌ Enviar senhas em texto plano
- ❌ Permitir que o frontend seja a única camada de segurança

---

## 🧪 Como Testar

### 1. **Criar Usuários de Teste no Banco de Dados**

```sql
-- Criar perfis
INSERT INTO TB_PERFIL (PER_Nome) VALUES ('ADMIN');
INSERT INTO TB_PERFIL (PER_Nome) VALUES ('GERENTE');
INSERT INTO TB_PERFIL (PER_Nome) VALUES ('ATENDENTE');
INSERT INTO TB_PERFIL (PER_Nome) VALUES ('BARBEIRO');

-- Criar usuários de teste (senha já criptografada no backend)
INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
VALUES (1, 'admin@barberix.com', 'senha123', 1);

INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
VALUES (2, 'gerente@barberix.com', 'senha123', 1);

INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
VALUES (3, 'atendente@barberix.com', 'senha123', 1);

INSERT INTO TB_USUARIO (PerfilId, USU_Email, USU_Senha, USU_Status) 
VALUES (4, 'barbeiro@barberix.com', 'senha123', 1);
```

### 2. **Testar Login com Cada Perfil**

1. Faça login com `admin@barberix.com` → Deve ver TODAS as opções no menu
2. Faça login com `gerente@barberix.com` → Não deve ver Usuários e Perfis
3. Faça login com `atendente@barberix.com` → Deve ver apenas Clientes e Agendamentos
4. Faça login com `barbeiro@barberix.com` → Deve ver apenas Agendamentos

### 3. **Testar Acesso Direto a URLs Protegidas**

1. Faça login como ATENDENTE
2. Tente acessar diretamente: `http://localhost:3000/usuario`
3. Deve exibir mensagem: **"🚫 Acesso Negado"**

---

## 🔧 Personalização

### **Adicionar um Novo Perfil**

1. **Backend**: Adicionar no banco de dados
```sql
INSERT INTO TB_PERFIL (PER_Nome) VALUES ('NOVO_PERFIL');
```

2. **Frontend**: Adicionar nas rotas em `routes.js`
```javascript
<Route path="/minha-rota" element={
  <PrivateRoute 
    element={MinhaPage} 
    allowedProfiles={['ADMIN', 'NOVO_PERFIL']} 
  />
} />
```

### **Modificar Permissões Existentes**

Edite o arquivo `src/routes/routes.js` e altere o array `allowedProfiles`:

```javascript
// Antes: Apenas ADMIN
allowedProfiles={['ADMIN']}

// Depois: ADMIN e GERENTE
allowedProfiles={['ADMIN', 'GERENTE']}
```

---

## 📚 Referências Rápidas

### **Hooks Disponíveis**

```javascript
const { 
  user,              // Objeto do usuário logado
  loading,           // Boolean - carregando dados
  login,             // Função para fazer login
  logout,            // Função para fazer logout
  hasPermission,     // Função para verificar permissões
  isAuthenticated    // Boolean - está autenticado?
} = useAuth();
```

### **Propriedades do Objeto `user`**

```javascript
{
  usuarioId: 123,
  email: "admin@barberix.com",
  perfil: {
    perfilId: 1,
    nomePerfil: "ADMIN"
  }
}
```

---

## 🐛 Solução de Problemas

### **Menu não está mostrando itens corretos**
- Verifique se o usuário está logado: `console.log(user)`
- Verifique o perfil: `console.log(user.perfil.nomePerfil)`
- Verifique se os nomes dos perfis no banco correspondem aos usados no código

### **Página de Acesso Negado aparece para todos**
- Verifique se o `AuthProvider` está envolvendo as rotas em `routes.js`
- Verifique se o perfil retornado pelo backend está correto

### **Não consigo fazer login**
- Verifique se o backend está retornando o objeto `perfil` na resposta
- Abra o Console do navegador e veja os logs
- Verifique a resposta da API no Network tab

---

## ✅ Checklist de Implementação

- [x] AuthContext criado
- [x] PrivateRoute com verificação de permissões
- [x] Rotas configuradas com perfis permitidos
- [x] Menu lateral dinâmico
- [x] Login atualizado para usar AuthContext
- [x] CSS para exibir informações do usuário
- [ ] **TODO**: Implementar proteção no backend (Spring Security)
- [ ] **TODO**: Adicionar testes de permissões
- [ ] **TODO**: Implementar JWT real (substituir 'authenticated')

---

**🎯 Próximos Passos Recomendados:**

1. Implementar autenticação JWT real no backend
2. Adicionar middleware de autorização nas rotas do backend
3. Implementar refresh token
4. Adicionar logs de auditoria (quem acessou o quê)
5. Criar tela de perfil do usuário para alteração de senha

---

**Desenvolvido para Barberix** 💈✨
