
import React, { useEffect } from 'react';
import { useVoting } from '@/context/VotingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#673ab7'];

const LiveResults = () => {
  const { voteResults, candidates, totalVotes } = useVoting();
  const [chartData, setChartData] = React.useState<Array<{ name: string; value: number; }>[]>([]);
  
  useEffect(() => {
    // Transform the data for the chart
    const data = candidates.map(candidate => ({
      name: candidate.name,
      value: voteResults[candidate.id] || 0,
    }));
    
    setChartData(data);
  }, [voteResults, candidates]);

  const formatPercent = (votes: number) => {
    if (totalVotes === 0) return '0%';
    return `${Math.round((votes / totalVotes) * 100)}%`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          Live Results
          <span className="ml-2 text-xs bg-vote-accent/20 text-vote-accent py-1 px-2 rounded-full animate-pulse-blue">
            Real-time
          </span>
        </CardTitle>
        <CardDescription className="text-center">
          Total votes: {totalVotes}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalVotes > 0 ? (
          <>
            <div className="mb-6 h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value} votes`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              {candidates.map((candidate) => {
                const votes = voteResults[candidate.id] || 0;
                const percent = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
                
                return (
                  <div key={candidate.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{candidate.name}</span>
                      <span className="font-medium">{votes} votes ({formatPercent(votes)})</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No votes have been cast yet. Results will appear here in real-time as votes are registered on the blockchain.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveResults;
