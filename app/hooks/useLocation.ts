import * as Location from "expo-location";
import { useEffect, useState } from "react";
import * as opencage from "opencage-api-client";

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    locate();
  }, []);
  const locate = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location1 = await Location.getCurrentPositionAsync({});
    setLocation(location1);
  };

  const getLocationCity = async () => {
    let data = await opencage.geocode({
      key: process.env.EXPO_PUBLIC_OPENCAGE_API_KEY,
      q: `${location?.coords.latitude},${location?.coords.longitude}`,
    });
    let r = data.results[0];
    let city: string = r.components.county;
    return city;
  };

  return { location, errorMsg, locate, getLocationCity };
};

export default useLocation;
