import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

// TODO: Eduardo ligar isso com AWS e dados de registro e login

export default function Profile({ navigation }) {
  const user = {
    name: 'Eduardo Santos',
    email: 'eduardo.santos@email.com',
    sexo: 'Masculino',
    bio: 'Informações do produtor rural e dos dados gerados pelo Lab Page',
    profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg',
  };

  return (


    <ScrollView style={styles.container}>
    
      <View style={styles.header}>
        <Image style={styles.profileImage} source={{ uri: user.profilePicture }} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.sexo}>{user.sexo}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.sectionContent}>{user.bio}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
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
