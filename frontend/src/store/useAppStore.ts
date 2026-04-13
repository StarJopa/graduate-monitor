import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
}

export interface Achievement {
    id: number;
    title: string;
    date: string;
    level: 'региональный' | 'федеральный' | 'международный';
    description: string | null;
}

interface AppState {
    // Auth state
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;

    // Dashboard data
    achievements: Achievement[];
    stats: {
        total_achievements: number;
        by_level: Record<string, number>;
    };

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, full_name: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    fetchDashboardData: () => Promise<void>;
    addAchievement: (data: { title: string; date: string; level: string; description?: string }) => Promise<void>;
}

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            isAuthenticated: false,
            isLoading: true,
            user: null,
            token: null,
            achievements: [],
            stats: { total_achievements: 0, by_level: {} },

            // Авторизация
            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const formData = new URLSearchParams();
                    formData.append('username', email);
                    formData.append('password', password);

                    // 1. Получаем токен
                    const res = await axios.post(`${API_BASE}/auth/login`, formData, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                    const { access_token } = res.data;
                    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

                    // 2. Запрашиваем профиль с ФИО
                    const userRes = await axios.get<User>(`${API_BASE}/users/me`);

                    // 3. Сохраняем всё в стейт
                    set({
                        isAuthenticated: true,
                        isLoading: false,
                        user: userRes.data,
                        token: access_token
                    });
                } catch (err: any) {
                    set({ isLoading: false });
                    throw new Error(err.response?.data?.detail || 'Ошибка входа');
                }
            },

            // Регистрация
            register: async (email: string, password: string, full_name: string) => {
                set({ isLoading: true });
                try {
                    await axios.post(`${API_BASE}/auth/register`, { email, password, full_name });
                    set({ isLoading: false });
                } catch (err: any) {
                    set({ isLoading: false });
                    throw new Error(err.response?.data?.detail || 'Ошибка регистрации');
                }
            },

            // Выход
            logout: () => {
                delete axios.defaults.headers.common['Authorization'];
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    achievements: [],
                    stats: { total_achievements: 0, by_level: {} }
                });
            },

            // Проверка токена при загрузке
            checkAuth: () => {
                const token = get().token;
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    set({ isAuthenticated: true, isLoading: false });
                } else {
                    set({ isLoading: false });
                }
            },

            // Загрузка данных дашборда (ТОЛЬКО для текущего пользователя)
            fetchDashboardData: async () => {
                try {
                    const [achievementsRes, statsRes] = await Promise.all([
                        axios.get<Achievement[]>(`${API_BASE}/achievements`),
                        axios.get(`${API_BASE}/analytics/summary`)
                    ]);

                    set({
                        achievements: achievementsRes.data,
                        stats: statsRes.data
                    });
                } catch (err) {
                    console.error('Failed to fetch dashboard data:', err);
                }
            },

            // Добавление достижения
            addAchievement: async (data) => {
                const res = await axios.post(`${API_BASE}/achievements`, data);
                const newAch = res.data;

                set(state => ({
                    achievements: [...state.achievements, newAch],
                    stats: {
                        ...state.stats,
                        total_achievements: state.stats.total_achievements + 1,
                        by_level: {
                            ...state.stats.by_level,
                            [data.level]: (state.stats.by_level[data.level] || 0) + 1
                        }
                    }
                }));
            },
        }),
        {
            name: 'graduate-monitor-auth',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);