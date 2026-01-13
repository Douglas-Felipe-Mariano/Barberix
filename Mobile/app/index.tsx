import { View, Text } from "react-native";
import { styles } from "./style";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barbearia 💈</Text>
      <Text style={styles.subtitle}>
        Seu agendamento na palma da mão
      </Text>
    </View>
  );
}
