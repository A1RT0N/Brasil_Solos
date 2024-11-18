import React from "react";
import styled from "styled-components/native";

const HomeCardContainer = styled.View`
  background-color: #2C2C38; /* Fundo mais escuro */
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px; /* Substitui o gap */
`;

const HomeCardTitle = styled.Text`
  font-size: 18px;
  font-family: Montserrat_700Bold;
  color: #FFF; /* Texto branco */
`;


const HomeCard = ({ title, button, children }) => {
  return (
    <HomeCardContainer>
      <HeaderContainer>
        <HomeCardTitle>{title}</HomeCardTitle>
        {button && button}
      </HeaderContainer>
      {children}
    </HomeCardContainer>
  );
};

export default HomeCard;
