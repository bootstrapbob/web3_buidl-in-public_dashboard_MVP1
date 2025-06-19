'use client';

import { MessageSquare, Wand2, Copy, Check, X } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectData } from '@/src/lib/types';
import { useState } from 'react';

interface BuildInPublicCardProps {
  projectData: ProjectData;
  generatedPost: string;
  isPostWithinLimit: boolean;
  onGenerate: () => void;
  onPostChange: (post: string) => void;
  onProjectDataChange: (field: keyof ProjectData, value: string) => void;
  isLoading: boolean;
  isApiKeySet: boolean;
  generatedMemeDataUrl?: string;
  onClearGeneratedMeme: () => void;
}

export function BuildInPublicCard({
  projectData,
  generatedPost,
  isPostWithinLimit,
  onGenerate,
  onPostChange,
  onProjectDataChange,
  isLoading,
  isApiKeySet,
  generatedMemeDataUrl,
  onClearGeneratedMeme
}: BuildInPublicCardProps) {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const characterCount = generatedPost.length;
  const twitterLimit = 280;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <SectionCard
      title="Build in Public Post"
      description="Generate engaging social media content for your community"
      icon={<MessageSquare className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="social-template">Social Media Template</Label>
          <Textarea
            id="social-template"
            placeholder="Create your template with placeholders like {{project_name}}, {{latest_milestone}}, etc."
            value={projectData.socialMediaTemplate}
            onChange={(e) => onProjectDataChange('socialMediaTemplate', e.target.value)}
            rows={6}
          />
        </div>
        
        {/* Meme Section */}
        <div className="space-y-3">
          <Label>Meme Content (Optional)</Label>
          
          {generatedMemeDataUrl ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">✅ Generated meme will be included in post</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearGeneratedMeme}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <div className="border rounded-lg p-2 bg-muted/50">
                <img 
                  src={generatedMemeDataUrl} 
                  alt="Generated meme" 
                  className="max-w-full h-auto rounded"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="meme-url">Meme Image URL (Conceptual)</Label>
                <Input
                  id="meme-url"
                  placeholder="https://example.com/meme.jpg"
                  value={projectData.memeImageUrl}
                  onChange={(e) => onProjectDataChange('memeImageUrl', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meme-text">Meme Text</Label>
                <Input
                  id="meme-text"
                  placeholder="HODL Strong! 💎🙌"
                  value={projectData.memeText}
                  onChange={(e) => onProjectDataChange('memeText', e.target.value)}
                />
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            {generatedMemeDataUrl 
              ? "The generated meme from the Meme Creator will take precedence over the conceptual meme above."
              : "Use the Meme Creator card to generate custom memes, or specify conceptual meme details above."
            }
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button 
                  onClick={onGenerate} 
                  disabled={isLoading || !isApiKeySet} 
                  className="w-full"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isLoading ? 'Generating...' : 'Generate Post'}
                </Button>
              </div>
            </TooltipTrigger>
            {!isApiKeySet && (
              <TooltipContent>
                <p>Please set your Google AI API Key first</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        {generatedPost && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Generated Post</Label>
              <div className="flex items-center space-x-2">
                <Badge variant={isPostWithinLimit ? 'default' : 'destructive'}>
                  {characterCount}/{twitterLimit}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!generatedPost}
                >
                  {copiedToClipboard ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copiedToClipboard ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            
            <Textarea
              value={generatedPost}
              onChange={(e) => onPostChange(e.target.value)}
              rows={6}
              className={`resize-none ${!isPostWithinLimit ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              placeholder="Your generated post will appear here..."
            />
            
            {!isPostWithinLimit && (
              <p className="text-sm text-destructive">
                ⚠ Post exceeds Twitter's 280 character limit. Consider shortening it.
              </p>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}