import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  Pressable,
  Touchable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import Header from "../../components/Header";
import { getClinicDetails, getDoctorDetails } from "../../api/doctor";
import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRepo } from "../../hooks/useRepo";

const DoctorProfile = () => {
  const { bookingInfo, setBookingInfo } = useRepo();
  const id = bookingInfo.docId;
  const navigation = useNavigation();
  const [doctorData, setDoctorData] = useState([]);
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);

  // console.log(id);

  useEffect(() => {
    getDoctorDetails(id)
      .then((response) => {
        setDoctorData(response.data.ResponseStatus[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Doctor Data: ", error);
        setLoading(false);
      });
    getClinicDetails(id)
      .then((response) => {
        setClinicData(response.data.ResponseStatus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Clinic Data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        {/* <Text>Loading...</Text> */}
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  const formatTime = (time) => {
    const hours = parseInt(time.split(":")[0], 10);
    const minutes = time.split(":")[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${
      hours > 12 ? hours - 12 : hours
    }:${minutes} ${ampm}`;
    return formattedTime;
  };

  const handlePress = (key) => {
    setBookingInfo({
      ...bookingInfo,
      clinicId: clinicData[key].clinicId,
      clinicName: clinicData[key].clinicName,
      clinicAddress: clinicData[key].ClinicAddress,
      clinicPhone: clinicData[key].AssistantPhone,
      docName: doctorData.Name,
    });
    navigation.navigate("(pages)/clinicSlots");
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Profile" />
      <ScrollView>
        <View className="items-center bg-sky-200" style={{ width: "100%" }}>
          <View
            className="justify-between items-center flex-row my-4 p-3"
            style={{ width: "100%" }}
          >
            <View className="">
              <Text className="text-gray-800 text-2xl font-bold mb-2">
                Dr. {doctorData.Name}
              </Text>
              <Text className="text-md font-bold text-gray-800 mb-1">
                <FontAwesome6 name="user-doctor" size={18} color="#4b5563" />
                {"  "}
                {doctorData.Specialization}
              </Text>
              <Text className="text-md font-bold text-gray-800 mb-1">
                <FontAwesome5 name="graduation-cap" size={18} color="#4b5563" />
                {"  "}
                {doctorData.Qualification}
              </Text>
              <Text className="text-lg font-bold text-gray-800">
                {doctorData.Experience} years of experience
              </Text>
            </View>
            <View>
              <Image
                source={{
                  uri: `data:image/png;base64,${doctorData.Photo}`,
                }}
                className="rounded-full w-32 h-32 bg-white"
                resizeMode="contain"
                style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
              />
            </View>
          </View>
        </View>
        <View className="py-4 px-3">
          <View className="border border-gray-100">
            <View className="p-3 bg-sky-100">
              <View className="flex-row items-center ">
                <View className="rounded-full p-1 bg-primary">
                  <MaterialCommunityIcons
                    name="home-plus"
                    size={20}
                    color="white"
                  />
                </View>
                <Text className="text-xl font-bold ml-2 text-gray-800">
                  Clinic Details
                </Text>
              </View>
            </View>
            {clinicData &&
              clinicData.map((clinicData, key) => (
                <View
                  className="p-4 pb-5 border border-gray-200 border-t-0 bg-white"
                  key={key}
                >
                  <Text className="text-bold text-gray-900 mb-1 text-lg">
                    {clinicData.clinicName}
                  </Text>
                  <Text className="text-bold text-gray-900 mb-1">
                    {clinicData.ClinicAddress}
                  </Text>
                  <Text className="text-bold text-gray-900">
                    Timings:{" "}
                    {clinicData.MorningStart !== "00:00:00" &&
                      `${formatTime(clinicData.MorningStart)}, `}
                    {clinicData.MorningEnd !== "00:00:00" &&
                      `${formatTime(clinicData.MorningEnd)}, `}
                    {clinicData.NoonStart !== "00:00:00" &&
                      `${formatTime(clinicData.NoonStart)}, `}
                    {clinicData.NoonEnd !== "00:00:00" &&
                      `${formatTime(clinicData.NoonEnd)}, `}
                    {clinicData.EveningStart !== "00:00:00" &&
                      `${formatTime(clinicData.EveningStart)}, `}
                    {clinicData.EveningEnd !== "00:00:00" &&
                      `${formatTime(clinicData.EveningEnd)}`}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handlePress(key)}
                    className="px-3 py-2 bg-sky-200 mt-3 text-semibold text-gray-900 rounded-md inline-flex self-start"
                  >
                    <Text className="text-gray-900">Time Slots</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
        <View className="pb-4 px-3">
          <View className="border-gray-50 bg-white py-4 px-2">
            <Text className="text-2xl font-bold text-gray-700 mb-3">
              About The Doctor
            </Text>
            <Text className="text-lg font-bold text-gray-600">
              Dr. {doctorData.Name}
            </Text>
            <Text className="text-lg font-semibold text-gray-600">
              <FontAwesome5 name="graduation-cap" size={20} color="#4b5563" />{" "}
              {doctorData.Qualification}
            </Text>
            <Text className="text-lg font-semibold text-gray-600">
              <Ionicons name="shield-checkmark" size={20} color="#4b5563" />{" "}
              {doctorData.Experience} years of experience
            </Text>
            <Text className="text-2xl font-bold text-gray-700 my-3">About</Text>
            <Text className="text-justify">{doctorData.Description}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DoctorProfile;
