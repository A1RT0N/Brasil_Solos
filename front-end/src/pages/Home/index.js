import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeCard from './components/HomeCard';

export default function Home() {
  const navigation = useNavigation();

  // Funções simuladas para obter as aulas e atividades
  const getTodayClasses = () => {
    return [
      { name: 'Sistemas Operacionais I', schedule: '08:10 - 09:50' },
      { name: 'Análise e Projeto Orientados a Objetos', schedule: '10:10 - 11:50' }
    ];
  };

  const getTodayActivities = () => {
    return [];
  };

  const getWeekActivities = () => {
    return [];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, Nome do Usuário Aqui, Eduardo!</Text>
      <Text style={styles.subGreeting}>TEXTO TEXTO TEXTO</Text>
      <Text style={styles.percentage}>Texto texto texto </Text>

      <ScrollView style={styles.scrollContainer}>
      <Text style={styles.cardText}>TEXTO TEXTO TEXTO </Text>
        <HomeCard title="Aulas de Hoje">
          {getTodayClasses().length ? (
            getTodayClasses().map((subject, index) => (
              <View key={index} style={[styles.card, styles.classCard]}>
                <Text style={styles.cardText}>{subject.name}</Text>
                <Text style={styles.cardSubText}>{subject.schedule}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noActivitiesText}>Sem aulas hoje.</Text>
          )}
        </HomeCard>

        <HomeCard title="Atividades da Semana">
          {getWeekActivities().length ? (
            getWeekActivities().map((activity, index) => (
              <View key={index} style={[styles.card, styles.weekActivityCard]}>
                <Text style={styles.cardText}>{activity.name}</Text>
                <Text style={styles.cardSubText}>{activity.details}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noActivitiesText}>Sem atividades para essa semana.</Text>
          )}
        </HomeCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto para seguir o estilo
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  percentage: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#1DB954',
  },
  classCard: {
    backgroundColor: '#7500BC',
  },
  weekActivityCard: {
    backgroundColor: '#FFC107',
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
  noActivitiesText: {
    color: '#fff',
    fontSize: 14,
  },
});
