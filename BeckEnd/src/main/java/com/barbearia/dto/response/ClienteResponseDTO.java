package com.barbearia.dto.response;

import java.time.LocalDateTime;

public record ClienteResponseDTO(
    Integer       clienteId
   ,String        nome
   ,String        telefone
   ,String        email
   ,String        endereco
   ,String        fotoUrl
   ,LocalDateTime dataCadastro
) {}
