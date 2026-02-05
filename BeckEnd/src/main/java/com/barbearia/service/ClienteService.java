package com.barbearia.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.dto.request.ClienteRequestDTO;
import com.barbearia.dto.response.ClienteResponseDTO;
import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Cliente;
import com.barbearia.model.Usuario;
import com.barbearia.repository.ClienteRepository;
import com.barbearia.repository.UsuarioRepository;

@Service
public class ClienteService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;
    

    public ClienteResponseDTO cadastrarCliente(ClienteRequestDTO dto){
        Cliente cliente = new Cliente();

        cliente.setNome(dto.nome());
        cliente.setTelefone(dto.telefone());
        cliente.setEndereco(dto.endereco());
        cliente.setFotoUrl(dto.fotoUrl());

        if (dto.usuarioId() != null){
           Usuario usuario = usuarioRepository.findById(dto.usuarioId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Usuário com o id: " + dto.usuarioId() + " não encontrado"));

           cliente.setUsuario(usuario);
        } else 
        {
            cliente.setUsuario(null);
        }

        Cliente clienteSalvo = clienteRepository.save(cliente);

        return convertToDTO(clienteSalvo);
    }

    public List<ClienteResponseDTO> buscarTodosCliente(){
        List<Cliente> clientes = clienteRepository.findAll();

        return clientes.stream()
                       .map(this::convertToDTO)
                       .collect(Collectors.toList());
    }

    public ClienteResponseDTO buscarClientePorId(Integer id){
        Cliente cliente = clienteRepository.findById(id)
                                            .orElseThrow(() -> new ResourceNotFoundException("Cliente com o id: " + id + " não encontrado"));
        return convertToDTO(cliente);
    }

    public ClienteResponseDTO atualizaCliente(Integer id ,ClienteRequestDTO dto){
        Cliente clienteExistente = clienteRepository.findById(id)
                                                    .orElseThrow(() -> new ResourceNotFoundException("Cliente com o id: " + id + " não encontrado"));

        if (dto.nome() != null){
            clienteExistente.setNome(dto.nome());         
        }
        if(dto.telefone() != null){
            clienteExistente.setTelefone(dto.telefone());
        }
        if (dto.endereco() != null){
            clienteExistente.setEndereco(dto.endereco());    
        }

        if(dto.fotoUrl() != null){
            clienteExistente.setFotoUrl(dto.fotoUrl());
        }   

        Cliente clienteAtualizado = clienteRepository.save(clienteExistente);
        
        return convertToDTO(clienteAtualizado);
    }
     public void deletarCliente(Integer id) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cliente com o id: " + id + " não encontrado"));
        clienteRepository.delete(cliente);
    }

    private ClienteResponseDTO convertToDTO(Cliente cliente){
        String emailUsuario = null;
        if(cliente.getUsuario() != null){
            emailUsuario = cliente.getUsuario().getEmail();
        }

        return new ClienteResponseDTO(
            cliente.getClienteId(),
            cliente.getNome(),
            cliente.getTelefone(),
            emailUsuario,
            cliente.getEndereco(),
            cliente.getFotoUrl(),
            cliente.getDataCadastro()
        );
    }


    //Adicionar soft delet futuramente - ou mecanismo explicito de inativação de clientes

}
