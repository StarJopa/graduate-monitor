import { UserAddOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';

const AddUserForm = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/v1/users', values);
            message.success(`Пользователь ${res.data.full_name} успешно создан`);
            form.resetFields();
        } catch (err: any) {
            const msg = err.response?.data?.detail || 'Ошибка сервера';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Добавить пользователя" style={{ maxWidth: 500, margin: '20px auto' }}>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{ is_active: true }}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Введите email' },
                        { type: 'email', message: 'Некорректный формат email' }
                    ]}
                >
                    <Input placeholder="example@college.ru" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Пароль"
                    rules={[
                        { required: true, message: 'Введите пароль' },
                        { min: 8, message: 'Минимум 8 символов' }
                    ]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                    name="full_name"
                    label="ФИО"
                    rules={[{ required: true, message: 'Введите ФИО' }]}
                >
                    <Input placeholder="Иванов Иван Иванович" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<UserAddOutlined />}>
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddUserForm;