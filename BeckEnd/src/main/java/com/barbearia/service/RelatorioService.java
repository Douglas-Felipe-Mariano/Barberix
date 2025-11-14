package com.barbearia.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.dto.RankingBarbeiroDTO;
import com.barbearia.dto.RankingServicoDTO;
import com.barbearia.exception.BusinesRuleException;
import com.barbearia.model.enums.StatusPagamento;
import com.barbearia.repository.AgendamentoRepository;

@Service
public class RelatorioService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public BigDecimal calcularFaturamentoTotal(){
        BigDecimal faturamento = agendamentoRepository.calcularFaturamentoPorStatus(StatusPagamento.PAGO);

        return (faturamento != null) ? faturamento : BigDecimal.ZERO;
    }

    public List<RankingBarbeiroDTO> rankingBarbeiros(){
        List<RankingBarbeiroDTO> rankingBarbeiros = agendamentoRepository.geraRankingBarbeiros(StatusPagamento.PAGO);

        return rankingBarbeiros;
    }

    public List<RankingServicoDTO> rankingServicos(){
        List<RankingServicoDTO> rankingServicos = agendamentoRepository.geraRankingServicos(StatusPagamento.PAGO);

        return rankingServicos;
    }
    
    public BigDecimal calcularFaturamentoPorPeriodo(LocalDateTime dataInicio, LocalDateTime dataFim){
        if (dataInicio == null || dataFim == null){
            throw new BusinesRuleException("Data de e data de fim são obrigatórias");
        }
        if (dataFim.isBefore(dataInicio)){
            throw new BusinesRuleException("A data final não pode ser anterio a data inicial.");
        }
        if(dataInicio.isAfter(dataFim)){
            throw new BusinesRuleException("A data de inicio não pode ser posterior a data de fim.");
        }

        BigDecimal faturamentoPorPeriodo = agendamentoRepository.calcularFaturamentoPorPeriodo(StatusPagamento.PAGO, dataInicio, dataFim);

        return (faturamentoPorPeriodo != null) ? faturamentoPorPeriodo : BigDecimal.ZERO;
    }

}
