import { userType } from "./../providers/store";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/authProvider";
import { router } from "expo-router";
import { getData, getValueFor, save, saveData } from "../../utils/storage";
import useStore from "./useStore";
import fetch from "node-fetch";
import { useJwtToken } from "../globalStore/globalStore";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const { userType, setUserType } = useStore();
  const tokenState = useJwtToken();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(undefined);
      if (email == "" || password == "") {
        setError("Please fill all the fields");
        return;
      }
      const res = await fetch("https://api.localg.biz/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status != 200) {
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.errors) {
        setError(data.error);
        setIsLoading(false);
        return;
      }

      const authToken = data.token.access;
      const refreshToken = data.token.refresh;
      const userTypeServer = data.user_type == "tourist" ? "Tourist" : "Guide";
      setUser({ username: "", email: email, userType: userTypeServer });
      setJwtToken(authToken);
      setUserType(userTypeServer);
      tokenState.setJwtToken(authToken);
      await save("token", authToken);
      await save("refreshToken", refreshToken);
      await saveData("userInfo", {
        username: "",
        email,
        userType: userTypeServer,
      });
      setIsLoading(false);
      if (userTypeServer == "Guide") {
        router.push("/(guide)/");
      } else {
        router.push("/(home)/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const signin = async (
    username: string,
    password: string,
    email: string,
    profile_pic: string,
    citizenship: string,
    phone_number: string,
    fullname: string
  ) => {
    try {
      setError(undefined);
      if (
        username == "" ||
        password == "" ||
        email == "" ||
        profile_pic == "" ||
        fullname == ""
      ) {
        setError("Please fill all the fields");
        return;
      }
      // if (phone_number.length != 10) {
      //   setError("Please enter a valid phone number");
      //   return;
      // }
      setIsLoading(true);

      let res = await fetch("https://api.localg.biz/api/user/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
          is_guide: userType == "Guide" ? true : false,
          profile: profile_pic,
          citizenship: citizenship,
          phone_number: phone_number,
          name: fullname,
          hourly_rate: null,
        }),
      });
      let data = await res.json();
      if (data.errors) {
        setError(data.error);
        setIsLoading(false);
        return;
      }
      let token = data.token.access;
      let refreshToken = data.token.refresh;

      setUser({ username, email, userType });
      setJwtToken(token);
      tokenState.setJwtToken(token);
      await save("token", token);
      await save("refreshToken", refreshToken);
      await saveData("userInfo", { username, email, userType });
      if (userType == "Guide") {
        router.push("/(guide)/");
      } else {
        router.push("/(home)/");
      }
    } catch (error) {
      console.error("Signin error:", error);
      setError("Signin failed. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setJwtToken(undefined);
      setUserType(undefined);

      tokenState.setJwtToken(null);
      setUser(undefined);
      setUserType(undefined);
      await save("token", "");
      await saveData("userInfo", "");
      await save("refreshToken", "");
      setIsLoading(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed. Please try again.");
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const userToken = await getValueFor("token");
      const userInfo = await getData("userInfo");

      if (!userToken || !userInfo) {
        setIsLoading(false);
        return;
      }

      let res = await fetch("https://api.localg.biz/api/user/ongoing-tours/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res.status != 200) {
        logout();
        return;
      }
      let data = await res.json();
      if (data.errors) {
        if (data.errors.code == "token_not_valid") {
          logout();
        }
      }
      setUserType(userInfo.userType);
      setUser(userInfo);
      setJwtToken(userToken);
      tokenState.setJwtToken(userToken);
      setIsLoading(false);
    } catch (error) {
      console.error("IsLoggedIn error:", error);
      setError("Error checking login status.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return {
    user,
    login,
    signin,
    logout,
    isLoading,
    error,
    clearError: () => setError(undefined),
    jwtToken,
  };
};

export default useAuth;
