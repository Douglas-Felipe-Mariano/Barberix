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

import com.barbearia.model.Cliente;
import com.barbearia.service.ClienteService;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<?> cadastrarCliente(@RequestBody Cliente cliente){
        try{
            Cliente novoCliente = clienteService.cadastrarCliente(cliente);
            
            return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
        } catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> buscarTodosCliente(){
        List<Cliente> clientes = clienteService.buscarTodosCliente();

        return new ResponseEntity<>(clientes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Integer id){
        return clienteService.buscarClientePorId(id)
                             .map(cliente -> new ResponseEntity<>(cliente, HttpStatus.OK)) //Se Optional tiver um valor retorna OK
                             .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND)); //Se Optional estiver vazio retorna uma resposta Not Found
    } 

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> atualizarCliente(@PathVariable Integer id, @RequestBody Cliente detalheCliente){
        try{
            Cliente clienteAtualizado = clienteService.atualizaCliente(id, detalheCliente);
            return new ResponseEntity<>(clienteAtualizado, HttpStatus.OK); 
        } catch (RuntimeException a){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //se o serviço lançar a exceprion de cliente não encontrado, retorna Not Found 
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id){
        if (clienteService.buscarClientePorId(id).isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //Se o cliente não for encontrado retorna Not Found
        }
        clienteService.deletarCliente(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); //Temporariamente não deleta nada
    }
}
