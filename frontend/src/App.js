// src/App.js

// Importe apenas o que é necessário, o 'useState' não é mais preciso
import React from 'react'; 
import AppRoutes from './routes/routes';
import './App.css'; 

function App() {
  // A lógica de modo escuro está toda no App.css (:root)

  return (
    // Não precisa de classes dinâmicas aqui, apenas a classe base 'App'
    <div className="App">
      
      {/* O botão de alternância (e sua lógica) foi removido */}

      <AppRoutes /> 
    </div>
  );
}

export default App;