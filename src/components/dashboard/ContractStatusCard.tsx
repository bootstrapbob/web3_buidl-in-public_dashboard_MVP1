'use client';

import { useState } from 'react';
import { FileCode, Plus, X } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContractStatus } from '@/src/lib/types';

interface ContractStatusCardProps {
  contractStatus: ContractStatus;
  onUpdate: (field: keyof ContractStatus, value: any) => void;
}

export function ContractStatusCard({ contractStatus, onUpdate }: ContractStatusCardProps) {
  const [newIssue, setNewIssue] = useState('');

  const addValidationIssue = () => {
    if (newIssue.trim() && !contractStatus.validationIssues.includes(newIssue.trim())) {
      onUpdate('validationIssues', [...contractStatus.validationIssues, newIssue.trim()]);
      setNewIssue('');
    }
  };

  const removeValidationIssue = (issue: string) => {
    onUpdate('validationIssues', contractStatus.validationIssues.filter(i => i !== issue));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValidationIssue();
    }
  };

  return (
    <SectionCard
      title="Smart Contract Status"
      description="Track deployment and audit progress"
      icon={<FileCode className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="is-deployed">Contract Deployed</Label>
          <Switch
            id="is-deployed"
            checked={contractStatus.isDeployed}
            onCheckedChange={(checked) => onUpdate('isDeployed', checked)}
          />
        </div>
        
        {contractStatus.isDeployed && (
          <>
            <div className="space-y-2">
              <Label htmlFor="contract-address">Contract Address</Label>
              <Input
                id="contract-address"
                placeholder="0x..."
                value={contractStatus.contractAddress || ''}
                onChange={(e) => onUpdate('contractAddress', e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contract-network">Network</Label>
              <Input
                id="contract-network"
                placeholder="e.g., Ethereum Mainnet, Polygon..."
                value={contractStatus.network || ''}
                onChange={(e) => onUpdate('network', e.target.value)}
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="audit-status">Audit Status</Label>
          <Select
            value={contractStatus.auditStatus}
            onValueChange={(value) => onUpdate('auditStatus', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {contractStatus.auditStatus !== 'not-started' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="audit-firm">Audit Firm</Label>
              <Input
                id="audit-firm"
                placeholder="e.g., OpenZeppelin, ConsenSys..."
                value={contractStatus.auditFirm || ''}
                onChange={(e) => onUpdate('auditFirm', e.target.value)}
              />
            </div>
            
            {contractStatus.auditStatus === 'completed' && (
              <div className="space-y-2">
                <Label htmlFor="audit-date">Audit Completion Date</Label>
                <Input
                  id="audit-date"
                  type="date"
                  value={contractStatus.auditDate || ''}
                  onChange={(e) => onUpdate('auditDate', e.target.value)}
                />
              </div>
            )}
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="gas-optimization">Gas Optimization</Label>
          <Select
            value={contractStatus.gasOptimization}
            onValueChange={(value) => onUpdate('gasOptimization', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="upgradeability">Upgradeable Contract</Label>
          <Switch
            id="upgradeability"
            checked={contractStatus.upgradeability}
            onCheckedChange={(checked) => onUpdate('upgradeability', checked)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Validation Issues</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add validation issue or concern..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addValidationIssue} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {contractStatus.validationIssues.length > 0 && (
            <div className="space-y-2 mt-2">
              {contractStatus.validationIssues.map((issue, index) => (
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