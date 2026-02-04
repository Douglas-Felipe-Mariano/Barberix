package com.barbearia.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.barbearia.model.enums.TipoLancamento;

public record FinanceiroResponseDTO(
    Integer         lancamentoId
   ,Integer         agendamentoId
   ,TipoLancamento  tipo
   ,String          descricao
   ,BigDecimal      valor
   ,LocalDateTime   dataLancamento
) {}
