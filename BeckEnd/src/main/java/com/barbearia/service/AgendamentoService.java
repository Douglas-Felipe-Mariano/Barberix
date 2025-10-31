package com.barbearia.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.model.Agendamento;
import com.barbearia.model.Barbeiro;
import com.barbearia.model.Cliente;
import com.barbearia.model.Servico;
import com.barbearia.repository.AgendamentoRepository;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private BarbeiroService barbeiroService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ServicoService servicoService;

    public Agendamento criarAgendamento(Agendamento agendamento){
        //Valida se o cliente Existe 
        Cliente cliente = clienteService.buscarClientePorId(agendamento.getCliente().getClienteId())
                                        .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        //Valida se o barbeiro existe e está ativo
        Barbeiro barbeiro = barbeiroService.buscarBarbeiroAtivoPorId(agendamento.getBarbeiro().getBarbeiroId())
                                           .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado ou Inativo"));

        //Valida se o serviço existe 
        Servico servico = servicoService.buscaServicoPorId(agendamento.getServico().getServicoId())                                        
                                        .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));

        //Valida se o barbeiro está disponivel no horario desejado                                        
        Optional<Agendamento> validaHorario = agendamentoRepository
                                              .findByBarbeiroAndDataAgendada(barbeiro, agendamento.getDataAgendada());
        
        if (validaHorario.isPresent()){
            throw new RuntimeException("Este barbeiro já possui um agendamento neste horario");
        }                             
        
        //Seta preco do servico para o agendamento
        agendamento.setValor(servico.getPreco());

        //Cria o agendamento com os objetos completos, não só com id
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servico);

        return agendamentoRepository.save(agendamento) ;
    }

    public List<Agendamento> buscarTodosAgendamentos(){
        return agendamentoRepository.findAll();
    }

    public List<Agendamento> buscarAgendamentoPorData(LocalDateTime dataAgendamento){
        return agendamentoRepository.findAllByDataAgendada(dataAgendamento);
    }

    public Agendamento atualizarAgendamento(Integer id, Agendamento detalheAgendamento){
        //Recupera o agendamento existente ou retorna uma exception
        Agendamento agendamentoExistente = agendamentoRepository.findById(id)
                                                                 .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        //Valida se o cliente foi alterado
        Cliente clienteAtualizado = agendamentoExistente.getCliente();
        if (detalheAgendamento.getCliente() != null){
            clienteAtualizado = clienteService.buscarClientePorId(detalheAgendamento.getCliente().getClienteId())
                                              .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        }
        
        //Valida se o barbeiro foi alterado
        Barbeiro barbeiroAtualizado = agendamentoExistente.getBarbeiro();
        if (detalheAgendamento.getBarbeiro() != null) {
            barbeiroAtualizado = barbeiroService.buscarBarbeiroAtivoPorId(detalheAgendamento.getBarbeiro().getBarbeiroId())
                                                .orElseThrow(() -> new RuntimeException("Barbeiro não encontrado ou Inativo"));
        }

        //Valida se o servico foi alterado
        Servico servicoAtualizado = agendamentoExistente.getServico();
        if (detalheAgendamento.getServico() != null){
            servicoAtualizado = servicoService.buscaServicoPorId(detalheAgendamento.getServico().getServicoId())
                                              .orElseThrow(() -> new RuntimeException("Serviço não encontrado"));
        }

        //Valida se a data foi alterada
        LocalDateTime dataAtualizada = agendamentoExistente.getDataAgendada();
        if (detalheAgendamento.getDataAgendada() != null){
            dataAtualizada = detalheAgendamento.getDataAgendada();
        }

        //Valida se o barbeiro ou a data foram alterados e checa se há conflito 
        if (detalheAgendamento.getBarbeiro() != null || detalheAgendamento.getDataAgendada() != null){
            Optional<Agendamento> conflitoHorario = agendamentoRepository
                                                   .findByBarbeiroAndDataAgendada(barbeiroAtualizado, dataAtualizada);
            if (conflitoHorario.isPresent() && !conflitoHorario.get().getAgendamentoId().equals(id)){
                throw new RuntimeException("Esse barbeiro já possui um agendamento neste horario");
            }
        }

        agendamentoExistente.setCliente(clienteAtualizado);
        agendamentoExistente.setBarbeiro(barbeiroAtualizado);
        agendamentoExistente.setServico(servicoAtualizado);
        agendamentoExistente.setDataAgendada(dataAtualizada);

        //Seta valor conforme o serviço correspondente
        agendamentoExistente.setValor(servicoAtualizado.getPreco());

        return agendamentoRepository.save(agendamentoExistente);
    }

    public void deletarAgendamento(Integer id){
        if (!agendamentoRepository.existsById(id)){
            throw new RuntimeException("Agendamento não encontrado");                
        }
        agendamentoRepository.deleteById(id);
    }
}
