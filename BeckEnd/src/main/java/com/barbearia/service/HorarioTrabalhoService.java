package com.barbearia.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.exception.BusinesRuleException;
import com.barbearia.exception.ResourceNotFoundException;
import com.barbearia.model.Barbeiro;
import com.barbearia.model.HorarioTrabalho;
import com.barbearia.repository.HorarioTrabalhoRepository;

@Service
public class HorarioTrabalhoService {

    @Autowired
    private HorarioTrabalhoRepository horarioTrabalhoRepository;

    @Autowired
    private BarbeiroService barbeiroService;

    public HorarioTrabalho criarHorario(HorarioTrabalho horarioTrabalho){
        //Valida se o barbeiro existe
        Barbeiro barbeiro = barbeiroService.buscarBarbeiroPorId(horarioTrabalho.getBarbeiro().getBarbeiroId())
                                           .orElseThrow(() -> new ResourceNotFoundException("Barbeiro Não Encontrado."));

        //A hora final deve ser maior que a hora inicial
        if (horarioTrabalho.getHoraFim().isBefore(horarioTrabalho.getHoraInicio())){
            throw new BusinesRuleException("A hora final não pode ser anterior à hora inicial");
        }                                

        horarioTrabalho.setBarbeiro(barbeiro); 
        return horarioTrabalhoRepository.save(horarioTrabalho);
    }

    public List<HorarioTrabalho> listarHorariosPorBarbeiro(Integer barbeiroId){
        Barbeiro barbeiro = barbeiroService.buscarBarbeiroPorId(barbeiroId)
                                           .orElseThrow(() -> new ResourceNotFoundException("Barbeiro Não Encontrado."));

        return horarioTrabalhoRepository.findByBarbeiro(barbeiro);                                           
    }

    public HorarioTrabalho atualizarHorario(Integer horarioId, HorarioTrabalho detalheHorario){
        HorarioTrabalho horarioExistente = horarioTrabalhoRepository.findById(horarioId)
                                                                    .orElseThrow(() -> new ResourceNotFoundException("Horario de trabalho não encontrado."));

        //Valida se as horas forma alteradas                                                                    
        LocalTime horaInicio = detalheHorario.getHoraInicio() != null ? detalheHorario.getHoraInicio() : horarioExistente.getHoraInicio();
        LocalTime horaFim    = detalheHorario.getHoraFim()    != null ? detalheHorario.getHoraFim()    : horarioExistente.getHoraFim();
        
        if(horaFim.isBefore(horaInicio)){
            throw new BusinesRuleException("A hora de final não pode ser anterior à hora inicial");
        }

        if(detalheHorario.getDiaSemana() != null){
            horarioExistente.setDiaSemana(detalheHorario.getDiaSemana());
        }

        if(detalheHorario.getHoraInicio() != null){
            horarioExistente.setHoraInicio(horaInicio);
        }
        
        if(detalheHorario.getHoraFim() != null){
            horarioExistente.setHoraFim(horaFim);
        }

        if (detalheHorario.getAtivo() != null) {
            horarioExistente.setAtivo(detalheHorario.getAtivo());
        }

        return horarioTrabalhoRepository.save(horarioExistente);
    }

    public void deletarHorario(Integer horarioId){
        if (!horarioTrabalhoRepository.existsById(horarioId)){
            throw new ResourceNotFoundException("Horario de trabalho não encontrado.");
        }

        horarioTrabalhoRepository.deleteById(horarioId);
    }

}
