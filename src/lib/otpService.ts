
import { generateOTP } from "./crypto-hash";

// In a real app, this would be a database or external service
const otpStore: { [phone: string]: { otp: string, expiresAt: number } } = {};

export interface OtpValidationResult {
  valid: boolean;
  message: string;
  voterId?: string;
}

// Send OTP to a phone number
export const sendOTP = (phoneNumber: string): boolean => {
  try {
    // Generate a 6-digit OTP
    const otp = generateOTP();
    
    // Store it with 5-minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore[phoneNumber] = { otp, expiresAt };
    
    // In a real application, we would send this via SMS service
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

// Validate OTP
export const validateOTP = (phoneNumber: string, userOTP: string): OtpValidationResult => {
  const storedData = otpStore[phoneNumber];
  
  // If no OTP exists for this phone
  if (!storedData) {
    return { valid: false, message: "No OTP request found. Please request a new OTP." };
  }
  
  // If OTP has expired
  if (Date.now() > storedData.expiresAt) {
    delete otpStore[phoneNumber]; // Clear expired OTP
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }
  
  // If OTP doesn't match
  if (storedData.otp !== userOTP) {
    return { valid: false, message: "Invalid OTP. Please try again." };
  }
  
  // Success! Clear the OTP
  delete otpStore[phoneNumber];
  
  return { 
    valid: true, 
    message: "OTP verified successfully.",
    // In a real app, this voterId would be retrieved from a database
    voterId: phoneNumber.replace(/\D/g, '') // Simplified: just use digits
  };
};

// For development purposes: retrieve the OTP for a phone number
export const getOTPForDev = (phoneNumber: string): string | null => {
  const data = otpStore[phoneNumber];
  return data ? data.otp : null;
};
