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

import com.barbearia.model.Usuario;
import com.barbearia.service.UsuarioService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<?> criarUsuario(@RequestBody Usuario usuario){
        Usuario novoUsuario = usuarioService.criaUsuario(usuario);

        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    @GetMapping 
    public ResponseEntity<List<Usuario>> listarTodosUsuarios(){
        List<Usuario> usuarios = usuarioService.listarTodosUsuarios();

        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<Usuario>> listarTodosUsuariosAtivos(){
        List<Usuario> usuarios = usuarioService.buscarUsuariosAtivos();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarUsuarioPorEmail(@PathVariable String email){
        return usuarioService.buscarUsuarioPorEmail(email)
                             .map(usuario -> new ResponseEntity<>(usuario, HttpStatus.OK))
                             .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuario){
        Usuario usuarioAtualizado = usuarioService.atualizarUsuario(id, usuario);

        return new ResponseEntity<>(usuarioAtualizado, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id){   
        usuarioService.deletarUsuario(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/reativar")
    public ResponseEntity<Usuario> ativarUsuario(@PathVariable Integer id){
        Usuario usuarioReativado = usuarioService.reativarUsuario(id);

        return new ResponseEntity<>(usuarioReativado, HttpStatus.OK);
    }
}
