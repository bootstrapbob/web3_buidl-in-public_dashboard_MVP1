export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  targetDate?: string;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ContractStatus {
  isDeployed: boolean;
  contractAddress?: string;
  network?: string;
  auditStatus: 'not-started' | 'in-progress' | 'completed';
  auditFirm?: string;
  auditDate?: string;
  gasOptimization: 'not-started' | 'in-progress' | 'completed';
  upgradeability: boolean;
  validationIssues: string[];
}

export interface FundingDetails {
  totalRaised: number;
  targetAmount: number;
  currency: string;
  fundingRounds: Array<{
    id: string;
    roundName: string;
    amount: number;
    date: string;
    investors: string[];
  }>;
  currentRunway: number;
  burnRate: number;
  nextMilestoneAmount: number;
}

export interface TokenomicsDetails {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
  currentPrice: number;
  marketCap: number;
  distribution: Array<{
    category: string;
    percentage: number;
    vestingPeriod?: string;
  }>;
  utilityFeatures: string[];
  stakingRewards: boolean;
  deflationary: boolean;
  validationIssues: string[];
}

export interface ProjectData {
  projectName: string;
  projectOverview: string;
  targetAudience: string;
  currentStrugglesToAddress: string;
  techStack: string[];
  blockchainNetwork: string;
  compatibilityReport: string;
  milestones: Milestone[];
  contractStatus: ContractStatus;
  funding: FundingDetails;
  tokenomics: TokenomicsDetails;
  socialMediaTemplate: string;
  memeImageUrl: string;
  memeText: string;
  recentPosts: string;
  web3Trends: string;
}

export const initialProjectData: ProjectData = {
  projectName: '',
  projectOverview: '',
  targetAudience: '',
  currentStrugglesToAddress: '',
  techStack: [],
  blockchainNetwork: '',
  compatibilityReport: '',
  milestones: [],
  contractStatus: {
    isDeployed: false,
    auditStatus: 'not-started',
    gasOptimization: 'not-started',
    upgradeability: false,
    validationIssues: []
  },
  funding: {
    totalRaised: 0,
    targetAmount: 0,
    currency: 'USD',
    fundingRounds: [],
    currentRunway: 0,
    burnRate: 0,
    nextMilestoneAmount: 0
  },
  tokenomics: {
    tokenName: '',
    tokenSymbol: '',
    totalSupply: 0,
    currentPrice: 0,
    marketCap: 0,
    distribution: [],
    utilityFeatures: [],
    stakingRewards: false,
    deflationary: false,
    validationIssues: []
  },
  socialMediaTemplate: `🚀 BUIDL Update #{{milestone_number}}

{{project_name}} Progress Report:

✅ Latest Milestone: {{latest_milestone}}
🎯 Current Focus: {{current_focus}}
💡 Tech Stack: {{tech_stack}}
🔗 Network: {{blockchain_network}}

{{#if funding_update}}
💰 Funding: {{funding_status}}
{{/if}}

{{#if contract_status}}
📊 Smart Contract: {{contract_progress}}
{{/if}}

What's Next: {{next_steps}}

#Web3 #BUIDL #{{project_hashtags}}

{{#if meme_content}}
{{meme_content}}
{{/if}}`,
  memeImageUrl: '',
  memeText: '',
  recentPosts: '',
  web3Trends: ''
};

export interface MemeText {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontFamily: string;
  isDragging: boolean;
  offsetX: number;
  offsetY: number;
}