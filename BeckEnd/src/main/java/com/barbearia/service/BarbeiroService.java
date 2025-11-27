package com.barbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Barbeiro;
import com.barbearia.repository.BarbeiroRepository;

@Service
public class BarbeiroService {
    @Autowired
    private com.barbearia.repository.UsuarioRepository usuarioRepository;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    public Barbeiro cadastrarBarbeiro(Barbeiro barbeiro){
        Optional<Barbeiro> barbeiroExistente = barbeiroRepository.findByUsuario(barbeiro.getUsuario());

        if (barbeiroExistente.isPresent()){
            throw new RuntimeException("Este usuario já está cadastrado como barbeiro");
        }

        return barbeiroRepository.save(barbeiro);
    }

    public List<Barbeiro> buscarTodosBarbeiros(){
        return barbeiroRepository.findAll();
    }

    public List<Barbeiro> buscarTodosBarbeirosAtivos(){
        return barbeiroRepository.findByStatus(1);
    }

    public Optional<Barbeiro> buscarBarbeiroAtivoPorId(Integer id){
        return barbeiroRepository.findByBarbeiroIdAndStatus(id, 1);
    }

    public Optional<Barbeiro> buscarBarbeiroPorId(Integer id){
        return barbeiroRepository.findById(id);
    }

    public Barbeiro atualizaBarbeiro(Integer id, Barbeiro detalheBarbeiro){
        Barbeiro barbeiroExistente = barbeiroRepository.findById(id)
                                                       .orElseThrow(() -> new ResourceNotFoundException("Barbeiro com o id " +id+ " não econtrado"));

        if(detalheBarbeiro.getNome() != null){
            barbeiroExistente.setNome(detalheBarbeiro.getNome());
        }

        return barbeiroRepository.save(barbeiroExistente);
    }

    public void deletarBarbeiro(Integer id){
        Barbeiro barbeiro = barbeiroRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Barbeiro com o id " +id+ " não encontrado"));
        barbeiro.setStatus(0); // Soft delete: desativa o barbeiro
        barbeiroRepository.save(barbeiro);
        // Inativa o usuário vinculado
        if (barbeiro.getUsuario() != null) {
            barbeiro.getUsuario().setStatus(0);
            usuarioRepository.save(barbeiro.getUsuario());
        }
    }

}
