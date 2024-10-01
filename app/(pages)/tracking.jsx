import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
// import MapView from "react-native-maps";
import WebView from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { getTokenDetails } from "../../api/appointments";

const Tracking = () => {
  const { bookingId } = useLocalSearchParams();
  const [tokenDetails, setTokenDetails] = useState({});
  const [mapRegion, setMapRegion] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  function getFormatedDate(utcDateString) {
    const utcDate = new Date(utcDateString);
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getMonth();
    const day = utcDate.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day.toString().padStart(2, "0")}-${months[month]}-${year}`;
  }

  const fetchTokenDetails = async () => {
    if (bookingId) {
      console.log("bookingId is available", bookingId);
      const response = await getTokenDetails(bookingId);
      console.log("response", response.data.ResponseStatus[0]);
      setTokenDetails(response.data.ResponseStatus[0]);
      setMapRegion({
        latitude: response.data.ResponseStatus[0].Latitude,
        longitude: response.data.ResponseStatus[0].Longitude,
      });
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchTokenDetails();
  }, [bookingId, refreshing]);

  const iframeSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.545939224378!2d80.99571637514089!3d26.790740065322243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be5319a1ee6e3%3A0xb591b5df4b31ef9d!2sSkyline%20plaza%203!5e0!3m2!1sen!2sin!4v1724403001325!5m2!1sen!2sin`;

  return (
    <View className="flex-1 bg-white">
      <Header title={"Track Appointmnet"} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-3">
          <View className="p-4">
            <View className="">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                Dr. {tokenDetails.drName}
              </Text>
              <Text className="text-gray-600 text-lg">
                {getFormatedDate(tokenDetails.AppDate)}
              </Text>
              <View className="my-3">
                <Text className="text-blue-500 mt-1">Your Token:</Text>
                <Text className="text-xl text-bold text-gray-600">
                  B{tokenDetails.TokenNo}
                </Text>
              </View>
              <View className="flex-row">
                <View className="w-1/2">
                  <Text className=" text-blue-500 mt-1">Current Token:</Text>
                  <Text className="text-gray-600">Not active</Text>
                </View>
                <View className="w-1/2">
                  <Text className=" text-blue-500 mt-1">Estimate Time:</Text>
                  <Text className="text-gray-600">
                    {tokenDetails.appTimeSlot}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="p-4 border-t border-gray-200">
            <Text className="text-lg font-bold text-blue-600">Address</Text>
            <Text className="text-gray-700 mt-2 text-lg">
              {tokenDetails.clinicName}
            </Text>
            <Text className="text-sm text-gray-700 mt-2">
              {tokenDetails.Address}
            </Text>

            <View className="rounded-lg mt-4">
              <WebView
                source={{
                  html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    <body style="height: 100vh; width: 100vw; ">
                    <iframe src="${iframeSrc}" style="border:1px; width:100%; height: 100%" ; border-radius: 25px;  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </body>
                    </html>`,
                }}
                className="w-full h-52 rounded-lg"
              />
            </View>
          </View>

          <View className="flex-row justify-between p-4 border-t border-gray-200">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg mr-2"
              onPress={() => console.log("Rechedule")}
            >
              <Text className="text-center text-gray-800 text-lg">
                Reschedule
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-lg ml-2"
              onPress={() => console.log("Cancel")}
            >
              <Text className="text-center text-white text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Tracking;
