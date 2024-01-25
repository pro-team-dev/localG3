// write initial react native code

import { View, Text, ScrollView, Dimensions, Image, Alert } from "react-native";
import useAuth from "../hooks/useAuth";
import CustomButton from "../../components/CustomButton";
import Seperator from "../../components/seperator";
import { useEffect, useState } from "react";
import { useJwtToken } from "../globalStore/globalStore";
import useLocation from "../hooks/useLocation";
import * as opencage from "opencage-api-client";
import useGuideUserSocketStore from "../globalStore/guideSocketStore";

const Guide = () => {
  const [data, setData] = useState<any[]>([]);
  const { jwtToken } = useJwtToken();
  const { location, getLocationCity } = useLocation();
  const [reRender, setReRender] = useState(false);
  const { data: render } = useGuideUserSocketStore();
  useEffect(() => {
    async function getLocation() {
      try {
        let city: string = await getLocationCity();
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
        if (res.status != 200) {
          console.log(res.toString());
          return;
        }
        let result = await res.json();
        console.log(result);
        if (result.errors) {
          console.log(result.errors);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    getLocation();
  }, [location, render]);
  useEffect(() => {
    async function getPending() {
      try {
        const res = await fetch(
          "https://api.localg.biz/api/user/pending-tours/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const data1 = await res.json();
        if (data1.status === "success") {
          setData(data1.pending_tours["not-accepted"]);
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    }
    getPending();
  }, [reRender, render]);
  const { logout } = useAuth();
  return (
    <View>
      <CustomButton onPress={logout} title="Logout" />
      <ScrollView style={{ height: Dimensions.get("window").height - 180 }}>
        {data && data.length > 0 ? (
          data.map((item, index) => {
            return (
              <GuideItem key={index} item={item} setReRender={setReRender} />
            );
          })
        ) : (
          <Text>No Pending Tours</Text>
        )}
      </ScrollView>
    </View>
  );
};

function GuideItem(props: {
  item: any;
  setReRender: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: render } = useGuideUserSocketStore();

  const { item } = props;
  const { tour_id } = item;
  const [touristData, setTouristData] = useState<any>();
  const { jwtToken } = useJwtToken();
  useEffect(() => {
    async function getTouristData() {
      try {
        const res = await fetch(
          `https://api.localg.biz/api/user/profile/${item.tourist}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        if (res.status === 404) {
          alert("Tourist not foundt");
          return;
        }
        const data1 = await res.json();
        if (data1.errors) {
          console.log(data1);
        } else {
          setTouristData(data1);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTouristData();
  }, [item.tourist, render]);

  const handleReach = async () => {
    let res = await fetch(
      `https://api.localg.biz/api/user/accept-tour-guide/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          tour_id: tour_id,
          price: item.price,
          duration: 200,
        }),
      }
    );
    let resJson = await res.json();
    if (resJson.errors || resJson.status === "error") {
      console.log(resJson.errors);
      Alert.alert(resJson);
      return;
    }
    Alert.alert("Tourist will be notified");
    props.setReRender((prev) => !prev);
  };
  return (
    <View className="p-4">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {touristData && touristData.profile ? (
          <Image
            source={{ uri: touristData.profile }}
            style={{ height: 50, width: 50, borderRadius: 100 }}
          />
        ) : null}
        <View>
          <Text className="text-xl font-semibold">
            {touristData && touristData.name}
          </Text>
          <Text className="text-base font-light">
            {props.item.locations.map((item: any, index: number) => {
              return (
                item.name.split(",")[0] +
                (index === props.item.locations.length - 1 ? "" : ", ")
              );
            })}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <View className="left">
          <Text className="font-light">
            <Text className="font-medium">Langage: {"         "}</Text> Eng,
            Esp, Nep
          </Text>
          <Text className="font-light">
            <Text className="font-medium">Time: {"               "}</Text> Eng,
            Esp, Nep
          </Text>
          <Text className="font-light">
            <Text className="font-medium">No of People: {"  "}</Text>
            {item.no_of_people}
          </Text>
          <Text className="font-light">
            <Text className="font-medium">Price: {"  "}</Text>
            {item.price}
          </Text>
          <Text className="font-light w-44">
            <Text className="font-medium">Personal Request: {"  "}</Text>
            {item.personal_request}
          </Text>
        </View>
        <View className="right">
          {item.travel_coverage ? (
            <Text className="text-primary-primary-0">Travel Coverage</Text>
          ) : null}
          {item.food_coverage ? (
            <Text className="text-primary-primary-0">Food Coverage</Text>
          ) : null}
        </View>
      </View>
      <View>
        <CustomButton
          title="Reach"
          style={{ marginTop: 10, marginLeft: "auto" }}
          onPress={handleReach}
        />
      </View>
    </View>
  );
}

export default Guide;
