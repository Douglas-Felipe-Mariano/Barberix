package com.barbearia.controller;

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

import com.barbearia.model.Barbeiro;
import com.barbearia.service.BarbeiroService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/barbeiros")
@SecurityRequirement(name = "bearerAuth")
public class BarbeiroController {

    @Autowired
    private BarbeiroService barbeiroService;

    @PostMapping
    public ResponseEntity<?> cadastrarBarbeiro(@RequestBody Barbeiro barbeiro){
        try{
            Barbeiro novBarbeiro = barbeiroService.cadastrarBarbeiro(barbeiro);
            return new ResponseEntity<>(novBarbeiro, HttpStatus.CREATED);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST); //caso haja algum problema retorna o erro com a mensagem exata trazida do service
        }
    }

    @GetMapping
    public ResponseEntity<List<Barbeiro>> buscarTodosBarbeiros(){
        List<Barbeiro> barbeiros = barbeiroService.buscarTodosBarbeirosAtivos();

        return new ResponseEntity<>(barbeiros, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Barbeiro> buscarBarbeiroAtivoPorId(@PathVariable Integer id){
        return barbeiroService.buscarBarbeiroAtivoPorId(id)
                              .map(barbeiro -> new ResponseEntity<>(barbeiro, HttpStatus.OK))
                              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarBarbeiro(@PathVariable Integer id, @RequestBody Barbeiro detalheBarbeiro){
        try{
            Barbeiro barbeiroAtualizado = barbeiroService.atualizaBarbeiro(id, detalheBarbeiro);
            return new ResponseEntity<>(barbeiroAtualizado, HttpStatus.OK);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); //caso haja algum problema retorna o erro com a mensagem exata trazida do service
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarBarbeiro(@PathVariable Integer id){
        try {
            barbeiroService.deletarBarbeiro(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
