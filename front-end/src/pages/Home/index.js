import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import Button from '../../components/Button';

export default function Home({ navigation }) {

  return (
    <View style={styles.container}>
      <Text>
        Primeiro passo
      </Text>
      <Button handlePress={() => navigation.navigate("Calculator")} buttonText={"Clique aqui"}/>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
