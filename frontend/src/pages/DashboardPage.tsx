import { PlusOutlined, TrophyOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Statistic, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../store/useAppStore';

const COLORS = ['#52c41a', '#1890ff', '#faad14', '#722ed1'];

const DashboardPage = () => {
    const { user, achievements, stats, fetchDashboardData, addAchievement } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Загружаем данные при монтировании
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

    // Добавление достижения
    const handleAddAchievement = async (values: any) => {
        try {
            await addAchievement({
                ...values,
                date: values.date.format('YYYY-MM-DD')
            });
            message.success('Достижение добавлено!');
            setIsModalOpen(false);
            form.resetFields();
        } catch (err: any) {
            message.error(err.message || 'Ошибка сохранения');
        }
    };

    return (
        <div>
            {/* Приветствие */}
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

            {/* Кнопка добавления + Диаграмма */}
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

            {/* Модальное окно добавления */}
            <Modal
                title="Новое достижение"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddAchievement} layout="vertical">
                    <Form.Item name="title" label="Название" rules={[{ required: true }]}>
                        <Input placeholder="Например: Победитель олимпиады" />
                    </Form.Item>

                    <Form.Item name="level" label="Уровень" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="региональный">🏙️ Региональный</Select.Option>
                            <Select.Option value="федеральный">🇷🇺 Федеральный</Select.Option>
                            <Select.Option value="международный">🌍 Международный</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="date" label="Дата" rules={[{ required: true }]}>
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