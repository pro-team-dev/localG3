import { View, Text, StyleSheet, Dimensions, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useJwtToken } from "../globalStore/globalStore";
import useUserSocketStore from "../globalStore/websocketStore";
import MapsComponent from "../../components/mapsComponent";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "../../components/CustomButton";
import { Image } from "react-native";

const OnGoing = () => {
  const [data, setData] = useState<any>();
  const { jwtToken } = useJwtToken();
  const { data: render, location } = useUserSocketStore();
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    async function getOnGoing() {
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
          console.log("error");
          return;
        }

        const data1 = await res.json();
        if (data1.status === "success") {
          if (data1.tour.locations) {
            setData(data1.tour);
          } else {
            setData(undefined);
          }
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getOnGoing(); // Call the function to fetch ongoing tours
  }, [render, reRender]);

  let [locationArr, setLocationArr] = useState<any>();

  useEffect(() => {
    if (location) {
      if (location.lat) {
        setLocationArr(location);
      }
    }
  }, [location, render, reRender]);

  return (
    <View style={{ height: Dimensions.get("window").height / 3 }}>
      <View>
        {locationArr ? (
          <MapsComponent
            locations={[locationArr]}
            cameraLocation={[locationArr.lng, locationArr.lat]}
          />
        ) : (
          <MapsComponent />
        )}
      </View>
      {data ? (
        <Card reRender={reRender} data={data} setReRender={setReRender} />
      ) : (
        <Text className="text-xl mt-10 mx-auto">No Ongoing Tours</Text>
      )}
    </View>
  );
};

const Card = ({ data, setReRender, reRender }) => {
  const { jwtToken } = useJwtToken();
  const handleCancel = async () => {
    let res = await fetch(`https://api.localg.biz/api/user/cancel-tour/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tour_id: data.tour_id,
      }),
    });
    if (res.status !== 200) {
      console.log("Error in cancelling tour");
      return;
    }
    let result = await res.json();
    if (result.status === "success") {
      Alert.alert("Tour cancelled");
      setReRender((prev) => !prev);
    } else {
      Alert.alert("Error in cancelling tour");
    }
  };
  return (
    <View style={styles.card}>
      <ScrollView>
        <GuideProfile id={data.guide} />
        <Text style={styles.text}>Location: {data.locations[0].name}</Text>
        <Text style={styles.text}>Price: {data.price}</Text>
        <Text style={styles.text}>Duration: {data.duration}</Text>
        <Text style={styles.text}>No. of People: {data.no_of_people}</Text>
        <Text style={styles.text}>
          Travel Coverage: {data.travel_coverage ? "Yes" : "No"}
        </Text>
        <Text style={styles.text}>
          Food Coverage: {data.food_coverage ? "Yes" : "No"}
        </Text>
        <Text style={[styles.text, { marginRight: 20 }]}>
          Personal Request: {data.personal_request}
        </Text>
        <View
          style={{ flexDirection: "row", justifyContent: "flex-end", gap: 5 }}
        >
          <CustomButton
            style={{
              width: 100,
              backgroundColor: "rgb(200,100,100)",
              marginRight: 10,
            }}
            title="Cancel"
            onPress={() => handleCancel()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

function GuideProfile(props: { id: number }) {
  const [data, setData] = useState<any>();
  const { jwtToken } = useJwtToken();

  useEffect(() => {
    async function getGuide() {
      try {
        const res = await fetch(
          `https://api.localg.biz/api/user/profile/${props.id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (res.status !== 200) {
          console.log("Erro in ongoing.tsx(home)");
          return;
        }

        const data1 = await res.json();
        //anuj
        setData(data1);
      } catch (error) {
        console.log(error);
      }
    }

    getGuide();
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {data && (
        <>
          <Image
            source={{ uri: data.profile }}
            style={{
              width: 50,
              height: 50,
              backgroundColor: "rgb(200,200,200)",
              borderRadius: 200,
            }}
          />
          <View style={{ marginTop: 5, marginBottom: 10 }}>
            <Text className="text-xl">{data.name}</Text>
            <Text>{data.email}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: Dimensions.get("window").height / 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 15,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
  },
});

export default OnGoing;
