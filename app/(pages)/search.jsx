import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const Search = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [clinicInput, setClinicInput] = useState("");
  const [hospitalInput, setHospitalInput] = useState("");
  const navigation = useNavigation();

  const handleHospitalSearch = () => {
    navigation.navigate("hospitals", {
      selectedLocation,
      searchTerm: hospitalInput,
    });
  };

  const handleClinicSearch = () => {
    navigation.navigate("doctorsList", {
      selectedLocation,
      searchTerm: clinicInput,
    });
  };

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="flex-row items-center justify-center mb-5">
        <Ionicons name="location-outline" size={22} color="#006298" />
        <View className="flex-row items-center">
          <Picker
            selectedValue={selectedLocation}
            style={{
              width: 200,
              color: "#006298",
            }}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          >
            <Picker.Item label="Location" value="" />
            <Picker.Item label="Lucknow" value="Lucknow" />
            <Picker.Item label="Varanasi" value="Varanasi" />
            <Picker.Item label="Ghaziabad" value="Ghaziabad" />
            <Picker.Item label="Noida" value="Noida" />
            <Picker.Item label="Delhi" value="Delhi" />
          </Picker>
        </View>
      </View>

      <View className="mb-7">
        <View className="px-3 py-2 flex-row items-center border border-gray-300 rounded-full bg-gray-100 shadow-sm">
          <TextInput
            className="flex-1 py-2 px-4 text-lg bg-gray-100 rounded-full text-gray-700 placeholder-gray-500"
            placeholder="Search Doctor / Specialization"
            placeholderTextColor="#a1a1aa"
            onChangeText={(text) => setClinicInput(text)}
          />
          <TouchableOpacity
            onPress={handleClinicSearch}
            className="p-2 bg-primary rounded-full shadow-md"
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <View className="px-3 py-2 flex-row items-center border border-gray-300 rounded-full bg-gray-100 shadow-sm">
          <TextInput
            className="flex-1 py-2 px-4 text-lg bg-gray-100 rounded-full text-gray-700 placeholder-gray-500"
            placeholder="Search Hospital / Department"
            placeholderTextColor="#a1a1aa"
            onChangeText={(text) => setHospitalInput(text)}
          />
          <TouchableOpacity
            onPress={handleHospitalSearch}
            className="p-2 bg-primary rounded-full shadow-md"
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Search;
