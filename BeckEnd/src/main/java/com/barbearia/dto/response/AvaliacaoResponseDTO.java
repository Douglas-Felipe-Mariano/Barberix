package com.barbearia.dto.response;

import java.time.LocalDateTime;

public record AvaliacaoResponseDTO(
    Integer       avaliacaoId
   ,String        nomeCliente
   ,String        nomeBarbeiro
   ,Integer       nota
   ,String        comentario
   ,LocalDateTime dataAvaliacao
) {}
