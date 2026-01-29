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
@Table(name = "TB_CLIENTE")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ClienteId", nullable = false)
    private Integer clienteId;

    @OneToOne(optional = true)    
    @JoinColumn(name = "UsuarioId", nullable = true, unique = true)
    private Usuario usuario;

    @Column(name = "CLI_Nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "CLI_Telefone", length = 16, nullable = false)
    private String telefone;

    @Column(name = "CLI_Endereco", length = 255, nullable = true)
    private String endereco;

    @Column(name = "CLI_FotoUrl", columnDefinition = "VARCHAR(MAX)")
    private String fotoUrl;


    public Cliente() {
    }

    public Integer getClienteId() {
        return this.clienteId;
    }

    public void setClienteId(Integer ClienteId) {
        this.clienteId = ClienteId;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return this.telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEndereco() {
        return this.endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    } 


    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getFotoUrl() {
        return this.fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

}
