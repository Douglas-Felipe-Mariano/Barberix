package com.barbearia.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    // --- Declara a chave da api ---
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime;

    //Geração do Token
    public String geraToken(String username){
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder()
                   .claims(claims)
                   .subject(subject)
                   .issuedAt(new Date(System.currentTimeMillis()))
                   .expiration(new Date(System.currentTimeMillis() + expirationTime))
                   .signWith(getSignKey())
                   .compact();
    }

    // --- Validação e leitura do token --- 
    
    //Extrai o email de dentro do token
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    //Verifica se o token e valido e se não expirou 
    public boolean isTokenValid(String token, String username){
        final String usernameToken = extractUsername(token);

        return (usernameToken.equals(username) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    //Método generico para extrair qualquer informação (Claim)
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver){
        final Claims claim = extractAllClaims(token);
        return claimsResolver.apply(claim);
    }

    //Decodifica o token usando a chave da api
    private Claims extractAllClaims(String token){
        return Jwts.parser()
                   .verifyWith(getSignKey())
                   .build()
                   .parseSignedClaims(token)
                   .getPayload();
    }

    //Transforma a chave string em um objeto secretkey utilizavel
    private SecretKey getSignKey(){
        byte[] keyBytes = Decoders.BASE64.decode(getSecretKeyBase64());

        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String getSecretKeyBase64(){
        return java.util.Base64.getEncoder().encodeToString(secretKey.getBytes());
    }
}
