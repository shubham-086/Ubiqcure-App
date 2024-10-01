import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Fontisto from "@expo/vector-icons/Fontisto";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: { height: 65, paddingBottom: 10, paddingTop: 10 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? "home" : "home-outline"}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="doctorsList"
          options={{
            title: "Doctors",
            tabBarIcon: ({ color, focused }) => (
              <Fontisto
                name={"doctor"}
                size={28}
                style={{ marginBottom: -3 }}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="hospitals"
          options={{
            title: "Hospitals",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name="hospital-building"
                size={28}
                style={{ marginBottom: -3 }}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="myBookings"
          options={{
            title: "Bookings",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome
                name={focused ? "plus-square" : "plus-square-o"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
