import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

import PrivateRoute from './privateRoutes';
import Clientes from '../pages/clientes/clientes';
import Login from '../pages/login/login';
import Home from '../pages/home/home';
import Servicos from '../pages/servicos/servicos';
import Barbeiros from '../pages/barbeiro/barbeiro';
import Agendamentos from '../pages/agendamentos/agendamentos';
// import Perfis from '../pages/perfil/perfil';
import MenuLateral from '../pages/menuLateral/menuLateral';
import Usuario from '../pages/usuario/usuario';
import Fila from '../pages/fila/fila';
import Pagamentos from '../pages/pagamentos/pagamentos';
import ClientePagamentos from '../pages/pagamentos/clientePagamentos';
import LandingPage from '../pages/landinpage/landinpage';

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/landinpage" element={<LandingPage />} />
          
          {/* Rotas acessíveis a todos os usuários autenticados */}
          <Route path="/home" element={<PrivateRoute element={Home} />}/>
          
          {/* Fila de Atendimentos: Todos podem ver */}
          <Route path="/fila" element={
            <PrivateRoute 
              element={Fila} 
              allowedProfiles={['ADMIN', 'GERENTE', 'ATENDENTE', 'BARBEIRO']} 
            />
          } />
          
          {/* Agendamentos: Todos podem ver, mas com funcionalidades diferentes */}
          <Route path="/agendamentos" element={
            <PrivateRoute 
              element={Agendamentos} 
              allowedProfiles={['ADMIN', 'GERENTE', 'ATENDENTE', 'BARBEIRO']} 
            />
          } />
          
          {/* Clientes: ADMIN, GERENTE e ATENDENTE */}
          <Route path="/clientes" element={
            <PrivateRoute 
              element={Clientes} 
              allowedProfiles={['ADMIN', 'GERENTE', 'ATENDENTE']} 
            />
          } />
          
          {/* Barbeiros: Apenas ADMIN e GERENTE */}
          <Route path="/barbeiros" element={
            <PrivateRoute 
              element={Barbeiros} 
              allowedProfiles={['ADMIN', 'GERENTE']} 
            />
          } />
          
          {/* Serviços: Apenas ADMIN e GERENTE */}
          <Route path="/servicos" element={
            <PrivateRoute 
              element={Servicos} 
              allowedProfiles={['ADMIN', 'GERENTE']} 
            />
          } />
          
          {/* Usuários: Apenas ADMIN */}
          <Route path="/usuario" element={
            <PrivateRoute 
              element={Usuario} 
              allowedProfiles={['ADMIN']} 
            />
          } />
          
          {/* Rota de Perfis removida, perfil agora é gerenciado no usuário */}

          {/* Pagamentos: ADMIN, GERENTE, ATENDENTE */}
          <Route path="/pagamentos" element={
            <PrivateRoute 
              element={Pagamentos} 
              allowedProfiles={['ADMIN', 'GERENTE', 'ATENDENTE']} 
            />
          } />
          <Route path="/pagamentos/cliente/:id" element={
            <PrivateRoute 
              element={ClientePagamentos} 
              allowedProfiles={['ADMIN', 'GERENTE', 'ATENDENTE']} 
            />
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;