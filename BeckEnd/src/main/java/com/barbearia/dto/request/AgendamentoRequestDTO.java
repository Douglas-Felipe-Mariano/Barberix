package com.barbearia.dto.request;

import java.time.LocalDateTime;

public record AgendamentoRequestDTO(
    Integer       clienteId
   ,Integer       servicoId
   ,Integer       barbeiroId
   ,LocalDateTime dataAgendada
) {}
