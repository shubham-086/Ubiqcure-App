import axios from "axios";

const baseUrl = "https://ubiqcure.com/ubiqapi/api";

export const checkUser = async (phoneNumber) => {
  console.log(phoneNumber);
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/checkUserInDb`,
      { UserPhone: phoneNumber },
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

export const registerUser = async (data) => {
  const user = {
    userName: data.userName,
    userMobile: data.phoneNumber,
    userAge: data.age,
    userGender: data.gender,
    userEmail: data.email,
  };
  console.log("API call", user);
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/insertUser`,
      user,
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
