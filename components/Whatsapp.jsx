import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity, Linking } from "react-native";

const Whatsapp = () => {
  const openWhatsAppChat = () => {
    const url = `whatsapp://send?phone=${9151003350}`;
    Linking.openURL(url);
  };
  return (
    <TouchableOpacity
      className="h-10 w-10 rounded-full items-center justify-center bg-green-50"
      onPress={() => openWhatsAppChat()}
      activeOpacity={0.6}
    >
      <FontAwesome name="whatsapp" size={24} color="green" />
    </TouchableOpacity>
  );
};

export default Whatsapp;
