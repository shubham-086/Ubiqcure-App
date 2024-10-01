import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRepo } from "../../hooks/useRepo";
import { useNavigation } from "expo-router";
import RazorpayCheckout from "react-native-razorpay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { insertPaymentReq, verifyPayment } from "../../api/booking";
import { sendBookingDetails } from "../../api/sendSMS";
import { createHospitalToken } from "../../api/hospital";

const HospitalCheckout = () => {
  const { hospitalBookingInfo, patient, setHospitalBookingInfo } = useRepo();
  const navigation = useNavigation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);

  const formatTime = (timeString) => {
    const [hourStr, minute] = timeString.split(":");
    const hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  function getFormatedDate(utcDateString) {
    const utcDate = new Date(utcDateString);
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getMonth();
    const day = utcDate.getDate();
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day.toString().padStart(2, "0")}-${months[month]}-${year}`;
  }

  const formattedTime = formatTime(hospitalBookingInfo.appTime);

  useEffect(() => {
    if (paymentSuccess) {
      navigation.navigate("(pages)/hospitalInvoice");
    }
  }, [paymentSuccess]);

  const createPaymentRequest = async () => {
    try {
      const user = await getUserFromStorage();
      const response = await insertPaymentReq(
        hospitalBookingInfo.transactionId,
        user.Id,
        patient.phoneNumber,
        "100",
        "hospital"
      );
      if (!response) throw new Error("Failed to insert payment");
      return response.orderId;
    } catch (error) {
      setError(error);
      return false;
    }
  };

  const handlePayment = async () => {
    // console.log("Payment button clicked");
    // console.log(hospitalBookingInfo, patient);

    try {
      const orderId = await createPaymentRequest();
      if (orderId) {
        const options = getRazorpayOptions(orderId);
        RazorpayCheckout.open(options)
          .then((data) => {
            handlePaymentSuccess(data);
          })
          .catch((error) => {
            handlePaymentError(error);
          });
      }
    } catch (error) {
      setError(error);
    }
  };

  const getUserFromStorage = async () => {
    const user = await AsyncStorage.getItem("user");
    return JSON.parse(user);
  };

  const getRazorpayOptions = (orderId) => {
    return {
      description: "Appointment Booking",
      image: "@/assets/images/logo.jpg",
      currency: "INR",
      key: "rzp_live_Ec7Q03czlqIxAi",
      order_id: orderId,
      amount: "100",
      name: "UBIQCURE",
      prefill: {
        email: patient.email,
        contact: patient.phoneNumber,
        name: patient.name,
      },
      theme: { color: "#006298" },
    };
  };

  const handlePaymentSuccess = async (data) => {
    try {
      const response = await verifyPayment(
        data.razorpay_order_id,
        data.razorpay_payment_id,
        data.razorpay_signature
      );
      // console.log("Payment Verify: ", response.ResponseStatus);

      if (response.ResponseStatus === "success") {
        alert("Payment successful.");
        console.log("Payment status: ", hospitalBookingInfo, patient);
        const tokenData = {
          DocId: hospitalBookingInfo.docId,
          hospitalId: hospitalBookingInfo.hospitalId,
          appDate: hospitalBookingInfo.appDate,
          appTimeSlot: hospitalBookingInfo.appTime,
          PatId: patient.patientId,
          shift: hospitalBookingInfo.shift,
          slotNo: hospitalBookingInfo.slotNumber,
          guidId: hospitalBookingInfo.transactionId,
          status: "success",
          paymentId: data.razorpay_payment_id,
          signature: data.razorpay_signature,
        };
        const tokenResponse = await createHospitalToken(tokenData);
        if (tokenResponse.bookingId) {
          sendBookingDetails(
            patient.phoneNumber,
            hospitalBookingInfo.slotNumber,
            hospitalBookingInfo.appDate,
            getFormatedDate(hospitalBookingInfo.appTime),
            hospitalBookingInfo.docName,
            tokenResponse.bookingId,
            tokenResponse.tokenId
          );
          setHospitalBookingInfo((prev) => ({
            ...prev,
            bookingId: tokenResponse.bookingId,
          }));
          navigation.navigate("(pages)/hospitalInvoice");
        } else {
          alert("Something went wrong!");
        }
      } else {
        alert("Payment failed.");
      }
    } catch (error) {
      setError(error);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    const errorData = JSON.parse(error.description);
    if (errorData.error.reason === "payment_cancelled") {
      alert("Payment cancelled.", errorData);
    } else {
      alert(`Error: ${error.code} | ${error.description}`);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header title={"Checkout"} />
      <ScrollView>
        <View className="p-5 ">
          <Text className="text-xl font-semibold mb-5">Booking Summary</Text>

          <View className="mt-2">
            <View className="mb-4 flex flex-row items-baseline border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Doctor Name:</Text>
              <Text className="text-lg ml-4 mb-2">
                Dr. {hospitalBookingInfo.docName}
              </Text>
            </View>

            <View className="mb-4 flex flex-row items-start border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Hospital Details:</Text>
              <View className="ml-4 flex-1 mb-2">
                <Text className="text-lg">
                  {hospitalBookingInfo.hospitalName}
                </Text>
                <Text className="text-sm">
                  {hospitalBookingInfo.hospitalAdd}
                </Text>
              </View>
            </View>

            <View className="mb-4 flex flex-row items-baseline border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Date & Time:</Text>
              <Text className="text-lg ml-4 mb-2">
                {getFormatedDate(hospitalBookingInfo.appDate)}, {formattedTime}
              </Text>
            </View>

            <View className="mb-3 flex flex-row border-dashed border-b border-gray-400">
              <Text className="text-lg mb-2">Patient Details:</Text>
              <View className="ml-4 flex-1 flex-wrap mb-2">
                <Text className="text-lg overflow-ellipsis overflow-hidden max-w-full">
                  {patient.patientName}, {patient.gender}, {patient.phoneNumber}
                </Text>
              </View>
            </View>

            <View className="my-5">
              <Text className="text-lg mb-3 font-semiibold">Booking Fees</Text>
              <View className="flex flex-row justify-between mb-2">
                <Text className="text-sm">Slot booking cost: </Text>
                <Text className="text-sm">
                  <Text className="line-through inline-block mr-1">₹20</Text>
                  {"  "}
                  <Text className="inline-block mr-1">₹0.83</Text>
                  {"  "}
                  <Text className="text-xs inline-block text-green-600">
                    (Promo offer)
                  </Text>
                </Text>
              </View>
              <View className="flex flex-row justify-between mb-2">
                <Text className="text-sm">Processing fees (2%): </Text>
                <Text className="text-sm">₹ 0.02/-</Text>
              </View>
              <View className="flex flex-row justify-between mb-2">
                <Text className="text-sm">GST (18%): </Text>
                <Text className="text-sm">₹ 0.15/-</Text>
              </View>
              <View className="flex flex-row justify-between border-t border-gray-500 pt-1">
                <Text className="text-sm">Total: </Text>
                <Text className="text-sm">₹ 1.00/-</Text>
              </View>
            </View>
          </View>

          <View className="flex justify-center mt-5">
            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-primary border border-primary py-3 px-4 rounded"
              onPress={handlePayment}
            >
              <Text className="text-xl text-center text-white font-bold">
                Proceed to Pay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HospitalCheckout;
