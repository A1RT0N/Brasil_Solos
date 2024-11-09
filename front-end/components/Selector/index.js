import { ScrollView, View } from "react-native";
import Button from "../Button";
import React from "react";

const Selector = ({ value, options, ellipsis, onChangeValue }) => {
  return (
    <ScrollView>
      {options.map((option) => (
        <View key={option.value} style={{ marginBottom: 12 }}>
          <Button
            text={option.name}
            disabledStyle={value !== option.value}
            onPress={() => onChangeValue(option.value)}
            numberOfLines={ellipsis === false ? undefined : 1}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default Selector;
