import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useJwtToken } from "../globalStore/globalStore";
import useUserSocketStore from "../globalStore/websocketStore";
import MapsComponent from "../../components/mapsComponent";
import { ScrollView } from "react-native-gesture-handler";

const OnGoing = () => {
  const [data, setData] = useState<any>();
  const { jwtToken } = useJwtToken();
  const { data: render, location } = useUserSocketStore();

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
          setData(data1.tour);
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getOnGoing(); // Call the function to fetch ongoing tours
  }, [render]);

  let [locationArr, setLocationArr] = useState<any>();

  useEffect(() => {
    if (location) {
      if (location.lat) {
        setLocationArr(location);
        console.log(location);
      }
    }
  }, [location]);

  return (
<<<<<<< HEAD
    <View style={{ height: Dimensions.get("window").height / 3 }}>
      <View>
        {(locationArr && locationArr.lat) && <MapsComponent
          locations={[locationArr]}
          cameraLocation={[locationArr.lng, locationArr.lat]}
        />}
=======
    <View style={{ height: Dimensions.get("window").height - 130 }}>
      <View style={{ flex: 1 }}>
        {locationArr && (
          <MapsComponent
            locations={[locationArr]}
            cameraLocation={[locationArr.lng, locationArr.lat]}
          />
        )}
>>>>>>> bd066c0ecb64af8721de7ee757537f3ea1637297
      </View>
      {data && <Card data={data} />}
    </View>
  );
};

const Card = ({ data }) => {
  return (
    <View style={styles.card}>
<<<<<<< HEAD
      <ScrollView>
        <Text style={styles.text}>Tour ID: {data.tour_id}</Text>
        <Text style={styles.text}>Location: {data.locations[0].name}</Text>
        <Text style={styles.text}>Status: {data.status}</Text>
        <Text style={styles.text}>Price: {data.price}</Text>
        <Text style={styles.text}>Duration: {data.duration}</Text>
        <Text style={styles.text}>No. of People: {data.no_of_people}</Text>
        <Text style={styles.text}>
          Travel Coverage: {data.travel_coverage ? "Yes" : "No"}
        </Text>
        <Text style={styles.text}>
          Food Coverage: {data.food_coverage ? "Yes" : "No"}
        </Text>
        <Text style={styles.text}>Personal Request: {data.personal_request}</Text>
        <Text style={styles.text}>Created At: {data.created_at}</Text>
        <Text style={styles.text}>Updated At: {data.updated_at}</Text>
        <Text style={styles.text}>Tourist: {data.tourist}</Text>
        <Text style={styles.text}>Guide: {data.guide}</Text>
        <Text style={styles.text}>Offer: {data.offer[0]}</Text>
      </ScrollView>
=======
      <Text style={styles.text}>Location: {data.locations[0].name}</Text>
      <Text style={styles.text}>Status: {data.status}</Text>
      <Text style={styles.text}>Price: {data.price}</Text>
      <Text style={styles.text}>Duration: {data.duration}</Text>
      <Text style={styles.text}>No. of People: {data.no_of_people}</Text>
      <Text style={styles.text}>
        Travel Coverage: {data.travel_coverage ? "Yes" : "No"}
      </Text>
      <Text style={styles.text}>
        Food Coverage: {data.food_coverage ? "Yes" : "No"}
      </Text>
      <Text style={styles.text}>Personal Request: {data.personal_request}</Text>
      {/* <Text style={styles.text}>Created At: {data.created_at}</Text> */}
      {/* <Text style={styles.text}>Updated At: {data.updated_at}</Text> */}
      {/* <Text style={styles.text}>Tourist: {data.tourist}</Text> */}
      <Text style={styles.text}>Guide: {data.guide}</Text>
      {/* <Text style={styles.text}>Offer: {data.offer[0]}</Text> */}
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", gap: 5 }}
      >
        <CustomButton
          style={{ width: 100, backgroundColor: "rgb(200,100,100)" }}
          title="Cancel"
          // onPress={() => handleCancel()}
        />
        <CustomButton
          style={{ width: 150 }}
          title="Complete"
          // onPress={() => handleComplte()}
        />
      </View>
>>>>>>> bd066c0ecb64af8721de7ee757537f3ea1637297
    </View>
  );
};

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
