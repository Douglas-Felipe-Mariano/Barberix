package com.barbearia.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbearia.model.Servico;
import com.barbearia.repository.ServicoRepository;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    public Servico cadastraServico(Servico servico){
        Optional<Servico> servicoExistente = servicoRepository.findByNome(servico.getNome());

        if (servicoExistente.isPresent()){
            throw new RuntimeException("Um serviço com esse nome já está cadastrado");
        }

        return servicoRepository.save(servico);
    }

    public List<Servico> buscarTodosServicos(){
        return servicoRepository.findAll();
    }

    public Optional<Servico> buscaServicoPorId(Integer id){
        return servicoRepository.findById(id);
    }

    public Servico atualizaServico(Integer id, Servico detalheServico){
        Servico servicoExistente = servicoRepository.findById(id)
                                                    .orElseThrow(() -> new RuntimeException("Serviço com o id " +id+ " não encontrado"));
        if (detalheServico.getNome() != null){
            //Valida se o nome ja existe, ou se é o mesmo nome do serviço a ser atualizado
            Optional<Servico> verificaNome = servicoRepository.findByNome(detalheServico.getNome());
            if (verificaNome.isPresent() && !verificaNome.get().getServicoId().equals(servicoExistente.getServicoId())){
                throw new RuntimeException("Nome de serviço já cadastrado");
            }
            servicoExistente.setNome(detalheServico.getNome()); 
        }

        if (detalheServico.getDuracaoMinutos() != null){
            servicoExistente.setDuracaoMinutos(detalheServico.getDuracaoMinutos());
        }

        if (detalheServico.getPreco() != null){
            servicoExistente.setPreco(detalheServico.getPreco());
        }

        return servicoRepository.save(servicoExistente);
    }
        
    

    public void deletarServico(Integer id){
        if (!servicoRepository.existsById(id)){
            throw new RuntimeException("Serviço com o id: " +id+ " não encontrado");
        }
        
        servicoRepository.deleteById(id);
    }


}
