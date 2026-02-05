package com.barbearia.dto.request;

public record ResetSenhaRequestDTO(
    String token
   ,String novaSenha
) {}
