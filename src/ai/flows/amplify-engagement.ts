'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ai } from '@/src/ai/genkit';
import { z } from 'zod';

export const AmplifyEngagementInputSchema = z.object({
  projectName: z.string(),
  projectOverview: z.string(),
  targetAudience: z.string(),
  recentPosts: z.string(),
  web3Trends: z.string(),
  techStack: z.array(z.string()),
  blockchainNetwork: z.string(),
});

export const AmplifyEngagementOutputSchema = z.object({
  trendingKeywords: z.array(z.string()),
  suggestedTopics: z.array(z.string()),
  communityEngagementTips: z.array(z.string()),
  timingRecommendations: z.array(z.string()),
  platformSpecificAdvice: z.object({
    twitter: z.array(z.string()),
    discord: z.array(z.string()),
    telegram: z.array(z.string()),
  }),
  collaborationOpportunities: z.array(z.string()),
  reasoning: z.string(),
});

export type AmplifyEngagementInput = z.infer<typeof AmplifyEngagementInputSchema>;
export type AmplifyEngagementOutput = z.infer<typeof AmplifyEngagementOutputSchema>;

const amplifyEngagementPrompt = ai.definePrompt(
  {
    name: 'amplifyEngagement',
    input: {
      schema: AmplifyEngagementInputSchema,
    },
    output: {
      schema: AmplifyEngagementOutputSchema,
    },
  },
  `You are a Web3 community growth expert specializing in engagement amplification and viral content strategies.

Analyze the following project and provide actionable engagement amplification strategies:

Project: {{projectName}}
Overview: {{projectOverview}}
Target Audience: {{targetAudience}}
Tech Stack: {{techStack}}
Blockchain Network: {{blockchainNetwork}}

Recent Posts Performance/Content: {{recentPosts}}
Current Web3 Trends: {{web3Trends}}

Based on this information, provide:

1. TRENDING KEYWORDS: 8-12 trending Web3/crypto keywords and hashtags that align with the project
2. SUGGESTED TOPICS: 6-8 content topics that would resonate with the target audience
3. COMMUNITY ENGAGEMENT TIPS: 5-7 specific tactics to increase community interaction
4. TIMING RECOMMENDATIONS: Best times and days to post for maximum visibility
5. PLATFORM-SPECIFIC ADVICE: Tailored strategies for Twitter, Discord, and Telegram
6. COLLABORATION OPPORTUNITIES: Potential partnerships or cross-promotions with similar projects
7. REASONING: Explain your recommendations based on current Web3 market dynamics

Focus on:
- Authentic community building over vanity metrics
- Educational content that provides value
- Leveraging current market sentiment and trends
- Building long-term relationships with other builders
- Creating shareable, memorable content
- Timing posts for maximum Web3 community activity
- Cross-platform content adaptation strategies`
);

export async function amplifyEngagement(
  input: AmplifyEngagementInput, 
  userApiKey?: string
): Promise<AmplifyEngagementOutput> {
  if (!userApiKey) {
    throw new Error('API Key is required for engagement amplification');
  }

  try {
    const userSpecificAi = genkit({ 
      plugins: [googleAI({ apiKey: userApiKey })] 
    });
    const modelToUse = userSpecificAi.model('googleai/gemini-2.0-flash-exp');
    
    const llmResponse = await amplifyEngagementPrompt(input, { 
      model: modelToUse 
    });
    
    return llmResponse.output || {
      trendingKeywords: [],
      suggestedTopics: [],
      communityEngagementTips: [],
      timingRecommendations: [],
      platformSpecificAdvice: {
        twitter: [],
        discord: [],
        telegram: [],
      },
      collaborationOpportunities: [],
      reasoning: 'Unable to generate engagement suggestions. Please try again.',
    };
  } catch (error) {
    console.error('Error amplifying engagement:', error);
    throw new Error('Failed to generate engagement suggestions. Please check your API key and try again.');
  }
}