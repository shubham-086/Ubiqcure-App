import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import Header from "../../components/Header";
import { AntDesign } from "@expo/vector-icons";
import { useRepo } from "../../hooks/useRepo";
import { useNavigation } from "expo-router";
import OtpVerification from "../../components/OtpVarification";
import ModalView from "../../components/ModalView";
import { insertAppRequest, insertPatient } from "../../api/booking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PatientForm = () => {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isOTPVarified, setIsOTPVarified] = useState(false);
  const [errors, setErrors] = useState({
    patientName: false,
    age: false,
    gender: false,
    phoneNumber: false,
    email: false,
  });
  const { bookingInfo, setBookingInfo, patient, setPatient } = useRepo();
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    switch (field) {
      case "patientName":
        setPatientName(value);
        setErrors((prevErrors) => ({ ...prevErrors, patientName: !value }));
        break;
      case "age":
        setAge(value);
        setErrors((prevErrors) => ({ ...prevErrors, age: !value }));
        break;
      case "gender":
        setGender(value);
        setErrors((prevErrors) => ({ ...prevErrors, gender: !value }));
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: !value }));
        break;
      case "email":
        setEmail(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: !isValidEmail(value),
        }));
        break;
      default:
        break;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!patientName || !age || !gender || !phoneNumber) {
      setErrors({
        patientName: !patientName,
        age: !age,
        gender: !gender,
        phoneNumber: !phoneNumber,
        email: !isValidEmail(email),
      });
    } else {
      setPatient({
        patientName,
        age,
        gender,
        phoneNumber,
        email,
      });
      console.log(phoneNumber);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const createAppRequest = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("user"));
      if (!user) throw new Error("User not found");

      const response = await insertPatient(patient, user.Id);
      if (!response || !response.patientId)
        throw new Error("Failed to insert patient");

      setPatient((prev) => ({ ...prev, patientId: response.patientId }));
      const appReqResponse = await insertAppRequest(
        bookingInfo,
        response.patientId
      );
      if (!appReqResponse)
        throw new Error("Failed to insert appointment request");

      setBookingInfo((prev) => ({
        ...prev,
        transactionId: appReqResponse.guidId,
      }));
      return true;
    } catch (error) {
      console.error("Error in creating Appointment Request: ", error);
      return false;
    }
  };

  const handleNavigation = async () => {
    handleModalClose();
    const response = await createAppRequest();
    console.log(response);
    if (response) {
      navigation.navigate("(pages)/checkout");
    }
  };

  useEffect(() => {
    if (isOTPVarified) {
      handleNavigation();
    }
  }, [isOTPVarified]);

  return (
    <View className="flex-1 bg-white">
      <Header title={"Book an appointment"} />
      <ScrollView>
        <View className="flex-1 p-8">
          <Text className="text-lg font-semibold my-4 mb-10">
            Please fill out the form below to book an appointment.
          </Text>

          <View className="mb-4">
            <View
              className={`p-3 ${
                errors.patientName ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Patient Name"
                value={patientName}
                onChangeText={(text) => handleInputChange("patientName", text)}
                className="text-lg bg-white w-full"
              />
              {errors.patientName && (
                <View className="absolute right-2">
                  <AntDesign name="exclamationcircleo" size={20} color="red" />
                </View>
              )}
            </View>
            {errors.patientName && (
              <Text className="text-red-500 text-sm">Required field</Text>
            )}
          </View>
          <View className="mb-4">
            <View
              className={`p-3 ${
                errors.age ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Age"
                value={age}
                keyboardType="numeric"
                inputMode="numeric"
                maxLength={2}
                onChangeText={(text) => handleInputChange("age", text)}
                className="text-lg bg-white w-full"
              />
              {errors.age && (
                <View className="absolute right-2">
                  <AntDesign name="exclamationcircleo" size={20} color="red" />
                </View>
              )}
            </View>
            {errors.age && (
              <Text className="text-red-500 text-sm">Required field</Text>
            )}
          </View>
          <View className="mb-4">
            <View
              className={`p-1 ${
                errors.gender ? "border-red-600" : "border-primary"
              } border rounded-lg `}
            >
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) =>
                  handleInputChange("gender", itemValue)
                }
                style={{ margin: -5 }}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
            {errors.gender && (
              <Text className="text-red-500 text-sm">Required field</Text>
            )}
          </View>
          <View className="mb-4">
            <View
              className={`p-3 ${
                errors.phoneNumber ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                keyboardType="numeric"
                inputMode="numeric"
                maxLength={10}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                className="text-lg bg-white w-full"
              />
              {errors.phoneNumber && (
                <View className="absolute right-2">
                  <AntDesign name="exclamationcircleo" size={20} color="red" />
                </View>
              )}
            </View>
            {errors.phoneNumber && (
              <Text className="text-red-500 text-sm">Required field</Text>
            )}
          </View>
          <View className="p-3 border-primary border rounded-lg">
            <TextInput
              placeholder="Email (optional)"
              value={email}
              inputMode="email"
              onChangeText={(text) => handleInputChange("email", text)}
              className="text-lg bg-white w-full"
            />
          </View>
          {email && !isValidEmail(email) && (
            <Text className="text-red-500 text-sm">Invalid email address</Text>
          )}
          <View className="flex justify-center mt-10">
            <Text
              onPress={handleSubmit}
              className="text-xl bg-primary text-center text-white border border-primary font-bold py-3 px-4 rounded"
            >
              Submit
            </Text>
          </View>
        </View>
      </ScrollView>
      <ModalView showModal={showModal} onRequestClose={handleModalClose}>
        <OtpVerification
          setIsOTPVarified={setIsOTPVarified}
          phoneNumber={phoneNumber}
        />
      </ModalView>
    </View>
  );
};

export default PatientForm;
