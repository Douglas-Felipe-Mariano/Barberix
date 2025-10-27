package com.barbearia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Integer>{
    Optional<Servico> findByNome(String nome);
}
