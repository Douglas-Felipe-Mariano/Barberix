package com.barbearia.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barbearia.model.HorarioTrabalho;
import com.barbearia.service.HorarioTrabalhoService;


@RestController
@RequestMapping("/api/horarios") 
public class HorarioTrabalhoController {

    @Autowired
    private HorarioTrabalhoService horarioTrabalhoService;

    @PostMapping
    public ResponseEntity<HorarioTrabalho> criarHorarioTrabalho(@RequestBody HorarioTrabalho horarioTrabalho){
        HorarioTrabalho novoHorarioTrabalho = horarioTrabalhoService.criarHorario(horarioTrabalho);

        return new ResponseEntity<>(novoHorarioTrabalho, HttpStatus.CREATED);
    }

    @GetMapping("/barbeiro/{barbeiroId}")
    public ResponseEntity<List<HorarioTrabalho>> listarHorariosPorBarbeiros(@PathVariable Integer barbeiroId){
        List<HorarioTrabalho> horarios = horarioTrabalhoService.listarHorariosPorBarbeiro(barbeiroId);
        
        return new ResponseEntity<>(horarios, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioTrabalho> atualizarHorarioTrabalho(@PathVariable Integer id, @RequestBody HorarioTrabalho detalheHorarioTrabalho){
        HorarioTrabalho horarioTrabalho = horarioTrabalhoService.atualizarHorario(id, detalheHorarioTrabalho);

        return new ResponseEntity<>(horarioTrabalho, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarHorarioTrabalho(@PathVariable Integer id){
        horarioTrabalhoService.deletarHorario(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
