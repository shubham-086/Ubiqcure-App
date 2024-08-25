import axios from "axios";

const baseUrl = "https://ubiqcure.com/ubiqapi/api";

export const getAllDoctors = async () => {
  try {
    const response = await axios.post(`${baseUrl}/Appointment/getDoctors`);
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const getDoctorDetails = async (docId) => {
  const id = { docId: docId };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/getDoctorsDetail`,
      id,
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

export const getClinicDetails = async (docId) => {
  const id = { docId: docId };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/getClinicsDetail`,
      id,
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

export const getClinicSlots = async (clinicId, docId, date) => {
  const data = { docId: docId, clinicId: clinicId, AppDate: date };
  console.log("Data", data);
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/getTimeSlot`,
      data,
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

export const getBookedSlots = async (clinicId, docId, date) => {
  const data = { docId: docId, clinicId: clinicId, AppDate: date };
  console.log("Data", data);
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/getIssuedSlot`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response && response.data.ResponseStatus[0];
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};
