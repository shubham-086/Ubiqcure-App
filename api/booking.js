import axios from "axios";

const baseUrl = "https://ubiqcure.com/ubiqapi/api";

export const insertAppRequest = async (bookingInfo, patientId) => {
  const data = {
    DocId: bookingInfo.docId,
    clinicId: bookingInfo.clinicId,
    appDate: bookingInfo.appDate,
    appTimeSlot: bookingInfo.appTime,
    PatId: patientId,
    shift: bookingInfo.shift,
    slotNo: bookingInfo.slotNumber,
  };
  // console.log(data);
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/insertAppRequest`,
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

export const insertPatient = async (patient, userId) => {
  const data = {
    Pname: patient.patientName,
    PmobileNo: patient.phoneNumber,
    PAge: patient.age,
    PMail: patient.email,
    today: new Date(Date.now()).toISOString(),
    PGender: patient.gender,
    userId: userId,
  };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/insertPatient`,
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

export const viewAppRequestDetails = async (guidId) => {
  const data = {
    guidId: guidId,
  };
  // console.log(data);

  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/viewInvoice`,
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

export const getOrderId = async (guidId) => {
  const data = {
    guidId: guidId,
  };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/createOrderId`,
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

export const insertPaymentReq = async (
  guidId,
  userId,
  UserPhone,
  bookingFees
) => {
  const orderIdResponse = await getOrderId();
  const data = {
    orderId: orderIdResponse.data.OrderId,
    guidId,
    userId,
    UserPhone,
    bookingFees,
  };

  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/insertPaymentRequest`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { response: response.data, orderId: orderIdResponse.data.OrderId };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const varifyPayment = async (orderId, paymentId, signature) => {
  const data = { orderId, paymentId, signature };
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/VerifyPaymentSignature`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

export const createToken = async (data) => {
  // console.log("update payment: ", data);
  try {
    const response = await axios.post(
      `${baseUrl}/Appointment/insertAppToken`,
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
    console.error("Error fetching data: ", error);
    return null;
  }
};
