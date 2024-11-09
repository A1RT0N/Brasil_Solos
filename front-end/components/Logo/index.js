import React from "react";
import { Image } from "react-native";

const Logo = ({ size }) => (
  <Image
    source={require("../../assets/logo.png")}
    style={{ width: size || 100, height: size || 100 }}
  />
);

export default Logo;
