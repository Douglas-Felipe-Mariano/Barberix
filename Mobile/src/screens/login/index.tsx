import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from '../../services/api';
import { useAuth } from '../../hooks/useAuth'; 
import { THEME } from '../../constants/theme';
import { styles } from './style';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, senha });
      
      const userData = {
        usuarioId: response.data.usuarioId,
        email: response.data.email,
        perfil: response.data.perfil
      };

      login(userData);
      router.replace('/home'); 

    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao conectar com o servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView impede que o teclado cubra os inputs no iPhone/Android
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} style={{ width: '100%' }}>
        <View style={styles.card}>
          <Text style={styles.title}>BARBERIX</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            placeholderTextColor={THEME.COLORS.TEXT_SECONDARY}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            placeholderTextColor={THEME.COLORS.TEXT_SECONDARY}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={THEME.COLORS.WHITE} />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>
          <View style={styles.linkRow}>
            <TouchableOpacity onPress={() => router.push('/esqueceuSenha')}>
              <Text style={styles.linkText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/registrese')}>
              <Text style={styles.linkText}>Registre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}