import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Slot, Stack, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getData, getValueFor } from "../utils/storage";
import { AuthContext } from "./providers/authProvider";
import Intro from "./intro";
import { GlobalStoreContext, userType } from "./providers/store";

export type User = { username: string; email: string; userType: userType };

const RootLayout = () => {
  const rootNavigationState = useRootNavigationState();

  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState<User>();
  const [userType, setUserType] = useState<userType>();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <GlobalStoreContext.Provider value={{ userType, setUserType }}>
        <SafeAreaView className="flex-1 ">
          {/* <Slot /> */}
          <Stack initialRouteName="login">
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen
              name="touristExtraPage"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            <Stack.Screen name="(guide)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </GlobalStoreContext.Provider>
    </AuthContext.Provider>
  );
};

export default RootLayout;
