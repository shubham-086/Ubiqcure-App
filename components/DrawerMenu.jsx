import { TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const DrawerMenu = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="h-10 w-10 rounded-full items-center justify-center bg-blue-50"
      onPress={() => navigation.toggleDrawer()}
      activeOpacity={0.6}
    >
      <Feather name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default DrawerMenu;
