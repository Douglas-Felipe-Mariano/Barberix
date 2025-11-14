package com.barbearia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.barbearia.dto.LoginRequestDTO; // 1. IMPORTANDO O DTO
import com.barbearia.exception.CredenciaisInvalidasException; // (Opcional, mas vamos usar!)
import com.barbearia.model.Usuario;
import com.barbearia.service.UsuarioService; // 2. IMPORTANDO O SERVICE

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// --- 3. ADICIONADO O @RestController ---
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    // --- 4. INJETANDO O SERVICE E NÃO O REPOSITORY ---
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    // --- 5. USANDO O DTO EM VEZ DE MAP ---
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email recebido: " + loginRequest.email());
        System.out.println("Senha recebida: " + loginRequest.senha());

        // 6. Buscando pelo SERVICE (que já filtra por status=1)
        Optional<Usuario> usuarioOpt = usuarioService.buscarUsuarioPorEmail(loginRequest.email());

        if (usuarioOpt.isEmpty()) {
            System.out.println("ERRO: Email não encontrado ou usuário inativo");
            // 7. Lançando nossa Exceção customizada!
            throw new CredenciaisInvalidasException("Email ou senha incorretos");
        }

        Usuario usuario = usuarioOpt.get();
        System.out.println("Usuário encontrado: " + usuario.getEmail());

        // 8. Verificando a senha
        boolean senhaCorreta = passwordEncoder.matches(loginRequest.senha(), usuario.getSenha());
        System.out.println("Senha correta? " + senhaCorreta);
        
        if (!senhaCorreta) {
            System.out.println("ERRO: Senha incorreta");
            // 7. Lançando nossa Exceção customizada!
            throw new CredenciaisInvalidasException("Email ou senha incorretos");
        }
        
        // (A checagem de status=1 não é mais necessária aqui, 
        // pois o 'usuarioService.buscarUsuarioPorEmail' já fez isso!)

        System.out.println("LOGIN SUCESSO!");
        
        // Retorna os dados do usuário (sem a senha)
        Map<String, Object> response = new HashMap<>();
        response.put("usuarioId", usuario.getUsuarioId());
        response.put("email", usuario.getEmail());
        response.put("perfil", usuario.getPerfil());
        response.put("message", "Login realizado com sucesso");

        return ResponseEntity.ok(response);
    }
}