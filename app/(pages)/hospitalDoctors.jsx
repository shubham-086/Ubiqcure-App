import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { getHospitalDoctors } from "@/api/hospital";
import Header from "@/components/Header";
import { useRepo } from "@/hooks/useRepo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import DoctorFilters from "@/components/DoctorFilters";

const CardItem = React.memo(({ item }) => {
  const navigation = useNavigation();
  const { hospitalBookingInfo, setHospitalBookingInfo } = useRepo();
  const { width } = Dimensions.get("window");

  const handlePress = useCallback(() => {
    setHospitalBookingInfo({
      ...hospitalBookingInfo,
      docId: item.id,
      docName: item.name,
    });
    navigation.navigate("(pages)/hospitalDocProfile", { id: item.id });
  }, [item.id, navigation, hospitalBookingInfo, setHospitalBookingInfo]);

  return (
    <View
      className="justify-center items-center mb-5"
      style={[styles.shadowProp, { width }]}
      key={item.id}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        className="flex-row p-4 rounded-lg border border-gray-200 w-11/12"
        onPress={handlePress}
      >
        <Image
          source={{ uri: `data:image/png;base64,${item.photo}` }}
          className="rounded-full w-24 h-24"
          resizeMode="contain"
          style={{ borderColor: "#FFFFFF", borderWidth: 1 }}
        />
        <View className="flex-1 ml-5">
          <Text className="text-slate-700 text-xl font-bold">
            Dr. {item.name}
          </Text>
          <Text className="text-slate-700">{item.department.trim()}</Text>
          <Text className="text-slate-700">
            {item.experience} years experience
          </Text>
          <View className="mt-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="px-2 py-1 border border-primary rounded-md inline-flex self-start"
            >
              <Text className="text-primary">Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const HospitalDoctors = () => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterHeight] = useState(new Animated.Value(0));

  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await getHospitalDoctors(id);
        const doctors = response.data.ResponseStatus || [];
        setDoctorsData(doctors);
        setFilteredData(doctors);
        console.log(doctors[0]);
      } catch (error) {
        console.error("Error fetching Doctors: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctors();
    }
  }, [id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await getHospitalDoctors(id);
      const doctors = response.data.ResponseStatus || [];
      setDoctorsData(doctors);
      setFilteredData(doctors);
    } catch (error) {
      console.error("Error refreshing Doctor Data: ", error);
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  const toggleFilters = () => {
    if (filtersVisible) {
      Animated.timing(filterHeight, {
        toValue: 0,
        duration: 260,
        useNativeDriver: false,
      }).start(() => setFiltersVisible(false));
    } else {
      setFiltersVisible(true);
      Animated.timing(filterHeight, {
        toValue: 260,
        duration: 260,
        useNativeDriver: false,
      }).start();
    }
  };

  const searchDoctors = (text) => {
    setSearchQuery(text);
    const filteredDoctors = doctorsData.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(text.toLowerCase()) ||
        doctor.department.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredDoctors);
  };

  const applyFilters = ({
    specialization,
    qualification,
    experience,
    gender,
  }) => {
    let filteredDoctors = doctorsData;

    if (specialization) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.department === specialization
      );
    }

    if (qualification) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.qualification === qualification
      );
    }

    if (experience) {
      const [minExp, maxExp] = experience.split("-");
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.experience >= minExp && doctor.experience <= maxExp
      );
    }

    if (gender) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.gender === gender
      );
    }

    setFilteredData(filteredDoctors);
  };

  const handleClearFilters = useCallback(() => {
    setFilteredData(doctorsData);
  }, [doctorsData]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title="Our Doctors" />
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors by name / department"
            value={searchQuery}
            onChangeText={searchDoctors}
          />
          <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
            <Text style={styles.filterText}>Filters</Text>
            <Ionicons
              name={filtersVisible ? "chevron-up" : "chevron-down"}
              size={16}
              color="#006298"
            />
          </TouchableOpacity>
        </View>
      </View>
      {filtersVisible && (
        <Animated.View style={{ height: filterHeight }}>
          <DoctorFilters onFilter={applyFilters} onClear={handleClearFilters} />
        </Animated.View>
      )}
      <FlatList
        data={filteredData}
        style={{ marginTop: 15, backgroundColor: "white" }}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
};

export default HospitalDoctors;

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  searchInput: {
    borderColor: "#006298",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 11,
    borderRadius: 6,
    borderColor: "#006298",
    borderWidth: 1,
    marginLeft: 5,
  },
  filterText: {
    color: "#006298",
    fontSize: 15,
    marginRight: 3,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
