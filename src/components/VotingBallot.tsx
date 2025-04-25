
import React from 'react';
import { useVoting } from '@/context/VotingContext';
import { Check, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const VotingBallot = () => {
  const { candidates, submitVote, isLoading, hasVoted, voteResults } = useVoting();
  const [selectedCandidate, setSelectedCandidate] = React.useState<string | null>(null);
  
  const handleVote = async () => {
    if (selectedCandidate) {
      await submitVote(selectedCandidate);
    }
  };
  
  // If the user has already voted, show them their vote
  if (hasVoted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center">Vote Cast Successfully</CardTitle>
          <CardDescription className="text-center">
            Your vote has been securely recorded on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Thank you for participating in this secure voting process.</p>
          <p className="text-center text-sm text-muted-foreground">
            Your vote was encrypted and added to the blockchain, ensuring it cannot be tampered with.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Cast Your Vote</CardTitle>
        <CardDescription className="text-center">
          Select one candidate from the list below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((candidate) => (
            <div 
              key={candidate.id}
              className="transition-transform hover:scale-105 active:scale-95"
            >
              <Card 
                className={`cursor-pointer border-2 transition-all ${
                  selectedCandidate === candidate.id 
                    ? 'border-vote-primary bg-vote-primary/5' 
                    : 'hover:border-muted'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-vote-muted p-2 rounded-full">
                      <UserIcon className="h-8 w-8 text-vote-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.party}</p>
                    </div>
                    {selectedCandidate === candidate.id && (
                      <div className="ml-auto">
                        <div className="bg-vote-primary rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={handleVote} 
          className="w-full mt-6 bg-vote-primary hover:bg-vote-primary/90"
          disabled={!selectedCandidate || isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit Vote'}
        </Button>
        
        <p className="text-xs text-center mt-4 text-muted-foreground">
          Your vote will be securely recorded on the blockchain
        </p>
      </CardContent>
    </Card>
  );
};

export default VotingBallot;
