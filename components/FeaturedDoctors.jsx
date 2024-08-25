import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
const { height, width } = Dimensions.get("window");
import { getAllDoctors } from "@/api/doctor";
import { useNavigation } from "expo-router";
import { useRepo } from "@/hooks/useRepo";

const CardItem = ({ item }) => {
  const navigation = useNavigation();
  const { setBookingInfo } = useRepo();
  const handlePress = () => {
    setBookingInfo({ docId: item.Id });
    navigation.navigate("(pages)/docProfile");
  };
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ width: width - 16 }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        className="flex-row p-4 px-2 rounded-lg border border-gray-100 bg-gray-50 shadow w-11/12"
        onPress={() => handlePress()}
      >
        <Image
          source={{ uri: `data:image/png;base64,${item.Photo}` }}
          className="rounded-full w-24 h-24"
          resizeMode="contain"
          style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
        />
        <View className="flex-1 ml-4 ">
          <Text className="text-slate-700 text-lg font-bold">
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

const FeaturedDoctors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View
        className="justify-center items-center"
        // style={{ height: height / 2 + 100 }}
      >
        <FlatList
          data={data}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            setCurrentIndex((x / width).toFixed(0));
          }}
          horizontal
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item.Id.toString()}
        />
      </View>
      <View className="flex-row w-full justify-center items-center mt-1 mb-5">
        {data &&
          data.map((item, index) => {
            return (
              <View
                key={item.Id}
                className={`${
                  currentIndex == index ? "w-5 h-2.5" : "w-2 h-2"
                } rounded-full ${
                  currentIndex == index ? "bg-gray-50" : "bg-gray-50"
                } mx-1`}
              ></View>
            );
          })}
      </View>
    </View>
  );
};

export default FeaturedDoctors;
