import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import ModalView from "@/components/ModalView";
import OtpVerification from "@/components/OtpVerification";
import { useNavigation } from "expo-router";
import { checkUser } from "@/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastNotification from "@/components/ToastNotification";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Default to false
  const [showModal, setShowModal] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false); // Typo correction: Varified -> Verified
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const [showToast, setShowToast] = useState(false);
  const [toastStatus, setToastStatus] = useState("");

  // OTP verified effect to trigger modal close and navigation
  useEffect(() => {
    if (isOTPVerified) {
      setShowModal(false);
      handleNavigation();
    }
  }, [isOTPVerified]);

  // Function to navigate and store user data
  const handleNavigation = async () => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setToastStatus("success");
      setShowToast(true);
      setTimeout(() => {
        navigation.navigate("(drawer)");
      }, 2000); // Toast visible for 2 seconds before navigation
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  // Handle input change and validate phone number
  const handleInputChange = (text) => {
    setPhoneNumber(text);
    setError(!text ? "Phone number is required" : ""); // Simple validation for non-empty input
  };

  // Function to submit the phone number and check user existence
  const handleSubmit = async () => {
    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    setLoading(true); // Set loading state before async request
    try {
      const response = await checkUser(phoneNumber);
      const fetchedUser = response.data.ResponseStatus?.[0];
      setUser(fetchedUser);

      if (fetchedUser && fetchedUser.PhoneNo.toString() === phoneNumber) {
        setShowModal(true);
      } else {
        setToastStatus("warning");
        setShowToast(true);
        console.log("User does not exist");
      }
    } catch (error) {
      console.error("Error fetching User Data: ", error);
      setToastStatus("error");
      setShowToast(true);
    } finally {
      setLoading(false); // Ensure loading is turned off after request
    }
  };

  // Handle closing of the modal
  const handleModalClose = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <ScrollView>
        <View className="flex-1">
          <View className="p-8 w-full">
            <View className="p-2">
              <Image
                source={require("@/assets/images/logo2.jpeg")}
                className="w-40 h-40 mx-auto"
              />
            </View>
            <View className="mb-10 mt-10">
              <Text className="text-4xl font-bold text-start text-primary mb-3">
                Login
              </Text>
              <Text className="text-primary text-start text-lg">
                Please verify your phone number.
              </Text>
            </View>
            <View className="mb-4">
              <View
                className={`p-3 ${
                  error ? "border-red-600" : "border-primary"
                } border rounded-lg flex-row justify-between items-center`}
              >
                <TextInput
                  placeholder="Phone Number"
                  value={phoneNumber}
                  keyboardType="numeric"
                  inputMode="numeric"
                  maxLength={10}
                  onChangeText={handleInputChange}
                  className="text-lg bg-white w-full"
                />
                {error && (
                  <View className="absolute right-2">
                    <AntDesign
                      name="exclamationcircleo"
                      size={20}
                      color="red"
                    />
                  </View>
                )}
              </View>
            </View>
            <View className="flex justify-center mt-5">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSubmit}
                className="bg-primary border border-primary py-3 px-4 rounded"
              >
                <Text className="text-center text-white font-bold text-xl">
                  Send OTP
                </Text>
              </TouchableOpacity>
            </View>
            <View className="mt-5 flex flex-row justify-center">
              <Text className="text-md">If not registered?</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("register")}
              >
                <Text className="text-md ml-2 text-blue-900">
                  Register Here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <ModalView showModal={showModal} onRequestClose={handleModalClose}>
            <OtpVerification
              setIsOTPVerified={setIsOTPVerified}
              phoneNumber={phoneNumber}
            />
          </ModalView>
        </View>
      </ScrollView>
      {showToast && (
        <ToastNotification
          status={toastStatus === "success" ? "success" : "info"}
          message={
            toastStatus === "success"
              ? "Successfully Logged In"
              : "User not Registered"
          }
          setShowToast={setShowToast}
        />
      )}
    </View>
  );
};

export default Login;
