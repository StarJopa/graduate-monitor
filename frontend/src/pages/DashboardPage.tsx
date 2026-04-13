import { PlusOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Statistic, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../store/useAppStore';

const COLORS = ['#52c41a', '#1890ff', '#faad14', '#722ed1'];

const DashboardPage = () => {
    // === ДЕСТРУКТУРИЗАЦИЯ ИЗ STORE ===
    const { user, achievements, stats, fetchDashboardData, addAchievement } = useAppStore();

    // === ЛОКАЛЬНЫЕ STATE И ФОРМА ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Данные для круговой диаграммы
    const chartData = Object.entries(stats.by_level).map(([level, count], i) => ({
        name: level,
        value: count,
        color: COLORS[i % COLORS.length]
    }));

    // Колонки таблицы достижений
    const columns = [
        { title: 'Название', dataIndex: 'title', key: 'title' },
        {
            title: 'Уровень',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => (
                <Tag color={level === 'международный' ? 'purple' : level === 'федеральный' ? 'blue' : 'green'}>
                    {level}
                </Tag>
            )
        },
        { title: 'Дата', dataIndex: 'date', key: 'date' },
        { title: 'Описание', dataIndex: 'description', key: 'description', ellipsis: true }
    ];

    // === ОБРАБОТЧИК ДОБАВЛЕНИЯ ДОСТИЖЕНИЯ ===
    const handleAddAchievement = async (values: any) => {
        try {
            await addAchievement({
                title: values.title,
                level: values.level,
                description: values.description,
                date: values.date // Input type="date" возвращает "YYYY-MM-DD"
            });

            message.success('✅ Достижение успешно добавлено!');
            setIsModalOpen(false);
            form.resetFields();
            fetchDashboardData(); // Обновляем данные с сервера
        } catch (err: any) {
            console.error('❌ Ошибка добавления:', err);

            const detail = err.response?.data?.detail;
            let errorMsg = 'Ошибка сохранения данных';

            if (detail) {
                if (Array.isArray(detail)) {
                    errorMsg = detail.map((e: any) => `${e.loc?.join('.')} → ${e.msg}`).join('; ');
                } else {
                    errorMsg = typeof detail === 'string' ? detail : JSON.stringify(detail);
                }
            }
            message.error(`❌ ${errorMsg}`);
        }
    };

    return (
        <div>
            {/* Приветствие с ФИО */}
            <Card style={{ marginBottom: 24 }}>
                <h2>
                    👋 Добро пожаловать, {user?.full_name || user?.email || 'Пользователь'}!
                </h2>
                <p>Здесь вы можете отслеживать свои профессиональные достижения.</p>
            </Card>

            {/* Статистика */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Всего достижений"
                            value={stats.total_achievements}
                            prefix={<TrophyOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Региональный уровень" value={stats.by_level['региональный'] || 0} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Федеральный уровень" value={stats.by_level['федеральный'] || 0} />
                    </Card>
                </Col>
            </Row>

            {/* Кнопка добавления + Таблица + Диаграмма */}
            <Row gutter={24}>
                <Col span={16}>
                    <Card
                        title="Мои достижения"
                        extra={
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                                Добавить
                            </Button>
                        }
                    >
                        <Table
                            dataSource={achievements}
                            columns={columns}
                            rowKey="id"
                            pagination={false}
                            locale={{ emptyText: 'Пока нет достижений. Добавьте первое!' }}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Распределение по уровням">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    nameKey="name"
                                    label
                                >
                                    {chartData.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Модальное окно добавления достижения */}
            <Modal
                title="Новое достижение"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <Form form={form} onFinish={handleAddAchievement} layout="vertical">
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
                        <Input placeholder="Например: Победитель олимпиады" />
                    </Form.Item>

                    <Form.Item name="level" label="Уровень" rules={[{ required: true, message: 'Выберите уровень' }]}>
                        <Select placeholder="Выберите уровень">
                            <Select.Option value="региональный">🏙️ Региональный</Select.Option>
                            <Select.Option value="федеральный">🇷🇺 Федеральный</Select.Option>
                            <Select.Option value="международный">🌍 Международный</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="date" label="Дата" rules={[{ required: true, message: 'Выберите дату' }]}>
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item name="description" label="Описание">
                        <Input.TextArea rows={3} placeholder="Краткое описание достижения" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DashboardPage;