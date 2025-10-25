package com.barbearia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Barbeiro;

@Repository
public interface BarbeiroRepository extends JpaRepository<Barbeiro, Integer>{

}
