package com.barbearia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Perfil;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Integer>{
    Optional<Perfil> findByNomePerfil(String nomePerfil);
}
