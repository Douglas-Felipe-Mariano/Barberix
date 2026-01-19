import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './style';

export function RegistreseScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registre-se</Text>
        <Text style={styles.description}>Em breve aqui vai o formulário de registro.</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
