import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Carrega os dados do usuário do localStorage ao iniciar
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('usuario');
                const authToken = localStorage.getItem('authToken');
                
                if (storedUser && authToken) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                localStorage.removeItem('usuario');
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('usuario', JSON.stringify(userData));
        localStorage.setItem('authToken', 'authenticated');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('authToken');
    };

    const hasPermission = (allowedProfiles) => {
        if (!user || !user.perfil) return false;
        if (!allowedProfiles || allowedProfiles.length === 0) return true;
        
        // Obtém o perfil do usuário (pode ser objeto ou string)
        const userProfile = user.perfil.nomePerfil || user.perfil;
        
        // Normaliza para maiúsculas para comparação (case-insensitive)
        const normalizedUserProfile = userProfile.toUpperCase();
        
        // Mapeia perfis comuns (aceita variações)
        const profileMap = {
            'ADMINISTRADOR': 'ADMIN',
            'ADMIN': 'ADMIN',
            'GERENTE': 'GERENTE',
            'ATENDENTE': 'ATENDENTE',
            'BARBEIRO': 'BARBEIRO'
        };
        
        // Obtém o perfil normalizado do usuário
        const mappedUserProfile = profileMap[normalizedUserProfile] || normalizedUserProfile;
        
        // Verifica se o perfil está na lista permitida (comparação case-insensitive)
        return allowedProfiles.some(profile => {
            const normalizedAllowed = profile.toUpperCase();
            const mappedAllowed = profileMap[normalizedAllowed] || normalizedAllowed;
            return mappedAllowed === mappedUserProfile;
        });
    };

    const value = {
        user,
        loading,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
