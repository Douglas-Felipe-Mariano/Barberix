package com.barbearia.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_CLIENTE")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ClienteId", nullable = false)
    private Integer clienteId;

    @Column(name = "CLI_Nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "CLI_Telefone", length = 16, nullable = false)
    private String telefone;

    @Column(name = "CLI_Email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "CLI_DataCadastro", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataCadastro;

    @Column(name = "CLI_Endereco", length = 255, nullable = true)
    private String endereco;


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

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getDataCadastro() {
        return this.dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getEndereco() {
        return this.endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    } 
}
