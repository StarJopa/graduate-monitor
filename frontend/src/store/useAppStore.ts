import { create } from 'zustand';

interface AppState {
    isAuthenticated: boolean;
    userName: string | null;
    setAuth: (name: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isAuthenticated: false,
    userName: null,
    setAuth: (name) => set({ isAuthenticated: !!name, userName: name })
}));