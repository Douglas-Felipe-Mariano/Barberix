package com.barbearia.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_AGENDAMENTO")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AgendamentoId", nullable = false)
    private Integer agendamentoId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ClienteId", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ServicoId", nullable = false)
    private Servico servico;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "BarbeiroId", nullable = false)
    private Barbeiro barbeiro;

    @Column(name = "AGEND_DataAgendada", nullable = false)
    private LocalDateTime dataAgendada;

    @Column(name = "AGEND_DataRegistroAgendamento", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dataRegistroAgendamento;

    @Column(name = "AGEND_Valor", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor;


    public Agendamento() {
    }

    public Integer getAgendamentoId() {
        return this.agendamentoId;
    }

    public void setAgendamentoId(Integer agendamentoId) {
        this.agendamentoId = agendamentoId;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Servico getServico() {
        return this.servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public Barbeiro getBarbeiro() {
        return this.barbeiro;
    }

    public void setBarbeiro(Barbeiro barbeiro) {
        this.barbeiro = barbeiro;
    }

    public LocalDateTime getDataAgendada() {
        return this.dataAgendada;
    }

    public void setDataAgendada(LocalDateTime dataAgendada) {
        this.dataAgendada = dataAgendada;
    }

    public LocalDateTime getDataRegistroAgendamento() {
        return this.dataRegistroAgendamento;
    }

    public void setDataRegistroAgendamento(LocalDateTime dataRegistroAgendamento) {
        this.dataRegistroAgendamento = dataRegistroAgendamento;
    }

    public BigDecimal getValor() {
        return this.valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
}
