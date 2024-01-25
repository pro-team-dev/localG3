import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Switch,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import UploadBackgroundImage from "../../components/uploadBackgroundImage";
import { router } from "expo-router";
import useStore from "../hooks/useStore";
import UploadImage from "../../components/CImagePicker";
import { IMAGE_DIVIDER } from "../../constants/utils";
import UserReviewCard from "../../components/Card";
import { ScrollView } from "react-native-gesture-handler";
import ReviewStar from "../../components/reviewStar";
import { AntDesign, Feather, FontAwesome5, Fontisto } from "@expo/vector-icons";
import Seperator from "../../components/seperator";
import Colors from "../../constants/Colors";
import languagesData from "../../constants/languages";
import useAuth from "../hooks/useAuth";
import { useJwtToken } from "../globalStore/globalStore";
const Profile: React.FC = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [number, setNumber] = useState<string | undefined>("9811826820");
  const [email, setEmail] = useState<string | undefined>("rabni@gmail.com");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [hourly, setHourly] = useState<number>(1000);
  const [hourlyNegotiable, setHourlyNegotiable] = useState<boolean>(false);
  const [daily, setDaily] = useState<number>(5000);
  const [dailyNegotiable, setDailyNegotiable] = useState<boolean>(false);
  const { jwtToken } = useJwtToken();
  let [lan, setLan] = useState<string[]>([]);

  const [userInfo, setUserInfo] = useState<{
    id: number;
    email: string;
    name: string;
    profile: string;
    username: string;
    citizenship: string;
    is_guide: boolean;
    phone_number: string;
    hourly_rate: number;
  }>();
  useEffect(() => {
    async function getUserInfo() {
      const data = await fetch("https://api.localg.biz/api/user/profile/", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      let user = await data.json();
      setUserInfo(user);
      setNumber(user.phone_number || "XXXXXXXXX");
      setEmail(user.email);
      setHourly(user.hourly_rate || 1200);
      setDaily(user.hourly_rate * 8 || 10000);
      setImage(user.profile);
    }
    getUserInfo();
  }, []);

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleEditSave = async () => {
    let res = await fetch("https://api.localg.biz/api/user/profile/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone_number: number,
        email: email,
        hourly_rate: hourly,
        languages: lan,
      }),
    });
    let result = await res.json();
    if (result.errors) {
      Alert.alert("Error", result.errors[0].message);
      return;
    }
    Alert.alert("Success", "Profile Updated");
    setIsEdit(!isEdit);
  };

  return (
    <ScrollView style={{ height: Dimensions.get("window").height }}>
      <View style={styles.container}>
        <UploadBackgroundImage />
        <View
          style={{
            marginTop: Dimensions.get("window").height / IMAGE_DIVIDER - 70,
            marginRight: "auto",
            marginLeft: -10,
          }}
        >
          <UploadImage setImage={setImage} image={image} />
        </View>
        <View style={styles.userDetail}>
          <View>
            <Text style={styles.username}>{userInfo?.name || "--------"}</Text>
            <ReviewStar rating={4.5} height={17} width={17} />
          </View>
          <View style={{ flex: 1, marginLeft: 60, marginTop: 4 }}>
            <Text
              style={{ color: Colors.primary["primary-0"], fontWeight: "bold" }}
            >{`Nrs ${hourly}  \n /hour`}</Text>
          </View>
        </View>
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
                onPress={handleEditSave}
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
                onPress={handleEdit}
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
          <Languages isEdit={isEdit} lan={lan} setLan={setLan} />
        </View>
        <Seperator />
        <View className="w-full">
          <Text className="text-xl">Pricing (Nrs.)</Text>
          <View
            className="flex-row justify-evenly mx-2 px-2 bg-gray-200 mt-4 py-5 rounded-xl"
            style={{ gap: 20 }}
          >
            <View
              className="flex-column items-center"
              style={{ gap: 10, marginTop: 0 }}
            >
              <Text className="text-primary-primary-0">Hourly</Text>
              <View
                className="flex-column items-center mx-3"
                style={{ gap: 10 }}
              >
                {isEdit ? (
                  <>
                    <TextInput
                      style={styles.priceEditInput}
                      value={hourly.toString()}
                      onChangeText={(text) => setHourly(parseInt(text))}
                    />
                    <View className="flex-row items-center">
                      <Text>Negotiable</Text>
                      <Switch
                        value={hourlyNegotiable}
                        onValueChange={setHourlyNegotiable}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text>{hourly}</Text>
                    <Text>
                      {hourlyNegotiable ? "Negotiable" : "Non-Negotiable"}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View
              className="flex-column items-center"
              style={{ gap: 10, marginTop: 0 }}
            >
              <Text className="text-primary-primary-0">One Day</Text>
              <View
                className="flex-column items-center mx-3"
                style={{ gap: 10 }}
              >
                {isEdit ? (
                  <>
                    <TextInput
                      style={styles.priceEditInput}
                      value={daily.toString()}
                      onChangeText={(text) => setDaily(parseInt(text))}
                    />
                    <View className="flex-row items-center">
                      <Text>Negotiable</Text>
                      <Switch
                        value={dailyNegotiable}
                        onValueChange={setDailyNegotiable}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text>{daily}</Text>
                    <Text>
                      {dailyNegotiable ? "Negotiable" : "Non-Negotiable"}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
          <Text className="ml-auto mt-3">
            *For up to{" "}
            <Text className="text-primary-primary-0">3-person Group</Text>
          </Text>
        </View>
        <Seperator />
        <Text className="w-full text-xl">Reviews</Text>
        <ScrollView
          className="my-1"
          style={{ width: Dimensions.get("window").width - 30 }}
          horizontal
        >
          <View style={{ width: Dimensions.get("window").width - 30 }}>
            <UserReviewCard
              rating={5}
              reviewText={
                "I had an amazing experience with the tourist guide. They were very knowledgeable and showed me all the hidden gems of the city. I highly recommend their services to anyone looking for a memorable and insightful tour."
              }
              username={"Atul Tiwari"}
              avatar={"https://i.pravatar.cc/300"}
            />
          </View>
          <View style={{ width: Dimensions.get("window").width - 30 }}>
            <UserReviewCard
              rating={3.5}
              reviewText={
                "I had an amazing experience with the tourist guide. They were very knowledgeable and showed me all the hidden gems of the city. I highly recommend their services to anyone looking for a memorable and insightful tour."
              }
              username={"Anuj Paudel"}
              avatar={"https://i.pravatar.cc/400"}
            />
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export function Languages(props: {
  isEdit: boolean;
  lan: string[];
  setLan: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { isEdit } = props;
  const { lan, setLan } = props;
  const [language, setLanguage] = useState<string>("");

  const handleAddLanguage = () => {
    if (language.trim() === "") return;

    const isValidLanguage = languagesData.some((lang) => {
      return lang.name.trim().toLowerCase() == language.trim().toLowerCase();
    });
    if (isValidLanguage) {
      setLan([...lan, language]);
      setLanguage("");
    } else {
      Alert.alert(`Invalid language: ${language}`);
    }
  };

  const handleDelete = (index: number) => {
    let _lan = [...lan];
    _lan.splice(index, 1);
    setLan(_lan);
  };
  return (
    <View>
      {isEdit ? (
        <View>
          <View
            className="flex-row"
            style={{ gap: 10, marginTop: 10, alignItems: "center" }}
          >
            <TextInput
              value={language}
              onChangeText={setLanguage}
              style={styles.editInput}
              placeholder="Add Language"
            />
            <TouchableOpacity
              onPress={handleAddLanguage}
              style={{
                backgroundColor: Colors.primary.btn,
                borderRadius: 10,
                height: 40,
                paddingHorizontal: 10,
                justifyContent: "center",
              }}
            >
              <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            {lan?.map((item, index) => (
              <LanguageItemDeleteable
                key={index}
                language={item}
                index={index}
                handleDelete={handleDelete}
              />
            ))}
          </View>
        </View>
      ) : (
        <View className="flex-row" style={{ gap: 10, marginTop: 10 }}>
          {lan?.map((item, index) => (
            <LanguageItem key={index} language={item} />
          ))}
          {lan?.length == 0 ? (
            <Text className="mx-auto pt-4 items-center">
              Add Languages you are fluent in{" "}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

function LanguageItemDeleteable(props: {
  language?: string;
  index: number;
  handleDelete: (index: number) => void;
}) {
  return (
    <View
      className="p-1 rounded-sm px-2 flex-row items-center"
      style={{ gap: 10 }}
    >
      <Text className="text-[16px]">{props.language}</Text>
      <TouchableOpacity
        className="ml-auto"
        onPress={() => props.handleDelete(props.index)}
      >
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

function LanguageItem(props: { language?: string }) {
  return (
    <View className="bg-gray-200 p-1 rounded-sm px-2">
      <Text className="text-[16px]">{props.language}</Text>
    </View>
  );
}

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
  priceEditInput: {
    width: 100,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    position: "absolute",
    paddingTop: Dimensions.get("window").height / 2.6 - 70,
    fontSize: 13,
    color: "white",
  },
  userDetail: {
    color: "white",
    position: "absolute",
    top: Dimensions.get("window").height / IMAGE_DIVIDER + 10,
    left: 120,
    flexDirection: "row",
  },
});

export default Profile;
