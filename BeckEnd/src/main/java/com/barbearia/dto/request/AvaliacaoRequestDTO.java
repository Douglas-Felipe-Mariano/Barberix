package com.barbearia.dto.request;

public record AvaliacaoRequestDTO(
    Integer  agendamentoId
   ,Integer  nota
   ,String   comentario
) {}