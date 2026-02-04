package com.barbearia.dto;

import java.math.BigDecimal;

public record RankingServicoDTO(
    String      nomeServico
   ,Long        quantidadeVendida
   ,BigDecimal  faturamentoTotal
) {}
