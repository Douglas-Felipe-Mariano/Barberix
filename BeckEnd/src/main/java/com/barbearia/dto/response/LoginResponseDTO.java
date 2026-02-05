package com.barbearia.dto.response;

public record LoginResponseDTO(
    String  token
   ,Integer usuarioId
   ,String  email
   ,String  perfil
) {}
