import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Estilos de Mantine
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Importación de componentes
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Registrar } from './pages/Registrar';
import { MainLayout } from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios'; 
import { getCurrentUser } from './services/auth';

// Tema personalizado
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
});

// Componente de Ruta Protegida
const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Componente de Ruta Pública
const PublicRoute = ({ children }) => {
  const user = getCurrentUser();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="app-container">

    <MantineProvider theme={theme}>
      <Notifications position="top-right" zIndex={2000} />
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          <Route 
            path="/registrar" 
            element={
              <PublicRoute>
                <Registrar />
              </PublicRoute>
            } 
          />

          {/* Rutas Protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/usuarios" 
            element={
              <PrivateRoute requiredRoles={['super_admin', 'administrador', 'microempresa_P']}>
                <Usuarios />
              </PrivateRoute>
            } 
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
    </div>

  );
}

export default App;