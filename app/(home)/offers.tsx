import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import dummyOffers, { Offer } from "../../constants/dummyData";
import ReviewStar from "../../components/reviewStar";
import Seperator from "../../components/seperator";
import Colors from "../../constants/Colors";
import CustomButton from "../../components/CustomButton";
import { useJwtToken } from "../globalStore/globalStore";
import useUserSocketStore from "../globalStore/websocketStore";

const Offers = () => {
  const [data, setData] = useState(dummyOffers);
  const [tourId, setTourId] = useState<number>();
  const [reRender, setReRender] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const { data: render } = useUserSocketStore();

  return (
    <ScrollView
      style={{
        height: Dimensions.get("window").height,
        backgroundColor: "white",
      }}
    >
      <View>
        <TourDetail
          setTourId={setTourId}
          reRender={reRender}
          setIsPending={setIsPending}
        />
        <Seperator />
        {tourId && isPending && (
          <GuideOffer tourId={tourId} setReRender={setReRender} />
        )}
      </View>
    </ScrollView>
  );
};

const TourDetail = (props: {
  setTourId: React.Dispatch<React.SetStateAction<number | undefined>>;
  reRender: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: render } = useUserSocketStore();

  const [tourDetail, setTourDetail] = useState<any>();
  const { jwtToken } = useJwtToken();
  useEffect(() => {
    async function getTourDetail() {
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
        const data = await res.json();
        if (data.status === "success") {
          // console.log(data);
          setTourDetail(data.pending_tours[0]);
          props.setTourId(data.pending_tours[0].tour_id);
          if (data.pending_tours[0].status === "pending") {
            props.setIsPending(true);
          }
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    }
    getTourDetail();
  }, [props.reRender, render]);
  return (
    <View className="p-4">
      {tourDetail && tourDetail.status == "pending" ? (
        <>
          <View>
            <Text className="text-xl font-semibold">
              {tourDetail &&
                tourDetail.locations.map((item: any, index: number) => {
                  return (
                    item.name.split(",")[0] +
                    (index === tourDetail.locations.length - 1 ? "" : ", ")
                  );
                })}
            </Text>
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
                <Text className="font-medium">Location: {"         "}</Text>{" "}
                {tourDetail ? tourDetail.location : "No location"}
              </Text>
              <Text className="font-light">
                <Text className="font-medium">Langage: {"         "}</Text> Eng,
                Esp, Nep
              </Text>
              <Text className="font-light">
                <Text className="font-medium">No of People: {"  "}</Text>
                {tourDetail ? tourDetail.no_of_people : 0}
              </Text>
              <Text className="font-light">
                <Text className="font-medium">Price: {"  "}</Text>
                Nrs. {tourDetail ? tourDetail.price : 0}
              </Text>
              <Text style={{ marginTop: 10 }}>
                {tourDetail
                  ? tourDetail.personal_request
                  : "No special request"}
              </Text>
            </View>
            <View className="right">
              {tourDetail && tourDetail.food_coverage ? (
                <Text className="text-primary-primary-0">Travel Coverage </Text>
              ) : (
                ""
              )}
              {tourDetail && tourDetail.travel_coverage ? (
                <Text className="text-primary-primary-0">Food Coverage </Text>
              ) : (
                ""
              )}
            </View>
          </View>
        </>
      ) : (
        <Text>No Offers</Text>
      )}
    </View>
  );
};

function GuideOffer(props: {
  tourId: number;
  setReRender: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { jwtToken } = useJwtToken();
  const [data, setData] = useState<any>([]);
  const { data: render } = useUserSocketStore();

  useEffect(() => {
    async function getGuideOffer() {
      try {
        const res = await fetch(
          `https://api.localg.biz/api/user/get-all-offers/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tour_id: props.tourId }),
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setData(data.offers);
        } else {
          console.log(data);
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    }
    getGuideOffer();
  }, [render]);

  return (
    <View style={{ marginTop: 20 }}>
      {data.map((item, index) => (
        <View key={index}>
          <OfferItem item={item} setReRender={props.setReRender} />
          <Seperator />
        </View>
      ))}
    </View>
  );
}

const OfferItem = (props) => {
  const { item } = props;
  let guideId = item.guide;
  const [guide, setGuide] = useState<any>();
  const { jwtToken } = useJwtToken();
  const [isloading, setIsLoading] = useState(false);
  const { data: render } = useUserSocketStore();

  useEffect(() => {
    async function getGuide() {
      try {
        const res = await fetch(
          `https://api.localg.biz/api/user/profile/${guideId}/`,
          {
            method: "GET",
            headers: {
              // anuj
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        const data = await res.json();
        if (data.errors) {
          console.log(data);
          return;
        }
        setGuide(data);
        // console.log(data.guide);
      } catch (error) {
        // console.log(error, 1);
      }
    }
    getGuide();
  }, [render]);

  const handleAccept = async () => {
    setIsLoading(true);
    let res = await fetch(
      "https://api.localg.biz/api/user/accept-tour-tourist/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          tour_id: item.tour,
          guide_id: guideId,
          duration: 2000,
          price: item.price,
        }),
      }
    );
    let resJson = await res.json();
    if (resJson.status === "error") {
      Alert.alert(resJson.message);
      console.log(resJson);
      return;
    }
    Alert.alert("Tour accepted");
    props.setReRender((prev) => !prev);
    setIsLoading(false);
  };
  return (
    <View style={{ paddingHorizontal: 30, paddingVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          gap: 20,
          alignItems: "center",
        }}
      >
        {guide ? (
          <Image
            source={{ uri: guide.profile }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 100,
              backgroundColor: "gray",
              borderWidth: 2,
              borderColor: Colors.primary["primary-0"],
            }}
          />
        ) : (
          ""
        )}
        <View
          className="detail"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View className="left" style={{ flexDirection: "column" }}>
            <Text className="text-xl font-semibold">
              {guide ? guide.name : ""}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text className="font-light">4.3</Text>
              <ReviewStar rating={4.3} width={13} height={13} />
            </View>
          </View>
          <View className="right">
            <Text className="font-light">
              <Text className="font-bold text-primary-primary-0">
                Nrs. {item.hourly_rate ? item.hourly_rate : "XXXX"}
              </Text>{" "}
              ,{"\n"}/ per hour
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-6">
        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <Text className="text-[15px] font-medium">Duration:</Text>
          <Text className="text-[15px] font-light">
            {item.duration ? item.duration : "No duration"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
          <Text className="text-[15px] font-medium">Total Price:</Text>
          <Text className="text-[15px] font-light">
            Nrs {item.price ? item.price : "XXXXXX"}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <CustomButton
          title="Accept"
          style={{ borderRadius: 5, marginTop: 10, marginLeft: "auto" }}
          onPress={handleAccept}
        />
        {isloading ? <ActivityIndicator /> : ""}
      </View>
    </View>
  );
};

export default Offers;
