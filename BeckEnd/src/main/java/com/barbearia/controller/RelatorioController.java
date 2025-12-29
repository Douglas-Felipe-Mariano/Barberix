package com.barbearia.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.barbearia.dto.RankingBarbeiroDTO;
import com.barbearia.dto.RankingServicoDTO;
import com.barbearia.service.RelatorioService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioService relatorioService;

    @GetMapping("/faturamento")
    public ResponseEntity<BigDecimal> calcularFaturamentoTotal(){
        BigDecimal faturamento = relatorioService.calcularFaturamentoTotal();

        return ResponseEntity.ok(faturamento);
    }

    @GetMapping("/faturamento-periodo")
    public ResponseEntity<BigDecimal> calcularFaturamentoPorPeriodo(@RequestParam("inicio") LocalDateTime inicio
                                                                   ,@RequestParam("fim")    LocalDateTime fim){
        BigDecimal faturamentoPeriodo = relatorioService.calcularFaturamentoPorPeriodo(inicio, fim);
        
        return ResponseEntity.ok(faturamentoPeriodo);
    }

    @GetMapping("/ranking-barbeiros")
    public ResponseEntity<List<RankingBarbeiroDTO>> rankearBarbeiros(){
        List<RankingBarbeiroDTO> rankingBarbeiros = relatorioService.rankingBarbeiros();

        return ResponseEntity.ok(rankingBarbeiros);
    }

    @GetMapping("/ranking-servicos")
    public ResponseEntity<List<RankingServicoDTO>> rankearServicos(){
        List<RankingServicoDTO> rankingServicos = relatorioService.rankingServicos();

        return ResponseEntity.ok(rankingServicos);
    }

}
