import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import { getAllSpecializations } from "@/api/doctor.js";

const DoctorFilters = ({ onFilter, onClear }) => {
  const [specialization, setSpecialization] = useState("");
  const [specializationArray, setSpecializationArray] = useState([]);
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [gender, setGender] = useState("");

  const handleApplyFilters = () => {
    onFilter({
      specialization,
      qualification,
      experience,
      gender,
    });
  };

  useEffect(() => {
    getAllSpecializations()
      .then((data) => setSpecializationArray(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <View className="px-4 bg-white">
      <Picker
        selectedValue={specialization}
        onValueChange={(value) => setSpecialization(value)}
        style={{ marginBottom: -10 }}
      >
        <Picker.Item label="Specialization" value="" />
        {specializationArray.map((item, index) => (
          <Picker.Item key={item.id} label={item.name} value={item.name} />
        ))}
        {/* <Picker.Item label="Other" value="" /> */}
      </Picker>
      <Picker
        selectedValue={qualification}
        onValueChange={(value) => setQualification(value)}
        style={{ marginBottom: -10 }}
        mode="dropdown"
      >
        <Picker.Item label="Qualification" value="" />
        <Picker.Item label="MBBS" value="MBBS" />
        <Picker.Item label="MD" value="MD" />
        <Picker.Item label="BDS" value="BDS" />
        <Picker.Item label="BHMS" value="BHMS" />
        <Picker.Item label="BAMS" value="BAMS" />
        <Picker.Item label="MS" value="MS" />
        {/* <Picker.Item label="Other" value="" /> */}
      </Picker>
      <Picker
        selectedValue={experience}
        onValueChange={(value) => setExperience(value)}
        style={{ marginBottom: -10 }}
      >
        <Picker.Item label="Experience" value="" />
        <Picker.Item label="1-5 years" value="1-5" />
        <Picker.Item label="5-10 years" value="5-10" />
        <Picker.Item label="10-15 years" value="10-15" />
        <Picker.Item label="15-20 years" value="15-20" />
        <Picker.Item label="20+ years" value="20-50" />
      </Picker>
      <Picker
        selectedValue={gender}
        onValueChange={(value) => setGender(value)}
      >
        <Picker.Item label="Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      <View className="flex-row mt-4 justify-between">
        <TouchableOpacity
          onPress={onClear}
          className="flex-1 bg-gray-200 px-4 py-2 rounded-lg mr-2 shadow-md"
        >
          <Text className="text-gray-700 font-semibold text-center">
            Clear Filters
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleApplyFilters}
          className="flex-1 bg-blue-500 px-4 py-2 rounded-lg ml-2 shadow-md"
        >
          <Text className="text-white font-semibold text-center">
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DoctorFilters;
