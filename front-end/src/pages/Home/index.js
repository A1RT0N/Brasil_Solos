import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HomeCard from './components/HomeCard';
import noticiasData from '../../../../back-end/Web-scrap/noticias.json';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home() {
  const navigation = useNavigation();
  const [news, setNews] = useState([]);
  const [previousNewsIndices, setPreviousNewsIndices] = useState([]);


  // TODO: NÃO TÁ GUARDANDO AINDA TÃO BEM AS NOTÍCIAS PARA NÃO REPETIR - CONSERTAR ISSO

  const getRandomNews = async () => { 
    const totalNoticias = noticiasData.length;
    let randomIndices = [];
  
    const storedIndices = await AsyncStorage.getItem('previousNewsIndices');
    const parsedIndices = storedIndices ? JSON.parse(storedIndices) : [];
  
    while (randomIndices.length < 5) {
      const randomIndex = Math.floor(Math.random() * totalNoticias);
      if (!randomIndices.includes(randomIndex) && !parsedIndices.includes(randomIndex)) {
        randomIndices.push(randomIndex);
      }
    }
  
    const selectedNews = randomIndices.map(index => noticiasData[index]);
    setNews(selectedNews);
    setPreviousNewsIndices(randomIndices);
  
    await AsyncStorage.setItem('previousNewsIndices', JSON.stringify(randomIndices));
  };

  useEffect(() => {
    getRandomNews();
  
    return () => {
      AsyncStorage.removeItem('previousNewsIndices');
    };
  }, []);
  

  const getTodayClasses = () => [
    { name: 'Sistemas Operacionais I', schedule: '08:10 - 09:50' },
    { name: 'Análise e Projeto Orientados a Objetos', schedule: '10:10 - 11:50' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, Nome do Usuário Aqui, Eduardo!</Text>
      <Text style={styles.subGreeting}>TEXTO TEXTO TEXTO</Text>
      <Text style={styles.percentage}>Texto texto texto</Text>

      <ScrollView style={styles.scrollContainer}>
        <HomeCard title="Não sei o que colocar aqui">
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

        <HomeCard title="Notícias de Agro" button={
    <TouchableOpacity style={styles.refreshButton} onPress={getRandomNews}>
      <Text style={styles.refreshButtonText}>Atualizar</Text>
    </TouchableOpacity>
  }>
       
          {news.length ? (
            news.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.newsCard}
                onPress={() => Linking.openURL(item.url)}>
                <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
                <Text style={styles.newsTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noActivitiesText}>Sem notícias disponíveis. Conecte-se à internet.</Text>
          )}
        </HomeCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  classCard: {
    backgroundColor: '#7500BC',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  newsTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  newsImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  noActivitiesText: {
    color: '#fff',
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: '#555', 
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14, 
  },
});
