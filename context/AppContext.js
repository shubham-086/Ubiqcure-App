import { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [hospitalBookingInfo, setHospitalBookingInfo] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [patient, setPatient] = useState(null);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        bookingInfo,
        patient,
        doctors,
        hospitals,
        hospitalBookingInfo,
        setDoctors,
        setHospitals,
        setIsLoggedIn,
        setBookingInfo,
        setPatient,
        setHospitalBookingInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
