package com.barbearia.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_SERVICO")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServicoId")
    private Integer servicoId;

    @Column(name = "SERV_Nome", length = 45, nullable = false, unique = true)
    private String nome;

    @Column(name = "SERV_DuracaoMinutos", nullable = false)
    private Integer duracaoMinutos;

    @Column(name = "SERV_Preco", precision = 10, scale = 2, nullable = false)
    private BigDecimal preco;

    public Servico() {
    }

    public Integer getServicoId() {
        return this.servicoId;
    }

    public void setServicoId(Integer servicoId) {
        this.servicoId = servicoId;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getDuracaoMinutos() {
        return this.duracaoMinutos;
    }

    public void setDuracaoMinutos(Integer duracaoMinutos) {
        this.duracaoMinutos = duracaoMinutos;
    }

    public BigDecimal getPreco() {
        return this.preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }
}
