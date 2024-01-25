import { View, Text, TextInput, TextInputProps } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const SearchInput = (props: TextInputProps) => {
  return (
    <View
      style={{
        borderColor: "rgb(100, 130, 00)",
        flexDirection: "row",
        paddingHorizontal: 2,
        alignItems: "center",
        borderWidth: 0.7,
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 4,
        flex: 1,
      }}
    >
      <AntDesign
        name="search1"
        size={20}
        color="rgb(100, 170, 00)"
        style={{ padding: 10 }}
      />
      <TextInput {...props} style={{ flex: 1, height: 40 }} />
    </View>
  );
};

export default SearchInput;
