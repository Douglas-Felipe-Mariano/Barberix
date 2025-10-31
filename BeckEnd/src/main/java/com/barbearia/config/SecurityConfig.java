package com.barbearia.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher; // Importar

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API Stateless
            
            // --- CONFIGURAÇÃO DE AUTORIZAÇÃO CORRETA ---
            .authorizeHttpRequests(authorize -> authorize
                
                // 1. Libera todos os endpoints do Swagger-UI e da documentação OpenAPI
                .requestMatchers(
                    new AntPathRequestMatcher("/swagger-ui/**"),
                    new AntPathRequestMatcher("/v3/api-docs/**"),
                    new AntPathRequestMatcher("/swagger-resources/**"),
                    new AntPathRequestMatcher("/webjars/**")
                ).permitAll()

                // 2. Libera TODOS os nossos endpoints da API (para testes no Swagger)
                .requestMatchers(new AntPathRequestMatcher("/api/**")).permitAll()
                
                // 3. (Opcional, mas boa prática) Libera o console do H2
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                
                // 4. Qualquer OUTRA requisição (que não seja as acima) precisa de login
                .anyRequest().authenticated() 
            )
            
            // (Necessário para o H2 Console funcionar corretamente)
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }
}