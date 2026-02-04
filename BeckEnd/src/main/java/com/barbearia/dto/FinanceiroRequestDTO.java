package com.barbearia.dto;

import java.math.BigDecimal;

import com.barbearia.model.enums.TipoLancamento;

public record FinanceiroRequestDTO(
    Integer        agendamentoId
   ,TipoLancamento tipo
   ,String         descricao
   ,BigDecimal     valor
) {}
