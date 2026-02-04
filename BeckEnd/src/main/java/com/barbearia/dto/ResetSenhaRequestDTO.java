package com.barbearia.dto;

public record ResetSenhaRequestDTO(
    String token
   ,String novaSenha
) {}
