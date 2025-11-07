import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from './privateRoutes';
import Clientes from '../pages/clientes/clientes';
import Login from '../pages/login/login';
import Home from '../pages/home/home';
import Servicos from '../pages/servicos/servicos';
import Barbeiros from '../pages/barbeiro/barbeiro';
import Agendamentos from '../pages/agendamentos/agendamentos';
import Perfis from '../pages/perfil/perfil';
import MenuLateral from '../pages/menuLateral/menuLateral';
import Usuario from '../pages/usuario/usuario';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/clientes" element={<PrivateRoute element={Clientes} />} />        
        <Route path="/home" element={<PrivateRoute element={Home} />}/>
        <Route path="/servicos" element={<PrivateRoute element={Servicos} />} />
        <Route path="/barbeiros" element={<PrivateRoute element={Barbeiros} />} />
        <Route path="/agendamentos" element={<PrivateRoute element={Agendamentos} />} />
        <Route path="/perfis" element={<PrivateRoute element={Perfis} />} />
        <Route path="/usuario" element={<PrivateRoute element={Usuario} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;