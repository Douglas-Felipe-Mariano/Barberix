package com.barbearia.model;

import java.time.LocalTime;

import com.barbearia.model.enums.DiaSemana;

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
@Table(name = "TB_HORARIO_TRABALHO")
public class HorarioTrabalho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer horarioId;

    @ManyToOne
    @JoinColumn(name = "BarbeiroId", nullable = false)
    private Barbeiro barbeiro;

    @Enumerated(EnumType.STRING)
    @Column(name = "HT_DiaSemana", nullable = false, length = 20)
    private DiaSemana diaSemana;

    @Column(name = "HT_HoraInicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "HT_HoraFim", nullable = false)
    private LocalTime horaFim;

    @Column(name = "HT_Ativo", nullable = false)
    private Boolean ativo = true;


    public Integer getHorarioId() {
        return this.horarioId;
    }

    public void setHorarioId(Integer horarioId) {
        this.horarioId = horarioId;
    }

    public Barbeiro getBarbeiro() {
        return this.barbeiro;
    }

    public void setBarbeiro(Barbeiro barbeiro) {
        this.barbeiro = barbeiro;
    }

    public DiaSemana getDiaSemana() {
        return this.diaSemana;
    }

    public void setDiaSemana(DiaSemana diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return this.horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFim() {
        return this.horaFim;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }
    
    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Boolean getAtivo(){
        return this.ativo;
    }
    

}
