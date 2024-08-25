import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const Header = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View className="flex-row items-center px-4 py-3 bg-primary">
      <TouchableOpacity
        className="pr-5"
        onPress={() => navigation.goBack()}
        activeOpacity={0.6}
      >
        <FontAwesome6 name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-white">{title}</Text>
    </View>
  );
};

export default Header;
