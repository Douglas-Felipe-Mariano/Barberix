package com.barbearia.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API Barbearia",
        version = "1.0",
        description = "Documentação da API REST para o Sistema de Gestão de Barbearia (Barberix). Inclui Agendamentos, Pagamentos e Relatórios."
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Token JWT para autenticação. Cole o token no formato 'Bearer <token>'"
)
public class OpenApiConfig {

}
