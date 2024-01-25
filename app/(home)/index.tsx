import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { router } from "expo-router";
import Star from "../../components/Star";
import ReviewStar from "../../components/reviewStar";
import useLocation from "../hooks/useLocation";
import useUserSocketStore from "../globalStore/websocketStore";
import { useJwtToken } from "../globalStore/globalStore";

const Index = () => {
  const { data: render } = useUserSocketStore();
  const { user, logout } = useAuth();
  const { jwtToken } = useJwtToken();

  const { location } = useLocation();
  return (
    <View className="p-4 bg-slate-50 flex-1">
      <Text className="text-xl">Features</Text>
      <View style={{ flexDirection: "row", gap: 30, marginTop: 20 }}>
        <CircularCard title={"Tourist \n Package"} />
        <CircularCard title="Guide" link="/book/" />
        <CircularCard title={"Company \n Package"} />
      </View>
      <View
        style={{
          borderBottomColor: "rgba(200,200,200,0.4)",
          borderBottomWidth: 3,
          marginTop: 60,
        }}
      />
      <Text className="text-xl mt-5">Suggestions</Text>
      <View></View>
      {/* <Text>Index</Text>
      <Star percentage={0} />
      <CustomButton title="logout" onPress={() => logout()} /> */}
      {/* <Text>{JSON.stringify(location?.coords)}</Text> */}
    </View>
  );
};

function CircularCard(props: { title: string; link?: string }) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.link) {
          router.push(props.link as `http${string}`);
        }
      }}
    >
      <View className="gap-3">
        <View className="w-16 h-16 bg-slate-200 rounded-full"></View>
        <Text className="text-center font-normal">{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default Index;
