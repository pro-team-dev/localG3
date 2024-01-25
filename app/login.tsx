import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InputWithLogo from "../components/InputWithLogo";
import useAuth from "./hooks/useAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, isLoading, error } = useAuth();

  const handleLogin = () => {
    // Implement your login logic here
    // Add your authentication logic here
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }
    login(email, password);
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-white">
      <View
        className="items-center mt-auto"
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Image
          className="w-28 h-28 "
          source={require("../assets/images/Logo.png")}
        />
        <Text className="text-2xl -mt-5">LocalG</Text>
      </View>
      <View
        className={"p-4 mt-10 mb-auto mx-5"}
        style={{ position: "relative" }}
      >
        <Text className="text-3xl text-center mb-6 font-bold">LOGIN</Text>
        <View style={{ gap: 30 }}>
          <InputWithLogo
            logo="mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
          />
          <InputWithLogo
            logo="lock"
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            secureTextEntry={true}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
            marginBottom: 20,
            gap: 3,
          }}
        >
          <Text className={"text-sm"}>Don't have an account?</Text>
          <Link className="text-blue-500 font-bold" href={"/"}>
            Register here
          </Link>
        </View>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            className={"bg-primary-btn py-2 px-4 rounded w-36 mx-auto"}
            onPress={handleLogin}
          >
            <Text className={"text-white text-lg text-center"}>Login</Text>
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator
              size="large"
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
              }}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
