package com.barbearia.service.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.barbearia.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    //Extrai o cabeçalho
    protected void doFilterInternal(
        HttpServletRequest request
       ,HttpServletResponse response
       ,FilterChain filterChain
    ) throws ServletException, IOException{
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        //verifica se houve cabeçalho ou se ele nao começa com Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        //Extrai o token JWT
        jwt = authHeader.substring(7);

        //Extrai o username  do token usando o JwtService
        userEmail = jwtService.extractUsername(jwt);

        //se o email foi extraido e o usuario ainda não foi autenticado
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null){
            
            //carrega os dados do usuario
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            //Verifica se o token é valido
            if (jwtService.isTokenValid(jwt, userDetails.getUsername())){
                //se for valido cria o objeto de autenticação
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails
                   ,null
                   ,userDetails.getAuthorities()
                );

                //Adiciona os detalhes da requisição
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                //autentica o usuario no scopo global da api
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        //passa para o proximo filtro ou para o controller
        filterChain.doFilter(request, response);
    }
    
}
