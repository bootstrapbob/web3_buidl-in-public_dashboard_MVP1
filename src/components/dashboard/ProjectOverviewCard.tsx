'use client';

import { FolderOpen } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProjectData } from '@/src/lib/types';

interface ProjectOverviewCardProps {
  projectData: ProjectData;
  onUpdate: (field: keyof ProjectData, value: string) => void;
}

export function ProjectOverviewCard({ projectData, onUpdate }: ProjectOverviewCardProps) {
  return (
    <SectionCard
      title="Project Overview"
      description="Basic information about your Web3 project"
      icon={<FolderOpen className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="Enter your project name"
            value={projectData.projectName}
            onChange={(e) => onUpdate('projectName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project-overview">Project Overview</Label>
          <Textarea
            id="project-overview"
            placeholder="Describe what your project does, the problem it solves, and your vision..."
            value={projectData.projectOverview}
            onChange={(e) => onUpdate('projectOverview', e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="target-audience">Target Audience</Label>
          <Textarea
            id="target-audience"
            placeholder="Who is your primary audience? Developers, DeFi users, NFT collectors, etc."
            value={projectData.targetAudience}
            onChange={(e) => onUpdate('targetAudience', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="current-struggles">Current Struggles to Address</Label>
          <Textarea
            id="current-struggles"
            placeholder="What challenges are you currently facing? Technical, community, funding, etc."
            value={projectData.currentStrugglesToAddress}
            onChange={(e) => onUpdate('currentStrugglesToAddress', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </SectionCard>
  );
}