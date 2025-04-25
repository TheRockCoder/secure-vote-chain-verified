
import React, { useState } from 'react';
import { useVoting } from '@/context/VotingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const PhoneVerification = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const { authenticateUser, isLoading } = useVoting();

  const validatePhone = (value: string): boolean => {
    // Basic phone validation - allow different formats
    if (!value.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    // Allow for international format or simple digits
    // Remove spaces, dashes, parentheses
    const digitsOnly = value.replace(/[\s\-\(\)]/g, '');
    
    // Check if it has a reasonable length (7-15 digits)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhone(phone)) {
      const success = await authenticateUser(phone);
      console.log("Authentication result:", success);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="bg-vote-primary/10 p-3 rounded-full">
            <Lock className="h-6 w-6 text-vote-primary" />
          </div>
        </div>
        <CardTitle className="text-center">Verify Your Identity</CardTitle>
        <CardDescription className="text-center">
          Enter your phone number to receive a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={phoneError ? 'border-destructive' : ''}
              />
              {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-vote-primary hover:bg-vote-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-xs text-muted-foreground">
          We'll send you a one-time code to verify your identity
        </p>
      </CardFooter>
    </Card>
  );
};

export default PhoneVerification;
