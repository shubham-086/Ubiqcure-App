import axios from "axios";

const base_url =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://ubiqcure.com/ubiqapi/api/Appointment";

export const getHospitals = async () => {
  try {
    const response = await axios.post(`${base_url}/getHospitals`);
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const getHospitalDetails = async (id) => {
  try {
    const response = await axios.post(
      `${base_url}/getHospitalDetail`,
      { hospitalId: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const getHospitalDoctors = async (id) => {
  try {
    const response = await axios.post(
      `${base_url}/getHospitalDoctors`,
      { hospitalId: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const getHospitalDoctorDetail = async (id) => {
  try {
    const response = await axios.post(
      `${base_url}/getHospitalDoctorDetail`,
      { DocId: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const getHospitalSlots = async (id) => {
  try {
    const response = await axios.post(
      `${base_url}/getHospitalSlots`,
      { DocId: id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const insertHospitalAppRequest = async (bookingInfo, patientId) => {
  const data = {
    DocId: bookingInfo.docId,
    hospitalId: bookingInfo.hospitalId,
    appDate: bookingInfo.appDate,
    appTimeSlot: bookingInfo.appTime,
    PatId: patientId,
    shift: bookingInfo.shift,
    slotNo: bookingInfo.slotNumber,
  };
  try {
    const response = await axios.post(
      `${base_url}/insertHospitalAppRequest`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.ResponseStatus[0];
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const createHospitalToken = async (data) => {
  // console.log("Token Data: ", data);
  try {
    const response = await axios.post(
      `${base_url}/insertHospitalAppToken`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (
      response.data &&
      response.data.ResponseStatus &&
      response.data.ResponseStatus[0]
    ) {
      return response.data.ResponseStatus[0];
    } else {
      console.error("Invalid response from server");
      return null;
    }
  } catch (error) {
    console.error("Error Creating Token: ", error);
    return null;
  }
};
