import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styled from "styled-components/native";
import theme from "../../config/theme";

const Container = styled.View`
  align-items: center;
  justify-content: center;
  display: flex;
  width: 100%;
`;

const ButtonsNavigationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 6px;
  border-radius: 100px;
  background-color: ${theme.colors.gray.gray2};
  width: auto;
  margin-top: 6px;
`;

const ButtonNavigation = styled.TouchableOpacity`
  background-color: ${theme.colors.gray.gray1};
  width: 36px;
  height: 36px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  margin-horizontal: 6px;
`;

const ButtonsNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Container>
      <ButtonsNavigationContainer>
        {[
          { name: "Home", icon: "home" },
          { name: "Week", icon: "list-outline" },
          { name: "Calendar", icon: "calendar-outline" },
          { name: "Activities", icon: "bookmark" },
          { name: "Absences", icon: "bag-outline" },
          { name: "Grade", icon: "file-tray-full-outline" },
          { name: "Settings", icon: "settings-outline" },
        ].map((item) => (
          <ButtonNavigation
            key={item.name}
            style={{
              backgroundColor:
                route.name === item.name
                  ? theme.colors.purple.primary
                  : theme.colors.gray.gray1,
            }}
            onPress={() => navigation.navigate(item.name)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={
                route.name === item.name
                  ? "white"
                  : theme.colors.gray.gray2
              }
            />
          </ButtonNavigation>
        ))}
      </ButtonsNavigationContainer>
    </Container>
  );
};

export default ButtonsNavigation;
