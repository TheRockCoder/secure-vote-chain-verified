
import React, { useState } from 'react';
import { useVoting } from '@/context/VotingContext';
import PhoneVerification from './PhoneVerification';
import OtpVerification from './OtpVerification';
import VotingBallot from './VotingBallot';
import LiveResults from './LiveResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VotingSystem = () => {
  const { isAuthenticated, userPhone } = useVoting();
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("vote");

  // Handle authentication flow
  if (!isAuthenticated) {
    // If a phone number is present but not authenticated, show OTP verification
    if (userPhone && !showOtpVerification) {
      setShowOtpVerification(true);
    }
    
    if (showOtpVerification) {
      return <OtpVerification onBack={() => setShowOtpVerification(false)} />;
    }
    
    return <PhoneVerification />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="vote">Vote</TabsTrigger>
          <TabsTrigger value="results">Live Results</TabsTrigger>
        </TabsList>
        <TabsContent value="vote" className="mt-0">
          <VotingBallot />
        </TabsContent>
        <TabsContent value="results" className="mt-0">
          <LiveResults />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VotingSystem;
