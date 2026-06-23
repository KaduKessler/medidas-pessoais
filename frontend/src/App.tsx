import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { isAuthenticated } from './lib/auth';
import { CadastroPage } from './pages/CadastroPage';
import { CodigoAcessoPage } from './pages/CodigoAcessoPage';
import { FormularioMedidasPage } from './pages/FormularioMedidasPage';
import { LoginPage } from './pages/LoginPage';
import { LojaDemoPage } from './pages/LojaDemoPage';
import { PainelPage } from './pages/PainelPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? '/painel' : '/login'} replace />}
        />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loja" element={<LojaDemoPage />} />
        <Route
          path="/painel"
          element={
            <ProtectedRoute>
              <PainelPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medidas/editar"
          element={
            <ProtectedRoute>
              <FormularioMedidasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/codigo-acesso"
          element={
            <ProtectedRoute>
              <CodigoAcessoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
