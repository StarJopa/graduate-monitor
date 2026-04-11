import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAppStore();
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            // Экшен login уже настроен на отработку form-urlencoded и сохранение токена
            await login(values.email, values.password);
            message.success('Добро пожаловать!');
            navigate('/dashboard');
        } catch (err: any) {
            const msg = err.message || 'Неверный email или пароль';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Card title="Вход в систему" style={{ width: 400 }}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Введите email' },
                            { type: 'email', message: 'Некорректный формат' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Войти
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;