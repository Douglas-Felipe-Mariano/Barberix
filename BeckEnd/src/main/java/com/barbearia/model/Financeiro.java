package com.barbearia.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.barbearia.model.enums.TipoLancamento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_FINANCEIRO")
public class Financeiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LancamentoId", nullable = false)
    private Integer lancamentoId;

    @ManyToOne(optional = true)
    @JoinColumn(name = "AgendamentoId", nullable = true)
    private Agendamento agendamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "FIN_Tipo", nullable = false, length = 20) 
    private TipoLancamento tipoLancametno;

    @Column(name = "FIN_Descricao", length = 200, nullable = false)
    private String descricao;

    @Column(name = "FIN_Valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @CreationTimestamp
    @Column(name = "FIN_Data", nullable = false, updatable = false)
    private LocalDateTime dataLancamento;

    public Financeiro() {
    }


    public Integer getLancamentoId() {
        return this.lancamentoId;
    }

    public void setLancamentoId(Integer lancamentoId) {
        this.lancamentoId = lancamentoId;
    }

    public Agendamento getAgendamento() {
        return this.agendamento;
    }

    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }

    public TipoLancamento getTipoLancametno() {
        return this.tipoLancametno;
    }

    public void setTipoLancamento(TipoLancamento tipoLancametno) {
        this.tipoLancametno = tipoLancametno;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return this.valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataLancamento() {
        return this.dataLancamento;
    }

    public void setDataLancamento(LocalDateTime dataLancamento) {
        this.dataLancamento = dataLancamento;
    }

}
