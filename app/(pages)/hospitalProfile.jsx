import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getHospitalDetails, getHospitalDoctors } from "../../api/hospital";
import { useRepo } from "../../hooks/useRepo";

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { hospitalBookingInfo, setHospitalBookingInfo } = useRepo();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const hospitalResponse = await getHospitalDetails(id);
        const doctorsResponse = await getHospitalDoctors(id);
        setHospital(hospitalResponse.data.ResponseStatus[0]);
        setDoctorsData(doctorsResponse.data.ResponseStatus);
      } catch (error) {
        console.error("Error fetching details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours > 12 ? hours - 12 : hours || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const setBookingDetails = (doctor = {}) => {
    const hospitalAdd = `${hospital.addressLine1}${
      hospital.addressLine2 ? `, ${hospital.addressLine2}` : ""
    }, ${hospital.city}, ${hospital.state}, ${hospital.pincode}`;

    setHospitalBookingInfo((prevInfo) => ({
      ...prevInfo,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      hospitalAdd,
      docId: doctor.id || null,
      docName: doctor.name || null,
    }));
  };

  const handleViewAll = () => {
    setBookingDetails();
    navigation.navigate("(pages)/hospitalDoctors", {
      id: hospital.id,
      department: hospital.departments,
    });
  };

  const handleDoctorPress = (doctor) => {
    setBookingDetails(doctor);
    navigation.navigate("(pages)/hospitalDocProfile", { id: doctor.id });
  };

  const handleBookApp = (doctor) => {
    setBookingDetails(doctor);
    console.log(hospitalBookingInfo);
    navigation.navigate("(pages)/hospitalSlots");
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Hospital Profile" />

      {/* Use FlatList as main container */}
      <FlatList
        data={doctorsData.slice(0, 5)}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <>
            {/* Header and Hospital Details */}
            <View className="items-center bg-sky-200" style={{ width: "100%" }}>
              <View
                className="flex-row justify-between items-start my-4 p-3"
                style={{ width: "100%" }}
              >
                {/* Logo Section */}
                <View>
                  <Image
                    source={{ uri: `data:image/png;base64,${hospital.logo}` }}
                    className="rounded-xl w-28 h-28 bg-white"
                    resizeMode="contain"
                    style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
                  />
                </View>

                {/* Details Section */}
                <View className="flex-1 ml-4">
                  <Text className="text-gray-800 text-2xl font-bold mb-2">
                    {hospital.name}
                  </Text>

                  {/* Address */}
                  <View style={{ flexDirection: "row" }}>
                    <MaterialIcons
                      name="location-pin"
                      size={22}
                      color="#374151"
                    />
                    <Text className="text-md font-semibold text-gray-700 mb-1 ml-1">
                      {hospital.addressLine1}
                      {hospital.addressLine2
                        ? `, ${hospital.addressLine2}`
                        : ""}
                      , {hospital.city}, {hospital.state}, {hospital.pincode}
                    </Text>
                  </View>

                  {/* Timings */}
                  <View
                    style={{ flexDirection: "row" }}
                    className="items-center"
                  >
                    <MaterialIcons
                      name="access-time"
                      size={22}
                      color="#374151"
                    />
                    <Text className="text-base font-semibold text-gray-700 ml-1">
                      {formatTime(hospital.opdStartTime)} -{" "}
                      {formatTime(hospital.opdEndTime)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Departments Section */}
            <View className="px-6 mt-4">
              <View className="flex-row items-baseline">
                <MaterialCommunityIcons
                  name="hospital-building"
                  size={20}
                  color="#006298"
                />
                <View>
                  <Text className="text-lg font-semibold ml-2 mb-1 text-gray-800">
                    Departments
                  </Text>
                  <Text className="ml-2 text-gray-800">
                    {hospital.departments}
                  </Text>
                </View>
              </View>
            </View>

            {/* Facilities Section */}
            <View className="px-6 mt-3">
              <View className="flex-row items-baseline">
                <MaterialIcons
                  name="local-hospital"
                  size={20}
                  color="#006298"
                />
                <View className="">
                  <Text className="text-lg font-semibold ml-2 mb-1 text-gray-800">
                    Facilities
                  </Text>
                  <Text className="ml-2 text-gray-800">
                    {hospital.facilities}
                  </Text>
                </View>
              </View>
            </View>

            {/* Doctors Section Header */}
            <View className="px-6 mt-8">
              <View className="flex-row items-center mb-3">
                <Fontisto name="stethoscope" size={20} color="#006298" />
                <Text className="text-lg font-semibold ml-2 text-gray-700">
                  Doctors
                </Text>
              </View>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleDoctorPress(item)}
          >
            <View className="flex-row justify-between items-center pt-2 pb-4 mx-5 px-1 border-b-[0.5px] border-slate-500 mb-2 rounded-md">
              <View className="flex-row">
                <Image
                  source={{ uri: `data:image/png;base64,${item.photo}` }}
                  className="rounded-full w-16 h-16 bg-white border-gray-500 border"
                  resizeMode="contain"
                />
                <View className="ml-4">
                  <Text className="text-lg font-semibold text-gray-700">
                    Dr. {item.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Department: {item.department}
                  </Text>
                  <Text className="text-xs text-gray-600">
                    {item.experience} years of experience
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleBookApp(item)}
                className="px-2 py-1 bg-sky-500 rounded"
              >
                <Text className="text-white">Book</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <>
            <TouchableOpacity
              onPress={handleViewAll}
              className="mt-2 mx-6"
              activeOpacity={0.7}
            >
              <Text className="font-bold text-sky-600">View All Doctors</Text>
            </TouchableOpacity>

            {/* About Section */}
            <View className="px-6 mt-8">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="info-outline" size={20} color="#006298" />
                <Text className="ml-2 text-lg font-bold text-gray-700">
                  About
                </Text>
              </View>
              <Text className="text-gray-600 pl-7">{hospital.description}</Text>
            </View>

            {/* Emergency Contact Section */}
            <View className="px-6 mt-4">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="phone-in-talk" size={20} color="#006298" />
                <Text className="ml-2 text-lg font-bold text-gray-700">
                  Emergency Contact
                </Text>
              </View>
              <Text className="text-gray-600 pl-7">
                {hospital.emergencyPhoneNum}
              </Text>
            </View>

            {/* Email Section */}
            <View className="px-6 mt-4 mb-10">
              <View className="flex-row items-center mb-1">
                <MaterialIcons name="email" size={20} color="#006298" />
                <Text className="ml-2 text-lg font-bold text-gray-700">
                  Email
                </Text>
              </View>
              <Text className="text-gray-600 pl-7">{hospital.email}</Text>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default HospitalProfile;
