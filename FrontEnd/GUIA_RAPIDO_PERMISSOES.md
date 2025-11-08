# 🚀 Guia Rápido - Controle de Acesso

## ⚡ Uso Rápido

### 1️⃣ Importar o hook
```javascript
import { useAuth } from '../context/AuthContext';
```

### 2️⃣ Usar no componente
```javascript
function MeuComponente() {
  const { user, hasPermission } = useAuth();
  
  return (
    <div>
      {hasPermission(['ADMIN']) && <button>Só Admin</button>}
    </div>
  );
}
```

---

## 📋 Perfis Disponíveis

| Perfil | Código |
|--------|--------|
| Administrador | `'ADMIN'` |
| Gerente | `'GERENTE'` |
| Atendente | `'ATENDENTE'` |
| Barbeiro | `'BARBEIRO'` |

---

## 🔧 Métodos Disponíveis

### `useAuth()` - Hook Principal

```javascript
const {
  user,              // Dados do usuário logado
  loading,           // true enquanto carrega
  login,             // Função para login
  logout,            // Função para logout
  hasPermission,     // Verificar permissão
  isAuthenticated    // true se autenticado
} = useAuth();
```

### `hasPermission(perfis)` - Verificar Permissão

```javascript
// Um perfil
hasPermission(['ADMIN'])

// Múltiplos perfis (OU lógico)
hasPermission(['ADMIN', 'GERENTE'])

// Todos os usuários autenticados
hasPermission([]) ou hasPermission()
```

---

## 💡 Exemplos Práticos

### Botão Condicional
```javascript
{hasPermission(['ADMIN']) && (
  <button>Excluir</button>
)}
```

### Seção Condicional
```javascript
{hasPermission(['ADMIN', 'GERENTE']) && (
  <div className="admin-panel">
    <h2>Painel Admin</h2>
  </div>
)}
```

### Usar Componente RequirePermission
```javascript
import RequirePermission from '../components/RequirePermission';

<RequirePermission allowedProfiles={['ADMIN']}>
  <button>Só Admin Vê</button>
</RequirePermission>
```

### Ação com Verificação
```javascript
const handleDelete = () => {
  if (!hasPermission(['ADMIN'])) {
    alert('Sem permissão!');
    return;
  }
  // executar ação
};
```

---

## 🛡️ Proteger Rotas

No arquivo `routes.js`:

```javascript
<Route path="/usuario" element={
  <PrivateRoute 
    element={Usuario} 
    allowedProfiles={['ADMIN']} 
  />
} />
```

---

## 🎨 Menu Dinâmico

No `menuLateral.js`:

```javascript
const { hasPermission } = useAuth();

{hasPermission(['ADMIN']) && (
  <Link to="/usuario">👤 Usuários</Link>
)}
```

---

## ⚠️ Lembre-se

- ✅ Frontend = UX (experiência do usuário)
- ✅ Backend = Segurança REAL
- ❌ NUNCA confie apenas no frontend
- ✅ Sempre validar no backend também

---

## 📞 Matriz de Permissões

| Funcionalidade | ADMIN | GERENTE | ATENDENTE | BARBEIRO |
|----------------|-------|---------|-----------|----------|
| Home | ✅ | ✅ | ✅ | ✅ |
| Agendamentos | ✅ | ✅ | ✅ | ✅ (só seus) |
| Clientes | ✅ | ✅ | ✅ | ❌ |
| Barbeiros | ✅ | ✅ | ❌ | ❌ |
| Serviços | ✅ | ✅ | ❌ | ❌ |
| Usuários | ✅ | ❌ | ❌ | ❌ |
| Perfis | ✅ | ❌ | ❌ | ❌ |

---

**Desenvolvido para Barberix** 💈
