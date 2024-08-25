import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Header from "@/components/Header";
const { height, width } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { getAllDoctors } from "../../../api/doctor";
import { useRepo } from "../../../hooks/useRepo";

const CardItem = ({ item }) => {
  const { setBookingInfo } = useRepo();
  const handlePress = () => {
    setBookingInfo({ docId: item.Id });
    navigation.navigate("(pages)/docProfile", { id: item.Id });
  };
  const navigation = useNavigation();
  return (
    <View
      className="justify-center items-center mb-5"
      style={[styles.shadowProp, { width: width }]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        className="flex-row p-4 rounded-lg border border-gray-200 w-11/12"
        onPress={() => handlePress()}
      >
        <Image
          source={{ uri: `data:image/png;base64,${item.Photo}` }}
          className="rounded-full w-24 h-24"
          resizeMode="contain"
          style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
        />
        <View className="flex-1 ml-5">
          <Text className="text-slate-700 text-xl font-bold">
            Dr. {item.Name}
          </Text>
          <Text className="text-slate-700">{item.Specialization}</Text>
          <Text className="text-slate-700">
            {item.Experience} years experience
          </Text>
          <Text className="text-slate-700">{item.CityList}</Text>
          {/* <Text className="text-gray-500">{item.qualification}</Text> */}
          <View className="mt-2">
            <Text className="px-2 py-1 border border-primary text-primary rounded-md inline-flex self-start">
              Book Appointment
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const DoctorList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDoctors()
      .then((response) => {
        setData(response.data.ResponseStatus);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        {/* <Text>Loading...</Text> */}
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  // console.log(data);

  return (
    <View className="flex-1 bg-white">
      <Header title="Our Doctors" />
      <View className="flex-1 justify-center items-center">
        <View className="justify-center items-center">
          <FlatList
            data={data}
            style={{ marginTop: 15 }}
            renderItem={({ item }) => <CardItem item={item} />}
            keyExtractor={(item) => item.Id.toString()}
          />
        </View>
      </View>
    </View>
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
