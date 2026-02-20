package com.barbearia.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.barbearia.dto.request.AgendamentoRequestDTO;
import com.barbearia.dto.response.AgendamentoResponseDTO;
import com.barbearia.model.enums.FormaPagamento;
import com.barbearia.service.AgendamentoService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(@RequestBody AgendamentoRequestDTO dto){
        AgendamentoResponseDTO novoAgendamento = agendamentoService.criarAgendamento(dto);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                                              .path("/{id}")
                                              .buildAndExpand(novoAgendamento.agendamentoId())
                                              .toUri();

        return ResponseEntity.created(uri).body(novoAgendamento);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AgendamentoResponseDTO> buscarAgendamentoPorId(@PathVariable Integer id){
        return agendamentoService.buscarAgendamentoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA', 'BARBEIRO')")
    public ResponseEntity<List<AgendamentoResponseDTO>> buscarTodosAgendamentos(){
        return ResponseEntity.ok(agendamentoService.buscarTodosAgendamentos());
    }

    @GetMapping("/data")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA', 'BARBEIRO')")
    public ResponseEntity<List<AgendamentoResponseDTO>> buscarAgendamentosPorData(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime data){
        return ResponseEntity.ok(agendamentoService.buscarAgendamentoPorData(data));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA') or isAuthenticated()")
    public ResponseEntity<AgendamentoResponseDTO> atualizarAgendamento(@PathVariable Integer id, @RequestBody AgendamentoRequestDTO dto){
        return ResponseEntity.ok(agendamentoService.atualizarAgendamento(id, dto));
    }

    @PostMapping("/{id}/pagar")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA', 'CLIENTE')")
    public ResponseEntity<AgendamentoResponseDTO> pagarAgendamento(@PathVariable Integer id, @RequestParam FormaPagamento formaPagamento){
        return ResponseEntity.ok(agendamentoService.pagarAgendamento(id, formaPagamento));
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AgendamentoResponseDTO> cancelarAgendamento(@PathVariable Integer id){
        return ResponseEntity.ok(agendamentoService.cancelarAgendamento(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Void> deletarAgendamento(@PathVariable Integer id){
        agendamentoService.deletarAgendamento(id);
        
        return ResponseEntity.noContent().build();
    }
}
