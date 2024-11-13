import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';

export default function Profile({ navigation }) {

  return (
    <View style={styles.container}>
      <Text>
        Aqui será mostrado todos os dados do usuário e também alguns campos para ele. Eduardo irá fazer essa parte.
      </Text>
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
