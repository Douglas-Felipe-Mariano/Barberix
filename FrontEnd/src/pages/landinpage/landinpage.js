import React from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaBell, FaUserFriends, FaWhatsapp } from 'react-icons/fa';
import './landinpage.css'

// NOTA: Para funcionar corretamente, você precisará garantir que o arquivo 'landinpage.css' 
// (que contém todas as classes de estilo) esteja importado e acessível neste ambiente.
//
// Para os ícones, estamos usando placeholders de emoji (classe .icon). Em um ambiente React real, 
// você usaria uma biblioteca como 'react-icons' ou Font Awesome.

// Defina o nome do seu sistema aqui
const NOME_DO_SISTEMA = "Barberix";

function LandingPageSaaS() {
    // Estado do menu mobile
    const [menuOpen, setMenuOpen] = React.useState(false);
    function toggleMenu() {
      setMenuOpen((open) => !open);
    }
    // Fecha o menu ao clicar fora
    React.useEffect(() => {
      if (!menuOpen) return;
      function handleClick(e) {
        if (e.target.classList.contains('nav-mobile-overlay')) {
          setMenuOpen(false);
        }
      }
      window.addEventListener('mousedown', handleClick);
      return () => window.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);
    // Estado do formulário
    const [form, setForm] = React.useState({
      barbearia: "",
      nome: "",
      whatsapp: "",
      email: ""
    });
    const [sending, setSending] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [fadeOut, setFadeOut] = React.useState(false);

    // Manipulador de mudança
    function handleChange(e) {
      // Máscara para telefone (WhatsApp)
      if (e.target.name === "whatsapp") {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        let formatted = value;
        if (value.length > 2) {
          formatted = `(${value.slice(0,2)}) ` + value.slice(2);
        }
        if (value.length > 7) {
          formatted = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
          formatted = `(${value.slice(0,2)}) ${value.slice(2)}`;
        }
        setForm({ ...form, whatsapp: formatted });
      } else if (e.target.name === "nome") {
        // Impede números no campo nome
        let value = e.target.value.replace(/[0-9]/g, "");
        setForm({ ...form, nome: value });
      } else {
        setForm({ ...form, [e.target.name]: e.target.value });
      }
    }

    // Manipulador de envio
    function handleSubmit(e) {
      e.preventDefault();
      setSending(true);
      setSuccess(false);
      // Simula envio (substitua por integração real)
      setTimeout(() => {
        setSending(false);
        setSuccess(true);
        setForm({ barbearia: "", nome: "", whatsapp: "", email: "" });
      }, 1500);
    }
  // Ícones profissionais
  const IconeAgenda = <FaCalendarAlt className="feature-icon" />;
  const IconeFinanceiro = <FaMoneyBillWave className="feature-icon" />;
  const IconeLembretes = <FaBell className="feature-icon" />;
  const IconeClientes = <FaUserFriends className="feature-icon" />;
  
  return (
    <div className={`landing-page container${fadeOut ? ' fade-out' : ''}`}> 
      {/* 1. HEADER: Focado no seu Software */}
      <header className="header">
        <div className="logo">
          <h1>{NOME_DO_SISTEMA}</h1>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#features">Funcionalidades</a></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="#testimonials">Depoimentos</a></li>
            <li><a href="#demo" className="cta-button" style={{ padding: '8px 16px', fontSize: '0.9em', marginLeft: '20px' }}>Solicitar Demo</a></li>
            <li><button className="btn-login-header" style={{ padding: '8px 16px', fontSize: '0.9em', marginLeft: '12px', borderRadius: '10px', border: 'none', background: 'var(--color-background-input)', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} onClick={() => {
              setFadeOut(true);
              setTimeout(() => {
                window.location.href = '/';
              }, 400);
            }}>Já sou cliente</button></li>
          </ul>
        </nav>
        {/* Menu Hambúrguer Mobile */}
        <button className={`menu-hamburger${menuOpen ? ' open' : ''}`} onClick={toggleMenu} aria-label="Abrir menu">
          <span className="hamburger-icon">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </span>
        </button>
        {menuOpen && (
          <div className="nav-mobile-overlay">
            <nav className="nav-mobile">
              <ul>
                <li><a href="#features" onClick={toggleMenu}>Funcionalidades</a></li>
                <li><a href="#about" onClick={toggleMenu}>Sobre</a></li>
                <li><a href="#testimonials" onClick={toggleMenu}>Depoimentos</a></li>
                <li><a href="#demo" className="cta-button" style={{ padding: '8px 16px', fontSize: '0.9em', marginLeft: '0' }} onClick={toggleMenu}>Solicitar Demo</a></li>
              </ul>
            </nav>
          </div>
        )}
      </header>
      
      {/* 2. HERO: Focado na dor do dono da barbearia */}
      <section className="hero">
        {/* Título forte focado no problema que você resolve */}
        <h2>Cansado de agenda bagunçada e clientes que não aparecem?</h2>
        <p>Assuma o controle total da sua barbearia com o {NOME_DO_SISTEMA}. O sistema completo de agendamento, financeiro e gestão de clientes.</p>
        {/* O CTA é para testar o sistema */}
        <a href="#demo" className="cta-button">
          Solicitar Demonstração Gratuita
        </a>
      </section>

      {/* 3. FEATURES (antigo "Serviços"): O que o seu sistema FAZ */}
      <section id="features" className="features-section">
        <h2>Tudo que sua barbearia precisa em um só lugar</h2>
        <div className="features-grid">
          {/* Feature 1: Agenda */}
          <div className="feature-card fade-in">
            {IconeAgenda}
            <h3>Agenda Online Inteligente</h3>
            <p>Seus clientes agendam sozinhos 24/7. Chega de atender telefone no meio do corte.</p>
          </div>
          {/* Feature 2: Financeiro */}
          <div className="feature-card fade-in">
            {IconeFinanceiro}
            <h3>Controle Financeiro</h3>
            <p>Saiba exatamente quanto você lucrou no dia, na semana e no mês. Fechamento de caixa em 1 clique.</p>
          </div>
          {/* Feature 3: Lembretes */}
          <div className="feature-card fade-in">
            {IconeLembretes}
            <h3>Lembretes Automáticos</h3>
            <p>Reduza em até 80% as faltas (no-shows) com lembretes automáticos via WhatsApp para seus clientes.</p>
          </div>
          {/* Feature 4: Clientes */}
          <div className="feature-card fade-in">
            {IconeClientes}
            <h3>Cadastro de Clientes</h3>
            <p>Saiba o histórico de cada cliente, quais serviços ele mais gosta e crie campanhas de fidelidade.</p>
          </div>
        </div>
      </section>

      {/* 4. PROVA SOCIAL: Essencial para B2B */}
      <section id="testimonials" className="social-proof-section">
        <h2>Barbearias que confiam no {NOME_DO_SISTEMA}</h2>
        <div className="testimonial-block fade-in">
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Avatar" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)'}} />
            <div>
              <blockquote>
                "Depois que contratei o sistema, minha agenda lotou e as faltas diminuíram. Meu faturamento aumentou 30% no primeiro mês. É o software perfeito para quem leva a sério."
              </blockquote>
              <p>- João, Barbearia Navalha de Ouro</p>
            </div>
          </div>
        </div>
        <div className="testimonial-block fade-in">
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Avatar" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)'}} />
            <div>
              <blockquote>
                "O sistema facilitou demais o controle dos pagamentos e o contato com os clientes. Recomendo para todo mundo que quer profissionalizar a barbearia!"
              </blockquote>
              <p>- Carla, Barbearia Estilo & Arte</p>
            </div>
          </div>
        </div>
        <div className="testimonial-block fade-in">
          <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Avatar" style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)'}} />
            <div>
              <blockquote>
                "Nunca mais perdi cliente por esquecimento! Os lembretes automáticos são sensacionais. Atendimento ficou muito mais organizado."
              </blockquote>
              <p>- Pedro, Barbearia TopCorte</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT (Sobre): Foco em POR QUE seu sistema é melhor */}
      <section id="about" className="about">
        <h2>Feito por quem entende de barbearia</h2>
        <p>Nós não somos apenas programadores. Entendemos a correria do dia a dia. Por isso, criamos um sistema simples, rápido e que funciona 100% no celular. Foque no que você faz de melhor (os cortes), que nós cuidamos da gestão.</p>
      </section>

      {/* 6. CTA / CONTATO: Foco em capturar o LEAD */}
      <section id="demo" className="contact-cta">
        <h2>Quer ver o sistema em ação?</h2>
        <p>Preencha o formulário e um de nossos especialistas entrará em contato para uma demonstração gratuita, sem compromisso.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Peça dados relevantes para a venda */}
          <div className="form-inputs-grid">
            <input type="text" name="barbearia" placeholder="Nome da sua Barbearia" value={form.barbearia} onChange={handleChange} required />
            <input type="text" name="nome" placeholder="Seu nome" value={form.nome} onChange={handleChange} required />
            <input type="tel" name="whatsapp" placeholder="Seu melhor WhatsApp" value={form.whatsapp} onChange={handleChange} required maxLength={16} pattern="\(\d{2}\) \d{5}-\d{4}" />
            <input type="email" name="email" placeholder="Seu email" value={form.email} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-cta" disabled={sending}>{sending ? "Enviando..." : "Quero minha Demonstração"}</button>
          {success && <p style={{color: 'var(--color-success)', marginTop: '15px'}}>Recebido! Em breve entraremos em contato 😊</p>}
        </form>
        <div className="trust-seals">
          <div className="seal">
            <span role="img" aria-label="Seguro" className="seal-icon">🔒</span>
            <span>100% Seguro</span>
          </div>
          <div className="seal">
            <span role="img" aria-label="Suporte" className="seal-icon">💬</span>
            <span>Suporte Dedicado</span>
          </div>
          <div className="seal">
            <span role="img" aria-label="Satisfação" className="seal-icon">⭐</span>
            <span>Satisfação Garantida</span>
          </div>
        </div>
      </section>

      {/* Seção FAQ */}
      <section className="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-list">
          <div className="faq-item">
            <h3>O sistema funciona no celular?</h3>
            <p>Sim! O Barberix foi desenvolvido para funcionar perfeitamente em qualquer dispositivo, seja computador, tablet ou smartphone.</p>
          </div>
          <div className="faq-item">
            <h3>Preciso instalar algum programa?</h3>
            <p>Não. O sistema é 100% online, basta acessar pelo navegador. Não precisa instalar nada.</p>
          </div>
          <div className="faq-item">
            <h3>Como funciona o suporte?</h3>
            <p>Você conta com suporte dedicado via WhatsApp e e-mail, sempre que precisar.</p>
          </div>
          <div className="faq-item">
            <h3>Meus dados estão seguros?</h3>
            <p>Sim! Utilizamos criptografia e boas práticas de segurança para proteger todas as informações da sua barbearia.</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2025 {NOME_DO_SISTEMA}. Todos os direitos reservados.</p>
        <p>
            <a href="#">Termos de Uso</a> | <a href="#">Política de Privacidade</a>
        </p>
      </footer>
      {/* Botão flutuante WhatsApp */}
      <a
        href="https://wa.me/5599999999999?text=Olá!%20Quero%20saber%20mais%20sobre%20o%20Barberix"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <FaWhatsapp style={{ fontSize: '2.2rem' }} aria-label="WhatsApp" />
      </a>
    </div>
  );
}

export default LandingPageSaaS;