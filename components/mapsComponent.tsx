import { View, Text } from "react-native";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Mapbox, {
  Camera,
  MapView,
  MarkerView,
  PointAnnotation,
} from "@rnmapbox/maps";
import useLocation from "../app/hooks/useLocation";
import * as opencage from "opencage-api-client";
import type { locationType } from "../app/(home)/guide";

Mapbox.setAccessToken(
  "sk.eyJ1IjoiYWxsd2NvbnMiLCJhIjoiY2xybHpoejUwMGxhcDJqb2p6Z200bWtmaCJ9.bY2hOS6FBtVv6ggKiUmr7g"
);

const MapsComponent = (props: {
  locations?: locationType[];
  cameraLocation: [number, number] | null;
}) => {
  const { location } = useLocation();
  const [calloutVisible, setCalloutVisible] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [locationOutput, setLocationOutput] = useState<
    { lat: number; lng: number }[]
  >([]);

  const onMarkerPress = () => {
    setCalloutVisible(true);
  };
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <MapView style={{ flex: 1 }} scaleBarEnabled={false}>
        {location && (
          <>
            {props.cameraLocation && (
              <Camera
                zoomLevel={17}
                centerCoordinate={props.cameraLocation as [number, number]}
                animationMode="flyTo"
                animationDuration={2000}
              />
            )}
            <PointAnnotation
              id="userLocation"
              coordinate={[
                location?.coords.longitude,
                location?.coords.latitude,
              ]}
              title="Your location"
            >
              <View className="w-14 h-14 bg-blue-600/[0.2] rounded-full justify-center items-center border-[1.3px] border-blue-400">
                <View className="w-3 h-3 bg-blue-600 rounded-full"></View>
              </View>
            </PointAnnotation>
            {props.locations &&
              props.locations.map((location, index) => (
                <PointAnnotation
                  key={index.toString()}
                  id="userLocation"
                  coordinate={[location.lng, location.lat]}
                  title="Your location"
                >
                  <View className="w-14 h-14 bg-blue-600/[0.2] rounded-full justify-center items-center border-[1.3px] border-blue-400">
                    <View className="w-3 h-3 bg-blue-600 rounded-full"></View>
                  </View>
                </PointAnnotation>
              ))}
          </>
        )}
      </MapView>
    </View>
  );
};

export default MapsComponent;
