import React from "react";
import theme from "../../../../config/theme";
import styled from "styled-components/native";

const HomeCardContainer = styled.View`
  background-color: ${theme.colors.gray.gray2};
  padding: 14px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  gap: 8px;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HomeCardTitle = styled.Text`
  font-size: 18px;
  font-family: Montserrat_700Bold;
  color: white;
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
