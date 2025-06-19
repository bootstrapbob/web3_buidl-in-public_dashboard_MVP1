'use client';

import { useState } from 'react';
import { Code, Plus, X } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from '@/src/lib/types';

interface TechStackCardProps {
  projectData: ProjectData;
  onUpdate: (field: keyof ProjectData, value: any) => void;
}

export function TechStackCard({ projectData, onUpdate }: TechStackCardProps) {
  const [newTech, setNewTech] = useState('');

  const addTechnology = () => {
    if (newTech.trim() && !projectData.techStack.includes(newTech.trim())) {
      onUpdate('techStack', [...projectData.techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    onUpdate('techStack', projectData.techStack.filter(t => t !== tech));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <SectionCard
      title="Tech Stack & Infrastructure"
      description="Technologies and blockchain network details"
      icon={<Code className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="blockchain-network">Blockchain Network</Label>
          <Input
            id="blockchain-network"
            placeholder="e.g., Ethereum, Polygon, Solana, Arbitrum..."
            value={projectData.blockchainNetwork}
            onChange={(e) => onUpdate('blockchainNetwork', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Technologies & Frameworks</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Add technology (e.g., React, Solidity, IPFS...)"
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={addTechnology} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {projectData.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {projectData.techStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <button
                    onClick={() => removeTechnology(tech)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="compatibility-report">Compatibility & Integration Notes</Label>
          <Textarea
            id="compatibility-report"
            placeholder="Any compatibility issues, integration challenges, or technical notes..."
            value={projectData.compatibilityReport}
            onChange={(e) => onUpdate('compatibilityReport', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </SectionCard>
  );
}