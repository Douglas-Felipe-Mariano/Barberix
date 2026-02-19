package com.barbearia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.barbearia.model.Financeiro;
import com.barbearia.model.enums.TipoLancamento;

@Repository
public interface FinanceiroRepository extends JpaRepository<Financeiro, Integer> {

    List<Financeiro> findByTipo(TipoLancamento tipo);

    @Query("SELECT SUM(f.valor) FROM Financeiro f WHERE f.tipo = :tipo")
    Double somarPorTipo(TipoLancamento tipo);
}
