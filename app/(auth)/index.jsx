import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import ModalView from "@/components/ModalView";
import OtpVerification from "@/components/OtpVarification";
import { useNavigation } from "expo-router";
import { checkUser } from "@/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastNotification from "@/components/ToastNotification";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isOTPVarified, setIsOTPVarified] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const [showToast, setShowToast] = useState(false);
  const [toastStatus, setToastStatus] = useState("");

  useEffect(() => {
    if (isOTPVarified) {
      setShowModal(false);
      handleNavigation();
    }
  }, [isOTPVarified]);

  const handleNavigation = async () => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setToastStatus("success");
      setShowToast(true);
      setTimeout(() => {
        navigation.navigate("(drawer)");
      }, 2000);
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  const handleInputChange = (text) => {
    setPhoneNumber(text);
    setError(!text);
  };

  const handleSubmit = async () => {
    if (!phoneNumber) {
      setError(true);
    } else {
      setLoading(true);
      await checkUser(phoneNumber)
        .then((response) => {
          const fetchedUser = response.data.ResponseStatus[0];
          setUser(fetchedUser);
          setLoading(false);

          if (fetchedUser && fetchedUser.PhoneNo.toString() === phoneNumber) {
            setShowModal(true);
          } else {
            setToastStatus("warning");
            setShowToast(true);
            console.log("User does not exist");
          }
        })
        .catch((error) => {
          console.error("Error fetching User Data: ", error);
          setLoading(false);
        });
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

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
              setIsOTPVarified={setIsOTPVarified}
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
