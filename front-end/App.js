import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import {AppRoutes } from './src/routes';
import { ActivityIndicator, View, Text } from 'react-native';

export default function App() {
  return (
    // <AuthProvider>
    //   <NavigationContainer>
    //     <AuthStack />
    //   </NavigationContainer>
    // </AuthProvider>
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}

// const AuthStack = () => {
//   const { authToken, loading } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return authToken ? <StackRoutesApp /> : <StackRoutesAuth />;
// };

