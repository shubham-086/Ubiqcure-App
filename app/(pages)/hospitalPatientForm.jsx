import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import Header from "../../components/Header";
import { AntDesign } from "@expo/vector-icons";
import { useRepo } from "../../hooks/useRepo";
import { useNavigation } from "expo-router";
import OtpVerification from "../../components/OtpVerification";
import ModalView from "../../components/ModalView";
import { insertAppRequest, insertPatient } from "../../api/booking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { insertHospitalAppRequest } from "../../api/hospital";

const HospitalPatientForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [isOTPVarified, setIsOTPVerified] = useState(false);

  const { hospitalBookingInfo, setHospitalBookingInfo, patient, setPatient } =
    useRepo();
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [field]: !value }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.patientName) {
      newErrors.patientName = "Patient name is required";
      valid = false;
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
      valid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      valid = false;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number is invalid";
      valid = false;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setPatient(formData);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const createAppRequest = async () => {
    try {
      const user = await AsyncStorage.getItem("user").then(JSON.parse);
      if (!user) throw new Error("User not found");

      const response = await insertPatient(formData, user.Id, "hospital");

      if (!response?.patientId) throw new Error("Failed to insert patient");

      setPatient((prev) => ({ ...prev, patientId: response.patientId }));

      const appReqResponse = await insertHospitalAppRequest(
        hospitalBookingInfo,
        response.patientId
      );

      // console.log("Appointment Request Response: ", appReqResponse);

      if (!appReqResponse)
        throw new Error("Failed to insert appointment request");

      setHospitalBookingInfo((prev) => ({
        ...prev,
        transactionId: appReqResponse.guidId,
      }));

      return true;
    } catch (error) {
      console.error("Error in creating Appointment Request: ", error);
      return false;
    }
  };

  // Navigate after appointment request is created
  const handleNavigation = async () => {
    setShowModal(false);
    const response = await createAppRequest();
    if (response) {
      navigation.navigate("(pages)/hospitalCheckout");
    }
  };

  // Handle navigation on OTP verification
  useEffect(() => {
    // console.log(hospitalBookingInfo);

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

          {/* Patient Name Input */}
          <View className="mb-4">
            <View
              className={`p-3 ${
                errors.patientName ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Patient Name"
                value={formData.patientName}
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
              <Text className="text-red-500 text-sm">{errors.patientName}</Text>
            )}
          </View>

          {/* Age Input */}
          <View className="mb-4">
            <View
              className={`p-3 ${
                errors.age ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Age"
                value={formData.age}
                keyboardType="numeric"
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
              <Text className="text-red-500 text-sm">{errors.age}</Text>
            )}
          </View>

          {/* Gender Picker */}
          <View className="mb-4">
            <View
              className={`p-1 ${
                errors.gender ? "border-red-600" : "border-primary"
              } border rounded-lg`}
            >
              <Picker
                selectedValue={formData.gender}
                onValueChange={(itemValue) =>
                  handleInputChange("gender", itemValue)
                }
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
            {errors.gender && (
              <Text className="text-red-500 text-sm">{errors.gender}</Text>
            )}
          </View>

          {/* Phone Number Input */}
          <View className="mb-4">
            <View
              className={`p-3 ${
                errors.phoneNumber ? "border-red-600" : "border-primary"
              } border rounded-lg flex-row justify-between items-center`}
            >
              <TextInput
                placeholder="Phone Number"
                value={formData.phoneNumber}
                keyboardType="numeric"
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
              <Text className="text-red-500 text-sm">{errors.phoneNumber}</Text>
            )}
          </View>

          {/* Email Input */}
          <View className="p-3 border-primary border rounded-lg">
            <TextInput
              placeholder="Email (optional)"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              className="text-lg bg-white w-full"
            />
          </View>
          {formData.email && !isValidEmail(formData.email) && (
            <Text className="text-red-500 text-sm">Invalid email address</Text>
          )}

          {/* Submit Button */}
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

      {/* OTP Modal */}
      <ModalView showModal={showModal} onRequestClose={handleModalClose}>
        <OtpVerification
          setIsOTPVerified={setIsOTPVerified}
          phoneNumber={formData.phoneNumber}
        />
      </ModalView>
    </View>
  );
};

export default HospitalPatientForm;
