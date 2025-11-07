package com.barbearia.config;

import java.util.Arrays; 

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration; 
import org.springframework.web.cors.CorsConfigurationSource; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
            // --- HABILITA O CORS GLOBAL ---
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API Stateless
            
            .authorizeHttpRequests(authorize -> authorize
                // Permissão para Swagger e H2 console
                .requestMatchers(
                    new AntPathRequestMatcher("/swagger-ui/**"),
                    new AntPathRequestMatcher("/v3/api-docs/**"),
                    new AntPathRequestMatcher("/swagger-resources/**"),
                    new AntPathRequestMatcher("/webjars/**")
                ).permitAll()
                
                // 🚨 REGRA CRÍTICA 1: Permissão total para TODAS as rotas da API (TESTE)
                // Isso resolve o problema de 403 Forbidden e garante que o CORS funcione.
                .requestMatchers(new AntPathRequestMatcher("/api/**")).permitAll() 
                
                // Permissão H2 console
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                
                // 🚨 REGRA CRÍTICA 2: Remove a autenticação obrigatória para o resto
                // .anyRequest().authenticated() // LINHA REMOVIDA TEMPORARIAMENTE PARA TESTES
            )
            
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    // --- BEAN DE CONFIGURAÇÃO GLOBAL DO CORS ---
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Origens permitidas (3000 e 5173)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://localhost:5173")); 
        
        // Permite TODOS os Métodos (GET, POST, PUT, DELETE, OPTIONS, etc.)
        configuration.setAllowedMethods(Arrays.asList("*")); 
        
        // Permite TODOS os Headers (para incluir Content-Type e Authorization)
        configuration.setAllowedHeaders(Arrays.asList("*")); 
        
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); 
        
        return source;
    }
}