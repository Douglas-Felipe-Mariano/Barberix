import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web' || (typeof window !== 'undefined' && !!(window as any).localStorage);

const storage = {
  getItem: async (key: string) => {
    if (isWeb) {
      try { return Promise.resolve(localStorage.getItem(key)); } catch { return null; }
    }
    try { return await SecureStore.getItemAsync(key); } catch { return null; }
  },
  setItem: async (key: string, value: string) => {
    if (isWeb) {
      try { localStorage.setItem(key, value); return; } catch { return; }
    }
    try { await SecureStore.setItemAsync(key, value); } catch { return; }
  },
  deleteItem: async (key: string) => {
    if (isWeb) {
      try { localStorage.removeItem(key); return; } catch { return; }
    }
    try { await SecureStore.deleteItemAsync(key); } catch { return; }
  }
};

type User = any;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (allowedProfiles?: string[]) => boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await storage.getItem('usuario');
        const token = await storage.getItem('authToken');
        if (stored && token) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Erro ao carregar usuário seguro:', err);
        await storage.deleteItem('usuario');
        await storage.deleteItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    try {
      await storage.setItem('usuario', JSON.stringify(userData));
      await storage.setItem('authToken', 'authenticated');
    } catch (err) {
      console.error('Erro ao salvar credenciais:', err);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await storage.deleteItem('usuario');
      await storage.deleteItem('authToken');
    } catch (err) {
      console.error('Erro ao limpar credenciais:', err);
    }
  };

  const hasPermission = (allowedProfiles?: string[]) => {
    if (!user || !user.perfil) return false;
    if (!allowedProfiles || allowedProfiles.length === 0) return true;

    const userProfile = user.perfil.nomePerfil || user.perfil;
    const normalizedUserProfile = String(userProfile).toUpperCase();

    const profileMap: Record<string, string> = {
      'ADMINISTRADOR': 'ADMIN',
      'ADMIN': 'ADMIN',
      'GERENTE': 'GERENTE',
      'ATENDENTE': 'ATENDENTE',
      'BARBEIRO': 'BARBEIRO'
    };

    const mappedUserProfile = profileMap[normalizedUserProfile] || normalizedUserProfile;

    return allowedProfiles.some(profile => {
      const normalizedAllowed = profile.toUpperCase();
      const mappedAllowed = profileMap[normalizedAllowed] || normalizedAllowed;
      return mappedAllowed === mappedUserProfile;
    });
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};


