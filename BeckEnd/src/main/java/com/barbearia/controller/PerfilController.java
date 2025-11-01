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

import com.barbearia.model.Perfil;
import com.barbearia.service.PerfilService;

@RestController
@RequestMapping("/api/perfis")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @PostMapping
    public ResponseEntity<?> criarPerfil(@RequestBody Perfil perfil){
        try{
            Perfil novoPerfil = perfilService.cadastrarPerfil(perfil);

            return new ResponseEntity<>(novoPerfil, HttpStatus.CREATED);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Perfil>> buscarTodosPerfis(){
        List<Perfil> perfis = perfilService.buscarTodosPerfis();

        return new ResponseEntity<>(perfis, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Perfil> buscarPerfilPorId (@PathVariable Integer id){
        return perfilService.buscarPerfilPorId(id)
                            .map(perfil -> new ResponseEntity<>(perfil, HttpStatus.OK))
                            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarPerfil (@PathVariable Integer id, @RequestBody Perfil detalhePerfil){
        try{
            Perfil perfilAtualizado = perfilService.atualizaPerfil(id, detalhePerfil);

            return new ResponseEntity<>(perfilAtualizado, HttpStatus.OK);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPerfil (@PathVariable Integer id){
        try{
            perfilService.deletarPerfil(id);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
