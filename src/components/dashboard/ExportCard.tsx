'use client';

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Button } from '@/components/ui/button';
import { ProjectData } from '@/src/lib/types';

interface ExportCardProps {
  projectData: ProjectData;
  generatedPost: string;
}

export function ExportCard({ projectData, generatedPost }: ExportCardProps) {
  const [copiedPost, setCopiedPost] = useState(false);

  const handleExportJson = () => {
    const exportData = {
      ...projectData,
      generatedPost,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.projectName || 'web3-project'}-progress-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPost = async () => {
    if (!generatedPost) return;
    
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <SectionCard
      title="Export & Share"
      description="Export project data and share your progress"
      icon={<Download className="h-5 w-5" />}
    >
      <div className="space-y-3">
        <Button onClick={handleExportJson} className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Progress Report (JSON)
        </Button>
        
        <Button 
          onClick={handleCopyPost} 
          className="w-full" 
          variant="outline"
          disabled={!generatedPost}
        >
          {copiedPost ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copiedPost ? 'Copied!' : 'Copy Social Media Post'}
        </Button>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Export includes all project data and generated content</p>
          <p>• Data is compatible with other BUIDL tools</p>
          <p>• Share your progress with team members or investors</p>
        </div>
      </div>
    </SectionCard>
  );
}