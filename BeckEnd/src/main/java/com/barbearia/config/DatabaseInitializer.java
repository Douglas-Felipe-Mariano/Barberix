package com.barbearia.config;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.barbearia.model.Usuario;
import com.barbearia.model.enums.PerfilTipo;
import com.barbearia.repository.UsuarioRepository;

@Component
public class DatabaseInitializer {

    private final PasswordEncoder passwordEncoder;

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public DatabaseInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder){
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runAfterStartup(){

        if (usuarioRepository.findByEmail("admin@barberix.com").isPresent()) {
            System.out.println("Usuário ADMIN já existe. Nenhum dado foi inserido.");
            return; 
        }

        Usuario usuario = new Usuario();

        usuario.setPerfil(PerfilTipo.ADMIN);
        usuario.setEmail("admin@barberix.com");
        usuario.setSenha(passwordEncoder.encode("1234"));

        usuarioRepository.save(usuario);
    }

}   
