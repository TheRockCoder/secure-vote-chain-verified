
import React, { useState, useEffect } from 'react';
import { useVoting } from '@/context/VotingContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const LiveResults = () => {
  const { candidates, voteResults, totalVotes } = useVoting();
  const [chartData, setChartData] = useState<{ name: string; value: number; }[]>([]);
  
  useEffect(() => {
    if (candidates && voteResults) {
      const data = candidates.map(candidate => ({
        name: candidate.name,
        value: voteResults[candidate.id] || 0
      }));
      
      // Fix the type issue by directly setting the array, not trying to use it as a nested array
      setChartData(data);
    }
  }, [candidates, voteResults]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Live Voting Results</CardTitle>
        <CardDescription className="text-center">
          Results update in real-time as votes are cast
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalVotes === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg font-medium">No votes have been cast yet</p>
            <p className="text-muted-foreground mt-2">Results will appear here once voting begins</p>
          </div>
        ) : (
          <>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} votes`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {chartData.map((entry, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-medium">{entry.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-2xl font-bold">{entry.value}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {totalVotes > 0 ? `${((entry.value / totalVotes) * 100).toFixed(1)}%` : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">Total votes: {totalVotes}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveResults;
