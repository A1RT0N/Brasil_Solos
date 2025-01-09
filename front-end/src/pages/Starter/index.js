import React from "react";
import Background from "./components/Background";
import Logo from "../../../components/Logo";
import WelcomeText from "./components/WelcomeText";
import ButtonView from "./components/ButtonView";
import { useNavigation } from "@react-navigation/native";

const Starter = () => {
  const navigation = useNavigation()

  return (
    <Background>
      <Logo size={70} />
      <WelcomeText>{`Brasil Solos`}</WelcomeText>
      <ButtonView navigation={navigation} />
    </Background>
  );
};

export default Starter;
