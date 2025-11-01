// frontEnd/src/App.tsx

import { useState, useEffect } from 'react';
import api from './services/api';
import { Routes, Route, Link } from 'react-router';

import { HomePage } from './pages/HomePage';
import { AgendamentoPage } from './pages/AgendamentoPage';

function App() {
  return (
    <div>
      {/* --- 3. NAVEGAÇÃO (CABEÇALHO) --- */}
      {/* Esta será a nossa barra de navegação simples */}
      <header>
        <h1>Barberix</h1>
        <nav>
          {/* O componente <Link> é o "<a>" (link) do React Router. */}
          <Link to="/">Página Inicial</Link> | <Link to="/agendar">Fazer Agendamento</Link>
        </nav>
      </header>
      
      <hr /> {/* Uma linha horizontal para separar */}

      {/* --- 4. ÁREA DA PÁGINA ATUAL --- */}
      {/* O <Routes> define onde o conteúdo da página deve aparecer */}
      <main>
        <Routes>
          {/* A <Route> define qual URL carrega qual Componente */}
          <Route path="/" element={<HomePage />} />
          <Route path="/agendar" element={<AgendamentoPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;