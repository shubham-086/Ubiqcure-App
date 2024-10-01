import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
const { width } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { useRepo } from "@/hooks/useRepo";
import { getHospitals } from "@/api/hospital";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
// import { useMemo } from "react";

const CardItem = React.memo(({ item }) => {
  const navigation = useNavigation();

  return (
    <View
      className="justify-center items-center mb-5"
      style={{ width }}
      key={item.Id}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        className="flex-row p-4 rounded-lg border border-gray-200 w-11/12"
        style={styles.shadowProp}
        onPress={() =>
          navigation.navigate("(pages)/hospitalProfile", { id: item.id })
        }
      >
        <Image
          source={{ uri: `data:image/png;base64,${item.logo}` }}
          className="rounded-2xl w-24 h-24"
          resizeMode="contain"
          style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
        />
        <View className="flex-1 ml-5">
          <Text className="text-slate-700 text-xl font-bold">{item.name}</Text>
          <Text className="text-slate-700">{item.type}</Text>
          <Text className="text-slate-700">
            {item.city}, {item.state}, {item.pincode}
          </Text>
          <View className="mt-2">
            <Text className="px-2 py-1 border border-primary text-primary rounded-md inline-flex self-start">
              Book Appointment
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const Hospitals = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [originalData, setOriginalData] = useState([]);

  const { hospitals } = useRepo();
  const { selectedLocation, searchTerm } = useLocalSearchParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getHospitals();
      const hospitalData = response.data.ResponseStatus || [];
      setOriginalData(hospitalData);
      setData(hospitalData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch hospitals. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Combined filtering function
  const filterData = (query, loc) => {
    let filteredHospitals = originalData;

    // Apply search query filter
    if (query) {
      filteredHospitals = filteredHospitals.filter((hospital) =>
        hospital.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply location filter
    if (loc) {
      filteredHospitals = filteredHospitals.filter(
        (hospital) => hospital.city === loc
      );
    }

    setData(filteredHospitals);
  };

  const searchHospital = (text) => {
    setSearchQuery(text);
    filterData(text, location);
  };

  const filterByLocation = (loc) => {
    setLocation(loc);
    filterData(searchQuery, loc);
  };

  useEffect(() => {
    if (hospitals.length > 0) {
      setOriginalData(hospitals);
      setData(hospitals);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [hospitals, fetchData]);

  // Apply search term and location from query params
  useEffect(() => {
    if (selectedLocation || searchTerm) {
      setLocation(selectedLocation || "");
      setSearchQuery(searchTerm || "");
      filterData(searchTerm || "", selectedLocation || "");
    }
  }, [selectedLocation, searchTerm]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [fetchData]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchData}>
          <Text style={{ color: "#006298", marginTop: 4 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title="Hospitals" />
      <View className="p-4">
        <View style={styles.locationFilter}>
          <Ionicons name="location-outline" size={20} color="#374151" />
          <Picker
            selectedValue={location}
            onValueChange={(value) => filterByLocation(value)}
            style={styles.locationPicker}
          >
            <Picker.Item label="Select Location" value="" />
            <Picker.Item label="Lucknow" value="Lucknow" />
            <Picker.Item label="Varanasi" value="Varanasi" />
            <Picker.Item label="Ghaziabad" value="Ghaziabad" />
            <Picker.Item label="Noida" value="Noida" />
            <Picker.Item label="Delhi" value="Delhi" />
          </Picker>
        </View>
        <TextInput
          placeholder="Search hospital name"
          onChangeText={(text) => searchHospital(text)}
          style={styles.searchInput}
          value={searchQuery}
        />
      </View>
      <View className="flex-1 justify-center items-center">
        <FlatList
          data={data}
          style={{ marginTop: 10 }}
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
};

export default Hospitals;

const styles = StyleSheet.create({
  shadowProp: {
    borderColor: "#E5E5E5",
    borderWidth: 1,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  searchInput: {
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingHorizontal: 10,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  locationFilter: {
    flexDirection: "row",
    alignItems: "center",
    width: 250,
    marginTop: -15,
  },
  locationPicker: {
    flex: 1,
  },
});
