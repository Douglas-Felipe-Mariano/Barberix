package com.barbearia.dto;

public record LoginResponseDTO(
    String  token
   ,Integer usuarioId
   ,String  email
   ,String  perfil
) {}
