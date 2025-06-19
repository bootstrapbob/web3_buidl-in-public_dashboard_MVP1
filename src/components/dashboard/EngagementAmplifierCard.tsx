'use client';

import { TrendingUp, Zap } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProjectData } from '@/src/lib/types';
import { AmplifyEngagementOutput } from '@/src/ai/flows/amplify-engagement';

interface EngagementAmplifierCardProps {
  projectData: Pick<ProjectData, 'projectName' | 'projectOverview' | 'targetAudience' | 'recentPosts' | 'web3Trends' | 'techStack' | 'blockchainNetwork'>;
  onProjectDataChange: (field: keyof ProjectData, value: string) => void;
  suggestions: AmplifyEngagementOutput | null;
  onAmplify: () => void;
  isLoading: boolean;
  isApiKeySet: boolean;
}

export function EngagementAmplifierCard({
  projectData,
  onProjectDataChange,
  suggestions,
  onAmplify,
  isLoading,
  isApiKeySet
}: EngagementAmplifierCardProps) {
  return (
    <SectionCard
      title="Engagement Amplifier"
      description="Get AI-powered suggestions to boost community engagement"
      icon={<TrendingUp className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recent-posts">Recent Posts Performance/Content</Label>
          <Textarea
            id="recent-posts"
            placeholder="Describe your recent social media posts, what performed well, engagement metrics, etc."
            value={projectData.recentPosts}
            onChange={(e) => onProjectDataChange('recentPosts', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="web3-trends">Current Web3 Trends You're Aware Of</Label>
          <Textarea
            id="web3-trends"
            placeholder="Share current Web3/crypto trends, market sentiment, popular topics in the space..."
            value={projectData.web3Trends}
            onChange={(e) => onProjectDataChange('web3Trends', e.target.value)}
            rows={3}
          />
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button 
                  onClick={onAmplify} 
                  disabled={isLoading || !isApiKeySet} 
                  className="w-full"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isLoading ? 'Analyzing...' : 'Get Amplification Tips'}
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
        
        {suggestions && (
          <div className="space-y-4">
            {/* Trending Keywords */}
            {suggestions.trendingKeywords.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">🔥 Trending Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.trendingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Suggested Topics */}
            {suggestions.suggestedTopics.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">💡 Content Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.suggestedTopics.map((topic, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Community Engagement Tips */}
            {suggestions.communityEngagementTips.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">🤝 Engagement Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.communityEngagementTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary">✓</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Timing Recommendations */}
            {suggestions.timingRecommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">⏰ Optimal Timing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.timingRecommendations.map((timing, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-accent">⌚</span>
                        <span className="text-sm">{timing}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Platform Specific Advice */}
            {(suggestions.platformSpecificAdvice.twitter.length > 0 || 
              suggestions.platformSpecificAdvice.discord.length > 0 || 
              suggestions.platformSpecificAdvice.telegram.length > 0) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">📱 Platform Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions.platformSpecificAdvice.twitter.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Twitter/X</h4>
                      <ul className="space-y-1">
                        {suggestions.platformSpecificAdvice.twitter.map((advice, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {advice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {suggestions.platformSpecificAdvice.discord.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Discord</h4>
                      <ul className="space-y-1">
                        {suggestions.platformSpecificAdvice.discord.map((advice, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {advice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {suggestions.platformSpecificAdvice.telegram.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Telegram</h4>
                      <ul className="space-y-1">
                        {suggestions.platformSpecificAdvice.telegram.map((advice, index) => (
                          <li key={index} className="text-sm text-muted-foreground">• {advice}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Collaboration Opportunities */}
            {suggestions.collaborationOpportunities.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">🤝 Collaboration Ideas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {suggestions.collaborationOpportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-accent">🚀</span>
                        <span className="text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Reasoning */}
            {suggestions.reasoning && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">🧠 AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{suggestions.reasoning}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </SectionCard>
  );
}