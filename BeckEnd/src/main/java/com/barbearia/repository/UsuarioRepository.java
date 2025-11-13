package com.barbearia.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Usuario;
import java.util.List;



@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByEmailAndStatus(String email, Integer status);

    List<Usuario> findByStatus(Integer status);
}
