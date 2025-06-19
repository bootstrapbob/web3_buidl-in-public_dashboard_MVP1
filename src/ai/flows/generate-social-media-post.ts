'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ai } from '@/src/ai/genkit';
import { z } from 'zod';

export const GenerateSocialMediaPostInputSchema = z.object({
  projectName: z.string(),
  projectOverview: z.string(),
  latestMilestone: z.string().optional(),
  currentFocus: z.string().optional(),
  techStack: z.array(z.string()),
  blockchainNetwork: z.string(),
  fundingStatus: z.string().optional(),
  contractProgress: z.string().optional(),
  nextSteps: z.string().optional(),
  socialMediaTemplate: z.string(),
  memeGeneratedDataUrl: z.string().optional(),
  memeImageUrl: z.string().optional(),
  memeText: z.string().optional(),
  targetAudience: z.string().optional(),
});

export const GenerateSocialMediaPostOutputSchema = z.object({
  post: z.string(),
  hashtags: z.array(z.string()),
  characterCount: z.number(),
  platform: z.string().default('twitter'),
  engagementTips: z.array(z.string()),
});

export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

const generateSocialMediaPostPrompt = ai.definePrompt(
  {
    name: 'generateSocialMediaPost',
    input: {
      schema: GenerateSocialMediaPostInputSchema,
    },
    output: {
      schema: GenerateSocialMediaPostOutputSchema,
    },
  },
  `You are a Web3 social media expert specializing in "build-in-public" content that drives community engagement.

Create an engaging social media post for {{projectName}} based on the provided project data.

Project Overview: {{projectOverview}}
{{#if latestMilestone}}Latest Milestone: {{latestMilestone}}{{/if}}
{{#if currentFocus}}Current Focus: {{currentFocus}}{{/if}}
Tech Stack: {{techStack}}
Blockchain Network: {{blockchainNetwork}}
{{#if fundingStatus}}Funding Status: {{fundingStatus}}{{/if}}
{{#if contractProgress}}Contract Progress: {{contractProgress}}{{/if}}
{{#if nextSteps}}Next Steps: {{nextSteps}}{{/if}}
{{#if targetAudience}}Target Audience: {{targetAudience}}{{/if}}

Template to follow (adapt as needed): {{socialMediaTemplate}}

{{#if memeGeneratedDataUrl}}
IMPORTANT: A custom meme has been generated for this post. Reference it naturally in the post content.
{{else if memeImageUrl}}
IMPORTANT: Include this meme concept in the post: Image URL: {{memeImageUrl}}, Text: {{memeText}}
{{/if}}

Requirements:
1. Keep under 280 characters for Twitter optimization
2. Use relevant Web3 and blockchain hashtags (3-5 max)
3. Include emojis to increase engagement
4. Make it authentic and relatable to the Web3 community
5. Focus on progress, learnings, and community value
6. Use "BUIDL" terminology when appropriate
7. Create a sense of momentum and excitement
8. Include a call-to-action when relevant

Provide engagement tips specific to Web3 communities and building in public best practices.`
);

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput, 
  userApiKey?: string
): Promise<GenerateSocialMediaPostOutput> {
  if (!userApiKey) {
    throw new Error('API Key is required for generating social media posts');
  }

  try {
    const userSpecificAi = genkit({ 
      plugins: [googleAI({ apiKey: userApiKey })] 
    });
    const modelToUse = userSpecificAi.model('googleai/gemini-2.0-flash-exp');
    
    const llmResponse = await generateSocialMediaPostPrompt(input, { 
      model: modelToUse 
    });
    
    return llmResponse.output || {
      post: 'Unable to generate post. Please try again.',
      hashtags: ['#Web3', '#BUIDL'],
      characterCount: 0,
      platform: 'twitter',
      engagementTips: []
    };
  } catch (error) {
    console.error('Error generating social media post:', error);
    throw new Error('Failed to generate social media post. Please check your API key and try again.');
  }
}