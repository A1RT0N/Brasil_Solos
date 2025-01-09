import { ScrollView, View } from "react-native";
import Button from "../Button";
import React from "react";

const MultiSelector = ({ value, options, ellipsis, onChangeValue }) => {
  const handleChange = (valuePressed) => {
    if (value.includes(valuePressed)) {
      onChangeValue(value.filter((v) => v !== valuePressed));
    } else {
      onChangeValue([...value, valuePressed]);
    }
  };

  return (
    <ScrollView>
      {options.map((option) => (
        <View key={option.value} style={{ marginBottom: 12 }}>
          <Button
            text={option.name}
            disabledStyle={!value.includes(option.value)}
            onPress={() => handleChange(option.value)}
            numberOfLines={ellipsis === false ? undefined : 1}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default MultiSelector;
