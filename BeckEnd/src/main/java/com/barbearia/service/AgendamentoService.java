package com.barbearia.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.exception.BusinesRuleException;
import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Agendamento;
import com.barbearia.model.Barbeiro;
import com.barbearia.model.Cliente;
import com.barbearia.model.HorarioTrabalho;
import com.barbearia.model.Servico;
import com.barbearia.model.enums.DiaSemana;
import com.barbearia.model.enums.FormaPagamento;
import com.barbearia.model.enums.StatusPagamento;
import com.barbearia.repository.AgendamentoRepository;
import com.barbearia.repository.HorarioTrabalhoRepository;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private HorarioTrabalhoRepository horarioTrabalhoRepository;

    @Autowired
    private BarbeiroService barbeiroService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ServicoService servicoService;

    public Agendamento criarAgendamento(Agendamento agendamento){
        //Valida se o cliente Existe 
        Cliente cliente = clienteService.buscarClientePorId(agendamento.getCliente().getClienteId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        //Valida se o barbeiro existe e está ativo
        Barbeiro barbeiro = barbeiroService.buscarBarbeiroAtivoPorId(agendamento.getBarbeiro().getBarbeiroId())
                                           .orElseThrow(() -> new ResourceNotFoundException("Barbeiro não encontrado ou Inativo"));

        //Valida se o serviço existe 
        Servico servico = servicoService.buscaServicoPorId(agendamento.getServico().getServicoId())                                        
                                        .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        //Valida se o barbeiro está disponivel no horario desejado                                        
        Optional<Agendamento> validaHorario = agendamentoRepository
                                              .findByBarbeiroAndDataAgendada(barbeiro, agendamento.getDataAgendada());
        
        if (validaHorario.isPresent()){
            throw new BusinesRuleException("Este barbeiro já possui um agendamento neste horario");
        }                         
        
        LocalDateTime dataHoraAgendamento = agendamento.getDataAgendada();

        DayOfWeek diaJava = dataHoraAgendamento.getDayOfWeek();
        LocalTime horaAgendamento = dataHoraAgendamento.toLocalTime();

        DiaSemana diaEnum;
        try{
            diaEnum = DiaSemana.valueOf(diaJava.name()); //Tentativa de conversao direta
        } catch (IllegalArgumentException e){
            diaEnum = converterDiaSemana(diaJava);
        }

        List<HorarioTrabalho> horariosTrabalhos = horarioTrabalhoRepository.findByBarbeiroAndDiaSemanaAndAtivo(barbeiro, diaEnum, true);

        if (horariosTrabalhos.isEmpty()){
            throw new BusinesRuleException("O barbeiro não trabalha neste dia da semana.");
        }

        boolean dentroDoHorario = false;
        for ( HorarioTrabalho turno : horariosTrabalhos){
            LocalTime inicoTurno = turno.getHoraInicio();
            LocalTime fimTurno   = turno.getHoraFim();

            if ((horaAgendamento.isAfter(inicoTurno) || horaAgendamento.equals(inicoTurno)) && (horaAgendamento.isBefore(fimTurno))){
                dentroDoHorario = true;
                break;
            }
        }

        if (!dentroDoHorario){
            throw new BusinesRuleException("O barbeiro não atende neste horario");
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
        return agendamentoRepository.findAllByDate(dataAgendamento);
    }

    public Optional<Agendamento> buscarAgendamentoPorId(Integer id){
        return agendamentoRepository.findById(id);
    }

    public Agendamento atualizarAgendamento(Integer id, Agendamento detalheAgendamento){
        //Recupera o agendamento existente ou retorna uma exception
        Agendamento agendamentoExistente = agendamentoRepository.findById(id)
                                                                 .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado"));

        //Valida se o cliente foi alterado
        Cliente clienteAtualizado = agendamentoExistente.getCliente();
        if (detalheAgendamento.getCliente() != null){
            clienteAtualizado = clienteService.buscarClientePorId(detalheAgendamento.getCliente().getClienteId())
                                              .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
        }
        
        //Valida se o barbeiro foi alterado
        Barbeiro barbeiroAtualizado = agendamentoExistente.getBarbeiro();
        if (detalheAgendamento.getBarbeiro() != null) {
            barbeiroAtualizado = barbeiroService.buscarBarbeiroAtivoPorId(detalheAgendamento.getBarbeiro().getBarbeiroId())
                                                .orElseThrow(() -> new ResourceNotFoundException("Barbeiro não encontrado ou Inativo"));
        }

        //Valida se o servico foi alterado
        Servico servicoAtualizado = agendamentoExistente.getServico();
        if (detalheAgendamento.getServico() != null){
            servicoAtualizado = servicoService.buscaServicoPorId(detalheAgendamento.getServico().getServicoId())
                                              .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));
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
                throw new BusinesRuleException("Esse barbeiro já possui um agendamento neste horario");
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

    public Agendamento pagarAgendamento(Integer agendamentoId, FormaPagamento formaPagamento){
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                                                       .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));
        
        if (agendamento.getStatusPagamento() == StatusPagamento.PAGO  || agendamento.getStatusPagamento() == StatusPagamento.CANCELADO){
            throw new BusinesRuleException("Este agendamento já foi pago ou cancelado");
        }
        
        agendamento.setStatusPagamento(StatusPagamento.PAGO);
        agendamento.setFormaPagamento(formaPagamento);
        agendamento.setDataPagamento(LocalDateTime.now());

        return agendamentoRepository.save(agendamento);
    }

    public void cancelarAgendamento(Integer agendamentoId){
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                                                       .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado!"));

        if (agendamento.getStatusPagamento() == StatusPagamento.PAGO){
            throw new BusinesRuleException("Não é possivel cancelar um agendamento já pago.");
        }                                                       

        agendamento.setStatusPagamento(StatusPagamento.CANCELADO);
        
        agendamentoRepository.save(agendamento);
    }

    public void deletarAgendamento(Integer id){
        if (!agendamentoRepository.existsById(id)){
            throw new ResourceNotFoundException("Agendamento não encontrado");                
        }
        agendamentoRepository.deleteById(id);
    }

    private DiaSemana converterDiaSemana(DayOfWeek diaJava){
        switch (diaJava){
            case  MONDAY    :  return DiaSemana.SEGUNDA;
            case  TUESDAY   :  return DiaSemana.TERCA;
            case  WEDNESDAY :  return DiaSemana.QUARTA;
            case  THURSDAY  :  return DiaSemana.QUINTA;
            case  FRIDAY    :  return DiaSemana.SEXTA;
            case  SATURDAY  :  return DiaSemana.SABADO;
            case  SUNDAY    :  return DiaSemana.DOMINGO;
            default:
                throw new IllegalArgumentException("Dia da semana inesperado: " + diaJava);
        }
    }
}
