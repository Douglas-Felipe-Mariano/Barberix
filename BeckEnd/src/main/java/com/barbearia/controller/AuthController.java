package com.barbearia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.barbearia.model.Usuario;
import com.barbearia.repository.UsuarioRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String senha = credentials.get("senha");

        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email recebido: " + email);
        System.out.println("Senha recebida: " + senha);

        // Busca o usuário pelo email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            System.out.println("ERRO: Email não encontrado no banco");
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email ou senha incorretos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Usuario usuario = usuarioOpt.get();
        System.out.println("Usuário encontrado: " + usuario.getEmail());
        System.out.println("Hash no banco: " + usuario.getSenha());
        System.out.println("Status do usuário: " + usuario.getStatus());

        // Verifica se a senha está correta usando BCrypt
        boolean senhaCorreta = passwordEncoder.matches(senha, usuario.getSenha());
        System.out.println("Senha correta? " + senhaCorreta);
        
        if (!senhaCorreta) {
            System.out.println("ERRO: Senha incorreta");
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email ou senha incorretos");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Verifica se o usuário está ativo
        if (usuario.getStatus() != 1) {
            System.out.println("ERRO: Usuário inativo");
            Map<String, String> error = new HashMap<>();
            error.put("message", "Usuário inativo");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        System.out.println("LOGIN SUCESSO!");
        
        // Retorna os dados do usuário (sem a senha)
        Map<String, Object> response = new HashMap<>();
        response.put("usuarioId", usuario.getUsuarioId());
        response.put("email", usuario.getEmail());
        response.put("perfil", usuario.getPerfil().getNomePerfil());
        response.put("message", "Login realizado com sucesso");

        return ResponseEntity.ok(response);
    }
}
