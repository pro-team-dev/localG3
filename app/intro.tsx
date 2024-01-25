import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import useAuth from "./hooks/useAuth";
import { router } from "expo-router";

const Intro = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View>
        <Text className="text-xl">Welcome to</Text>
        <Text className="text-3xl">LocalG</Text>
      </View>
    </SafeAreaView>
  );
};

export default Intro;
