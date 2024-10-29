import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, styles.greenCard]}
        onPress={() => navigation.navigate('Calculator')}
      >
        <Text style={styles.cardText}>CALCULATOR</Text>
        <Text style={styles.cardSubText}>
          texto <Text style={styles.boldText}>texto</Text>
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.card, styles.yellowCard]}
        onPress={() => navigation.navigate('LabPage')}
      >
        <Text style={styles.cardText}>LAB PAGE</Text>
        <Text style={styles.cardSubText}>
          texto ao <Text style={styles.boldText}>texto</Text> texto
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.card, styles.blueCard]}
        onPress={() => navigation.navigate('Chatbot')}
      >
        <Text style={styles.cardText}>CHATBOT</Text>
        <Text style={styles.cardSubText}>
          É o <Text style={styles.boldText}>GPT</Text>
        </Text>
      </TouchableOpacity>
      
      <View style={styles.iconContainer}>
        <Image source={require('../../../assets/icon.png')} style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    // Adiciona sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Adiciona elevação para Android
    elevation: 5,
  },
  greenCard: {
    backgroundColor: '#1DB954',
  },
  yellowCard: {
    backgroundColor: '#FFC107',
  },
  blueCard: {
    backgroundColor: '#1976D2',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSubText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
