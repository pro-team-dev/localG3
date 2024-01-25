import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import UploadBackgroundImage from "../../components/uploadBackgroundImage";
import { router } from "expo-router";
import useStore from "../hooks/useStore";
import UploadImage from "../../components/CImagePicker";
import { IMAGE_DIVIDER } from "../../constants/utils";
import UserReviewCard from "../../components/Card";
import CustomButton from "../../components/CustomButton";
import useAuth from "../hooks/useAuth";
import fetch from "node-fetch";
import { useJwtToken } from "../globalStore/globalStore";
import { AntDesign, Feather, Fontisto } from "@expo/vector-icons";
import Seperator from "../../components/seperator";
import Colors from "../../constants/Colors";
import { Languages } from "../(guide)/profile";

const Profile: React.FC = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { logout, user } = useAuth();
  const jwtToken = useJwtToken((state) => state.jwtToken);
  const [isEdit, setIsEdit] = useState(false);
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  const [userInfo, setUserInfo] = useState<{
    email: string;
    username: string;
    name: string;
    profile: string;
    is_guide: boolean;
    citizenship?: string;
  }>();

  const handleSave = async () => {
    // const response = await fetch(`https://api.localg.biz/api/user/profile/`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${jwtToken}`,
    //   },
    //   body: JSON.stringify({
    //     phone_number: number,
    //     email: email,
    //   }),
    // });
    // const data = await response.json();
    // if (data.errors) {
    //   console.log(data.errors);
    //   return;
    // }
    setIsEdit(false);
  };
  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetch(`https://api.localg.biz/api/user/profile/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = await response.json();
      if (data.errors) {
        console.log(data.errors);
        return;
      }
      setUserInfo(data);
      setImage(data.profile);
      setEmail(data.email);
      setNumber(data.phone_number || "XXXXXXXXXX");
    };
    getUserInfo();
  }, []);

  return (
    <ScrollView
      style={{ height: Dimensions.get("window").height / IMAGE_DIVIDER }}
    >
      <View style={styles.container}>
        <UploadBackgroundImage />
        <View
          style={{
            marginTop: Dimensions.get("window").height / IMAGE_DIVIDER - 70,
            marginRight: "auto",
          }}
        >
          <UploadImage setImage={setImage} image={image} />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: -40,
            marginLeft: 110,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.username}>{userInfo?.name}</Text>
            <Text style={styles.email}>{userInfo?.email}</Text>
          </View>
          <TouchableOpacity
            style={{
              marginLeft: 80,
              backgroundColor: "rgba(200,200,200,0.5)",
              padding: 10,
              borderRadius: 10,
            }}
            onPress={() => logout()}
          >
            <AntDesign name="logout" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <View
            style={{
              width: "100%",
              marginTop: 30,
              marginLeft: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                About
              </Text>
              <View className="flex-row items-center" style={{ gap: 10 }}>
                <Feather name="phone-call" />
                {isEdit ? (
                  <TextInput
                    style={styles.editInput}
                    value={number}
                    onChangeText={setNumber}
                  />
                ) : (
                  <Text>{number}</Text>
                )}
              </View>
              <View className="flex-row items-center" style={{ gap: 10 }}>
                <Fontisto name="email" />
                {isEdit ? (
                  <TextInput
                    style={styles.editInput}
                    value={email}
                    onChangeText={setEmail}
                  />
                ) : (
                  <Text>{email}</Text>
                )}
              </View>
            </View>
            <View style={{ marginLeft: "auto", marginTop: 30 }}>
              {isEdit ? (
                <TouchableOpacity
                  onPress={handleSave}
                  style={{
                    backgroundColor: Colors.primary.btn,
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <AntDesign name="check" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEdit(true)}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <AntDesign name="edit" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Seperator />
          <View className="w-full">
            <Text className="text-xl">Languages</Text>
            <Languages isEdit={isEdit} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    paddingTop: 50,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "black",
    position: "absolute",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 30,
    top: 35,
    left: 20,
    zIndex: 1,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    top: -4,
    fontSize: 25,
    color: "black",
  },
  username: {
    fontSize: 20,
  },
  email: {
    fontSize: 13,
  },
  editInput: {
    width: 200,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
  },
});

export default Profile;
