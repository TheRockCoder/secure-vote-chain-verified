
import React from 'react';
import { VotingProvider } from '@/context/VotingContext';
import VotingSystem from '@/components/VotingSystem';
import { Separator } from '@/components/ui/separator';
import { LockIcon, ShieldCheckIcon, BarChart3Icon } from 'lucide-react';

const Index = () => {
  return (
    <VotingProvider>
      <div className="min-h-screen bg-vote-background flex flex-col">
        <header className="py-6 border-b">
          <div className="container">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-vote-primary">
              <span className="flex items-center justify-center">
                <LockIcon className="h-6 w-6 mr-2" />
                SecureVoteChain
              </span>
            </h1>
            <p className="text-center text-muted-foreground mt-1">Blockchain-powered secure voting system</p>
          </div>
        </header>

        <main className="flex-1 container py-8 md:py-12">
          <div className="mb-12">
            <VotingSystem />
          </div>

          <Separator className="my-12" />

          <section className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-vote-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Secure Authentication</h3>
                <p className="text-muted-foreground text-sm">Verify your identity with a one-time password sent to your phone, ensuring only eligible voters participate.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <LockIcon className="h-6 w-6 text-vote-secondary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Blockchain Technology</h3>
                <p className="text-muted-foreground text-sm">Each vote is securely recorded on the blockchain, making it tamper-proof and ensuring complete transparency.</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BarChart3Icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Real-time Results</h3>
                <p className="text-muted-foreground text-sm">Watch the election unfold with live vote counting, providing instant transparency and verifiable results.</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t py-6">
          <div className="container">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} SecureVoteChain - A blockchain-powered secure voting system
            </p>
          </div>
        </footer>
      </div>
    </VotingProvider>
  );
};

export default Index;
