import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from '../../services/api';
import { THEME } from '../../constants/theme';
import { styles } from './style';

export function EsqueceuSenhaScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRecover = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, insira seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      Alert.alert("Sucesso", "Se o e-mail estiver cadastrado, você receberá instruções de recuperação.");
      router.replace('/'); // Volta para a tela de Login (root)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao processar solicitação.';
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ width: '100%' }}>
        <View style={styles.card}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.description}>Informe seu e-mail para receber o link de redefinição.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="exemplo@email.com"
            placeholderTextColor={THEME.COLORS.TEXT_SECONDARY}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleRecover} disabled={loading}>
            {loading ? <ActivityIndicator color={THEME.COLORS.WHITE} /> : <Text style={styles.buttonText}>Enviar Link</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
            <Text style={styles.backButtonText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}