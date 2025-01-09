import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import firebaseConfig from "../../firebase/config";
import { initializeApp } from 'firebase/app';
import { GlobalContext } from '../../contexts/GlobalContext';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export default function Profile({ navigation }) {
  const { globalEmail } = useContext(GlobalContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", globalEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [globalEmail]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10A37F" />
        <Text style={styles.loadingText}>Carregando suas informações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil do Usuário</Text>
      </View>

      {userData ? (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Segue abaixo todas as suas informações até o momento:</Text>

          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{userData.name || "Não informado"}</Text>

          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{userData.email || "Não informado"}</Text>

          {userData.gender && (
            <>
              <Text style={styles.label}>Gênero:</Text>
              <Text style={styles.value}>{userData.gender}</Text>
            </>
          )}

          {userData.age && (
            <>
              <Text style={styles.label}>Idade:</Text>
              <Text style={styles.value}>{userData.age}</Text>
            </>
          )}

          {userData.profile && (
            <>
              <Text style={styles.label}>Perfil:</Text>
              <Text style={styles.value}>{userData.profile}</Text>
            </>
          )}

          {userData.cultures && userData.cultures.length > 0 && (
            <>
              <Text style={styles.label}>Culturas:</Text>
              <Text style={styles.value}>{userData.cultures.join(", ")}</Text>
            </>
          )}

          {userData.waterConsumption && (
            <>
              <Text style={styles.label}>Gasto de Água (R$):</Text>
              <Text style={styles.value}>{userData.waterConsumption}</Text>
            </>
          )}

          {userData.energyConsumption && (
            <>
              <Text style={styles.label}>Gasto de Energia (R$):</Text>
              <Text style={styles.value}>{userData.energyConsumption}</Text>
            </>
          )}

          {userData.propertySize && (
            <>
              <Text style={styles.label}>Tamanho da Propriedade (ha):</Text>
              <Text style={styles.value}>{userData.propertySize}</Text>
            </>
          )}
        </View>
      ) : (
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Nenhuma informação encontrada.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343541',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#444654',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343541',
  },
  loadingText: {
    marginTop: 5,
    color: '#FFF',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#10A37F',
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
});
