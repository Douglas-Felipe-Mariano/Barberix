package com.barbearia.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.barbearia.model.Usuario;
import com.barbearia.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Usuario criaUsuario(Usuario usuario){
        String senhaPura = usuario.getSenha(); // senhaPura recebe a senha informada pelo usuario
        String senhaHash = passwordEncoder.encode(senhaPura); //criptografa a senha a partir do método global passord encoder
        usuario.setSenha(senhaHash); // seta a senha do usuario para o Hash criado

        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarUsuarioPorEmail (String email){
        return usuarioRepository.findByEmail(email);
    }

    public void deletarUsuario(Integer id){
        if(usuarioRepository.existsById(id)){
            usuarioRepository.deleteById(id);
        } else{
            throw new RuntimeException("Usuario não encontrado");
        }
    }
}
