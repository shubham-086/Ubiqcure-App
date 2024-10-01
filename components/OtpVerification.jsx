import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { generateOtp, sendOtpToMobile } from "../api/sendSMS";

const OtpVerification = ({ setIsOTPVerified, phoneNumber }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [count, setCount] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    console.log(otp);
    sendOtpToMobile(phoneNumber, otp);
    ToastAndroid.show(
      "OTP sent successfully!",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  }, []);

  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [otp]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
      clearInterval(timer);
      setIsResendDisabled(false);
    }

    return () => clearInterval(timer);
  }, [count]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value === "") {
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    } else if (value && index < newOtp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspacePress = (index) => {
    if (index > 0) {
      inputs.current[index - 1].focus();
      handleOtpChange("", index);
    }
  };

  const handleOtpSubmit = () => {
    const isOtpCorrect = otp.join("") === generatedOtp;
    setIsOTPVerified(isOtpCorrect);
    if (isOtpCorrect) {
      console.log("OTP verified");
      ToastAndroid.show("OTP Verified", ToastAndroid.SHORT, ToastAndroid.TOP);
    } else {
      ToastAndroid.show("Incorrect OTP", ToastAndroid.SHORT, ToastAndroid.TOP);
    }
  };

  const handleResendCodePress = () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setCount(60);
    setIsResendDisabled(true);
    inputs.current[0].focus();
    console.log(otp);
    sendOtpToMobile(phoneNumber, otp);
    setOtp(["", "", "", ""]);
  };

  return (
    <SafeAreaView className="justify-center items-center mx-4 mt-4">
      <View className="flex-row justify-center mb-5">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            className="w-15 h-15 border border-primary mx-2.5 p-1.5 rounded-lg text-center text-lg"
            value={digit}
            maxLength={1}
            inputMode="numeric"
            keyboardType="numeric"
            onChangeText={(value) => handleOtpChange(value, index)}
            ref={(input) => {
              inputs.current[index] = input;
            }}
            onSubmitEditing={
              index === otp.length - 1 ? handleOtpSubmit : undefined
            }
            onKeyPress={({ nativeEvent: { key } }) =>
              key === "Backspace" ? handleBackspacePress(index) : null
            }
          />
        ))}
      </View>
      <TouchableOpacity
        className="bg-primary py-1.5 px-5 rounded-md mb-3.5"
        onPress={handleOtpSubmit}
        disabled={isButtonDisabled}
        activeOpacity={0.7}
      >
        <Text className="text-white text-lg">Verify</Text>
      </TouchableOpacity>
      <View className="flex-row items-baseline justify-center">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleResendCodePress}
          disabled={isResendDisabled}
        >
          <Text className="text-blue-700">Resend OTP</Text>
        </TouchableOpacity>
        {count > 0 ? <Text className="ml-2">{`in ${count} sec`}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

export default OtpVerification;
