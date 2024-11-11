import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import Button from "../../../../components/Button"
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ButtonViewView = styled.View`
  align-items: center;
  width: 100%;
`;

export const ButtonViewText = styled.Text`
  font-family: Montserrat_600SemiBold;
  color: white;
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
`;

export const BlueColorText = styled.Text`
  color: #5ec8ae;
`;

const ButtonView = ({ navigation }) => {
  return (
    <ButtonViewView>
      <Button text="Entrar" width="90%" onPress={() => navigation.navigate("MainTabNavigator")} />
      <ButtonViewText>
        Criado <BlueColorText>por Expo</BlueColorText> por{" "}
        <BlueColorText>SUCN</BlueColorText>
      </ButtonViewText>
    </ButtonViewView>
  );
};


export default ButtonView;
