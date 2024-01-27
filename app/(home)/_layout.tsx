import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router/tabs";
import { Alert, Image, StyleSheet, Text } from "react-native";
import { View } from "../../components/Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import useLocation from "../hooks/useLocation";
import useUserSocketStore from "../globalStore/websocketStore";
import useAuth from "../hooks/useAuth";
import { useJwtToken } from "../globalStore/globalStore";
import { useEffect, useState } from "react";
import useTourStore from "../globalStore/tourStore";
import useLocationTest from "../hooks/useLocationTest";
import { StatusBar } from "react-native";

export default function AppLayout() {
  const config = {};
  const { connectWebSocket, data, disconnectWebSocket, sendWebSocket } =
    useUserSocketStore();
  const { user, logout } = useAuth();
  const { jwtToken } = useJwtToken();
  const [showNotification, setShowNotification] = useState(false);

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
          console.log("Error in _layout(home)");
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
        console.log("Error in line 50, _layout(home)");
      }
    };
    getOnGoing();
  }, [data]);

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

  useEffect(() => {
    const getUserInfo = async () => {
      let data = await fetch(`https://api.localg.biz/api/user/profile/`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
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
            tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
            headerLeft(props) {
              return (
                <Image
                  source={require("../../assets/images/Logo.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 10,
                    marginRight: -10,
                  }}
                />
              );
            },
            title: "LocalG",
            headerRight() {
              return (
                <TouchableOpacity
                  onPress={() => router.replace("/(home)/profile")}
                >
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
          }}
        />
        <Tabs.Screen
          name="maps"
          options={{
            title: "Maps",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="offers"
          options={{
            title: "Offers",
            href: {
              pathname: "/offers",
              params: {
                isReRender: "false",
              },
            },
            tabBarIcon: () => (
              <MaterialIcons name="pending-actions" size={24} color="black" />
            ),
            ...config,
          }}
        />
        <Tabs.Screen
          name="ongoing"
          options={{
            title: "Ongoing",
            tabBarIcon: () => (
              <MaterialIcons name="tour" size={24} color="black" />
            ),
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
        <Tabs.Screen
          name="book/index"
          options={{
            title: "Guide",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            headerShown: false,
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="book/locationView"
          options={{
            title: "Guide",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            headerShown: false,
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="book/bookingArea"
          options={{
            title: "Guide",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            headerShown: false,
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="book/reachOuts"
          options={{
            title: "Guide",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            headerShown: false,
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="book/matches"
          options={{
            title: "Guide",
            tabBarIcon: () => <AntDesign name="API" size={24} color="black" />,
            ...config,
            headerShown: false,
            tabBarItemStyle: { display: "none" },
            tabBarStyle: { display: "none" },
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({});
