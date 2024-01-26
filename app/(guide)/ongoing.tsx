import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useJwtToken } from "../globalStore/globalStore";
import MapsComponent from "../../components/mapsComponent";
import useGuideUserSocketStore from "../globalStore/guideSocketStore";
import CustomButton from "../../components/CustomButton";
import useLocation from "../hooks/useLocation";

const OnGoing = () => {
  const [data, setData] = useState<any>();
  const { jwtToken } = useJwtToken();
  const { data: render, location: locationData } = useGuideUserSocketStore();

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

    getOnGoing();
  }, [render]);

  let [locationArr, setLocationArr] = useState<any>();

  useEffect(() => {
    if (locationData) {
      setLocationArr(locationData);
      console.log(locationData);
    }
  }, [locationData]);

  return (
    <View style={{ height: Dimensions.get("window").height - 130 }}>
      <View style={{ flex: 1 }}>
        {locationArr && (
          <MapsComponent
            locations={[locationArr]}
            cameraLocation={[locationArr.lng, locationArr.lat]}
          />
        )}
      </View>
      {data && <Card data={data} />}
    </View>
  );
};

const Card = (props: { data: any }) => {
  const { data } = props;
  const { jwtToken } = useJwtToken();
  const handleComplte = async () => {
    let data1 = data;

    try {
      let res: any = await fetch(
        `https://api.localg.biz/api/user/complete-tour/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            tour_id: data1.tour_id,
          }),
        }
      );
      if (res.status !== 200) {
        console.log(res);
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        console.log("success");
      } else {
        console.log(data);
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = async () => {
    let data1 = data;
    try {
      console.log(data1.tour_id);
      let res: any = await fetch(
        `https://api.localg.biz/api/user/cancel-tour/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            tour_id: data1.tour_id,
          }),
        }
      );
      if (res.status !== 200) {
        console.log(res.status);
        return;
      }
      const data = await res.json();
      if (data.status === "success") {
        console.log("success");
      } else {
        if (!data) console.log(undefined);

        if (data) console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={[styles.card, { marginTop: 10 }]}>
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
      <Text style={styles.text}>Tourist: {data.tourist}</Text>
      <View
        style={{ flexDirection: "row", justifyContent: "flex-end", gap: 5 }}
      >
        <CustomButton
          style={{ width: 100, backgroundColor: "rgb(200,100,100)" }}
          title="Cancel"
          onPress={() => handleCancel()}
        />
        <CustomButton
          style={{ width: 150 }}
          title="Complete"
          onPress={() => handleComplte()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
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
    fontSize: 16,
    marginBottom: 8,
  },
});

export default OnGoing;
