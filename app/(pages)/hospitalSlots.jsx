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
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../components/Header";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRepo } from "../../hooks/useRepo";
import { getHospitalSlots } from "../../api/hospital";

const HospitalSlots = () => {
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [formattedDate, setFormattedDate] = useState(
    new Date().toLocaleDateString()
  );
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();
  const { hospitalBookingInfo, setHospitalBookingInfo } = useRepo();

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const getFormattedDate = (utcDateString) => {
    const utcDate = new Date(utcDateString);
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getMonth();
    const day = utcDate.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${day.toString().padStart(2, "0")}-${months[month]}-${year}`;
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = getFormattedDate(selectedDate);
      togglePicker();
      setDate(selectedDate);
      setFormattedDate(currentDate);
    } else {
      togglePicker();
    }
  };

  useEffect(() => {
    getHospitalSlots(
      hospitalBookingInfo.hospitalId,
      hospitalBookingInfo.docId,
      date
    )
      .then((response) => {
        setSlots(response.data.ResponseStatus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Slots Data: ", error);
        setLoading(false);
      });
  }, [formattedDate]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  const morningSlots = slots.filter((slot) => slot.Shift === "Morning");
  const afternoonSlots = slots.filter((slot) => slot.Shift === "Noon");
  const eveningSlots = slots.filter((slot) => slot.Shift === "Evening");

  const SlotButton = ({ slot }) => {
    const time = slot.SlotTime.split(":");
    const hour = parseInt(time[0]);
    const minute = time[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    const handlePress = () => {
      setHospitalBookingInfo({
        ...hospitalBookingInfo,
        slotNumber: slot.SlotNumber,
        appDate: date,
        appTime: slot.SlotTime,
        shift: slot.Shift,
      });
      console.log(hospitalBookingInfo);

      navigation.navigate("(pages)/hospitalPatientForm");
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
      <Header title={`Dr. ${hospitalBookingInfo.docName}`} />
      <ScrollView>
        <Text className="m-4 text-lg font-semibold">
          <Text className="font-bold text-xl">Address: </Text>
          {hospitalBookingInfo.hospitalAdd}
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
              value={formattedDate}
              placeholderTextColor="black"
              className="text-lg"
            />
            <AntDesign name="calendar" size={24} color="black" />
          </Pressable>
        </View>
        <View className="mx-5 my-5">
          {morningSlots.length > 0 && (
            <View>
              <View className="flex-row items-center">
                <Feather name="sunrise" size={20} color="gray" />
                <Text className="text-lg text-gray-800 ml-3">Morning</Text>
              </View>
              <View className="flex-row flex-wrap justify-start mt-3">
                {morningSlots.map((slot) => (
                  <SlotButton key={slot.SlotNumber} slot={slot} />
                ))}
              </View>
            </View>
          )}
          {afternoonSlots.length > 0 && (
            <View>
              <View className="flex-row items-center mt-3">
                <Feather name="sun" size={20} color="gray" />
                <Text className="text-lg text-gray-800 ml-3">Afternoon</Text>
              </View>
              <View className="flex-row flex-wrap justify-start mt-3">
                {afternoonSlots.map((slot) => (
                  <SlotButton key={slot.SlotNumber} slot={slot} />
                ))}
              </View>
            </View>
          )}
          {eveningSlots.length > 0 && (
            <View>
              <View className="flex-row items-center mt-3">
                <Feather name="sunset" size={20} color="gray" />
                <Text className="text-lg text-gray-800 ml-3">Evening</Text>
              </View>
              <View className="flex-row flex-wrap justify-start mt-3">
                {eveningSlots.map((slot) => (
                  <SlotButton key={slot.SlotNumber} slot={slot} />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default HospitalSlots;
