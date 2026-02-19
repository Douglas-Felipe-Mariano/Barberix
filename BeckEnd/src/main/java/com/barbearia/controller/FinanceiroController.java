package com.barbearia.controller;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.barbearia.dto.request.FinanceiroRequestDTO;
import com.barbearia.dto.response.FinanceiroResponseDTO;
import com.barbearia.service.FinanceiroService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/financeiro")
@SecurityRequirement(name = "bearerAuth")
public class FinanceiroController {

    @Autowired
    private FinanceiroService financeiroService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA'")
    public ResponseEntity<FinanceiroResponseDTO> criarLancamento(@RequestBody FinanceiroRequestDTO dto){
        FinanceiroResponseDTO novoLancamento = financeiroService.criarLancamento(dto);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                                             .path("/{id}")
                                             .buildAndExpand(novoLancamento.lancamentoId())
                                             .toUri();

        return ResponseEntity.created(uri).body(novoLancamento);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA')")
    public ResponseEntity<List<FinanceiroResponseDTO>> listarTodosLancamentos(){
        List<FinanceiroResponseDTO> lancamentos = financeiroService.listarTodosLancamentos();

        return ResponseEntity.ok(lancamentos);
    }

     @GetMapping("/saldo")
     @PreAuthorize("hasAnyRole('ADMIN')")
     public ResponseEntity<BigDecimal>  CalcularSaldoTotal(){
         BigDecimal saldoTotal = financeiroService.CalcularSaldoTotal();

         return ResponseEntity.ok(saldoTotal);
     }  

     @GetMapping("/{id}")
     @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA')")
     public ResponseEntity<FinanceiroResponseDTO> buscarLancamentoPorId(@PathVariable Integer id){
         FinanceiroResponseDTO lancamento = financeiroService.buscarLancamentoPorId(id);

         return ResponseEntity.ok(lancamento);
     }
}
