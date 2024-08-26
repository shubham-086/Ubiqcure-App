import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useRepo } from "../../hooks/useRepo";
import { viewAppRequestDetails } from "../../api/booking";
import { useNavigation } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const Invoice = () => {
  const [appRequest, setAppRequest] = useState();
  const { bookingInfo, patient, setBookingInfo, setPatient } = useRepo();
  const navigation = useNavigation();

  useEffect(() => {
    getAppRequest();
  }, []);

  const formatTime = (timeString) => {
    const [hourStr, minute] = timeString.split(":");
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  function getFormatedDate(utcDateString) {
    const utcDate = new Date(utcDateString);
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getMonth();
    const day = utcDate.getDate();
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day.toString().padStart(2, "0")}-${months[month]}-${year}`;
  }

  const formattedTime = formatTime(bookingInfo.appTime);

  const getAppRequest = async () => {
    try {
      const response = await viewAppRequestDetails(bookingInfo.transactionId);
      console.log(response);
      setAppRequest(response);
    } catch (error) {
      console.log("Error in fetching Appointment Request: ", error);
    }
  };

  const handleNavigation = () => {
    navigation.navigate("doctorsList");
    setBookingInfo(null);
    setPatient(null);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 bg-primary">
        <TouchableOpacity
          className="pr-5"
          onPress={handleNavigation}
          activeOpacity={0.6}
        >
          <FontAwesome6 name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Invoice</Text>
      </View>
      <ScrollView>
        <View className="p-5">
          <Text className="text-xl font-semibold mb-5 text-green-600 text-center">
            Appointment Booked
          </Text>
          <View className="my-2">
            <View className="mb-4 flex flex-row items-baseline border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Token Number:</Text>
              <Text className="text-2xl text-bold ml-4 mb-2">
                B{bookingInfo.slotNumber}
              </Text>
            </View>

            <View className="mb-4 flex flex-row items-baseline border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Booking ID:</Text>
              <View className="ml-4 flex-1 flex flex-row justify-between mb-2">
                <Text className="text-lg">{bookingInfo.bookingId}</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="bg-gray-200 border border-gray-200 py-1 px-2 rounded"
                  onPress={() =>
                    Clipboard.setStringAsync(bookingInfo.bookingId)
                  }
                >
                  <Text className="text-sm text-center text-gray-600 font-bold">
                    Copy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4 flex flex-row items-baseline border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Doctor Name:</Text>
              <Text className="text-lg ml-4 mb-2">
                Dr. {bookingInfo.docName}
              </Text>
            </View>

            <View className="mb-4 flex flex-row items-baseline border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Date & Time:</Text>
              <Text className="text-lg ml-4 mb-2">
                {getFormatedDate(bookingInfo.appDate)}, {formattedTime}
              </Text>
            </View>

            <View className="mb-3 flex flex-row border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Patient Details:</Text>
              <View className="ml-4 flex-1 flex-wrap mb-2">
                <Text className="text-lg overflow-ellipsis overflow-hidden max-w-full">
                  {patient.patientName}, {patient.gender}, {patient.phoneNumber}
                </Text>
              </View>
            </View>

            <View className="mb-4 flex flex-col border-dashed border-b border-gray-400">
              <View className="flex flex-row">
                <Text className="text-lg mb-2">Clinic Details:</Text>
                <Text className="text-lg ml-2 text-wrap">
                  {bookingInfo.clinicName}
                </Text>
              </View>
              <View className="flex-1 mb-2">
                <Text className="text-sm">{bookingInfo.clinicAddress}</Text>
                <Text className="text-sm">{bookingInfo.clinicPhone}</Text>
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-lg mb-3 font-semiibold">Booking Fees</Text>
              <View className="flex flex-row justify-between mb-2">
                <Text className="text-sm">Slot booking cost: </Text>
                <Text className="text-sm">
                  <Text className="line-through inline-block mr-1">₹20</Text>
                  {"  "}
                  <Text className="inline-block mr-1">₹0.83</Text>
                  {"  "}
                  <Text className="text-xs inline-block text-green-600">
                    (Promo offer)
                  </Text>
                </Text>
              </View>
              <View className="flex flex-row justify-between mb-2">
                <Text className="text-sm">Processing fees (2%): </Text>
                <Text className="text-sm">₹ 0.02/-</Text>
              </View>
              <View className="flex flex-row justify-between mb-2">
                <Text className="text-sm">GST (18%): </Text>
                <Text className="text-sm">₹ 0.15/-</Text>
              </View>
              <View className="flex flex-row justify-between border-t border-gray-500 pt-1">
                <Text className="text-sm">Total: </Text>
                <Text className="text-sm">₹ 1.00/-</Text>
              </View>
            </View>
          </View>

          <View className="flex justify-center mt-5">
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-primary border border-primary py-3 px-4 rounded"
              onPress={handleNavigation}
            >
              <Text className="text-xl text-center text-white font-bold">
                Back To Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Invoice;
