import { View, Text, TextInput, TextInputProps } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

type InputWithLogoType = {
  logo: any;
} & TextInputProps;

const InputWithLogo = (props: InputWithLogoType) => {
  return (
    <View
      style={{
        // flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <AntDesign color={"green"} size={20} name={props.logo} />
      <TextInput
        className={
          "flex-1 h-10 border border-gray-300 border-l-transparent border-r-transparent border-t-transparent p-2"
        }
        {...props}
      />
    </View>
  );
};

export default InputWithLogo;
