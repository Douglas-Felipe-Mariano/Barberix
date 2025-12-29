package com.barbearia.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.barbearia.exception.BusinesRuleException;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public void enviarEmailRecuperacao(String destinatario, String token) {
        try{
            SimpleMailMessage mensagem = new SimpleMailMessage();

            mensagem.setFrom(remetente);
            mensagem.setTo(destinatario); 
            mensagem.setSubject("Recuperação de senha - Barberix");

            String linkRecuperacao = "http://localhost:3000/reset-password?token=" + token;

            String corpoEmail = String.format(
                "Olá,\n\nRecebemos uma solicitação de recuperação de senha para este e-mail. " +
                "Clique no link abaixo para redefinir sua senha (válido por 1 hora):\n\n" +
                "%s\n\n" +
                "Se você não solicitou a recuperação, ignore este e-mail.\n\n" +
                "Atenciosamente,\nEquipe Barberix",
                linkRecuperacao
            );
            mensagem.setText(corpoEmail);
            mailSender.send(mensagem);
            
        }catch (MailException e){
            throw new BusinesRuleException("Falha ao enviar e-mail de recuperação. Verifique as configurações de SMTP.");
        }
    }

}
