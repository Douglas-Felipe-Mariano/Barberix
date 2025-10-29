package com.barbearia.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barbearia.model.Servico;
import com.barbearia.service.ServicoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @PostMapping
    public ResponseEntity<?> cadastrarServico(@RequestBody Servico servico) {
        try{
            Servico novoServico = servicoService.cadastraServico(servico);
            return new ResponseEntity<>(novoServico, HttpStatus.CREATED);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Servico>> buscarTodosServicos(){
        List<Servico> servicos = servicoService.buscarTodosServicos();

        return new ResponseEntity<>(servicos, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Servico> buscarServicoPorId(@PathVariable Integer id){
        return servicoService.buscaServicoPorId(id)
                             .map(servico -> new ResponseEntity<>(servico, HttpStatus.OK)) //Se Optional tiver um valor retorna OK
                             .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND)); //Se Optional estiver vazio retorna uma resposta Not Found
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizaServico(@PathVariable Integer id, @RequestBody Servico detalhesServico){
        try{
            Servico servicoAtualizado = servicoService.atualizaServico(id, detalhesServico);
            return new ResponseEntity<>(servicoAtualizado, HttpStatus.OK);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);  //se o serviço lançar a exception de serviço não encontrado, retorna Not Found 
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarServico(@PathVariable Integer id){
        try{
            servicoService.deletarServico(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //se o serviço lançar a exception de serviço não encontrado, retorna Not Found 
        }
    }


}
