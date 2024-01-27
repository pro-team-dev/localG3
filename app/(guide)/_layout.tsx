import { AntDesign } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { Alert, StatusBar, StyleSheet, Text } from "react-native";
import { View } from "../../components/Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import useGuideUserSocketStore from "../globalStore/guideSocketStore";
import { useEffect, useState } from "react";
import { useJwtToken } from "../globalStore/globalStore";
import useTourStore from "../globalStore/tourStore";
import useLocation from "../hooks/useLocation";

export default function AppLayout() {
  const { logout, user } = useAuth();
  const jwtToken = useJwtToken((state) => state.jwtToken);
  const { connectWebSocket, data, disconnectWebSocket, sendWebSocket } =
    useGuideUserSocketStore();
  const [showNotification, setShowNotification] = useState(false);

  const { location: l, getLocationCity } = useLocation();
  useEffect(() => {
    async function getLocation() {
      try {
        console.log("0");
        let city: string = "lalitpur";
        let res = await fetch("https://api.localg.biz/api/user/profile/", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: city.toLowerCase(),
          }),
        });
        console.log("2");
        if (res.status != 200) {
          console.log("Error in response, index.tsx (guide)");
          return;
        }
        let result = await res.json();
        console.log("1");
        if (result.errors) {
          console.log(result);
          return;
        }
      } catch (error) {
        console.log("Please stop");
        // getLocation();
      }
    }
    getLocation();
  }, []);

  const tour = useTourStore();
  useEffect(() => {
    const getOnGoing = async () => {
      try {
        const res = await fetch(
          "https://api.localg.biz/api/user/ongoing-tours/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (res.status !== 200) {
          console.log(res);
          console.log("error");
          return;
        }

        const data1 = await res.json();
        if (data1.status === "success") {
          tour.setTourDetail(data1.tour.tour_id);
        } else {
          console.log(data1);
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getOnGoing();
  }, [data]);

  useEffect(() => {
    const getUserInfo = async () => {
      let data = await fetch(`https://api.localg.biz/api/user/profile/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (data.status != 200) {
        Alert.alert("Something went wrong");
        return;
      }
      let result = await data.json();
      if (result.errors) {
        Alert.alert(result.errors.code);
        return;
      }
      connectWebSocket(result.id);
    };
    getUserInfo();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (data) {
      if (!data.type) {
        // setShowNotification(true);
      }
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [data]);
  const config = {};

  const { locate, location } = useLocation();
  const sendLocation = async () => {
    try {
      await locate();
      if (tour && tour.tour_id) {
        sendWebSocket(
          JSON.stringify({
            type: "location",
            tour_id: tour.tour_id,
            location_data: {
              current_location: JSON.stringify({
                lat: location?.coords.latitude,
                lng: location?.coords.longitude,
              }),
            },
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (tour && tour.tour_id) {
      let id = setInterval(() => {
        sendLocation();
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
  });

  return (
    <>
      {showNotification && (
        <View
          style={{
            backgroundColor: "rgb(100,150,100)",
            position: "absolute",
            right: 0,
            left: 0,
            top: StatusBar.currentHeight * 3 - 20,
            padding: 10,
            zIndex: 1,
          }}
        >
          <Text style={{ color: "white" }}>You have Notifications</Text>
        </View>
      )}
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 70,
            paddingTop: 10,
            paddingBottom: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerRight(props) {
              return (
                <TouchableOpacity onPress={() => router.push("/profile")}>
                  <View className="w-10 h-10 bg-slate-200 rounded-full mr-5 justify-center items-center overflow-hidden">
                    <Entypo
                      name="user"
                      size={30}
                      color="white"
                      style={{ transform: [{ translateY: 5 }] }}
                    />
                  </View>
                </TouchableOpacity>
              );
            },
            tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
          }}
        />
        <Tabs.Screen
          name="ongoing"
          options={{
            title: "Ongoing",
            tabBarIcon: () => <AntDesign name="flag" size={24} color="black" />,
            ...config,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({});
