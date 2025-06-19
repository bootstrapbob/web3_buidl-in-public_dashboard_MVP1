'use client';

import { useState } from 'react';
import { Coins, Plus, X, PieChart } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TokenomicsDetails } from '@/src/lib/types';
import { formatCurrency, generateId } from '@/src/lib/utils';

interface TokenomicsCardProps {
  tokenomics: TokenomicsDetails;
  onUpdate: (field: keyof TokenomicsDetails, value: any) => void;
}

export function TokenomicsCard({ tokenomics, onUpdate }: TokenomicsCardProps) {
  const [newDistribution, setNewDistribution] = useState({
    category: '',
    percentage: '',
    vestingPeriod: ''
  });
  
  const [newUtility, setNewUtility] = useState('');
  const [newIssue, setNewIssue] = useState('');

  const addDistribution = () => {
    if (newDistribution.category.trim() && newDistribution.percentage) {
      const distribution = {
        category: newDistribution.category.trim(),
        percentage: parseFloat(newDistribution.percentage),
        vestingPeriod: newDistribution.vestingPeriod || undefined
      };
      
      onUpdate('distribution', [...tokenomics.distribution, distribution]);
      setNewDistribution({ category: '', percentage: '', vestingPeriod: '' });
    }
  };

  const removeDistribution = (index: number) => {
    onUpdate('distribution', tokenomics.distribution.filter((_, i) => i !== index));
  };

  const addUtilityFeature = () => {
    if (newUtility.trim() && !tokenomics.utilityFeatures.includes(newUtility.trim())) {
      onUpdate('utilityFeatures', [...tokenomics.utilityFeatures, newUtility.trim()]);
      setNewUtility('');
    }
  };

  const removeUtilityFeature = (feature: string) => {
    onUpdate('utilityFeatures', tokenomics.utilityFeatures.filter(f => f !== feature));
  };

  const addValidationIssue = () => {
    if (newIssue.trim() && !tokenomics.validationIssues.includes(newIssue.trim())) {
      onUpdate('validationIssues', [...tokenomics.validationIssues, newIssue.trim()]);
      setNewIssue('');
    }
  };

  const removeValidationIssue = (issue: string) => {
    onUpdate('validationIssues', tokenomics.validationIssues.filter(i => i !== issue));
  };

  const totalDistribution = tokenomics.distribution.reduce((sum, dist) => sum + dist.percentage, 0);

  return (
    <SectionCard
      title="Tokenomics"
      description="Token economics and distribution details"
      icon={<Coins className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="token-name">Token Name</Label>
            <Input
              id="token-name"
              placeholder="e.g., MyToken"
              value={tokenomics.tokenName}
              onChange={(e) => onUpdate('tokenName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token-symbol">Token Symbol</Label>
            <Input
              id="token-symbol"
              placeholder="e.g., MTK"
              value={tokenomics.tokenSymbol}
              onChange={(e) => onUpdate('tokenSymbol', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="total-supply">Total Supply</Label>
            <Input
              id="total-supply"
              type="number"
              placeholder="1000000"
              value={tokenomics.totalSupply}
              onChange={(e) => onUpdate('totalSupply', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current-price">Current Price ($)</Label>
            <Input
              id="current-price"
              type="number"
              step="0.000001"
              placeholder="0.00"
              value={tokenomics.currentPrice}
              onChange={(e) => onUpdate('currentPrice', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        
        {tokenomics.currentPrice > 0 && tokenomics.totalSupply > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                Market Cap: {formatCurrency(tokenomics.currentPrice * tokenomics.totalSupply)}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Label htmlFor="staking-rewards">Staking Rewards</Label>
          <Switch
            id="staking-rewards"
            checked={tokenomics.stakingRewards}
            onCheckedChange={(checked) => onUpdate('stakingRewards', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="deflationary">Deflationary Token</Label>
          <Switch
            id="deflationary"
            checked={tokenomics.deflationary}
            onCheckedChange={(checked) => onUpdate('deflationary', checked)}
          />
        </div>
        
        {/* Token Distribution */}
        <div className="space-y-3">
          <Label>Token Distribution</Label>
          
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Category (e.g., Team, Public)"
                  value={newDistribution.category}
                  onChange={(e) => setNewDistribution({...newDistribution, category: e.target.value})}
                />
                <Input
                  type="number"
                  placeholder="Percentage"
                  value={newDistribution.percentage}
                  onChange={(e) => setNewDistribution({...newDistribution, percentage: e.target.value})}
                />
                <Input
                  placeholder="Vesting (optional)"
                  value={newDistribution.vestingPeriod}
                  onChange={(e) => setNewDistribution({...newDistribution, vestingPeriod: e.target.value})}
                />
              </div>
              <Button onClick={addDistribution} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Distribution
              </Button>
            </CardContent>
          </Card>
          
          {tokenomics.distribution.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Distribution</span>
                  <span className={totalDistribution === 100 ? 'text-green-600' : 'text-red-600'}>
                    {totalDistribution}%
                  </span>
                </div>
                <Progress value={Math.min(totalDistribution, 100)} className="h-2" />
              </div>
              
              {tokenomics.distribution.map((dist, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{dist.category}</h4>
                        <p className="text-2xl font-bold text-primary">{dist.percentage}%</p>
                        {dist.vestingPeriod && (
                          <p className="text-sm text-muted-foreground">Vesting: {dist.vestingPeriod}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDistribution(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
        
        {/* Utility Features */}
        <div className="space-y-2">
          <Label>Utility Features</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add utility feature..."
              value={newUtility}
              onChange={(e) => setNewUtility(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUtilityFeature()}
            />
            <Button onClick={addUtilityFeature} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tokenomics.utilityFeatures.length > 0 && (
            <div className="space-y-2 mt-2">
              {tokenomics.utilityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{feature}</span>
                  <button
                    onClick={() => removeUtilityFeature(feature)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Validation Issues */}
        <div className="space-y-2">
          <Label>Validation Issues</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add validation issue..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addValidationIssue()}
            />
            <Button onClick={addValidationIssue} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tokenomics.validationIssues.length > 0 && (
            <div className="space-y-2 mt-2">
              {tokenomics.validationIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">{issue}</span>
                  <button
                    onClick={() => removeValidationIssue(issue)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}