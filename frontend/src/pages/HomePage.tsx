import { FileTextOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { name: 'Трудоустроено', value: 65 },
    { name: 'Продолжают обучение', value: 20 },
    { name: 'Ищут работу', value: 15 },
];
const COLORS = ['#52c41a', '#1890ff', '#faad14'];

const HomePage = () => (
    <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}><Card><Statistic title="Выпускников 2025" value={142} prefix={<UserOutlined />} /></Card></Col>
            <Col span={8}><Card><Statistic title="Достижений" value={89} prefix={<TrophyOutlined />} /></Card></Col>
            <Col span={8}><Card><Statistic title="Отчетов" value={12} prefix={<FileTextOutlined />} /></Card></Col>
        </Row>
        <Card title="Статус трудоустройства">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                        {data.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    </div>
);

export default HomePage;