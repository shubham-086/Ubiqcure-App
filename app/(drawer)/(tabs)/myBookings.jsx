import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getHistory, getUpcomig } from "@/api/appointments";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyBookings = () => {
  const [tab, setTab] = useState("upcoming");
  const [user, setUser] = useState({});
  const [upcoming, setUpcoming] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = await getUser();
      await upcomingAppointments(user.Id);
      await historyAppointments(user.Id);
    }
    fetchData();
  }, []);

  const getUser = async () => {
    const user = await AsyncStorage.getItem("user");
    setUser(JSON.parse(user));
    return JSON.parse(user);
  };

  const upcomingAppointments = async (userId) => {
    const response = await getUpcomig(userId);
    setUpcoming(response.data.ResponseStatus);
    // console.log("Upcoming:", upcoming);
  };

  const historyAppointments = async (userId) => {
    const response = await getHistory(userId);
    setHistory(response.data.ResponseStatus);
    // console.log("History: ", history);
  };

  return (
    <View className="flex-1">
      <Header title={"Appointments"} />
      <View className="flex-1 bg-white ">
        <View className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md">
          <View className="flex flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={() => setTab("upcoming")}
              activeOpacity={0.7}
              className={`text-white font-bold p-3 w-1/2 ${
                tab === "upcoming"
                  ? "border-b-2 border-primary"
                  : "border-b border-gray-300"
              }`}
            >
              <View className="flex flex-row justify-center items-center">
                <Text className="text-center text-lg text-bold">Upcoming</Text>
                <View className="bg-primary p-1 py-1 px-2.5 rounded-full ml-4">
                  <Text className="text-white">{upcoming.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab("history")}
              activeOpacity={0.7}
              className={`text-white font-bold p-3 w-1/2  ${
                tab === "history"
                  ? "border-b-2 border-primary"
                  : "border-b border-gray-300"
              }`}
            >
              <View className="flex flex-row justify-center items-center">
                <Text className="text-center text-lg text-bold">History</Text>
                <View className="bg-primary p-1 py-1 px-2.5 rounded-full ml-4">
                  <Text className="text-white">{history.length}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {tab === "upcoming" ? (
            <UpcomingAppointments upcoming={upcoming} />
          ) : (
            <AppointmentHistory history={history} />
          )}
        </View>
      </View>
    </View>
  );
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

const getFormatedTime = (timeString) => {
  const [hour, minute, second] = timeString.split(":");
  const hour12 = hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour12.toString().padStart(2, "0")}:${minute.padStart(
    2,
    "0"
  )} ${ampm}`;
};

const UpcomingAppointments = ({ upcoming }) => {
  const navigation = useNavigation();
  return (
    <View className="p-4">
      {upcoming.length > 0 ? (
        upcoming.map((detail, idx) => {
          const formattedDate = getFormatedDate(detail.AppDate);
          const formattedTime = getFormatedTime(detail.appTimeSlot);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("(pages)/tracking", {
                  bookingId: detail.bookingId,
                })
              }
              key={idx}
              className="p-4 mb-4 rounded-lg border-gray-400 border"
            >
              <Text className="text-xl text-primary font-bold mb-1">
                {formattedTime}, {formattedDate}
              </Text>
              <Text className="text-lg font-bold text-gray-700">
                Dr. {detail.docName}
              </Text>
              <Text className="text-lg text-gray-700">{detail.clinicName}</Text>
              <Text className="text-gray-700">{detail.clinicAddress}</Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <View className="justify-center items-center">
          <Text className="text-xl text-gray-500">No Active Appointments</Text>
        </View>
      )}
    </View>
  );
};

const AppointmentHistory = ({ history }) => {
  return (
    <View className="p-4">
      {history.length > 0 ? (
        history.map((detail, idx) => {
          const formattedDate = getFormatedDate(detail.AppDate);
          const formattedTime = getFormatedTime(detail.appTimeSlot);
          return (
            <View
              key={idx}
              className="p-4 mb-4 rounded-lg border-gray-400 border"
            >
              <Text className="text-xl text-primary font-bold mb-1">
                {formattedTime}, {formattedDate}
              </Text>
              <Text className="text-lg font-bold text-gray-700">
                Dr. {detail.docName}
              </Text>
              <Text className="text-lg text-gray-700">{detail.clinicName}</Text>
              <Text className="text-gray-700">{detail.clinicAddress}</Text>
            </View>
          );
        })
      ) : (
        <View className="justify-center items-center">
          <Text className="text-xl text-gray-500">No Past Appointments</Text>
        </View>
      )}
    </View>
  );
};

export default MyBookings;
