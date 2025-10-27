package com.barbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.model.Barbeiro;
import com.barbearia.repository.BarbeiroRepository;

@Service
public class BarbeiroService {

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

    public Optional<Barbeiro> buscarBarbeiroAtivosPorId(Integer id){
        return barbeiroRepository.findByBarbeiroIdAndStatus(id, 1);
    }

    public Optional<Barbeiro> buscarBarbeiroPorId(Integer id){
        return barbeiroRepository.findById(id);
    }

    public Barbeiro atualizaBarbeiro(Integer id, Barbeiro detalheBarbeiro){
        Barbeiro barbeiroExistente = barbeiroRepository.findById(id)
                                                       .orElseThrow(() -> new RuntimeException("Barbeiro com o id " +id+ " não econtrado"));

        if(detalheBarbeiro.getNome() != null){
            barbeiroExistente.setNome(detalheBarbeiro.getNome());
        }

        return barbeiroRepository.save(barbeiroExistente);
    }

    public void inativarBarbeiro(Integer id){
        //Valida se o barbeiro existe
        if(!barbeiroRepository.existsById(id)){
            throw new RuntimeException("Barbeiro com o id " +id+ " não encontrado");
        }
        barbeiroRepository.deleteById(id);
    }

}
