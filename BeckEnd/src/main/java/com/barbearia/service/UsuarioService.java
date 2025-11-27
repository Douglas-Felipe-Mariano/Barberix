package com.barbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.barbearia.exception.BusinesRuleException;
import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Usuario;
import com.barbearia.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private com.barbearia.repository.BarbeiroRepository barbeiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Usuario criaUsuario(Usuario usuario){

        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioExistente.isPresent()){
            throw new BusinesRuleException("Um usuario com este email já existe.");
        }

        String senhaPura = usuario.getSenha(); // senhaPura recebe a senha informada pelo usuario
        String senhaHash = passwordEncoder.encode(senhaPura); //criptografa a senha a partir do método global passord encoder
        usuario.setSenha(senhaHash); // seta a senha do usuario para o Hash criado

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodosUsuarios(){
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarUsuarioPorEmail (String email){
        return usuarioRepository.findByEmailAndStatus(email,1);
    }

    public Usuario atualizarUsuario(Integer id, Usuario usuarioAtualizado){
        return usuarioRepository.findById(id).map(usuario -> {
            if (usuarioAtualizado.getEmail() != null){
                //Verifica se o email ja está em uso
                Optional<Usuario> emailExistente = usuarioRepository.findByEmail(usuarioAtualizado.getEmail());
                if(emailExistente.isPresent() && !emailExistente.get().getUsuarioId().equals(id)){
                    throw new BusinesRuleException("Este e-mail já está em uso por outro usuário.");
                }
                usuario.setEmail(usuarioAtualizado.getEmail());
            }
            
            if (usuarioAtualizado.getPerfil() != null){
                usuario.setPerfil(usuarioAtualizado.getPerfil());
            }
            
            // Só atualiza a senha se uma nova foi fornecida
            if(usuarioAtualizado.getSenha() != null && !usuarioAtualizado.getSenha().isEmpty()){
                String senhaHash = passwordEncoder.encode(usuarioAtualizado.getSenha());
                usuario.setSenha(senhaHash);
            }
            
            return usuarioRepository.save(usuario);
        }).orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));
    }

    public void deletarUsuario(Integer id){
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado"));
        usuario.setStatus(0); // Soft delete: desativa o usuário
        usuarioRepository.save(usuario);
        // Inativa barbeiro vinculado, se existir
        java.util.Optional<com.barbearia.model.Barbeiro> barbeiroOpt = barbeiroRepository.findByUsuario(usuario);
        if (barbeiroOpt.isPresent()) {
            com.barbearia.model.Barbeiro barbeiro = barbeiroOpt.get();
            barbeiro.setStatus(0);
            barbeiroRepository.save(barbeiro);
        }
    }

    public Usuario reativarUsuario(Integer id){
        Usuario usuario = usuarioRepository.findById(id)
                                           .orElseThrow(() -> new ResourceNotFoundException("Usuario não encontrado."));

        if (usuario.getStatus() == 1 ){
            throw new BusinesRuleException("Usuario já está ativo");
        }                                           

        usuario.setStatus(1);
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> buscarUsuariosAtivos(){
            return usuarioRepository.findByStatus(1);
      }
}


