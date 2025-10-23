package com.barbearia.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_PERFIL")
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PerfilId")
    private Integer PerfilId;

    @Column(name = "PER_Nome", length = 30, nullable = false, unique = true)
    private String NomePerfil;

    public Integer getPerfilId() {
        return PerfilId;
    }

    public void setPerfilId(Integer perfilId) {
        PerfilId = perfilId;
    }

    public String getNomePerfil() {
        return NomePerfil;
    }

    public void setNomePerfil(String nomePerfil) {
        NomePerfil = nomePerfil;
    }

    public Perfil() {
    }

}
