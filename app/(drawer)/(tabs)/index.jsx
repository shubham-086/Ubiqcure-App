import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  RefreshControl,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import DrawerMenu from "@/components/DrawerMenu";
import Whatsapp from "@/components/Whatsapp";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const [placeholder, setPlaceholder] = useState("Search for doctors");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholder(
        placeholder === "Search for doctors"
          ? "Search for specialization"
          : "Search for doctors"
      );
    }, 3000);
    return () => clearInterval(intervalId);
  }, [placeholder, refreshing, setRefreshing]);

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
        <View className="px-3 py-4">
          <View className="flex-row items-center justify-between">
            <DrawerMenu />
            <View className="flex-row gap-2 items-center justify-center">
              <Image
                source={require("@/assets/images/logo.jpg")}
                className="h-10 w-10"
              />
              <Text className="font-bold text-2xl text-red-500">
                UBIQ<Text className="text-primary">CURE</Text>
              </Text>
            </View>
            <Whatsapp />
          </View>
          <View className="pt-4">
            <TextInput
              placeholder={placeholder}
              className="w-full p-2 px-5 border border-blue-300 rounded-full"
            />
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="pt-2 pb-5">
            <View className="mb-8 px-3">
              <Text className="text-2xl font-bold text-center text-primary">
                Striving For Your Better Healthcare!
              </Text>
              <Text className="mt-2 text-center text-gray-700">
                Book your doctor appointments and Track your token status live!
                Get real-time updates and estimated consultation times for a
                smooth, hassle-free visit.
              </Text>
            </View>

            <View className="mb-10 bg-primary px-2 py-4">
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
                      <Text className="text-base font-semibold text-gray-700">
                        Book Appointment
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="w-1/2 pl-2 bg-white">
                <TouchableOpacity
                  activeOpacity={0.6}
                  // onPress={() => navigation.navigate("(pages)/tracking")}
                  className=""
                >
                  <View className="border-2 border-gray-200 rounded-lg">
                    <Image
                      // source={{
                      //   uri: "https://via.placeholder.com/150?text=Track Appointment",
                      // }}
                      source={require("@/assets/images/track.jpg")}
                      className="w-full h-32 rounded-lg rounded-b-none"
                    />
                    <View className="p-4">
                      <Text className="text-base font-semibold text-gray-700">
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
