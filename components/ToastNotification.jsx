import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const ToastNotification = ({ status, message, setShowToast }) => {
  let bgColor =
    status === "success"
      ? "#2ecc71"
      : status === "fail"
      ? "#ec7063"
      : "#5dade2";
  let icon =
    status === "success"
      ? "check-circle-outline"
      : status === "fail"
      ? "close-circle-outline"
      : "alert-circle-outline";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000); // 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        top: 10,
        width: "90%",
        position: "absolute",
        backgroundColor: bgColor,
        borderRadius: 5,
        padding: 12,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        shadowColor: "#003049",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        zIndex: 100,
        elevation: 2,
      }}
    >
      <Icon name={icon} size={30} color="#ffffff" />
      <View>
        <Text
          style={{
            color: "#ffffff",
            fontWeight: "400",
            marginLeft: 10,
            fontSize: 18,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default ToastNotification;
