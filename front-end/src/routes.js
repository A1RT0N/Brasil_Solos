import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./pages/Home";
import CalculatorScreen from "./pages/Calculator";
import ChatbotScreen from "./pages/Chatbot";
import LabPageScreen from "./pages/LabPage";
import ProfileScreen from "./pages/Profile";
import CustomHeader from "./components/CustomHeader";

const Stack = createStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <CustomHeader title="Home" />,
        }}
      />
      <Stack.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          header: () => <CustomHeader title="Calculator" />,
        }}
      />
      <Stack.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          header: () => <CustomHeader title="Chatbot" />,
        }}
      />
      <Stack.Screen
        name="LabPage"
        component={LabPageScreen}
        options={{
          header: () => <CustomHeader title="Lab Page" />,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: () => <CustomHeader title="Profile" />,
        }}
      />
    </Stack.Navigator>
  );
}
