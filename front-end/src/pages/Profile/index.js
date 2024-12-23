import {React, useState, useContext} from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import firebaseConfig from "../../firebase/config"
import { initializeApp } from 'firebase/app'
import { GlobalContext } from '../../contexts/GlobalContext'
import { getFirestore, setDoc, doc, query, where, getDocs,collection } from "firebase/firestore"

// TODO: Eduardo ligar isso com AWS e dados de registro e login

export default function Profile({ navigation }) {
  const { globalEmail } = useContext(GlobalContext);

  const [user, setUser] = useState({
    id: '',
    name: '',
    email: globalEmail
  });

  const profilePicture = 'https://randomuser.me/api/portraits/lego/1.jpg';
  

  const recuperarDados = async () => {

    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const propriedadesRef = collection(db, "users");
    const q = query(propriedadesRef, where("email", "==", globalEmail));
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot.docs);
    querySnapshot.forEach((doc) => {
      setUser(doc.data());
    });

  }

  return (


    <ScrollView style={styles.container}>
    
      <View style={styles.header}>
      <TouchableOpacity style={styles.button} onPress={recuperarDados}>
        <Text style={styles.buttonText}>Carregar suas informações</Text>
      </TouchableOpacity>
        <Image style={styles.profileImage} source={{ uri: profilePicture }} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#10A37F',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#AAA',
    marginTop: 5,
  },
  sexo: {
    fontSize: 16,
    color: '#AAA',
    marginTop: 5,
  },
  section: {
    margin: 20,
    backgroundColor: '#444654',
    padding: 15,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#10A37F',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#FFF',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#10A37F',
    padding: 15,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
