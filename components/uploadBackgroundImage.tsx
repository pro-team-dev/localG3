import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { IMAGE_DIVIDER } from "../constants/utils";

export default function UploadBackgroundImage() {
  const [image, setImage] = useState<string | null>(null);
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [360, 279],
      quality: 1,
    });

    if (!_image.canceled) {
      setImage(_image.assets[0].uri);
    }
  };
  return (
    <View className="items-center">
      <View style={imageUploaderStyles.container}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height / IMAGE_DIVIDER,
            }}
          />
        )}
        <View style={imageUploaderStyles.overlay} />
        <View style={[imageUploaderStyles.uploadBtnContainer]}>
          <TouchableOpacity onPress={addImage}>
            <AntDesign name="camera" size={23} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: Dimensions.get("window").height / IMAGE_DIVIDER,
    width: Dimensions.get("window").width,
    backgroundColor: "#efefef",
    position: "absolute",
    overflow: "hidden",
    marginTop: -20,
  },

  overlay: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / IMAGE_DIVIDER,
    position: "absolute",
    backgroundColor: "#010C36",
    opacity: 0.5,
  },

  uploadBtnContainer: {
    opacity: 0.8,
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
