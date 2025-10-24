package com.barbearia.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_BARBEIRO")
public class Barbeiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BarbeiroId", nullable = false)
    private Integer barbeiroId;

    @OneToOne
    @JoinColumn(name = "UsuarioId", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "BARB_Nome", length = 100 ,nullable = false)
    private String nome;


    public Barbeiro() {
    }

    public Integer getBarbeiroId() {
        return this.barbeiroId;
    }

    public void setBarbeiroId(Integer barbeiroId) {
        this.barbeiroId = barbeiroId;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
