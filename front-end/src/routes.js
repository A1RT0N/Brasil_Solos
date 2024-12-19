import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./pages/Home";
import CalculatorScreen from "./pages/Calculator";
import ChatbotScreen from "./pages/Chatbot";
import LabPageScreen from "./pages/LabPage";
import ProfileScreen from "./pages/Profile";
import StarterScreen from "./pages/Starter";
import LoginScreen from "./pages/LoginScreen/index"

import RegistrationScreen from "./pages/RegistrationScreen"; // Importe a tela de registro


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Higher-order component to wrap screens in a SafeAreaView
function withSafeArea(Component) {
  return (props) => (
    <SafeAreaView style={styles.safeArea}>
      <Component {...props} />
    </SafeAreaView>
  );
}

function StarterStack() {
  return (
    <Stack.Navigator initialRouteName="Starter">
      <Stack.Screen
        name="Starter"
        component={withSafeArea(StarterScreen)}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function LoginStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={withSafeArea(LoginScreen)}
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
        component={withSafeArea(HomeScreen)}
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
        tabBarActiveTintColor: '#6B8E23',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopColor: '#121212',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Preços"
        component={withSafeArea(CalculatorScreen)}
      />
      <Tab.Screen
        name="Chat"
        component={withSafeArea(ChatbotScreen)}
      />
      <Tab.Screen
        name="Laboratório"
        component={withSafeArea(LabPageScreen)}
      />
      <Tab.Screen
        name="Propriedade"
        component={withSafeArea(ProfileScreen)}
      />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Starter" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Starter" component={StarterStack} />
      <Stack.Screen name="Login" component={withSafeArea(LoginScreen)} />
      <Stack.Screen name="Registration" component={withSafeArea(RegistrationScreen)} />
      <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000", // Fundo padrão
  },
});
