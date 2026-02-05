package com.barbearia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.barbearia.dto.response.LoginResponseDTO;
import com.barbearia.dto.request.EsqueceuSenhaRequestDTO;
import com.barbearia.dto.request.LoginRequestDTO;
import com.barbearia.dto.request.ResetSenhaRequestDTO;
import com.barbearia.exception.CredenciaisInvalidasException; 
import com.barbearia.model.Usuario;
import com.barbearia.service.JwtService;
import com.barbearia.service.UsuarioService; 

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {


    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {

        Optional<Usuario> usuarioOpt = usuarioService.buscarUsuarioPorEmail(loginRequest.email());

        if (usuarioOpt.isEmpty()) {
            System.out.println("ERRO: Email não encontrado ou usuário inativo");
            throw new CredenciaisInvalidasException("Email ou senha incorretos.");
        }

        Usuario usuario = usuarioOpt.get();

        if (!passwordEncoder.matches(loginRequest.senha(), usuario.getSenha())){
            throw new CredenciaisInvalidasException("Email ou senha incorretos.");
        }

        String token = jwtService.geraToken(usuario.getEmail());

        LoginResponseDTO response = new LoginResponseDTO(
            token
           ,usuario.getUsuarioId()
           ,usuario.getEmail()
           ,usuario.getPerfil().toString()
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> esqueceuSenha(@RequestBody EsqueceuSenhaRequestDTO request) {
        usuarioService.esqueceuSenha(request.email());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetSenha(@RequestBody ResetSenhaRequestDTO request) {
        usuarioService.resetarSenha(request.token(), request.novaSenha());

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

