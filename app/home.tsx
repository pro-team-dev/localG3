import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import CustomButton from "../components/CustomButton";
import useAuth from "./hooks/useAuth";

const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <SafeAreaView className="mt-10">
      <CustomButton title="Logout" onPress={() => logout()} />
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
        perspiciatis inventore eum dolorem ipsum ea veritatis, facere
        praesentium voluptates enim laudantium dolores! Consequuntur eius iste
        pariatur ut molestias laudantium ex?
      </Text>
    </SafeAreaView>
  );
};

export default Dashboard;
