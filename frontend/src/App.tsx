import { Layout, Spin, Typography } from 'antd';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { useAppStore } from './store/useAppStore';

const { Header, Content, Footer } = Layout;

// Защищённый маршрут: редирект на логин, если не авторизован
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAppStore();

  if (isLoading) return <Spin fullscreen tip="Проверка сессии..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  const { checkAuth } = useAppStore();

  // При загрузке приложения проверяем, есть ли валидный токен
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Мониторинг выпускников
        </Typography.Title>
        <AuthHeader />
      </Header>

      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Защищённые маршруты */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Редирект по умолчанию */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Курсовой проект © {new Date().getFullYear()} • ГБПОУ «Царицыно»
      </Footer>
    </Layout>
  );
};

// Компонент шапки с кнопкой выхода
const AuthHeader = () => {
  const { user, logout } = useAppStore();
  if (!user) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Typography.Text>👤 {user.full_name || user.email}</Typography.Text>
      <a onClick={logout}>Выйти</a>
    </div>
  );
};

export default App;