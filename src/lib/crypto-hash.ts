
// Simple wrapper for SubtleCrypto to hash data
export async function sha256(message: string): Promise<string> {
  // Encode the message as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  
  // Convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// Generate a random OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a unique voter ID based on phone
export async function generateVoterId(phoneNumber: string): Promise<string> {
  const salt = "SecureVoteChain2025";
  return await sha256(phoneNumber + salt);
}
