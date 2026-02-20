package com.barbearia.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.dto.request.AgendamentoRequestDTO;
import com.barbearia.dto.response.AgendamentoResponseDTO;
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
import com.barbearia.repository.BarbeiroRepository;
import com.barbearia.repository.ClienteRepository;
import com.barbearia.repository.HorarioTrabalhoRepository;
import com.barbearia.repository.ServicoRepository;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private HorarioTrabalhoRepository horarioTrabalhoRepository;

    @Autowired
    private BarbeiroRepository barbeiroRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto){
        //Valida se o cliente Existe 
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        //Valida se o barbeiro existe e está ativo
        Barbeiro barbeiro = barbeiroRepository.findById(dto.barbeiroId())
                                           .orElseThrow(() -> new ResourceNotFoundException("Barbeiro não encontrado ou Inativo"));

        //Valida se o serviço existe 
        Servico servico = servicoRepository.findById(dto.servicoId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        //Valida se o barbeiro está disponivel no horario desejado                                        
        validarDisponibilidade(barbeiro, dto.dataAgendada(), null);
        
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setBarbeiro(barbeiro);
        agendamento.setServico(servico);
        agendamento.setDataAgendada(dto.dataAgendada());
        agendamento.setValor(servico.getPreco());
        agendamento.setStatusPagamento(StatusPagamento.PENDENTE);

        Agendamento salvo = agendamentoRepository.save(agendamento);
        
        return convertToDTO(salvo);
    }

    public List<AgendamentoResponseDTO> buscarTodosAgendamentos(){
        return agendamentoRepository.findAll()
                                    .stream()
                                    .map(this::convertToDTO)
                                    .collect(Collectors.toList());
    }

    public List<AgendamentoResponseDTO> buscarAgendamentoPorData(LocalDateTime dataAgendamento){
        return agendamentoRepository.findAllByDate(dataAgendamento)
                                    .stream()
                                    .map(this::convertToDTO)
                                    .collect(Collectors.toList());  
    }

    public Optional<AgendamentoResponseDTO> buscarAgendamentoPorId(Integer id){
       return agendamentoRepository.findById(id)
                                    .map(this::convertToDTO);
    }

    public AgendamentoResponseDTO atualizarAgendamento(Integer id, AgendamentoRequestDTO dto){
        //Recupera o agendamento existente ou retorna uma exception
        Agendamento agendamentoExistente = agendamentoRepository.findById(id)
                                                                 .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado"));

        //Valida se houve mudança no horario ou barbeiro                                                                 
        boolean alterouBarbeiro = !agendamentoExistente.getBarbeiro().getBarbeiroId().equals(dto.barbeiroId());                                                                 
        boolean alterouData = !agendamentoExistente.getDataAgendada().equals(dto.dataAgendada());
        
        
        //Valida se o barbeiro foi alterado
        if (alterouBarbeiro || alterouData){
            Barbeiro barbeiroAtualizado = barbeiroRepository.findById(dto.barbeiroId())
                                                            .orElseThrow(() -> new ResourceNotFoundException("Barbeiro não encontrado ou Inativo"));

            //Valida a disponibilidade do barbeiro no novo horario
            validarDisponibilidade(barbeiroAtualizado, dto.dataAgendada(), id);

            agendamentoExistente.setBarbeiro(barbeiroAtualizado);
            agendamentoExistente.setDataAgendada(dto.dataAgendada());
        } 

        // 3. Verifica se houve mudança no Cliente
        if (!agendamentoExistente.getCliente().getClienteId().equals(dto.clienteId())) {
            Cliente novoCliente = clienteRepository.findById(dto.clienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));
            agendamentoExistente.setCliente(novoCliente);
        }

        //Valida se o servico foi alterado
        if (dto.servicoId() != null){
            Servico novoServico = servicoRepository.findById(dto.servicoId())
                                              .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

            agendamentoExistente.setServico(novoServico);
            agendamentoExistente.setValor(novoServico.getPreco());
        }


        Agendamento atualizado = agendamentoRepository.save(agendamentoExistente);

        return convertToDTO(atualizado);
    }

    public AgendamentoResponseDTO pagarAgendamento(Integer agendamentoId, FormaPagamento formaPagamento){
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                                                       .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado."));
        
        if (agendamento.getStatusPagamento() == StatusPagamento.PAGO  || agendamento.getStatusPagamento() == StatusPagamento.CANCELADO){
            throw new BusinesRuleException("Este agendamento já foi pago ou cancelado");
        }
        
        agendamento.setStatusPagamento(StatusPagamento.PAGO);
        agendamento.setFormaPagamento(formaPagamento);
        agendamento.setDataPagamento(LocalDateTime.now());

        return convertToDTO(agendamentoRepository.save(agendamento));
    }

    public AgendamentoResponseDTO cancelarAgendamento(Integer agendamentoId){
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                                                       .orElseThrow(() -> new ResourceNotFoundException("Agendamento não encontrado!"));

        if (agendamento.getStatusPagamento() == StatusPagamento.PAGO){
            throw new BusinesRuleException("Não é possivel cancelar um agendamento já pago.");
        }                                                       

        agendamento.setStatusPagamento(StatusPagamento.CANCELADO);
        
        return convertToDTO(agendamentoRepository.save(agendamento));
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

    private void validarDisponibilidade(Barbeiro barbeiro, LocalDateTime dataAgendada, Integer agendamentoIdIgnorado) {
        // 1. Conflito de Agendamento
        Optional<Agendamento> conflito = agendamentoRepository.findByBarbeiroAndDataAgendada(barbeiro, dataAgendada);
        if (conflito.isPresent() && !conflito.get().getAgendamentoId().equals(agendamentoIdIgnorado)) {
            throw new BusinesRuleException("Este barbeiro já possui um agendamento neste horário");
        }

        // Valida o turno   
        DayOfWeek diaJava = dataAgendada.getDayOfWeek();
        LocalTime horaAgendamento = dataAgendada.toLocalTime();

        DiaSemana diaEnum;
        try {
            diaEnum = DiaSemana.valueOf(diaJava.name());
        } catch (IllegalArgumentException e) {
            diaEnum = converterDiaSemana(diaJava);
        }

        List<HorarioTrabalho> horariosTrabalhos = horarioTrabalhoRepository.findByBarbeiroAndDiaSemanaAndAtivo(barbeiro, diaEnum, true);

        if (horariosTrabalhos.isEmpty()) {
            throw new BusinesRuleException("O barbeiro não trabalha neste dia da semana.");
        }

        boolean dentroDoHorario = false;
        for (HorarioTrabalho turno : horariosTrabalhos) {
            LocalTime inicioTurno = turno.getHoraInicio();
            LocalTime fimTurno = turno.getHoraFim();

            if ((horaAgendamento.equals(inicioTurno) || horaAgendamento.isAfter(inicioTurno)) && horaAgendamento.isBefore(fimTurno)) {
                dentroDoHorario = true;
                break;
            }
        }

        if (!dentroDoHorario) {
            throw new BusinesRuleException("O barbeiro não atende neste horário");
        }
    }

    private AgendamentoResponseDTO convertToDTO(Agendamento agendamento) {
        return new AgendamentoResponseDTO(
            agendamento.getAgendamentoId()
           ,agendamento.getCliente()         .getClienteId()
           ,agendamento.getCliente()         .getNome()
           ,agendamento.getServico()         .getServicoId()
           ,agendamento.getServico()         .getNome()
           ,agendamento.getBarbeiro()        .getBarbeiroId()
           ,agendamento.getBarbeiro()        .getNome()
           ,agendamento.getStatusPagamento()
           ,agendamento.getDataAgendada()
           ,agendamento.getValor()
           ,agendamento.getFormaPagamento()
        );
    }
}
