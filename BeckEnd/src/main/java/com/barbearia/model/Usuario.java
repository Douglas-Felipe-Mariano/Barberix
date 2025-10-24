package com.barbearia.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UsuarioId")
    private Integer usuarioId;

    @ManyToOne  
    @JoinColumn(name = "PerfilId", nullable = false)
    private Perfil perfil;

    @Column(name = "USU_Email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "USU_Senha", length = 100, nullable = false)
    private String senha;

    @Column(name = "USU_DataCadastro", nullable = false, updatable = false)
    @CreationTimestamp //Grava a data da criação do Registro
    private LocalDateTime dataCadastro;

    public Usuario() {
    }

    public Integer getUsuarioId() {
        return this.usuarioId;
    }
    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Perfil getPerfil() {
        return this.perfil;
    }

    public void setPerfil(Perfil perfil) {
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
}
