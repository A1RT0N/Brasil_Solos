import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../contexts/GlobalContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { setGlobalEmail } = useContext(GlobalContext);
  const navigation = useNavigation();

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  const onLoginPress = () => {
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
        console.log('Email após login:', email); // Verifica o e-mail antes de atualizar o contexto

        setGlobalEmail(email); // Atualiza o e-mail globalmente
        navigation.navigate("MainTabNavigator"); // Redireciona para a Home após o login
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
        <TouchableOpacity style={styles.button} onPress={onLoginPress}>
          <Text style={styles.buttonTitle}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Não tem uma conta?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Criar conta
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
