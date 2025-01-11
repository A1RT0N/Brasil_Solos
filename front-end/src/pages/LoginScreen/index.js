import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../../contexts/GlobalContext';
import {ButtonViewText, BlueColorText} from '../Starter/components/ButtonView'

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
            setGlobalEmail(email); // Atualiza o e-mail globalmente
            navigation.navigate("MainTabNavigator"); // Redireciona para a Home após o login
        })
        .catch((error) => {
            // Verifica se o erro está relacionado ao email ou senha inválidos
            if (error.code === 'auth/invalid-email') {
                alert("Email inexistente. Verifique se digitou adequadamente!");
            } else {
                if(error.code === 'auth/invalid-credential'){
                  alert("Senha incorreta!");

                }else{
                  alert(error.message);
                }
            }
        });
  };


  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps="always">
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff', textAlign: 'center', marginTop: 30}}>
          Login
        </Text>
      </View>
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
      <View
          style={{
            position: 'absolute', // Define posição fixa
            bottom: 20, // Define distância do rodapé
            alignItems: 'center', // Centraliza horizontalmente
            width: '100%', // Garante que ocupe toda a largura
          }}>
          <ButtonViewText>
            Em parceria com{' '}
            <BlueColorText>USP, EMBRAPA e UNESCO</BlueColorText>
          </ButtonViewText>
        </View>
    </View>
  );
}
