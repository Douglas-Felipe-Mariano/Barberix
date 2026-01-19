import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { EsqueceuSenhaScreen } from '../src/screens/esqueceuSenha';

export default function EsqueceuSenha() {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Redirect href="/home" />;
    return <EsqueceuSenhaScreen />;
}