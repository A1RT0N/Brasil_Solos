import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import theme from "../../config/theme";

const TouchableButton = styled.TouchableOpacity`
  background-color: ${theme.colors.purple.primary};
  padding: 12px 28px;
  border-radius: 100px;
`;

const TextButton = styled.Text`
  color: white;
  font-size: 14px;
  font-family: Montserrat_600SemiBold;
  text-align: center;
`;

const Button = ({
  text,
  width,
  disabled,
  disabledStyle,
  style,
  styleText,
  numberOfLines,
  onPress,
}) => {
  return (
    <TouchableButton
      disabled={disabled}
      style={[
        {
          width,
          backgroundColor:
            disabled || disabledStyle
              ? theme.colors.gray.gray3
              : theme.colors.purple.primary,
        },
        style,
      ]}
      onPress={onPress}
    >
      <TextButton numberOfLines={numberOfLines} style={styleText}>
        {text}
      </TextButton>
    </TouchableButton>
  );
};

export default Button;
