import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

const ModalView = ({ showModal, onRequestClose, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 justify-center items-center">
        <View className="flex-1 inset-0 bg-gray-800 opacity-50 absolute w-full h-full" />
        <View className="relative z-10">
          <View className="rounded-2xl bg-white p-5 relative">
            <TouchableOpacity
              onPress={onRequestClose}
              activeOpacity={0.7}
              className="absolute top-0 right-0 mt-2 mr-2"
            >
              <Entypo name="cross" size={24} color="rgb(107 114 128);" />
            </TouchableOpacity>
            <View className="mt-1">{children}</View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalView;
