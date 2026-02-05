package com.barbearia.controller;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.barbearia.dto.request.ClienteRequestDTO;
import com.barbearia.dto.response.ClienteResponseDTO;
import com.barbearia.service.ClienteService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@RequestMapping("/api/clientes")
@SecurityRequirement(name = "bearerAuth")
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;


    //Requisição de Cadastro interno, a requisição de autocadastro estara no authcontroller
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA')")
    public ResponseEntity<ClienteResponseDTO> cadastrarCliente(@RequestBody ClienteRequestDTO dto){
        ClienteResponseDTO novoCliente = clienteService.cadastrarCliente(dto);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                                             .path("/{id}")
                                             .buildAndExpand(novoCliente.clienteId())
                                             .toUri();
                                             
        return ResponseEntity.created(uri).body(novoCliente);
    }

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA', 'BARBEIRO')")
    public ResponseEntity<List<ClienteResponseDTO>> buscarTodosCliente(){
        List<ClienteResponseDTO> clientes = clienteService.buscarTodosCliente();

        return new ResponseEntity<>(clientes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ClienteResponseDTO> buscarClientePorId(@PathVariable Integer id){
        return ResponseEntity.ok(clienteService.buscarClientePorId(id)); 
    } 

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA') or isAuthenticated()")
    public ResponseEntity<ClienteResponseDTO> atualizarCliente(@PathVariable Integer id, @RequestBody ClienteRequestDTO dto){
        return ResponseEntity.ok(clienteService.atualizaCliente(id,dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARIA')")
    public ResponseEntity<Void> deletarCliente(@PathVariable Integer id){
        clienteService.deletarCliente(id);

        return ResponseEntity.noContent().build();
    }
}
