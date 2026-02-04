package com.barbearia.dto;

import java.math.BigDecimal;

public record RankingBarbeiroDTO(
    String      nomeBarbeiro
   ,Long        totalAgendamentos
   ,BigDecimal  faturamentoTotal
) {}