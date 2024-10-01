import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
const { height, width } = Dimensions.get("window");
import { getAllDoctors } from "@/api/doctor";
import { useNavigation } from "expo-router";
import { useRepo } from "@/hooks/useRepo";

const CardItem = React.memo(({ item }) => {
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
        onPress={handlePress}
      >
        <Image
          source={{ uri: `data:image/png;base64,${item.Photo}` }}
          className="rounded-full w-24 h-24"
          resizeMode="contain"
          style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
        />
        <View className="flex-1 ml-4">
          <Text className="text-slate-700 text-lg font-bold">
            Dr. {item.Name}
          </Text>
          <Text className="text-slate-700">{item.Specialization}</Text>
          <Text className="text-slate-700">
            {item.Experience} years experience
          </Text>
          <Text className="text-slate-700">{item.CityList}</Text>
          <View className="mt-2">
            <Text className="px-2 py-1  border border-primary text-primary rounded-md inline-flex self-start">
              Book Appointment
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const FeaturedDoctors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error handling
  const { doctors } = useRepo();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await getAllDoctors();
      setData(response.data.ResponseStatus);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch doctors. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      setData(doctors);
      setLoading(false);
    } else {
      fetchDoctors();
    }
  }, [doctors]);

  const handleScroll = useCallback((e) => {
    const x = e.nativeEvent.contentOffset.x;
    setCurrentIndex((x / width).toFixed(0));
  }, []);

  const paginationDots = useMemo(() => {
    return data.map((item, index) => (
      <View
        key={item.Id}
        className={`${
          currentIndex == index ? "w-5 h-2.5" : "w-2 h-2"
        } rounded-full bg-gray-50 mx-1`}
      />
    ));
  }, [data, currentIndex]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-100">{error}</Text>
        <TouchableOpacity onPress={fetchDoctors}>
          <Text className="text-blue-400 my-2">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <FlatList
        data={data}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        onScroll={handleScroll}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item) => item.Id.toString()}
      />
      <View className="flex-row w-full justify-center items-center mt-3">
        {paginationDots}
      </View>
    </View>
  );
};

export default FeaturedDoctors;
