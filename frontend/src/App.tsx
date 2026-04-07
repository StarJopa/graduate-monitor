import { Layout, Typography } from 'antd';
import HomePage from './pages/HomePage.tsx';

const { Header, Content, Footer } = Layout;

const App = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Header style={{ background: '#fff', padding: '0 24px' }}>
      <Typography.Title level={3} style={{ margin: '12px 0' }}>
        Мониторинг выпускников
      </Typography.Title>
    </Header>
    <Content style={{ padding: '24px', background: '#f5f5f5' }}>
      <HomePage />
    </Content>
    <Footer style={{ textAlign: 'center' }}>Курсовой проект © {new Date().getFullYear()}</Footer>
  </Layout>
);

export default App;