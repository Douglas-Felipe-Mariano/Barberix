package com.barbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.model.Perfil;
import com.barbearia.repository.PerfilRepository;

@Service
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;

    public Perfil cadastrarPerfil(Perfil perfil){
        Optional<Perfil> perfilExistente = perfilRepository.findByNomePerfil(perfil.getNomePerfil());

        if (perfilExistente.isPresent()){
            throw new RuntimeException("Um perfil com este nome já está cadastrado");
        }

        return perfilRepository.save(perfil);
    }

    public List<Perfil> buscarTodosPerfis(){
        return perfilRepository.findAll();
    }

    public Optional<Perfil> buscarPerfilPorId(Integer id){
        return perfilRepository.findById(id);
    }

    public Perfil atualizaPerfil(Integer id, Perfil detalhePerfil){
        Perfil perfilExistente = perfilRepository.findById(id)
                                                 .orElseThrow(() -> new RuntimeException("Perfil com o id " +id+ " não econtrado"));

        if (detalhePerfil.getNomePerfil() != null){
            Optional<Perfil> verificaNome = perfilRepository.findByNomePerfil(detalhePerfil.getNomePerfil());                                                    
            if (verificaNome.isPresent() && !verificaNome.get().getPerfilId().equals(id)){
                throw new RuntimeException("Nome do Perfil já cadastrado");
            }    

            perfilExistente.setNomePerfil(detalhePerfil.getNomePerfil());
        }

        return perfilRepository.save(perfilExistente);
    }

    public void deletarPerfil(Integer id){
        if(!perfilRepository.existsById(id)){
            throw new RuntimeException("Perfil com o id " +id+ " não encontrado");
        }
        perfilRepository.deleteById(id);
    }
}
