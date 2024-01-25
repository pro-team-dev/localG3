import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  useLocationStore,
  locationType,
} from "../../globalStore/locationStore";
import { router } from "expo-router";

interface CustomHeaderProps {
  onBackPress: () => void;
  onDeletePress: () => void;
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  onBackPress,
  onDeletePress,
  title,
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      paddingTop: StatusBar.currentHeight + 10,
    }}
  >
    <TouchableOpacity onPress={onBackPress}>
      <AntDesign name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity onPress={onDeletePress}>
      <AntDesign name="delete" size={24} color="black" />
    </TouchableOpacity>
  </View>
);

const LocationView: React.FC = () => {
  const locationStore = useLocationStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDeleteLocation = () => {
    const locationToRemove = locationStore.locations[currentIndex];
    if (locationToRemove) {
      const { lat, lng } = locationToRemove;
      // Assuming lat and lng together uniquely identify the location
      locationStore.removeLocationUsingLatAndLng(lat, lng);
      // Implement any additional logic after removing the location
      // For example, you can navigate back to the previous screen
      // using the navigation.goBack() function
    }
  };

  const handleNextLocation = () => {
    if (currentIndex < locationStore.locations.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBackLocation = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentLocation = locationStore.locations[currentIndex];

  return (
    <View>
      <CustomHeader
        onBackPress={() => {
          router.replace("/book/");
        }}
        onDeletePress={handleDeleteLocation}
        title="Location View"
      />
      <View style={{ alignItems: "center", margin: 10 }}>
        <Image
          source={{
            uri: "https://admin.hikingbees.com/media/temple-g6bf49f8f9_1920.jpg",
          }}
          style={{ width: 300, height: 400, borderRadius: 10 }}
        />
        <Text className="text-xl font-bold mt-10">
          {currentLocation?.text.split(",")[0]}
        </Text>
        <Text className="text-base mx-10 mt-4 text-center">
          {currentLocation?.text}
        </Text>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {currentIndex > 0 && (
            <TouchableOpacity onPress={handleBackLocation}>
              <View
                style={{
                  backgroundColor: "green",
                  borderRadius: 30,
                  padding: 10,
                  marginRight: 30,
                }}
              >
                <AntDesign name="arrowleft" size={24} color="white" />
              </View>
            </TouchableOpacity>
          )}
          {currentIndex < locationStore.locations.length - 1 && (
            <TouchableOpacity onPress={handleNextLocation}>
              <View
                style={{
                  backgroundColor: "green",
                  borderRadius: 30,
                  padding: 10,
                }}
              >
                <AntDesign name="arrowright" size={24} color="white" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default LocationView;
