'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Save, Info } from 'lucide-react';
import { Header } from '@/src/components/Header';
import { SectionCard } from '@/src/components/SectionCard';
import { DataImportCard } from '@/src/components/dashboard/DataImportCard';
import { ProjectOverviewCard } from '@/src/components/dashboard/ProjectOverviewCard';
import { TechStackCard } from '@/src/components/dashboard/TechStackCard';
import { MilestonesCard } from '@/src/components/dashboard/MilestonesCard';
import { ContractStatusCard } from '@/src/components/dashboard/ContractStatusCard';
import { FundingCard } from '@/src/components/dashboard/FundingCard';
import { TokenomicsCard } from '@/src/components/dashboard/TokenomicsCard';
import { BuildInPublicCard } from '@/src/components/dashboard/BuildInPublicCard';
import { EngagementAmplifierCard } from '@/src/components/dashboard/EngagementAmplifierCard';
import { ExportCard } from '@/src/components/dashboard/ExportCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProjectData, initialProjectData, Milestone } from '@/src/lib/types';
import { generateSocialMediaPost, GenerateSocialMediaPostInput } from '@/src/ai/flows/generate-social-media-post';
import { amplifyEngagement, AmplifyEngagementInput, AmplifyEngagementOutput } from '@/src/ai/flows/amplify-engagement';
import { generateId } from '@/src/lib/utils';
import { toast } from 'sonner';
import { lazy, Suspense } from 'react';

const MemeCreatorCard = lazy(() => 
  import('@/src/components/dashboard/MemeCreatorCard').then(module => ({
    default: module.MemeCreatorCard
  }))
);

