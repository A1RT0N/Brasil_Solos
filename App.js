import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './front-end/src/routes';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import { PaperProvider, MD3DarkTheme as PaperDarkMode } from 'react-native-paper';
import { AuthProvider } from './front-end/src/contexts/AuthContext'; // Importa o AuthProvider
import { GlobalProvider } from './front-end/src/contexts/GlobalContext'; // Importa o GlobalProvider
import Toast from 'react-native-toast-message';

export default function App() {
  let [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={PaperDarkMode}>
      <AuthProvider> {/* Envolve o aplicativo com AuthProvider */}
        <GlobalProvider> {/* Envolve o aplicativo com GlobalProvider */}
          <NavigationContainer>
            <AppRoutes />
          </NavigationContainer>
          <Toast />
        </GlobalProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
