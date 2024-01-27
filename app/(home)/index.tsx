import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
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
      <View style={{ flexDirection: "row", gap: 30, marginTop: 20 }}>
        <CircularCard
          title="Quick Guide"
          link="/book/"
          name={require("../../assets/images/guide.png")}
        />
        <CircularCard
          title={"Tourist \n Package"}
          name={require("../../assets/images/tour.png")}
        />
        <CircularCard
          title={"Groups"}
          name={require("../../assets/images/group.png")}
        />
      </View>
      <View
        style={{
          borderBottomColor: "rgba(200,200,200,0.4)",
          borderBottomWidth: 3,
          marginTop: 60,
        }}
      />
      <Text className="text-xl mt-5">Suggestions</Text>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 20,
        }}
      >
        <View style={{ alignItems: "center", gap: 10 }}>
          <Image
            source={require("../../assets/images/ktm.jpg")}
            style={{ width: 70, height: 70, borderRadius: 10 }}
          />
          <Text style={{ textAlign: "center", fontWeight: 400 }}>
            Kathmandu {"\n"} Durbar Square
          </Text>
        </View>
        <View style={{ alignItems: "center", gap: 10 }}>
          <Image
            source={require("../../assets/images/patan-durbar-square.jpg")}
            style={{ width: 70, height: 70, borderRadius: 10 }}
          />
          <Text style={{ textAlign: "center", fontWeight: 400 }}>
            Patan {"\n"} Durbar Square
          </Text>
        </View>
        <View style={{ alignItems: "center", gap: 10 }}>
          <Image
            source={require("../../assets/images/swayambu.jpg")}
            style={{ width: 70, height: 70, borderRadius: 10 }}
          />
          <Text style={{ textAlign: "center", fontWeight: 400 }}>
            Swayambu {"\n"} Durbar Square
          </Text>
        </View>
      </View>
    </View>
  );
};

function CircularCard(props: { title: string; link?: string; name: string }) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.link) {
          router.push(props.link as `http${string}`);
        }
      }}
    >
      <View className="gap-3">
        <View className="w-16 h-16 bg-slate-200 rounded-full">
          <Image source={props.name} className="w-16 h-16" />
        </View>
        <Text className="text-center font-medium">{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default Index;
