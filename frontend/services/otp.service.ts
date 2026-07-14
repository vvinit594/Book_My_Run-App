/**
 * Frontend OTP helpers.
 * Backend uses a replaceable OtpProvider (DummyOtpProvider → Twilio/MSG91 later).
 * Dev OTP is always 123456.
 */
export { sendOTP, verifyOTP } from "./auth.service";
