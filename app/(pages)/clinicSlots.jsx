import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { getBookedSlots, getClinicSlots } from "../../api/doctor";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../components/Header";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRepo } from "../../hooks/useRepo";

const ClinicSlots = () => {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState(null);
  const [bookedSlots, setBookedSlots] = useState(null);
  const [fomattedDate, setFormattedDate] = useState(
    new Date().toLocaleDateString()
  );
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const { bookingInfo, setBookingInfo } = useRepo();

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  function getFormatedDate(utcDateString, utcTimeString) {
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

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      let currentDate = getFormatedDate(selectedDate);
      togglePicker();
      setDate(selectedDate);
      setFormattedDate(currentDate);
    }
    togglePicker();
  };

  useEffect(() => {
    getClinicSlots(bookingInfo.clinicId, bookingInfo.docId, date)
      .then((response) => {
        setSlots(response.data.ResponseStatus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Clinic Data: ", error);
        setLoading(false);
      });
    getIssuedTokens();
  }, [fomattedDate]);

  const getIssuedTokens = async () => {
    try {
      setLoading(true);
      const slots = await getBookedSlots(
        bookingInfo.clinicId,
        bookingInfo.docId,
        date
      );
      setLoading(false);
      setBookedSlots(slots);
      console.log(slots);
    } catch (error) {
      console.log("Error in fetching booked slots: ", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        {/* <Text>Loading...</Text> */}
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  console.log(slots);

  const morningSlots = slots.filter((slot) => slot.Shift === "Morning");
  const afternoonSlots = slots.filter((slot) => slot.Shift === "Noon");
  const eveningSlots = slots.filter((slot) => slot.Shift === "Evening");

  const SlotButton = ({ slot }) => {
    const time = slot.TimeSlot.split(":");
    const hour = parseInt(time[0]);
    const minute = time[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    const handlePress = () => {
      setBookingInfo({
        ...bookingInfo,
        slotNumber: slot.SlotNumber,
        appDate: date,
        appTime: slot.TimeSlot,
        shift: slot.Shift,
      });
      navigation.navigate("(pages)/patientDetailsForm");
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        className="mx-1"
      >
        <View
          className="flex-col items-center mb-3 px-0 py-[0.5] bg-white border border-blue-400 rounded-md"
          style={{ width: 80 }}
        >
          <Text className="text-sm font-semibold text-primary">{`${hour12}:${minute} ${ampm}`}</Text>
          <Text className="text-sm font-semibold text-primary mt-[-1.5]">{`B${slot.SlotNumber}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Header title={`Dr. ${bookingInfo.docName}`} />
      <ScrollView>
        <Text className="m-4 text-lg font-semiboold">
          <Text className="font-bold text-xl">Address: </Text>
          {bookingInfo.clinicAddress}
        </Text>
        <View className="flex-row items-center p-4">
          <View className="rounded-full p-1 bg-primary">
            <MaterialCommunityIcons name="home-plus" size={20} color="white" />
          </View>
          <Text className="text-xl font-bold ml-2 text-gray-800">
            Available Slots
          </Text>
        </View>
        {showPicker && (
          <DateTimePicker
            mode="date"
            display=""
            value={date}
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}

        <View className="mx-4 my-2">
          <Pressable
            onPress={togglePicker}
            className="bg-white px-4 py-3 rounded-lg flex flex-row justify-between border border-primary"
          >
            <TextInput
              editable={false}
              placeholder={date.toISOString().substr(0, 10)}
              placeholderTextColor="black"
              className="text-lg"
            />
            <AntDesign name="calendar" size={24} color="black" />
          </Pressable>
        </View>
        <View className="mx-5 my-5">
          {morningSlots.length !== 0 && (
            <View>
              <View className="flex-row items-center">
                <Feather name="sunrise" size={20} color="gray" />
                <Text className="text-lg text-gray-800 ml-3">Morning</Text>
              </View>
              <View className="flex-row flex-wrap justify-start mt-3">
                {morningSlots.map((slot, index) => (
                  <SlotButton
                    key={slot.SlotNumber}
                    slot={slot}
                    style={{ width: "25%" }}
                  />
                ))}
              </View>
            </View>
          )}
          {afternoonSlots.length !== 0 && (
            <View>
              <View className="flex-row items-center mt-3">
                <Feather name="sun" size={20} color="gray" />
                <Text className="text-lg text-gray-800 ml-3">Afternoon</Text>
              </View>
              <View className="flex-row flex-wrap justify-start mt-3">
                {afternoonSlots.map((slot, index) => (
                  <SlotButton
                    key={slot.SlotNumber}
                    slot={slot}
                    style={{ width: "25%" }}
                  />
                ))}
              </View>
            </View>
          )}
          {eveningSlots.length !== 0 && (
            <View>
              <View className="flex-row items-center mt-3">
                <Feather name="sunset" size={20} color="gray" />
                <Text className="text-lg text-gray-800 ml-3">Evening</Text>
              </View>
              <View className="flex-row flex-wrap justify-start mt-3">
                {eveningSlots.map((slot, index) => (
                  <SlotButton
                    key={slot.SlotNumber}
                    slot={slot}
                    style={{ width: "25%" }}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default ClinicSlots;
