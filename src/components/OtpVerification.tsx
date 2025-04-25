
import React, { useState, useEffect } from 'react';
import { useVoting } from '@/context/VotingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Lock, ArrowLeft } from 'lucide-react';
import { getOTPForDev } from '@/lib/otpService';

interface OtpVerificationProps {
  onBack: () => void;
}

const OtpVerification = ({ onBack }: OtpVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { verifyOTP, userPhone, isLoading, resendOTP } = useVoting();

  // Debug - Console log the current OTP for development
  useEffect(() => {
    if (userPhone) {
      const devOtp = getOTPForDev(userPhone);
      console.log(`DEV ONLY - OTP for ${userPhone}:`, devOtp);
    }
  }, [userPhone]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length === 6) {
      console.log("Attempting to verify OTP:", otp);
      await verifyOTP(otp);
    }
  };

  const handleResend = async () => {
    const result = await resendOTP();
    if (result) {
      setTimer(30);
      setCanResend(false);
      setOtp('');
    }
  };

  const maskedPhone = userPhone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');

  console.log("Rendering OTP verification for phone:", userPhone);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 top-4" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-center mb-4">
          <div className="bg-vote-primary/10 p-3 rounded-full">
            <Lock className="h-6 w-6 text-vote-primary" />
          </div>
        </div>
        <CardTitle className="text-center">OTP Verification</CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to {maskedPhone}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={setOtp}
            className="gap-2 justify-center"
          >
            <InputOTPGroup>
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <InputOTPSlot 
                    key={index} 
                    index={index}
                    className="w-10 h-12 text-lg border-vote-primary/20 focus:border-vote-primary"
                  />
                ))}
            </InputOTPGroup>
          </InputOTP>
          
          <Button 
            onClick={handleVerify} 
            className="w-full bg-vote-primary hover:bg-vote-primary/90"
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>
      </CardContent>
      <Separator className="my-2" />
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-center text-muted-foreground">
          {canResend ? (
            <Button variant="link" className="p-0" onClick={handleResend} disabled={isLoading}>
              Resend code
            </Button>
          ) : (
            <>Resend code in <span className="font-medium">{timer}s</span></>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default OtpVerification;
