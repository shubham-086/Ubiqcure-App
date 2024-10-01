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
  Animated,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import Header from "@/components/Header";
import { useNavigation } from "@react-navigation/native";
import { getAllDoctors } from "@/api/doctor";
import { useRepo } from "@/hooks/useRepo";
import DoctorFilters from "@/components/DoctorFilters";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
// import { debounce } from "lodash";

const CardItem = React.memo(({ item }) => {
  const { setBookingInfo } = useRepo();
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const handlePress = useCallback(() => {
    setBookingInfo({ docId: item.Id });
    navigation.navigate("(pages)/docProfile", { id: item.Id });
  }, [item.Id, setBookingInfo, navigation]);

  return (
    <View style={[styles.cardContainer, { width }]} key={item.Id}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={handlePress}
      >
        <Image
          source={{ uri: `data:image/png;base64,${item.Photo}` }}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Dr. {item.Name}</Text>
          <Text style={styles.cardSubtitle}>{item.Specialization}</Text>
          <Text style={styles.cardSubtitle}>
            {item.Experience} years experience
          </Text>
          <Text style={styles.cardSubtitle}>{item.CityList}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.bookButton}>Book Appointment</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const DoctorList = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filterHeight] = useState(new Animated.Value(0));

  const { doctors, setDoctors } = useRepo();
  const { selectedLocation, searchTerm } = useLocalSearchParams();

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
  };

  const filterDoctors = useMemo(() => {
    let filteredDoctors = doctors;

    if (searchQuery) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) =>
          doctor.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.Specialization.toLowerCase().includes(
            searchQuery.toLowerCase()
          )
      );
    }

    if (location) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.CityList.includes(location)
      );
    }

    return filteredDoctors;
  }, [doctors, searchQuery, location]);

  const applyFilters = ({
    specialization,
    qualification,
    experience,
    gender,
  }) => {
    let filteredDoctors = filterDoctors;

    if (specialization) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.Specialization === specialization
      );
    }

    if (qualification) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.Qualification === qualification
      );
    }

    if (experience) {
      const [minExp, maxExp] = experience.split("-");
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.Experience >= minExp && doctor.Experience <= maxExp
      );
    }

    if (gender) {
      filteredDoctors = filteredDoctors.filter(
        (doctor) => doctor.Gender === gender
      );
    }

    setFilteredData(filteredDoctors);
  };

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setLocation("");
    setFilteredData(doctors);
  }, [doctors]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllDoctors();
      setDoctors(response.data.ResponseStatus || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [setDoctors]);

  useEffect(() => {
    if (doctors.length === 0) {
      fetchData();
    } else {
      setFilteredData(doctors);
      setLoading(false);
    }
  }, [doctors, fetchData]);

  useEffect(() => {
    if (selectedLocation || searchTerm) {
      setLocation(selectedLocation);
      setSearchQuery(searchTerm);
    }
  }, [selectedLocation, searchTerm]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, [fetchData]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#006298" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchData}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Our Doctors" />
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors by name / specialization"
          value={searchQuery}
          onChangeText={searchDoctors}
        />
        <View style={styles.filterRow}>
          <View style={styles.locationFilter}>
            <Ionicons name="location-outline" size={20} color="#006298" />
            <Picker
              selectedValue={location}
              onValueChange={(value) => setLocation(value)}
              style={styles.locationPicker}
              dropdownIconColor="#006298"
            >
              <Picker.Item label="Location" value="" />
              <Picker.Item label="Lucknow" value="Lucknow" />
              <Picker.Item label="Varanasi" value="Varanasi" />
              <Picker.Item label="Ghaziabad" value="Ghaziabad" />
              <Picker.Item label="Noida" value="Noida" />
              <Picker.Item label="Delhi" value="Delhi" />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
            <Text style={styles.filterText}>More Filters</Text>
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
        data={filterDoctors}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item) => item.Id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        getItemLayout={(data, index) => ({
          length: 130,
          offset: 130 * index,
          index,
        })}
        windowSize={11}
      />
    </View>
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  retryText: { color: "#006298", marginTop: 4 },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderColor: "#E5E5E5",
    borderWidth: 1,
    width: "92%",
    backgroundColor: "#FFF",
    elevation: 4,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  cardContent: { flex: 1, marginLeft: 16 },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardSubtitle: { color: "#777", marginTop: 4 },
  buttonContainer: { marginTop: 8 },
  bookButton: {
    color: "#006298",
    borderColor: "#006298",
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    textAlign: "center",
    alignSelf: "flex-start",
  },
  filterContainer: {
    padding: 15,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationFilter: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    height: 42,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 2,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  locationPicker: {
    width: 160,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 6,
    borderColor: "#006298",
    borderWidth: 1,
  },
  filterText: {
    color: "#006298",
    fontSize: 14,
    marginRight: 6,
  },
});
