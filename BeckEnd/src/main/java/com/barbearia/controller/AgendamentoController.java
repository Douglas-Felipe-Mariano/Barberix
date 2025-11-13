package com.barbearia.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barbearia.model.Agendamento;
import com.barbearia.model.enums.FormaPagamento;
import com.barbearia.service.AgendamentoService;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<?> criarAgendamento(@RequestBody Agendamento agendamento){
        Agendamento novoAgendamento = agendamentoService.criarAgendamento(agendamento);

        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Agendamento>> buscarTodosAgendamentos(){
        List<Agendamento> agendamentos = agendamentoService.buscarTodosAgendamentos();

        return new ResponseEntity<>(agendamentos, HttpStatus.OK);
    }

    @GetMapping("/data/{data}")
    public ResponseEntity<List<Agendamento>> buscarAgendamentosPorData(@PathVariable LocalDateTime data){
        List<Agendamento> agendamentos = agendamentoService.buscarAgendamentoPorData(data);

        return new ResponseEntity<>(agendamentos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarAgendamento(@PathVariable Integer id, @RequestBody Agendamento detalheAgendamento){
        Agendamento novoAgendamento = agendamentoService.atualizarAgendamento(id, detalheAgendamento);

        return new ResponseEntity<>(novoAgendamento, HttpStatus.OK);
    }

    @PostMapping("/{id}/pagar")
    public ResponseEntity<Agendamento> pagarAgendamento(@PathVariable Integer id, @RequestBody FormaPagamento formaPagamento){
        Agendamento agendamentoPago = agendamentoService.pagarAgendamento(id, formaPagamento);

        return new ResponseEntity<>(agendamentoPago, HttpStatus.OK);
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarAgendamento(@PathVariable Integer id){
        agendamentoService.cancelarAgendamento(id);
        
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAgendamento(@PathVariable Integer id){
        agendamentoService.deletarAgendamento(id);
        
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
