import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./pages/Home";
import CalculatorScreen from "./pages/Calculator";
import ChatbotScreen from "./pages/Chatbot";
import LabPageScreen from "./pages/LabPage";
import ProfileScreen from "./pages/Profile";
import StarterScreen from "./pages/Starter"; 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function StarterStack() {
  

  return (
    <Stack.Navigator initialRouteName="Starter">
      <Stack.Screen
        name="Starter"
        component={StarterScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Preços') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'Laboratório') {
            iconName = focused ? 'flask' : 'flask-outline';
          } else if (route.name === 'Propriedade') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B8E23', // Cor dos ícones ativos
        tabBarInactiveTintColor: '#B0B0B0', // Cor dos ícones inativos
        tabBarStyle: {
          backgroundColor: '#1A1A1A', // Fundo mais escuro para a barra de navegação
          borderTopColor: '#121212', // Linha superior da barra
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen name="Preços" component={CalculatorScreen} />
      <Tab.Screen name="Chat" component={ChatbotScreen} />
      <Tab.Screen name="Laboratório" component={LabPageScreen} />
      <Tab.Screen name="Propriedade" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


export function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="StarterStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StarterStack" component={StarterStack} />
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

