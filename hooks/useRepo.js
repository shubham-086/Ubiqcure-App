import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const useRepo = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    bookingInfo,
    setBookingInfo,
    patient,
    setPatient,
    doctors,
    setDoctors,
    hospitals,
    setHospitals,
    hospitalBookingInfo,
    setHospitalBookingInfo,
  } = useContext(AppContext);

  return {
    isLoggedIn,
    setIsLoggedIn,
    bookingInfo,
    setBookingInfo,
    patient,
    setPatient,
    doctors,
    setDoctors,
    hospitals,
    setHospitals,
    hospitalBookingInfo,
    setHospitalBookingInfo,
  };
};
