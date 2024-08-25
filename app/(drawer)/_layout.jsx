import { View, Text } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const DrawerLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "white",
          },
          drawerLabelStyle: {
            color: "#404040",
            fontSize: 18,
            marginLeft: -10,
          },
          drawerItemStyle: { paddingLeft: 10 },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            title: "Home",
            headerShadowVisible: false,
            drawerIcon: () => (
              <FontAwesome name="home" size={24} color="#404040" />
            ),
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: "Logout",
            title: "Logout",
            headerShadowVisible: false,
            drawerIcon: () => (
              <FontAwesome name="sign-out" size={24} color="#404040" />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
