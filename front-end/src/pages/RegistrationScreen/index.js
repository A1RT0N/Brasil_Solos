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
import { Title, Checkbox } from 'react-native-paper'; // <-- IMPORT DO CHECKBOX

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estado do checkbox
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { setGlobalEmail } = useContext(GlobalContext);
  const navigation = useNavigation();

  const firebaseApp = initializeApp(firebaseConfig);

  const onFooterLinkPress = () => {
    navigation.navigate('Login');
  };

  const onRegisterPress = () => {
    // Checa se o usuário marcou o checkbox
    if (!acceptedTerms) {
      alert('Você precisa concordar com os termos antes de prosseguir.');
      return;
    }

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

        setGlobalEmail(email);
        navigation.navigate('MainTabNavigator');
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }} keyboardShouldPersistTaps="always">
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#fff', textAlign: 'center', marginTop: 30}}>
          Registro
        </Text>
      </View>
              
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

        {/* CHECKBOX E TEXTO DE CONSENTIMENTO */}
        <View style={{ width: '100%', alignItems: 'center', marginVertical: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }}>
            <Checkbox
              status={acceptedTerms ? 'checked' : 'unchecked'}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            />
            <Text style={{ flex: 1, fontSize: 12, color: '#fff' }}>
              Concordo que estou ciente que meus dados poderão ser utilizados pela Escola Superior de 
              Agricultura Luiz de Queiroz da Universidade de São Paulo (USP) e que eles serão protegidos 
              conforme a lei brasileira e a LGPD.
            </Text>
          </View>
        </View>

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
