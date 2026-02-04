package com.barbearia.dto;

public record AvaliacaoRequestDTO(
    Integer  agendamentoId
   ,Integer  nota
   ,String   comentario
) {}