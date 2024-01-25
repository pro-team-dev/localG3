import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import MapsComponent from "../../../components/mapsComponent";
import SearchInput from "../../../components/SearchInput";
import { AntDesign } from "@expo/vector-icons";
import * as opencage from "opencage-api-client";
import { Entypo } from "@expo/vector-icons";
import CustomButton from "../../../components/CustomButton";
import { useLocationStore } from "../../globalStore/locationStore";
import { router, useNavigation } from "expo-router";

export type locationType = {
  id: number;
  text: string;
  lat: number;
  lng: number;
  head: string;
};

const Guide = () => {
  const [locationSearch, setLocationSearch] = useState("");
  const [locationOutput, setLocationOutput] = useState<locationType[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [locations, setLocations] = useState<locationType[]>([]);
  const [cameraLocation, setCameraLocation] = useState<[number, number] | null>(
    null
  );
  const count = useLocationStore((state) => state.count);
  const locationsStore = useLocationStore((state) => state.locations);
  const [activeId, setActiveId] = useState<number | null>(null);

  const getData = useCallback(async () => {
    try {
      if (locationSearch.length > 0) {
        let key = process.env.EXPO_PUBLIC_OPENCAGE_API_KEY;
        setIsloading(true);
        let data = await opencage.geocode({ key, q: locationSearch });
        let result = data.results;
        let o = result.map((res: any, index: number) => ({
          id: index,
          text: res.formatted,
          lat: res.geometry.lat,
          lng: res.geometry.lng,
          head: res.components.neighbourhood,
        }));
        setLocationOutput(o);
        setIsloading(false);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  }, [locationSearch]);

  const handleLocationClick = useCallback((item: locationType) => {
    setActiveId(item.id);
    setLocations([item]);
    setCameraLocation([item.lng, item.lat]);
  }, []);

  const handleSearch = useCallback(() => {
    getData();
  }, [getData]);

  return (
    <View style={{ flex: 1 }}>
      <View className="h-1/2">
        <MapsComponent locations={locations} cameraLocation={cameraLocation} />
      </View>
      <View
        style={{
          transform: [{ translateY: -50 }],
          backgroundColor: "white",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingTop: 20,
          height: 480,
        }}
      >
        <View className="flex-row items-center">
          <SearchInput
            placeholder="Search Destination"
            style={{ fontWeight: "bold" }}
            value={locationSearch}
            onChangeText={setLocationSearch}
          />
          <TouchableOpacity
            className="mr-5 bg-primary-btn p-3 rounded-xl"
            onPress={handleSearch}
          >
            <AntDesign name="search1" size={18} color={"white"} />
          </TouchableOpacity>
        </View>
        <View className="mx-3 mt-4">
          <Text className="text-xl">Results</Text>
          <View style={{ height: 300, paddingBottom: 0, marginTop: 15 }}>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <FlatList
                data={locationOutput}
                contentContainerStyle={{
                  paddingRight: 10,
                  gap: 15,
                }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <LocationItem
                    handleLocationClick={handleLocationClick}
                    item={item}
                    activeId={activeId}
                  />
                )}
              />
            )}
          </View>
        </View>
        <View
          className="flex-1 bg-slate-100 flex-row items-center pt-3 h-20 px-10 justify-between"
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (count > 0) {
                router.push("/book/locationView");
              }
            }}
          >
            <View className="w-12 h-12 bg-slate-300/60 rounded-xl relative">
              <View className="absolute right-0 bg-primary-primary-0 h-5 w-5 rounded-full flex items-center justify-center">
                <Text className="text-[10px] text-center text-white">
                  {count}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <CustomButton
            title="Next"
            onPress={() => {
              if (count > 0) {
                router.push("/(home)/book/bookingArea");
                return;
              }
              Alert.alert("Please select at least one location");
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Guide;
const LocationItemT = memo(
  (props: {
    handleLocationClick: (item: locationType) => void;
    item: locationType;
    activeId: number | null;
  }): React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > | null => {
    const { handleLocationClick, item, activeId } = props;
    const locationStore = useLocationStore();

    const handleRemoveLocation = useCallback(() => {
      locationStore.removeLocation(item.id);
    }, [item.id, locationStore]);

    const handleAddLocation = useCallback(() => {
      locationStore.addLocation(item);
    }, [item, locationStore]);

    const isLocationSelected = useMemo(() => {
      return locationStore.locations.some(
        (l) => l.lat === item.lat && l.lng === item.lng
      );
    }, [item.lat, item.lng, locationStore.locations]);

    return (
      <TouchableOpacity onPress={() => handleLocationClick(item)}>
        <View
          style={{
            flexDirection: "row",
            paddingRight: 10,
            alignItems: "center",
            borderBottomWidth: 1,
            paddingBottom: 10,
            paddingTop: 10,
            paddingLeft: 7,
            borderRadius: 5,
            borderBottomColor: "rgba(200,200,200,0.4)",
            backgroundColor:
              activeId === item.id ? "rgb(220,220,220)" : "white",
          }}
        >
          <Entypo name="location-pin" size={24} color="black" />
          <Text className="text-slate-800 flex-1 ml-2 mr-4">{item.text}</Text>
          {isLocationSelected ? (
            <TouchableOpacity
              className="ml-auto"
              onPress={handleRemoveLocation}
            >
              <AntDesign name="delete" size={24} color="green" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="ml-auto" onPress={handleAddLocation}>
              <AntDesign name="pluscircle" size={24} color="green" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const LocationItem = LocationItemT;
