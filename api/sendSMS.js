import axios from "axios";

const API_URL = "https://sms.digidonar.com/app/smsapi/index.php";

const generateOtp = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const sendOtpToMobile = async (mobileNumber, otp) => {
  const message = `Thank you for choosing UBIQCURE. Please verify your phone number using the code ${otp}. If you did not request this, please ignore this message. SIDVIR PVL.`;
  try {
    const response = await axios.post(
      `${API_URL}?key=2667C21035D329&campaign=11615&routeid=101494&type=text&contacts=${mobileNumber}&senderid=SIDVIR&msg=${message}&template_id=1107171955224055764&pe_id=1101401980000079973`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const sendBookingDetails = async (
  mobileNumber,
  token,
  date,
  time,
  docName,
  bookingId,
  tokenId
) => {
  const trackingUrl = `https://ubiqcure.com/t.aspx?i=${tokenId}`;
  const message = `Greetings from UBIQCURE. Appt with Dr. ${docName} confirmed. Token B${token}. ${date}, ${time}. Booking ID ${bookingId}. Track your appt at ${trackingUrl} SIDVIR PVL.`;
  try {
    const response = await axios.post(
      `${API_URL}?key=2667C21035D329&campaign=11615&routeid=101494&type=text&contacts=${mobileNumber}&senderid=SIDVIR&msg=${message}&template_id=1107171955212835371&pe_id=1101401980000079973`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { generateOtp, sendOtpToMobile, sendBookingDetails };
