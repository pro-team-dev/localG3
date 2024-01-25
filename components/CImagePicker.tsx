import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

type ImageUploaderProps = {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function UploadImage(props: ImageUploaderProps) {
  const { image, setImage } = props;
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.8,
    });
    if (!_image.canceled) {
      setImage(_image.assets[0].uri);
    }
  };
  return (
    <View className="items-center">
      <View style={imageUploaderStyles.container}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
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
    height: 100,
    width: 100,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "50%",
  },
  uploadBtnContainerAfterImage: {
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
