import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import ToastNotification from "@/components/ToastNotification";
import ModalView from "@/components/ModalView";
import OtpVerification from "@/components/OtpVarification";
import { useNavigation } from "expo-router";
import { checkUser, registerUser } from "@/api/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [formState, setFormState] = useState({
    userName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: "",
  });
  const [error, setError] = useState({
    userName: false,
    age: false,
    gender: false,
    phoneNumber: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastStatus, setToastStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isOTPVarified, setIsOTPVarified] = useState(false);

  useEffect(() => {
    console.log("isOTPVarified changed:", isOTPVarified);
    if (isOTPVarified) {
      setShowModal(false);
      userRegistration();
    }
  }, [isOTPVarified]);

  const handleInputChange = (field, value) => {
    setFormState((prevFormState) => ({ ...prevFormState, [field]: value }));
    setError((prevError) => ({ ...prevError, [field]: !value }));
  };

  const handleSubmit = async () => {
    const { userName, age, gender, phoneNumber } = formState;
    if (!userName || !age || !gender || !phoneNumber) {
      setError({
        userName: !userName,
        age: !age,
        gender: !gender,
        phoneNumber: !phoneNumber,
      });
      return;
    }

    try {
      const response = await checkUser(phoneNumber);
      const fetchedUser = response.data.ResponseStatus[0];
      setUser(fetchedUser);

      if (fetchedUser && fetchedUser.PhoneNo.toString() === phoneNumber) {
        setToastStatus("info");
        setToastMsg("User already exists");
        setShowToast(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching User Data: ", error);
    }
  };

  const userRegistration = async () => {
    setShowModal(false);
    try {
      const response = await registerUser(formState);
      console.log("response: ", response.data.ResponseStatus[0]);
      if (response && response.data.ResponseStatus[0]) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.ResponseStatus[0])
        );
        setToastStatus("success");
        setToastMsg("User Registered Successfully");
        setShowToast(true);

        setTimeout(() => {
          navigation.navigate("(drawer)");
        }, 2000);
      }
    } catch (err) {
      console.error("Error in registering User: ", err);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <ScrollView>
        <View className="p-8 w-full">
          <View className="mb-5">
            <Image
              source={require("@/assets/images/logo2.jpeg")}
              className="w-40 h-40 mx-auto"
            />
          </View>
          <View className="mb-5">
            <Text className="text-4xl font-bold text-start text-primary mb-2">
              Register
            </Text>
            <Text className="text-primary text-start text-lg">
              Please enter your details to proceed.
            </Text>
          </View>
          <View className="mb-4">
            <View
              className={`p-3 ${
                error.userName ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Full Name"
                value={formState.userName}
                onChangeText={(text) => handleInputChange("userName", text)}
                className="text-lg bg-white w-full"
              />
              {error.userName && (
                <View className="absolute right-2">
                  <AntDesign name="exclamationcircleo" size={20} color="red" />
                </View>
              )}
            </View>
          </View>
          <View className="flex-row mb-4">
            <View className="w-1/2 pr-1">
              <View
                className={`p-1 ${
                  error.gender ? "border-red-600" : "border-primary"
                } border rounded-lg `}
              >
                <Picker
                  selectedValue={formState.gender}
                  onValueChange={(itemValue) =>
                    handleInputChange("gender", itemValue)
                  }
                  style={{ margin: -5 }}
                >
                  <Picker.Item label="Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View>
            <View className="w-1/2 pl-1">
              <View
                className={`p-3 ${
                  error.age ? "border-red-600" : "border-primary"
                } border rounded-lg flex-row justify-between items-center`}
              >
                <TextInput
                  placeholder="Age"
                  value={formState.age}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(text) => handleInputChange("age", text)}
                  className="text-lg bg-white w-full"
                />
                {error.age && (
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
          </View>
          <View className="mb-4">
            <View
              className={`p-3 ${
                error.phoneNumber ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Phone Number"
                value={formState.phoneNumber}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                className="text-lg bg-white w-full"
              />
              {error.phoneNumber && (
                <View className="absolute right-2">
                  <AntDesign name="exclamationcircleo" size={20} color="red" />
                </View>
              )}
            </View>
          </View>
          <View className="p-3 border-primary border rounded-lg">
            <TextInput
              placeholder="Email (optional)"
              value={formState.email}
              onChangeText={(text) => handleInputChange("email", text)}
              className="text-lg bg-white w-full"
            />
          </View>
          <View className="flex justify-center mt-5">
            <Text
              onPress={handleSubmit}
              className="text-xl bg-primary text-center text-white border border-primary font-bold py-3 px-4 rounded"
            >
              Submit
            </Text>
          </View>
          <View className="mt-5 flex flex-row justify-center">
            <Text className="text-md">If already registered?</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("index")}
            >
              <Text className="text-md ml-2 text-blue-900">Login Here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ModalView showModal={showModal} onRequestClose={handleModalClose}>
        <OtpVerification
          setIsOTPVarified={setIsOTPVarified}
          phoneNumber={formState.phoneNumber}
        />
      </ModalView>
      {showToast && (
        <ToastNotification
          status={toastStatus}
          message={toastMsg}
          setShowToast={setShowToast}
        />
      )}
    </View>
  );
};

export default Register;
