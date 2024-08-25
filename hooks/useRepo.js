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
  } = useContext(AppContext);

  return {
    isLoggedIn,
    setIsLoggedIn,
    bookingInfo,
    setBookingInfo,
    patient,
    setPatient,
  };
};
