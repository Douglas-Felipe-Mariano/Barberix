package com.barbearia.model;


import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.barbearia.model.enums.AuthProvider;
import com.barbearia.model.enums.PerfilTipo;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@SQLDelete(sql = "UPDATE TB_USUARIO SET USU_Status = 0 WHERE UsuarioId = ? ")
@Entity
@Table(name = "TB_USUARIO")
public class Usuario implements UserDetails{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsuarioId")
    private Integer usuarioId;

    @Column(name = "USU_Status", nullable = false)
    private Integer status = 1; // Já inicia como 1 Ativo

    @Enumerated(EnumType.STRING)  
    @Column(name = "USU_Perfil", nullable = false, length = 30)
    private PerfilTipo perfil;

    @Column(name = "USU_Email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "USU_Senha", length = 255, nullable = true)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(name = "USU_Provider", nullable = false, length = 20)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(name = "USU_DataCadastro", nullable = false, updatable = false)
    @CreationTimestamp //Grava a data da criação do Registro
    private LocalDateTime dataCadastro;

    @UpdateTimestamp
    @Column(name = "USU_UltimaAlteracao", nullable = true)
    private LocalDateTime ultimaAlteracao;

    @OneToMany(mappedBy = "usuario")
    private List<ResetToken> tokens;

    public Usuario() {
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + perfil.name()));
 
    }

    @Override
    public String getPassword(){
        return senha;
    }

    @Override
    public String getUsername(){
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Um usuário está habilitado se o status dele for 1 (ativo)
        return status == 1;
    }

    public Integer getUsuarioId() {
        return this.usuarioId;
    }
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public PerfilTipo getPerfil() {
        return this.perfil;
    }

    public void setPerfil(PerfilTipo perfil) {
        this.perfil = perfil;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return this.senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDateTime getDataCadastro() {
        return this.dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
    

    public AuthProvider getProvider() {
        return this.provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public LocalDateTime getUltimaAlteracao() {
        return this.ultimaAlteracao;
    }

    public void setUltimaAlteracao(LocalDateTime ultimaAlteracao) {
        this.ultimaAlteracao = ultimaAlteracao;
    }

    public List<ResetToken> getTokens() {
        return this.tokens;
    }

    public void setTokens(List<ResetToken> tokens) {
        this.tokens = tokens;
    }


}
