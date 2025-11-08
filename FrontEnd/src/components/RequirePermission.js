import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que renderiza children apenas se o usuário tiver permissão
 * 
 * @example
 * // Mostrar botão apenas para ADMIN
 * <RequirePermission allowedProfiles={['ADMIN']}>
 *   <button>Excluir Tudo</button>
 * </RequirePermission>
 * 
 * @example
 * // Mostrar seção para ADMIN ou GERENTE
 * <RequirePermission allowedProfiles={['ADMIN', 'GERENTE']}>
 *   <div>Conteúdo Restrito</div>
 * </RequirePermission>
 */
export const RequirePermission = ({ children, allowedProfiles = [] }) => {
    const { hasPermission } = useAuth();

    if (!hasPermission(allowedProfiles)) {
        return null;
    }

    return <>{children}</>;
};

/**
 * Componente que renderiza diferentes conteúdos baseado no perfil
 * 
 * @example
 * <ShowByRole 
 *   admin={<AdminPanel />}
 *   gerente={<GerentePanel />}
 *   atendente={<AtendentePanel />}
 *   default={<div>Sem permissão</div>}
 * />
 */
export const ShowByRole = ({ admin, gerente, atendente, barbeiro, defaultContent = null }) => {
    const { user } = useAuth();

    if (!user || !user.perfil) {
        return defaultContent;
    }

    const profileName = (user.perfil.nomePerfil || user.perfil).toUpperCase();
    
    // Mapeia variações de nomes
    const roleMap = {
        'ADMINISTRADOR': 'ADMIN',
        'ADMIN': 'ADMIN',
        'GERENTE': 'GERENTE',
        'ATENDENTE': 'ATENDENTE',
        'BARBEIRO': 'BARBEIRO'
    };
    
    const normalizedRole = roleMap[profileName] || profileName;

    switch (normalizedRole) {
        case 'ADMIN':
            return admin || defaultContent;
        case 'GERENTE':
            return gerente || defaultContent;
        case 'ATENDENTE':
            return atendente || defaultContent;
        case 'BARBEIRO':
            return barbeiro || defaultContent;
        default:
            return defaultContent;
    }
};

export default RequirePermission;