export default function DashboardClientPage() {
  // State
  const [projectData, setProjectData] = useState<ProjectData>(initialProjectData);
  const [userApiKey, setUserApiKey] = useState('');
  const [apiKeyInputValue, setApiKeyInputValue] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isPostWithinLimit, setIsPostWithinLimit] = useState(true);
  const [engagementSuggestions, setEngagementSuggestions] = useState<AmplifyEngagementOutput | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [generatedMemeDataUrl, setGeneratedMemeDataUrl] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjectData = localStorage.getItem('web3BuidlPublicistProjectData');
    if (savedProjectData) {
      try {
        setProjectData(JSON.parse(savedProjectData));
      } catch (error) {
        console.error('Error loading project data:', error);
      }
    }

    const savedApiKey = localStorage.getItem('web3BuidlPublicistUserApiKey');
    if (savedApiKey) {
      setUserApiKey(savedApiKey);
      setApiKeyInputValue(savedApiKey);
    }
  }, []);

  // Save project data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('web3BuidlPublicistProjectData', JSON.stringify(projectData));
  }, [projectData]);

  // Update character count for generated post
  useEffect(() => {
    setIsPostWithinLimit(generatedPost.length <= 280);
  }, [generatedPost]);

  // Handler functions
  const handleSaveApiKey = () => {
    setUserApiKey(apiKeyInputValue);
    localStorage.setItem('web3BuidlPublicistUserApiKey', apiKeyInputValue);
    toast.success('API Key saved successfully!');
  };

  const handleDataImport = (importedData: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...importedData }));
    toast.success('Project data imported successfully!');;
  };

  const handleUpdateProjectData = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateNestedField = (
    parentField: keyof ProjectData,
    field: string,
    value: any
  ) => {
    setProjectData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [field]: value
      }
    }));
  };

  const handleUpdateMilestones = (milestones: Milestone[]) => {
    setProjectData(prev => ({ ...prev, milestones }));
  };

  const handleAddMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: generateId()
    };
    setProjectData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const handleRemoveMilestone = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
  };

  const handleMemeGenerated = (dataUrl: string) => {
    setGeneratedMemeDataUrl(dataUrl);
  };

  const handleClearGeneratedMeme = () => {
    setGeneratedMemeDataUrl('');
  };

  const handleGeneratePost = async () => {
    if (!userApiKey) {
      toast.error('Please set your Google AI API Key first');
      return;
    }

    setIsLoadingPost(true);
    try {
      // Prepare input data
      const latestMilestone = projectData.milestones
        .filter(m => m.status === 'completed')
        .sort((a, b) => new Date(b.completedDate || '').getTime() - new Date(a.completedDate || '').getTime())[0];

      const currentFocus = projectData.milestones
        .filter(m => m.status === 'in-progress')
        .map(m => m.title)
        .join(', ') || 'Continuing development';

      const fundingStatus = projectData.funding.totalRaised > 0 
        ? `Raised ${projectData.funding.totalRaised} ${projectData.funding.currency}` 
        : undefined;

      const contractProgress = projectData.contractStatus.isDeployed 
        ? `Contract deployed on ${projectData.contractStatus.network}` 
        : `Contract development in progress`;

      const nextSteps = projectData.milestones
        .filter(m => m.status === 'not-started')
        .slice(0, 2)
        .map(m => m.title)
        .join(', ') || 'Planning next phase';

      const input: GenerateSocialMediaPostInput = {
        projectName: projectData.projectName,
        projectOverview: projectData.projectOverview,
        latestMilestone: latestMilestone?.title,
        currentFocus,
        techStack: projectData.techStack,
        blockchainNetwork: projectData.blockchainNetwork,
        fundingStatus,
        contractProgress,
        nextSteps,
        socialMediaTemplate: projectData.socialMediaTemplate,
        memeGeneratedDataUrl: generatedMemeDataUrl || undefined,
        memeImageUrl: projectData.memeImageUrl || undefined,
        memeText: projectData.memeText || undefined,
        targetAudience: projectData.targetAudience || undefined,
      };

      const result = await generateSocialMediaPost(input, userApiKey);
      setGeneratedPost(result.post);
      toast.success('Social media post generated successfully!');
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error('Failed to generate post. Please check your API key and try again.');
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleAmplifyEngagement = async () => {
    if (!userApiKey) {
      toast.error('Please set your Google AI API Key first');
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const input: AmplifyEngagementInput = {
        projectName: projectData.projectName,
        projectOverview: projectData.projectOverview,
        targetAudience: projectData.targetAudience,
        recentPosts: projectData.recentPosts,
        web3Trends: projectData.web3Trends,
        techStack: projectData.techStack,
        blockchainNetwork: projectData.blockchainNetwork,
      };

      const result = await amplifyEngagement(input, userApiKey);
      setEngagementSuggestions(result);
      toast.success('Engagement suggestions generated successfully!');
    } catch (error) {
      console.error('Error generating engagement suggestions:', error);
      toast.error('Failed to generate suggestions. Please check your API key and try again.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const isApiKeySet = Boolean(userApiKey);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Welcome Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Welcome to the Web3 BUIDL Publicist (Beta)!</AlertTitle>
            <AlertDescription>
              Track your Web3 project progress and generate build-in-public social media posts with AI assistance. 
              All data is saved locally in your browser. AI features require your own Google AI API Key.
            </AlertDescription>
          </Alert>

          {/* API Key Section */}
          <SectionCard
            title="Google AI API Key"
            description="Required for AI-powered post generation and engagement suggestions"
            icon={<KeyRound className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  To use AI features, you need a Google AI API Key. Get yours from{' '}
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                  . Your key is stored locally and never sent to our servers.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  type="password"
                  placeholder="Enter your Google AI API Key"
                  value={apiKeyInputValue}
                  onChange={(e) => setApiKeyInputValue(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveApiKey}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Key
                </Button>
              </div>
              
              {!isApiKeySet && (
                <p className="text-sm text-amber-600">
                  ⚠ AI features are disabled until you set your API key
                </p>
              )}
              
              {isApiKeySet && (
                <p className="text-sm text-green-600">
                  ✅ API key is set and ready to use
                </p>
              )}
            </div>
          </SectionCard>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DataImportCard onDataImport={handleDataImport} />
            
            <ProjectOverviewCard 
              projectData={projectData}
              onUpdate={handleUpdateProjectData}
            />
            
            <TechStackCard 
              projectData={projectData}
              onUpdate={handleUpdateProjectData}
            />
            
            <MilestonesCard 
              milestones={projectData.milestones}
              onUpdate={handleUpdateMilestones}
              onAdd={handleAddMilestone}
              onRemove={handleRemoveMilestone}
            />
            
            <ContractStatusCard 
              contractStatus={projectData.contractStatus}
              onUpdate={(field, value) => handleUpdateNestedField('contractStatus', field, value)}
            />
            
            <FundingCard 
              funding={projectData.funding}
              onUpdate={(field, value) => handleUpdateNestedField('funding', field, value)}
            />
            
            <TokenomicsCard 
              tokenomics={projectData.tokenomics}
              onUpdate={(field, value) => handleUpdateNestedField('tokenomics', field, value)}
            />
            
            <Suspense fallback={
              <SectionCard title="Meme Creator" description="Loading meme creator...">
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </SectionCard>
            }>
              <MemeCreatorCard onMemeSave={handleMemeGenerated} />
            </Suspense>
            
            <BuildInPublicCard 
              projectData={projectData}
              generatedPost={generatedPost}
              isPostWithinLimit={isPostWithinLimit}
              onGenerate={handleGeneratePost}
              onPostChange={setGeneratedPost}
              onProjectDataChange={handleUpdateProjectData}
              isLoading={isLoadingPost}
              isApiKeySet={isApiKeySet}
              generatedMemeDataUrl={generatedMemeDataUrl}
              onClearGeneratedMeme={handleClearGeneratedMeme}
            />
            
            <EngagementAmplifierCard 
              projectData={projectData}
              onProjectDataChange={handleUpdateProjectData}
              suggestions={engagementSuggestions}
              onAmplify={handleAmplifyEngagement}
              isLoading={isLoadingSuggestions}
              isApiKeySet={isApiKeySet}
            />
            
            <ExportCard 
              projectData={projectData}
              generatedPost={generatedPost}
            />
          </div>

          {/* Footer */}
          <footer className="text-center py-8 text-muted-foreground">
            <p>Powered by BUIDL Framework</p>
          </footer>
        </div>
      </ScrollArea>
    </div>
  );
}