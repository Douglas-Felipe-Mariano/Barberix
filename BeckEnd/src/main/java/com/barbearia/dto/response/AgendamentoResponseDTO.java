package com.barbearia.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.barbearia.model.enums.FormaPagamento;
import com.barbearia.model.enums.StatusPagamento;

public record AgendamentoResponseDTO(
    Integer         agendamentoId
   ,Integer         clienteId
   ,String          clienteNome
   ,Integer         servicoId
   ,String          servicoNome
   ,Integer         barbeiroId
   ,String          barbeiroNome
   ,StatusPagamento statusPagamento
   ,LocalDateTime   dataAgendada
   ,BigDecimal      valor
   ,FormaPagamento  formaPagamento
) {}
