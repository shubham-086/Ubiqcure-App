import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Header from "../../components/Header";
import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { getHospitalDoctorDetail } from "../../api/hospital";
import { useRepo } from "../../hooks/useRepo";

const DoctorProfile = () => {
  const navigation = useNavigation();
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hospitalBookingInfo, setHospitalBookingInfo } = useRepo();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    getHospitalDoctorDetail(id)
      .then((response) => {
        setDoctorData(response.data.ResponseStatus[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Doctor Data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  const formatTime = (time) => {
    if (!time) return "";
    const hours = parseInt(time.split(":")[0], 10);
    const minutes = time.split(":")[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${
      hours > 12 ? hours - 12 : hours
    }:${minutes} ${ampm}`;
    return formattedTime;
  };

  const handlePress = () => {
    // setHospitalBookingInfo({ ...hospitalBookingInfo });
    navigation.navigate("(pages)/hospitalSlots");
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Profile" />
      <ScrollView>
        <View className="items-center bg-sky-200" style={{ width: "100%" }}>
          <View
            className="justify-between items-center flex-row my-4 px-4"
            style={{ width: "100%" }}
          >
            <View className="">
              <Text className="text-gray-800 text-2xl font-bold mb-2">
                Dr. {doctorData.name}
              </Text>
              <Text className="text-md font-bold text-gray-800 mb-1">
                <FontAwesome6 name="user-doctor" size={18} color="#4b5563" />
                {"  "}
                {doctorData.specialization}
              </Text>
              <Text className="text-md font-bold text-gray-800 mb-1">
                <FontAwesome5 name="graduation-cap" size={18} color="#4b5563" />
                {"  "}
                {doctorData.qualification}
              </Text>
              <Text className="text-lg font-bold text-gray-800">
                {doctorData.experience} years of experience
              </Text>
            </View>
            <View>
              <Image
                source={{
                  uri: `data:image/png;base64,${doctorData.photo}`,
                }}
                className="rounded-full w-32 h-32 bg-white"
                resizeMode="contain"
                style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
              />
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          <View className="flex-row items-baseline">
            <MaterialIcons name="access-time" size={22} color="#006298" />
            <View>
              <Text className="text-lg font-semibold ml-2 mb-1 text-gray-800">
                Timings
              </Text>
              <Text className="ml-2 text-gray-800">
                {doctorData.morningStart !== "00:00:00" &&
                  `${formatTime(doctorData.morningStart)} - `}
                {doctorData.morningEnd !== "00:00:00" &&
                  `${formatTime(doctorData.morningEnd)}`}
                {doctorData.noonStart !== "00:00:00" &&
                  `, ${formatTime(doctorData.noonStart)} - `}
                {doctorData.noonEnd !== "00:00:00" &&
                  `${formatTime(doctorData.noonEnd)}`}
                {doctorData.eveningStart !== "00:00:00" &&
                  `, ${formatTime(doctorData.eeningStart)} - `}
                {doctorData.eveningEnd !== "00:00:00" &&
                  `${formatTime(doctorData.eveningEnd)}`}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-6 mt-4">
          <View className="flex-row items-baseline">
            <MaterialCommunityIcons
              name="hospital-building"
              size={22}
              color="#006298"
            />
            <View>
              <Text className="text-lg font-semibold ml-2 mb-1 text-gray-800">
                {hospitalBookingInfo.hospitalName}
              </Text>
              <Text className="ml-2 text-gray-800">
                {hospitalBookingInfo.hospitalAdd}
              </Text>
            </View>
          </View>
          <View className="mt-8 px-10">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handlePress}
              className="px-3 py-2 bg-sky-400 inline-flex self-start rounded"
            >
              <Text className="text-white font-semibold">Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-6 mt-8">
          <View className="flex-row items-center mb-1">
            <MaterialIcons name="info-outline" size={20} color="#006298" />
            <Text className="ml-2 text-lg font-bold text-gray-700">About</Text>
          </View>
          <Text className="text-gray-600 pl-7">{doctorData.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DoctorProfile;
