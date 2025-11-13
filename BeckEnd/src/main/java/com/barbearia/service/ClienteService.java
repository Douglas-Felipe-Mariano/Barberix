package com.barbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.exception.BusinesRuleException;
import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Cliente;
import com.barbearia.repository.ClienteRepository;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public Cliente cadastrarCliente(Cliente cliente){
        Optional<Cliente> clienteExistenete = clienteRepository.findByEmail(cliente.getEmail());
        
        //Verifica se o email ja existe no banco de dados   
        if (clienteExistenete.isPresent()){
            throw new BusinesRuleException("E-mail já cadastrado no sistema");
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> buscarTodosCliente(){
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarClientePorId(Integer id){
        return clienteRepository.findById(id);
    }

    public Cliente atualizaCliente(Integer id ,Cliente detalheCliente){
        Cliente clienteExistente = clienteRepository.findById(id)
                                                    .orElseThrow(() -> new ResourceNotFoundException("Cliente com o id: " + id + " não encontrado"));

        if (detalheCliente.getNome() != null){
            clienteExistente.setNome(detalheCliente.getNome());         
        }
        if (detalheCliente.getEmail() != null){
            //Valida se o email ja está em uso por outra pessoa
            Optional<Cliente> verificaEmail = clienteRepository.findByEmail(detalheCliente.getEmail());
            if (verificaEmail.isPresent() && !verificaEmail.get().getClienteId().equals(clienteExistente.getClienteId())){
                throw new BusinesRuleException("E-mail já cadastrado no sistema");
            }
            clienteExistente.setEmail(detalheCliente.getEmail());
        }
        if(detalheCliente.getTelefone() != null){
            clienteExistente.setTelefone(detalheCliente.getTelefone());
        }
        if (detalheCliente.getEndereco() != null){
            clienteExistente.setEndereco(detalheCliente.getEndereco());    
        }

        return clienteRepository.save(clienteExistente);
    }

    //Adicionar soft delet futuramente - ou mecanismo explicito de inativação de clientes

}
