import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import DrawerMenu from "@/components/DrawerMenu";
import Whatsapp from "@/components/Whatsapp";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const [placeholder, setPlaceholder] = useState("Search for doctors");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholder(
        placeholder === "Search for doctors"
          ? "Search for specialization"
          : "Search for doctors"
      );
    }, 3000);
    return () => clearInterval(intervalId);
  }, [placeholder]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View className="flex-1">
      <StatusBar backgroundColor={"#006298"} barStyle={"light-content"} />
      <View className="flex-1 bg-white">
        <View className="px-3 py-3">
          <View className="flex-row items-center justify-between">
            <DrawerMenu />
            <View>
              <View className="flex-row gap-2 items-center justify-center">
                <Image
                  source={require("@/assets/images/logo.jpg")}
                  className="h-8 w-8"
                />
                <Text className="font-bold text-2xl text-red-500">
                  UBIQ<Text className="text-primary">CURE</Text>
                </Text>
              </View>
              <Text className="text-sm italic text-center font-semibold text-primary">
                Striving for Your Better Healthcare!
              </Text>
            </View>
            <Whatsapp />
          </View>
          <View className="pt-4">
            <TextInput
              placeholder={placeholder}
              onPress={() => navigation.navigate("(pages)/search")}
              className="w-full p-2 px-5 border border-blue-300 rounded-full"
            />
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="pb-2">
            <View className="mb-5 px-3">
              <Text className="text-base font-semibold text-center text-primary">
                {/* Striving for Your Better Healthcare! */}
                Book your Doctor's Appointment with{" "}
                <Text className="text-red-600 text-xl font-bold">MedTrack</Text>
              </Text>
              {/* <Text className="mt-2 text-center text-gray-700">
                Why to wait at Doctor's Clinics when you can track your
                appointment. Reach at clinic only at your turn.
              </Text>
              <Text className="mt-1 text-center text-gray-700">
                Book your doctor's appointments & Track your token status live!
                Get real-time updates & save your time.
              </Text> */}
              <Text className="mt-1 mx-1 text-center text-gray-700">
                Why to wait at doctor's clinics when you can book your
                appointments & track your token status live? Reach at Doctor's
                clinic only when it's your turn, get real-time updates, avoid
                discomfort to patient and save your time!
              </Text>
            </View>

            <View className="mb-5 bg-primary px-2 py-4">
              <View className="flex flex-row items-center gap-4 mb-4 pl-2">
                <View className="rounded-full p-2 bg-white w-auto flex-shrink">
                  <AntDesign name="staro" size={20} color={"black"} />
                </View>
                <Text className="text-white font-bold text-xl">
                  Featured Doctors
                </Text>
              </View>
              <FeaturedDoctors />
            </View>

            <View className="flex flex-row px-5">
              <View className="w-1/2 pr-2">
                <TouchableOpacity
                  activeOpacity={0.6}
                  className=""
                  onPress={() => navigation.navigate("doctorsList")}
                >
                  <View className="border-2 border-gray-200 rounded-lg">
                    <Image
                      source={require("@/assets/images/doc.jpeg")}
                      className="w-full h-32 rounded-lg rounded-b-none"
                    />
                    <View className="p-4">
                      <Text className="text-md font-semibold text-gray-700">
                        Book Appointment
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="w-1/2 pl-2 bg-white">
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => navigation.navigate("myBookings")}
                  className=""
                >
                  <View className="border-2 border-gray-200 rounded-lg">
                    <Image
                      source={require("@/assets/images/track.jpg")}
                      className="w-full h-32 rounded-lg rounded-b-none"
                    />
                    <View className="p-4">
                      <Text className="text-md font-semibold text-gray-700">
                        Track Appointment
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
