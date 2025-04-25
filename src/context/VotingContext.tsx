
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Blockchain, VoteData, voteChain } from '../lib/blockchain';
import { validateOTP, sendOTP } from '../lib/otpService';
import { generateVoterId } from '../lib/crypto-hash';
import { useToast } from "@/components/ui/use-toast";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  avatar?: string;
}

interface VotingContextType {
  isAuthenticated: boolean;
  authenticateUser: (phone: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  submitVote: (candidateId: string) => Promise<boolean>;
  candidates: Candidate[];
  userPhone: string;
  voterId: string | null;
  hasVoted: boolean;
  voteResults: { [candidateId: string]: number };
  totalVotes: number;
  isLoading: boolean;
  resendOTP: () => Promise<boolean>;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

// Sample candidates data
const SAMPLE_CANDIDATES: Candidate[] = [
  { id: 'c1', name: 'Alex Johnson', party: 'Progressive Party' },
  { id: 'c2', name: 'Maria Rodriguez', party: 'Future Alliance' },
  { id: 'c3', name: 'James Smith', party: 'United Democratic' },
  { id: 'c4', name: 'Sarah Williams', party: 'Liberty Coalition' },
];

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [voterId, setVoterId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResults, setVoteResults] = useState<{ [candidateId: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize vote counts
  useEffect(() => {
    updateVoteCounts();
    // Set up an interval to refresh vote counts
    const intervalId = setInterval(updateVoteCounts, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const updateVoteCounts = () => {
    const currentVotes = voteChain.getAllVotes();
    setVoteResults(currentVotes);
  };

  const authenticateUser = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = sendOTP(phone);
      if (success) {
        setUserPhone(phone);
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your phone.",
        });
        console.log("OTP sent successfully to:", phone);
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (): Promise<boolean> => {
    if (!userPhone) return false;
    setIsLoading(true);
    try {
      const success = sendOTP(userPhone);
      if (success) {
        toast({
          title: "OTP Resent",
          description: "A new verification code has been sent to your phone.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to resend OTP. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Verifying OTP:", otp, "for phone:", userPhone);
      const result = validateOTP(userPhone, otp);
      if (result.valid && result.voterId) {
        // Generate a secure voter ID
        const secureVoterId = await generateVoterId(userPhone);
        setVoterId(secureVoterId);
        setIsAuthenticated(true);
        toast({
          title: "Verified",
          description: "Your identity has been verified. You can now vote.",
        });
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitVote = async (candidateId: string): Promise<boolean> => {
    if (!voterId || !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please verify your identity before voting.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    try {
      const voteData: VoteData = {
        voterId,
        candidateId,
        timestamp: Date.now(),
      };
      
      const success = await voteChain.addVote(voteData);
      
      if (success) {
        setHasVoted(true);
        updateVoteCounts();
        toast({
          title: "Vote Recorded",
          description: "Your vote has been securely recorded on the blockchain.",
        });
        return true;
      } else {
        toast({
          title: "Voting Failed",
          description: "You have already voted. Each voter can only vote once.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Voting error:", error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VotingContext.Provider
      value={{
        isAuthenticated,
        authenticateUser,
        verifyOTP,
        submitVote,
        candidates: SAMPLE_CANDIDATES,
        userPhone,
        voterId,
        hasVoted,
        voteResults,
        totalVotes: voteChain.getTotalVotes(),
        isLoading,
        resendOTP,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = (): VotingContextType => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
