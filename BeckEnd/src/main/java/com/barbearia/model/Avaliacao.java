package com.barbearia.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_AVALIACAO")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "AvaliacaoId", nullable = false)
    private Integer avaliacaoId;

    @OneToOne
    @JoinColumn(name = "AgendamentoId", nullable = false, unique = true)
    private Agendamento agendamento;

    @Column(name = "AVA_Nota", nullable = false)
    private Integer nota;

    @Column(name = "AVA_Comentario", length = 500, nullable = true)
    private String comentario;

    @CreationTimestamp
    @Column(name = "AVA_DataAvaliacao", nullable = false, updatable = false)
    private LocalDateTime dataAvaliacao;

    public Avaliacao() {
    }

    public Integer getAvaliacaoId() {
        return this.avaliacaoId;
    }

    public void setAvaliacaoId(Integer avaliacaoId) {
        this.avaliacaoId = avaliacaoId;
    }

    public Agendamento getAgendamento() {
        return this.agendamento;
    }

    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }

    public Integer getNota() {
        return this.nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return this.comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDateTime getDataAvaliacao() {
        return this.dataAvaliacao;
    }

    public void setDataAvaliacao(LocalDateTime dataAvaliacao) {
        this.dataAvaliacao = dataAvaliacao;
    }
}