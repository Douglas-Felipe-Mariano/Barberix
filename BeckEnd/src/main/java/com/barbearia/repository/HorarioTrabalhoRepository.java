package com.barbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Barbeiro;
import com.barbearia.model.HorarioTrabalho;
import com.barbearia.model.enums.DiaSemana;

@Repository
public interface HorarioTrabalhoRepository extends JpaRepository {

    List<HorarioTrabalho> findByBarbeiroAndDiaSemanaAndAtivo(Barbeiro  barbeiro
                                                            ,DiaSemana diaSemana
                                                            ,boolean   ativo);

    List<HorarioTrabalho> findByBarbeiro(Barbeiro barbeiro);                                                

}
