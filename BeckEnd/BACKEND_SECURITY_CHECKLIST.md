# 🔐 Backend Security Checklist - Spring Boot

## ✅ Tarefas para Implementar Segurança Real

### 📋 Configuração Inicial

- [ ] **Adicionar dependências no `pom.xml`**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
</dependency>
```

---

### 🔧 Arquivos a Criar/Modificar

#### 1. **JwtUtil.java** - Geração e validação de JWT
```java
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    
    public String generateToken(String email, String role) {
        // Gerar token
    }
    
    public boolean validateToken(String token) {
        // Validar token
    }
    
    public String extractRole(String token) {
        // Extrair role do token
    }
}
```

#### 2. **JwtRequestFilter.java** - Filtro para validar JWT
```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain chain) {
        // Validar JWT em cada requisição
    }
}
```

#### 3. **SecurityConfig.java** - Configuração de segurança
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/api/perfis/**").hasRole("ADMIN")
                .requestMatchers("/api/barbeiros/**").hasAnyRole("ADMIN", "GERENTE")
                .requestMatchers("/api/servicos/**").hasAnyRole("ADMIN", "GERENTE")
                .requestMatchers("/api/clientes/**").hasAnyRole("ADMIN", "GERENTE", "ATENDENTE")
                .requestMatchers("/api/agendamentos/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
}
```

#### 4. **AuthController.java** - Modificar login para retornar JWT
```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
    Usuario usuario = usuarioService.autenticar(loginDTO.getEmail(), loginDTO.getSenha());
    
    if (usuario != null) {
        String token = jwtUtil.generateToken(
            usuario.getEmail(), 
            usuario.getPerfil().getNomePerfil()
        );
        
        return ResponseEntity.ok(new AuthResponse(
            token,
            usuario.getUsuarioId(),
            usuario.getEmail(),
            usuario.getPerfil()
        ));
    }
    
    return ResponseEntity.status(401).body("Credenciais inválidas");
}
```

---

### 🛡️ Proteger Endpoints com @PreAuthorize

#### **UsuarioController.java**
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping
public List<Usuario> listarTodos() { }

@PreAuthorize("hasRole('ADMIN')")
@PostMapping
public Usuario criar(@RequestBody Usuario usuario) { }

@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/{id}")
public void deletar(@PathVariable Integer id) { }
```

#### **BarbeiroController.java**
```java
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
@GetMapping
public List<Barbeiro> listarTodos() { }

@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
@PostMapping
public Barbeiro criar(@RequestBody Barbeiro barbeiro) { }
```

#### **ClienteController.java**
```java
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'ATENDENTE')")
@GetMapping
public List<Cliente> listarTodos() { }

@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'ATENDENTE')")
@PostMapping
public Cliente criar(@RequestBody Cliente cliente) { }
```

#### **AgendamentoController.java**
```java
// Todos autenticados podem ver
@PreAuthorize("isAuthenticated()")
@GetMapping
public List<Agendamento> listarTodos() { }

// Apenas gestores podem criar
@PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'ATENDENTE')")
@PostMapping
public Agendamento criar(@RequestBody Agendamento agendamento) { }

// BARBEIRO pode ver apenas seus agendamentos
@PreAuthorize("hasRole('BARBEIRO')")
@GetMapping("/meus-agendamentos")
public List<Agendamento> meusAgendamentos(Principal principal) {
    // Buscar apenas do barbeiro logado
}
```

---

### 📝 application.properties

```properties
# JWT Configuration
jwt.secret=sua-chave-secreta-super-segura-aqui-min-256-bits
jwt.expiration=86400000

# Security
spring.security.user.name=admin
spring.security.user.password=admin123
```

---

### 🔄 Atualizar Frontend

#### **axios interceptor** (criar em `src/services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Adicionar token em todas as requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Tratar erro 401 (não autorizado)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### **Atualizar login.js**
```javascript
const response = await axios.post(API_URL_LOGIN, {
  email: formData.email,
  senha: formData.senha
});

// Salvar TOKEN JWT
localStorage.setItem('token', response.data.token);

// Salvar dados do usuário
const userData = {
  usuarioId: response.data.usuarioId,
  email: response.data.email,
  perfil: response.data.perfil
};
localStorage.setItem('usuario', JSON.stringify(userData));
```

---

### 🧪 Testes de Segurança

- [ ] Tentar acessar `/api/usuarios` sem token → deve retornar 401
- [ ] Tentar acessar `/api/usuarios` com token de GERENTE → deve retornar 403
- [ ] Tentar acessar `/api/usuarios` com token de ADMIN → deve funcionar
- [ ] Token expirado deve retornar 401
- [ ] Token inválido deve retornar 401
- [ ] BARBEIRO acessando `/api/agendamentos` deve ver apenas seus

---

### 📊 Ordem de Implementação Recomendada

1. ✅ Criar JwtUtil
2. ✅ Modificar AuthController para gerar JWT
3. ✅ Criar JwtRequestFilter
4. ✅ Configurar SecurityConfig
5. ✅ Adicionar @PreAuthorize nos controllers
6. ✅ Testar cada endpoint com Postman
7. ✅ Atualizar frontend para usar JWT
8. ✅ Testar aplicação completa

---

### 🔍 Exemplo de Teste com Postman

#### **1. Login**
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "email": "admin@barberix.com",
  "senha": "senha123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuarioId": 1,
  "email": "admin@barberix.com",
  "perfil": {
    "perfilId": 1,
    "nomePerfil": "ADMIN"
  }
}
```

#### **2. Usar Token**
```
GET http://localhost:8080/api/usuarios
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

### ⚠️ Segurança Adicional

- [ ] **Criptografar senhas** com BCrypt
- [ ] **HTTPS** em produção
- [ ] **Rate limiting** para evitar brute force
- [ ] **CORS** configurado corretamente
- [ ] **Validação de entrada** em todos os endpoints
- [ ] **Logs de auditoria** (quem fez o quê)
- [ ] **Refresh token** para melhor UX
- [ ] **Blacklist de tokens** revogados

---

### 📚 Recursos Úteis

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Desenvolvido para Barberix** 💈🔒
