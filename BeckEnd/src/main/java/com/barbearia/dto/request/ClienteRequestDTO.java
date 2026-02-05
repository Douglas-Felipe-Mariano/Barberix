package com.barbearia.dto.request;

public record ClienteRequestDTO(
    Integer usuarioId
   ,String nome
   ,String telefone
   ,String endereco
   ,String fotoUrl 
) {}
