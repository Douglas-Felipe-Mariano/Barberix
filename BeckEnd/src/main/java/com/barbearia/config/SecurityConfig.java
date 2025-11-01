package com.barbearia.config;

import java.util.Arrays; // 1. NOVO IMPORT

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration; // 2. NOVO IMPORT
import org.springframework.web.cors.CorsConfigurationSource; // 3. NOVO IMPORT
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // 4. NOVO IMPORT

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        http
            // --- 5. HABILITA O CORS GLOBAL ---
            // Diz ao Spring Security para usar a configuração "corsConfigurationSource"
            // que definimos no Bean logo abaixo.
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API Stateless
            
            // (As regras de permissão que já tínhamos continuam iguais)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                    new AntPathRequestMatcher("/swagger-ui/**"),
                    new AntPathRequestMatcher("/v3/api-docs/**"),
                    new AntPathRequestMatcher("/swagger-resources/**"),
                    new AntPathRequestMatcher("/webjars/**")
                ).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                .anyRequest().authenticated() 
            )
            
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        return http.build();
    }

    // --- 6. BEAN DE CONFIGURAÇÃO GLOBAL DO CORS ---
    // Aqui nós definimos as regras do CORS que o ".cors()" acima vai usar.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 7. Define a ORIGEM permitida (o seu app React)
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); 
        
        // 8. Define os MÉTODOS HTTP permitidos (GET, POST, etc.)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")); 
        
        // 9. Define os HEADERS (cabeçalhos) que o React pode enviar
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type")); 
        
        // (Opcional, mas boa prática)
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // 10. Aplica esta configuração a TODAS as rotas da sua API ("/**")
        source.registerCorsConfiguration("/**", configuration); 
        
        return source;
    }
}