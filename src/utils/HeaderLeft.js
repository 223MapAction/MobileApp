import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import  Icon  from "react-native-vector-icons/FontAwesome";


const HeaderLeft = ({ colors }) => {
  const navigation = useNavigation();
  const [pressed, onClick] = useState(false);
  return (
    <TouchableOpacity
      testID="header-left"
      onPress={() => {
        if (pressed === false) {
          onClick(true);
          navigation.goBack();
        }
      }}
      style={{ position: "relative", padding: 5 }}
    >
      <Icon
        name="arrow-back"
        size={27}
        color={colors}
        style={{ marginRight: 15 }}
      />
    </TouchableOpacity>
  );
};

export default HeaderLeft;
