package com.barbearia.config;

import java.time.LocalDateTime;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import com.barbearia.model.Usuario;
import com.barbearia.model.enums.PerfilTipo;
import com.barbearia.repository.UsuarioRepository;

public class DatabaseInitializer {


    private final UsuarioRepository usuarioRepository;

    public DatabaseInitializer(UsuarioRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runAfterStartup(){
        Usuario usuario = new Usuario();

        usuario.setPerfil(PerfilTipo.ADMIN);
        usuario.setEmail("admin@barberix.com");
        usuario.setSenha("1234");
        usuario.setStatus(1);
        usuario.setDataCadastro(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

}   
