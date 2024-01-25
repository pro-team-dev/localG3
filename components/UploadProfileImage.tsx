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

export default function UploadProfileImage() {
  const [image, setImage] = useState<string | null>(null);
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
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
          <Image source={{ uri: image }} style={{ width: 120, height: 120 }} />
        )}
        <View
          style={[
            imageUploaderStyles.uploadBtnContainer,
            image ? imageUploaderStyles.uploadBtnContainerAfterImage : {},
          ]}
        >
          <TouchableOpacity
            onPress={addImage}
            style={imageUploaderStyles.uploadBtn}
          >
            {image ? "" : <Text>Upload</Text>}
            <AntDesign name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 120,
    width: 120,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: Dimensions.get('window').height/2.6 - 60,
  },
  uploadBtnContainer: {
    opacity: 0.6,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "50%",
  },
  uploadBtnContainerAfterImage: {
    height: "20%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
