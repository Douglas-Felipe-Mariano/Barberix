package com.barbearia.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Agendamento;
import com.barbearia.model.Barbeiro;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {
    Optional<Agendamento> findByBarbeiroAndDataAgendada(Barbeiro barbeiro, LocalDateTime dataAgendada);

    List<Agendamento> findAllByDataAgendada(LocalDateTime dataAgendada);
    
    // Busca todos os agendamentos de um dia específico (ignora a hora)
    @Query("SELECT a FROM Agendamento a WHERE CAST(a.dataAgendada AS date) = CAST(:data AS date)")
    List<Agendamento> findAllByDate(@Param("data") LocalDateTime data);
}
