import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Logout = () => {
  const navigation = useNavigation();

  const handleConfirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.navigate("(auth)");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-white p-8 rounded">
        <Text className="text-lg text-gray-800 mb-4">
          Are you sure you want to logout?
        </Text>
        <View className="flex-row justify-center mt-4">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleConfirmLogout}
            className="bg-red-500 py-2 px-4 rounded mr-4"
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCancel}
            className="bg-gray-200 py-2 px-4 rounded"
          >
            <Text className="text-gray-800 font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Logout;
