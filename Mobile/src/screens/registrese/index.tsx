import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { THEME } from '../../constants/theme';
import { styles } from './style';

export function RegistreseScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async () => {
    // Validações básicas de frontend
    if (!email || !senha || !confirmSenha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Informe um e-mail válido.');
      return;
    }
    if (senha.length < 8) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      // Enviamos apenas email e senha. 
      // O backend Java deve tratar este endpoint para criar um perfil 'CLIENTE' por padrão.
      const payload = { email, senha };
      await api.post('/api/usuarios/registrar-cliente', payload); 
      
      Alert.alert('Sucesso', 'Conta criada com sucesso! Agora você já pode fazer login.');
      router.replace('/'); // Volta para a tela de login (index)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao conectar com o servidor.';
      Alert.alert('Erro', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
        style={{ width: '100%' }}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.description}>Preencha os dados abaixo para acessar o Barberix.</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={THEME.COLORS.TEXT_SECONDARY}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={THEME.COLORS.TEXT_SECONDARY}
            secureTextEntry
          />

          <Text style={styles.label}>Confirme a Senha</Text>
          <TextInput
            style={styles.input}
            value={confirmSenha}
            onChangeText={setConfirmSenha}
            placeholder="Repita sua senha"
            placeholderTextColor={THEME.COLORS.TEXT_SECONDARY}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={THEME.COLORS.WHITE} />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.replace('/')}
          >
            <Text style={styles.backButtonText}>Já tenho uma conta. Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}