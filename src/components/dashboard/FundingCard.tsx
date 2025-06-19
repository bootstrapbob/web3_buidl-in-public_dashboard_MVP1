'use client';

import { useState } from 'react';
import { DollarSign, Plus, X, TrendingUp } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FundingDetails } from '@/src/lib/types';
import { formatCurrency, generateId } from '@/src/lib/utils';

interface FundingCardProps {
  funding: FundingDetails;
  onUpdate: (field: keyof FundingDetails, value: any) => void;
}

export function FundingCard({ funding, onUpdate }: FundingCardProps) {
  const [newRound, setNewRound] = useState({
    roundName: '',
    amount: '',
    date: '',
    investors: ''
  });

  const addFundingRound = () => {
    if (newRound.roundName.trim() && newRound.amount) {
      const round = {
        id: generateId(),
        roundName: newRound.roundName.trim(),
        amount: parseFloat(newRound.amount),
        date: newRound.date,
        investors: newRound.investors.split(',').map(inv => inv.trim()).filter(Boolean)
      };
      
      onUpdate('fundingRounds', [...funding.fundingRounds, round]);
      setNewRound({ roundName: '', amount: '', date: '', investors: '' });
    }
  };

  const removeFundingRound = (id: string) => {
    onUpdate('fundingRounds', funding.fundingRounds.filter(round => round.id !== id));
  };

  const fundingProgress = funding.targetAmount > 0 ? (funding.totalRaised / funding.targetAmount) * 100 : 0;
  const runwayMonths = funding.burnRate > 0 ? funding.totalRaised / funding.burnRate : 0;

  return (
    <SectionCard
      title="Funding & Finance"
      description="Track funding rounds and financial metrics"
      icon={<DollarSign className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="total-raised">Total Raised</Label>
            <Input
              id="total-raised"
              type="number"
              placeholder="0"
              value={funding.totalRaised}
              onChange={(e) => onUpdate('totalRaised', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-amount">Target Amount</Label>
            <Input
              id="target-amount"
              type="number"
              placeholder="0"
              value={funding.targetAmount}
              onChange={(e) => onUpdate('targetAmount', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            placeholder="USD, ETH, USDC..."
            value={funding.currency}
            onChange={(e) => onUpdate('currency', e.target.value)}
          />
        </div>
        
        {funding.targetAmount > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Funding Progress</span>
              <span>{fundingProgress.toFixed(1)}%</span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(funding.totalRaised, funding.currency)}</span>
              <span>{formatCurrency(funding.targetAmount, funding.currency)}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="burn-rate">Monthly Burn Rate</Label>
            <Input
              id="burn-rate"
              type="number"
              placeholder="0"
              value={funding.burnRate}
              onChange={(e) => onUpdate('burnRate', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="next-milestone-amount">Next Milestone Amount</Label>
            <Input
              id="next-milestone-amount"
              type="number"
              placeholder="0"
              value={funding.nextMilestoneAmount}
              onChange={(e) => onUpdate('nextMilestoneAmount', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        {runwayMonths > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Current Runway: {runwayMonths.toFixed(1)} months
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Label>Funding Rounds</Label>
          
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Add New Round</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Round name (e.g., Seed, Series A...)"
                  value={newRound.roundName}
                  onChange={(e) => setNewRound({...newRound, roundName: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newRound.amount}
                  onChange={(e) => setNewRound({...newRound, amount: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={newRound.date}
                  onChange={(e) => setNewRound({...newRound, date: e.target.value})}
                />
                <Input
                  placeholder="Investors (comma-separated)"
                  value={newRound.investors}
                  onChange={(e) => setNewRound({...newRound, investors: e.target.value})}
                />
              </div>
              <Button onClick={addFundingRound} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </Button>
            </CardContent>
          </Card>
          
          {funding.fundingRounds.map((round) => (
            <Card key={round.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{round.roundName}</h4>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(round.amount, funding.currency)}
                    </p>
                    {round.date && (
                      <p className="text-sm text-muted-foreground">{round.date}</p>
                    )}
                    {round.investors.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Investors:</strong> {round.investors.join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFundingRound(round.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}