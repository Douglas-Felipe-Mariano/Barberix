package com.barbearia.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barbearia.dto.PixDTO;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/pix")
public class PixController {

    @Value("${barbearia.pix.chave}")
    private String chavePix;

    @Value("${barbearia.pix.brcode}")
    private String brCodePix;

    @GetMapping
    public ResponseEntity<PixDTO> getPixInfo(){
        PixDTO pixInfo = new PixDTO(chavePix, brCodePix);

        return ResponseEntity.ok(pixInfo);
    }

}
