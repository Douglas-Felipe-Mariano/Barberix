package com.barbearia.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Barbeiro;
import com.barbearia.model.Usuario;

@Repository
public interface BarbeiroRepository extends JpaRepository<Barbeiro, Integer>{
    List<Barbeiro> findByStatus(Integer status);

    Optional<Barbeiro> findByBarbeiroIdAndStatus(Integer id, Integer status);

    Optional<Barbeiro> findByUsuario(Usuario usuario);
}
