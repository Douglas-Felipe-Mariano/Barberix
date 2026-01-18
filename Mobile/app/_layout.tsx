// app/_layout.tsx
import { Slot } from 'expo-router';
import { View } from 'react-native';
import { THEME } from '../src/constants/theme';
import { AuthProvider } from '../src/hooks/useAuth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: THEME.COLORS.BACKGROUND_BODY }}>
        <Slot />
      </View>
    </AuthProvider>
  );
}