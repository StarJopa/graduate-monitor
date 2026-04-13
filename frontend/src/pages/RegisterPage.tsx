import { LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, message } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { register } = useAppStore(); // Теперь используется
    const navigate = useNavigate();

    const onFinish = async (values: { email: string; password: string; full_name: string }) => {
        setLoading(true);
        setError(null);
        try {
            // Вызываем функцию из стора, а не axios напрямую
            await register(values.email, values.password, values.full_name);
            message.success('Регистрация успешна! Теперь войдите в систему.');
            navigate('/login');
        } catch (err: any) {
            const msg = err.message || 'Ошибка регистрации';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Card title="Регистрация выпускника" style={{ width: 400 }}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="full_name"
                        label="ФИО"
                        rules={[{ required: true, message: 'Введите ФИО' }]}
                    >
                        <Input prefix={<UserAddOutlined />} placeholder="Иванов Иван Иванович" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Введите email' },
                            { type: 'email', message: 'Некорректный формат' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="example@college.ru" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[
                            { required: true, message: 'Введите пароль' },
                            { min: 8, message: 'Минимум 8 символов' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Link to="/login">Уже есть аккаунт? Войти</Link>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;