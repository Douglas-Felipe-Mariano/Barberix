import { View, Text } from 'react-native';
import { THEME } from '../src/constants/theme';

export default function Home() {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: THEME.COLORS.BACKGROUND_BODY, 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <Text style={{ color: THEME.COLORS.TEXT_PRIMARY, fontSize: 20 }}>
        Bem-vindo à Home!
      </Text>
    </View>
  );
}