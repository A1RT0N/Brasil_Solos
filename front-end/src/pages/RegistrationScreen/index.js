import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase/config';
import { initializeApp } from 'firebase/app';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../contexts/GlobalContext'; 
import { Title } from 'react-native-paper';

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { setGlobalEmail } = useContext(GlobalContext); // Utilizar o setGlobalEmail do contexto
  const navigation = useNavigation(); // Utilize useNavigation para acessar o objeto de navegação

  const firebaseApp = initializeApp(firebaseConfig);

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert('Suas senhas não são iguais.');
      return;
    }

    const auth = getAuth(firebaseApp);
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const uid = response.user.uid;
        const db = getFirestore(firebaseApp);
        addDoc(collection(db, 'users'), {
          id: uid,
          email: email,
          name: fullName.trim(),
        });

        setGlobalEmail(email); // Atualiza o e-mail globalmente no contexto
        navigation.navigate('MainTabNavigator'); // Redireciona para Home após o registro
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps="always">
        <Image style={styles.logo} source={require('../../../assets/icon.png')} />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Senha"
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder="Confirmar Senha"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onRegisterPress}>
          <Text style={styles.buttonTitle}>Criar conta</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Já possui uma conta?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Entrar
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
