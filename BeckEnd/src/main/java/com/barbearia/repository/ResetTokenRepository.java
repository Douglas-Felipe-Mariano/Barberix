package com.barbearia.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbearia.model.ResetToken;
import com.barbearia.model.Usuario;

public interface ResetTokenRepository extends JpaRepository <ResetToken, Integer> {

    Optional<ResetToken> findByTokenAndDataExpiracaoAfter(String token, LocalDateTime now);

    Optional<ResetToken> findByUsuario(Usuario usuario);

    void deleteByDataExpiracaoBefore(LocalDateTime now);
}
