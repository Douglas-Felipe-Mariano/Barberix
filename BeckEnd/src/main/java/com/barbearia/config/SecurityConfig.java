package com.barbearia.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration; 
import org.springframework.web.cors.CorsConfigurationSource; 
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.barbearia.service.CustomUserDetailService;
import com.barbearia.service.security.JwtAuthFilter; 

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public AuthenticationProvider authenticationProvider(){

        //usa o padroa DAO para buscar no banco 
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        //passa a referencia de como validar o usuario
        authProvider.setUserDetailsService(customUserDetailService);

        //Passa a referencia para validar a senha 
        authProvider.setPasswordEncoder(passwordEncoder);

        return authProvider;
    }

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
                    new AntPathRequestMatcher("/api/auth/login"),
                    new AntPathRequestMatcher("/api/usuarios", "POST"), // Permite criar usuário
                    new AntPathRequestMatcher("/api/pix/**")
                ).permitAll()
                
                // Permite acesso público ao Swagger e H2 (para desenvolvimento)
                .requestMatchers(
                    new AntPathRequestMatcher("/swagger-ui/**"),
                    new AntPathRequestMatcher("/v3/api-docs/**"),
                    new AntPathRequestMatcher("/h2-console/**")
                ).permitAll()
                
                .requestMatchers(new AntPathRequestMatcher("/api/**")).authenticated()
                
                // Qualquer outro request que não seja /api, também exige autenticação
                .anyRequest().authenticated()
            )
            //Adiciona o filtro JWT antes do filtro padrao da autenticação 
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

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