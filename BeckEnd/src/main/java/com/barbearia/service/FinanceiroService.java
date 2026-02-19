package com.barbearia.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.dto.request.FinanceiroRequestDTO;
import com.barbearia.dto.response.FinanceiroResponseDTO;
import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Agendamento;
import com.barbearia.model.Financeiro;
import com.barbearia.model.enums.TipoLancamento;
import com.barbearia.repository.AgendamentoRepository;
import com.barbearia.repository.FinanceiroRepository;

@Service
public class FinanceiroService {

    @Autowired
    private FinanceiroRepository financeiroRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public FinanceiroResponseDTO criarLancamento(FinanceiroRequestDTO dto){
        Financeiro financeiro = new Financeiro();

        financeiro.setTipoLancamento(dto.tipo());
        financeiro.setDescricao(dto.descricao());   
        financeiro.setValor(dto.valor());

        if(dto.agendamentoId() != null){
            Agendamento agendamento = agendamentoRepository.findById(dto.agendamentoId())
                                                           .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado: " + dto.agendamentoId()));
            financeiro.setAgendamento(agendamento);
        } else {
            financeiro.setAgendamento(null);
        }

        Financeiro salvo = financeiroRepository.save(financeiro);
        return convertToDTO(salvo);
    }

    public FinanceiroResponseDTO buscarLancamentoPorId(Integer id){
        Financeiro financeiro = financeiroRepository.findById(id)
                                                    .orElseThrow(() -> new ResourceNotFoundException("Lançamento não encontrado: " + id));
        return convertToDTO(financeiro);
    }

    public List<FinanceiroResponseDTO> listarTodosLancamentos(){
        return financeiroRepository.findAll()
                                  .stream()
                                  .map(this::convertToDTO)
                                  .collect(Collectors.toList());
    }

    public BigDecimal CalcularSaldoTotal(){
        Double totalReceitas = financeiroRepository.somarPorTipo(TipoLancamento.RECEITA);
        Double totalDespesas = financeiroRepository.somarPorTipo(TipoLancamento.DESPESA);

        if (totalReceitas == null) totalReceitas = 0.0;
        if (totalDespesas == null) totalDespesas = 0.0;

        return BigDecimal.valueOf(totalReceitas - totalDespesas);
    }

    public FinanceiroResponseDTO convertToDTO(Financeiro financeiro){
        Integer agendamentoId = (financeiro.getAgendamento() != null) ? financeiro.getAgendamento().getAgendamentoId() : null;

        return new FinanceiroResponseDTO(
            financeiro.getLancamentoId()
           ,agendamentoId
           ,financeiro.getTipoLancametno()
           ,financeiro.getDescricao()
           ,financeiro.getValor()
           ,financeiro.getDataLancamento()
        );
    }
}
