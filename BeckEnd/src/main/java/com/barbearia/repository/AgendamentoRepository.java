package com.barbearia.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.barbearia.dto.RankingBarbeiroDTO;
import com.barbearia.dto.RankingServicoDTO;
import com.barbearia.model.Agendamento;
import com.barbearia.model.Barbeiro;
import com.barbearia.model.enums.StatusPagamento;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Integer> {
    Optional<Agendamento> findByBarbeiroAndDataAgendada(Barbeiro barbeiro, LocalDateTime dataAgendada);

    List<Agendamento> findByDataAgendada(LocalDateTime dataAgendada);
    
    // Busca todos os agendamentos de um dia específico (ignora a hora)
    @Query("SELECT a FROM Agendamento a WHERE CAST(a.dataAgendada AS date) = CAST(:data AS date)")
    List<Agendamento> findAllByDate(@Param("data") LocalDateTime data);

    @Query("SELECT SUM(a.valor) FROM Agendamento a WHERE a.statusPagamento = :status")
    BigDecimal calcularFaturamentoPorStatus(@Param("status") StatusPagamento status);

    @Query("SELECT new com.barbearia.dto.RankingBarbeiroDTO(" +
       "   b.nome, " +
       "   COUNT(a.agendamentoId), " +
       "   SUM(a.valor)" +
       ") " +
       "FROM Agendamento a " +
       "INNER JOIN a.barbeiro b " +
       "WHERE a.statusPagamento = :status " +
       "GROUP BY b.barbeiroId, b.nome " +
       "ORDER BY SUM(a.valor) DESC")
    List<RankingBarbeiroDTO> geraRankingBarbeiros(@Param("status") StatusPagamento status);

    @Query("SELECT new com.barbearia.dto.RankingServicoDTO(" +
       "   s.nome, " +
       "   COUNT(a.agendamentoId), " +
       "   SUM(a.valor)" +
       ") " +
       "FROM Agendamento a " +
       "JOIN a.servico s " +
       "WHERE a.statusPagamento = :status " +
       "GROUP BY s.servicoId, s.nome " +
       "ORDER BY COUNT(a.agendamentoId) DESC") 
    List<RankingServicoDTO> geraRankingServicos(@Param("status") StatusPagamento status);

    @Query("SELECT SUM(a.valor) FROM Agendamento a " +
           "WHERE a.statusPagamento = :status " +
           "AND a.dataPagamento BETWEEN :dataInicio AND :dataFim")
    BigDecimal calcularFaturamentoPorPeriodo(
            @Param("status")     StatusPagamento status
           ,@Param("dataInicio") LocalDateTime dataInicio
           ,@Param("dataFim")    LocalDateTime dataFim
    );

}
