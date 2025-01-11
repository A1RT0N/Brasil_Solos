import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import HomeCard from './components/HomeCard';
import noticiasData from '../../../../back-end/Web-scrap-sem-api/noticias.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import firebaseConfig from '../../firebase/config';


import { GlobalContext } from '../../contexts/GlobalContext';



export default function Home() {
  const [news, setNews] = useState([]);
  const [previousNewsIndices, setPreviousNewsIndices] = useState([]);
  const { globalEmail } = useContext(GlobalContext); 

  const [userName, setUserName] = useState('');


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



  const fetchUserName = async () => {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = collection(db, 'users');
    const q = query(userRef, where('email', '==', globalEmail));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserName(userData.name);
      } else {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Erro ao buscar o nome do usuário:', error);
      setUserName('Usuário');
    }
  };

  useEffect(() => {
    getRandomNews();
    fetchUserName();

    return () => {
      AsyncStorage.removeItem('previousNewsIndices');
    };
  }, []);

  

  const getTodayClasses = () => [
    { name: 'A minha participação é voluntária e gratuita.', schedule: '' },
    { name: 'Os dados digitados são verdadeiros, e podem ser utilizados para propor melhorias ao sistema de agricultura no Brasil.', schedule: '' },
  ];

  const handlePress = () => {
    Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSdZ68Q3yAxmF_bfQkQWZhZIchwGuekHqdiwHy_ciEtzX6x0ng/viewform?usp=sf_link');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {userName}! </Text>
      <Text style={styles.subGreeting}>Brasil Solos tem como missão conhecer melhor a realidade da sua propriedade rural, e propor soluções que aumentem o valor e a qualidade dos seus produtos.</Text>
      <Text style={[styles.link, { marginBottom: 20 }, {fontSize: 18}]} onPress={handlePress}> Avalie nosso aplicativo clicando aqui!</Text>

      <ScrollView style={styles.scrollContainer}>
        <HomeCard title="Ao utilizar esse aplicativo, eu concordo:">
          {getTodayClasses().length ? (
            getTodayClasses().map((subject, index) => (
              <View key={index} style={[styles.card, styles.classCard]}>
                <Text style={styles.cardText}>{subject.name}</Text>
                <Text style={styles.cardSubText}>{subject.schedule}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noActivitiesText}>Sem info's hoje.</Text>
          )}
        </HomeCard>

        <HomeCard title="Notícias Agro" button={
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
    backgroundColor: '#343541', 
    padding: 16,
  },
  link: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF', 
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#FFF', 
    marginBottom: 8,
  },
  percentage: {
    fontSize: 14,
    color: '#FFF', 
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    backgroundColor: '#525466', 
  },
  classCard: {
    backgroundColor: '#525466', 
    padding: 12,
  },
  cardText: {
    color: '#FFF', 
    fontSize: 16,
  },
  cardSubText: {
    color: '#B0B0B0', 
    fontSize: 14,
  },
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#40414F', 
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
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
    color: '#FFF', 
    flex: 1,
  },
  noActivitiesText: {
    color: '#B0B0B0', 
    fontSize: 14,
  },
  refreshButton: {
    backgroundColor: '#1E5F74', 
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
});
