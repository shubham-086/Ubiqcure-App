import axios from "axios";

const baseUrl = "https://ubiqcure.com/ubiqapi/api";

export const getUpcomig = async (userId) => {
  const data = { userId };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/getUpcomingPatient`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching upcoming data: ", error);
    return null;
  }
};

export const getHistory = async (userId) => {
  const data = { userId };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/getHistoryPatient`,
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

export const getTokenDetails = async (bookingId) => {
  const data = { bookingId };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/trackAppointment`,
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
