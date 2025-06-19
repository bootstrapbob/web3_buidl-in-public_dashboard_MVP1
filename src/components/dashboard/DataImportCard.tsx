'use client';

import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProjectData } from '@/src/lib/types';

interface DataImportCardProps {
  onDataImport: (data: Partial<ProjectData>) => void;
}

export function DataImportCard({ onDataImport }: DataImportCardProps) {
  const [isImporting, setIsImporting] = useState(false);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      toast.error('Please select a JSON file');
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Map common field variations
      const mappedData: Partial<ProjectData> = {
        projectName: data.projectName || data.name || data.title || '',
        projectOverview: data.projectOverview || data.overview || data.description || data.problemStatement || '',
        targetAudience: data.targetAudience || data.audience || data.target || '',
        currentStrugglesToAddress: data.currentStrugglesToAddress || data.struggles || data.challenges || '',
        techStack: Array.isArray(data.techStack) ? data.techStack : 
                   Array.isArray(data.technologies) ? data.technologies : 
                   typeof data.techStack === 'string' ? data.techStack.split(',').map((s: string) => s.trim()) : [],
        blockchainNetwork: data.blockchainNetwork || data.network || data.blockchain || '',
        compatibilityReport: data.compatibilityReport || data.compatibility || '',
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        contractStatus: data.contractStatus || {},
        funding: data.funding || data.fundingDetails || {},
        tokenomics: data.tokenomics || data.tokenomicsDetails || {},
        socialMediaTemplate: data.socialMediaTemplate || data.template || '',
        memeImageUrl: data.memeImageUrl || data.memeUrl || '',
        memeText: data.memeText || data.meme || '',
        recentPosts: data.recentPosts || data.posts || '',
        web3Trends: data.web3Trends || data.trends || '',
      };

      onDataImport(mappedData);
      toast.success('Project data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <SectionCard
      title="Import Project Data"
      description="Import existing project data from JSON file"
      icon={<Upload className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="data-import">Select JSON File</Label>
          <Input
            id="data-import"
            type="file"
            accept=".json"
            onChange={handleFileImport}
            disabled={isImporting}
          />
        </div>
        
        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Import project data from other BUIDL tools or previous exports. 
            The system will automatically map common field names.
          </p>
        </div>
        
        {isImporting && (
          <div className="text-sm text-muted-foreground">
            Importing data...
          </div>
        )}
      </div>
    </SectionCard>
  );
}