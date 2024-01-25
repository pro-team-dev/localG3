import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { CheckBox } from "react-native-btr";
import languagesData from "../constants/languages";

interface Language {
  code: string;
  name: string;
}

const Checkbox: React.FC<{ checked: boolean; onPress: () => void }> = ({
  checked,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#000",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      backgroundColor: checked ? "#3498db" : "transparent",
    }}
  >
    {checked && <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>}
  </TouchableOpacity>
);

type propsType = {
  selectedLanguages: Language[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
};

const LanguageSelector = (props: propsType) => {
  const { selectedLanguages, setSelectedLanguages } = props;

  const [isVisible, setIsVisible] = useState(false);

  const toggleLanguage = (language: Language) => {
    const isSelected = selectedLanguages.some(
      (lang) => lang.code === language.code
    );
    if (isSelected) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang.code !== language.code)
      );
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };
  console.log(selectedLanguages);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleVisibility}
        className="items-center flex-row"
      >
        <Text
          style={{
            fontWeight: "bold",
            paddingRight: 5,
            marginRight: 5,
            borderRightWidth: 1,
          }}
        >
          {selectedLanguages.length > 2
            ? `${selectedLanguages[0].name}, ${selectedLanguages[1].name}, +${
                selectedLanguages.length - 2
              } more`
            : selectedLanguages.map((lang) => lang.name).join(", ")}
        </Text>
        <AntDesign name="pluscircleo" size={15} color="black" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={toggleVisibility}
              className="p-2 rounded ml-auto -mt-4 -mr-4"
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            {languagesData.map((language) => (
              <View
                key={language.code}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Checkbox
                  checked={selectedLanguages.some(
                    (lang) => lang.code === language.code
                  )}
                  onPress={() => toggleLanguage(language)}
                />
                <Text>{language.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 200,
    gap: 10,
  },
});

export default LanguageSelector;
