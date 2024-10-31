import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {AppRoutes } from './src/routes';

export default function App() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}
