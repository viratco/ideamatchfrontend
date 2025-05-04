import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios-wrapper';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  FileText,
  CircleDollarSign, 
  Target, 
  Lightbulb, 
  Users, 
  LineChart, 
  BarChart3, 
  ShieldCheck, 
  BarChart, 
  PieChart, 
  RefreshCw, 
  Map,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Circle
} from 'lucide-react';
// TODO: Import RevenueProjectionsChart once component is created
const RevenueProjectionsChart = () => {
  return <div>Revenue Projections Chart Component</div>;
};
import MarketShareDonutChart from '../components/MarketShareDonutChart';
import GrowthLineChart from '../components/GrowthLineChart';
import MarketSizeChart from '../components/MarketSizeChart';
import CompetitiveAnalysisChart from '../components/CompetitiveAnalysisChart';
// TODO: Import RoadmapTimelineChart once component is created
const RoadmapTimelineChart = () => {
  return <div>Roadmap Timeline Chart Component</div>;
};
import ExecutiveSummaryMetrics from '../components/ExecutiveSummaryMetrics';
import { useLocation } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

interface IdeaData {
  title: string;
  ideaFitness: string;
  skills: string[];
  industry: string;
}

interface LocationState {
  idea: IdeaData;
}

interface PlanFeature {
  feature: string;
  included: boolean;
}

interface SubscriptionPlan {
  name: string;
  price: number;
  isPopular?: boolean;
  features: PlanFeature[];
}

interface GrowthData {
  month: string;
  users: number;
  revenue: number;
}

interface GrowthProjectionsResponse {
  growthData: GrowthData[];
}

interface CompetitorData {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
}

interface ComparisonData {
  aspect: string;
  us: number;
  competitorA: number;
  competitorB: number;
  competitorC: number;
}

interface CompetitorAnalysisResponse {
  competitors: CompetitorData[];
  comparisonData: ComparisonData[];
}

interface TechnologyStackItem {
  category: string;
  description: string;
}

interface YearlyRevenue {
  revenue: number;
  plans: {
    startup: number;
    growth: number;
    scale: number;
  };
  customers: number;
  arpu: number;
  churnRate: number;
}

interface BurnRate {
  monthlyBurnRate: number;
  runwayMonths: number;
  expenses: {
    engineering: number;
    salesMarketing: number;
    operations: number;
    generalAdmin: number;
  };
}

interface FinancialMilestone {
  month: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

interface RevenueProjectionsResponse {
  yearlyRevenue: {
    year1: YearlyRevenue;
    year2: YearlyRevenue;
    year3: YearlyRevenue;
  };
  burnRate: BurnRate;
  milestones: FinancialMilestone[];
}

interface TechnologyPlanResponse {
  coreStack: TechnologyStackItem[];
  integrationCapabilities: {
    description: string;
    categories: string[];
    security: string[];
  };
}

interface Challenge {
  title: string;
  description: string;
}

interface RiskMitigation {
  title: string;
  description: string;
}

interface SwotAnalysisResponse {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ChallengesResponse {
  challenges: Challenge[];
  mitigationStrategies: RiskMitigation[];
}

interface MarketingStrategyResponse {
  acquisitionStrategy: Array<{
    phase: string;
    title: string;
    description: string;
  }>;
  channelStrategy: Array<{
    channel: string;
    percentage: number;
  }>;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  goals: string[];
}

interface Milestone {
  title: string;
  month: number;
  description: string;
}

interface StrategicRoadmapResponse {
  roadmapPhases: RoadmapPhase[];
  milestones: Milestone[];
}

interface CustomerSegmentsResponse {
  segments: {
    segment: string;
    description: string;
    characteristics: string[];
    needs: string[];
    marketSize: string;
  }[];
  marketAnalysis: {
    totalMarketSize: string;
    growthRate: string;
    keyTrends: string[];
  };
}

function BusinessPlanPage() {
  const [activeSection, setActiveSection] = useState<string>('executive-summary');
  // Separate loading states for each key section to avoid race conditions and wrong UI feedback
const [loading, setLoading] = useState(false); // For introduction/investment
const [problemOpportunityLoading, setProblemOpportunityLoading] = useState(false); // For problem/opportunity
// Removed duplicate declaration for customerValidationLoading/setCustomerValidationLoading. The correct one is declared later with customerValidationText.

  const [marketShareLoading, setMarketShareLoading] = useState(false);
  const [marketShareData, setMarketShareData] = useState<Array<{ name: string; value: number }>>([]);
  const [growthProjectionsLoading, setGrowthProjectionsLoading] = useState(false);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [competitorAnalysisLoading, setCompetitorAnalysisLoading] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<StrategicRoadmapResponse | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [marketingStrategyLoading, setMarketingStrategyLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [mitigationStrategies, setMitigationStrategies] = useState<RiskMitigation[]>([]);
  const [challengesLoading, setChallengesLoading] = useState(true);
  const [swotAnalysis, setSwotAnalysis] = useState<SwotAnalysisResponse | null>(null);
  const [swotLoading, setSwotLoading] = useState(true);
  const [technologyPlanLoading, setTechnologyPlanLoading] = useState(false);
  const [coreStack, setCoreStack] = useState<TechnologyStackItem[]>([]);
  const [revenueProjectionsLoading, setRevenueProjectionsLoading] = useState(false);
  const [yearlyRevenue, setYearlyRevenue] = useState<RevenueProjectionsResponse['yearlyRevenue']>({ 
    year1: { revenue: 0, plans: { startup: 0, growth: 0, scale: 0 }, customers: 0, arpu: 0, churnRate: 0 },
    year2: { revenue: 0, plans: { startup: 0, growth: 0, scale: 0 }, customers: 0, arpu: 0, churnRate: 0 },
    year3: { revenue: 0, plans: { startup: 0, growth: 0, scale: 0 }, customers: 0, arpu: 0, churnRate: 0 }
  });
  const [burnRate, setBurnRate] = useState<BurnRate>({
    monthlyBurnRate: 0,
    runwayMonths: 0,
    expenses: {
      engineering: 0,
      salesMarketing: 0,
      operations: 0,
      generalAdmin: 0
    }
  });
  const [financialMilestones, setFinancialMilestones] = useState<FinancialMilestone[]>([]);
  const [integrationCapabilities, setIntegrationCapabilities] = useState<TechnologyPlanResponse['integrationCapabilities']>({description: '', categories: [], security: []});
  const [acquisitionStrategy, setAcquisitionStrategy] = useState<MarketingStrategyResponse['acquisitionStrategy']>([]);
  const [channelStrategy, setChannelStrategy] = useState<MarketingStrategyResponse['channelStrategy']>([]);
  const [introduction, setIntroduction] = useState<string>('');
  const [investmentOpportunity, setInvestmentOpportunity] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [problemPoints, setProblemPoints] = useState<string[]>([]);
  const [opportunityPoints, setOpportunityPoints] = useState<string[]>([]);
  const [marketSizeLoading, setMarketSizeLoading] = useState(false);
  const [marketSizeData, setMarketSizeData] = useState<Array<{
    year: string;
    totalMarket: number;
    targetSegment: number;
    ourShare: number;
  }>>([]);
  const [productOfferingLoading, setProductOfferingLoading] = useState(false);
  const [productFeatures, setProductFeatures] = useState<Array<{
    title: string;
    description: string;
  }>>([]);
  const [solutionDetailsLoading, setSolutionDetailsLoading] = useState(false);
  const [sellingPoints, setSellingPoints] = useState<Array<{
    title: string;
    description: string;
  }>>([]);
  const [workflowSteps, setWorkflowSteps] = useState<Array<{
    stepNumber: number;
    title: string;
    description: string;
  }>>([]);
  const [subscriptionPlansLoading, setSubscriptionPlansLoading] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegmentsResponse | null>(null);
  const [customerSegmentsLoading, setCustomerSegmentsLoading] = useState(false);
  const MAX_RETRIES = 2;

  const location = useLocation();
  const ideaData = (location.state as LocationState)?.idea;

  const generateProblemOpportunity = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    setProblemOpportunityLoading(true);
    setProblemPoints([]); // Clear old data before fetching new
    setOpportunityPoints([]);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      // Fetch fresh token
      const sessionData = await supabase.auth.getSession();
      const token = sessionData?.data.session?.access_token;

      const response = await fetch('http://localhost:3001/api/business-plan/problem-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate problem and opportunity statements');
      }

      const data = await response.json();
      if (!data.problemPoints || !data.opportunityPoints) {
        throw new Error('Invalid response format');
      }

      setProblemPoints(Array.isArray(data.problemPoints) ? data.problemPoints : []);
      setOpportunityPoints(Array.isArray(data.opportunityPoints) ? data.opportunityPoints : []);
      toast.success('Problem and opportunity statements generated successfully!');
    } catch (error: any) {
      console.error('Error generating problem and opportunity statements:', error);
      toast.error(error.message || 'Failed to generate statements');
    } finally {
      setProblemOpportunityLoading(false);
    }
  }, [ideaData]);

  const generateIntroduction = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      // Fetch fresh token
      const sessionData = await supabase.auth.getSession();
      const token = sessionData?.data.session?.access_token;

const response = await fetch('http://localhost:3001/api/business-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate introduction');
      }

      let data;
      try {
        data = await response.json();
        if (!data.introduction) {
          throw new Error('No introduction was generated');
        }
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }
      
      setIntroduction(data.introduction);
      setInvestmentOpportunity(data.investmentOpportunity);
      setRetryCount(0);
      toast.success('Introduction generated successfully!');
    } catch (error: any) {
      console.error('Error generating introduction:', error);
      
      if (error.name === 'AbortError') {
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          toast.error(`Generation taking longer than expected. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
          // Wait a bit longer between retries
          setTimeout(() => generateIntroduction(), 5000);
          return;
        } else {
          toast.error('Generation timed out. The model might be busy, please try again in a moment.');
        }
      } else {
        toast.error(error.message || 'Failed to generate introduction');
      }
    } finally {
      setLoading(false);
    }
  }, [ideaData, retryCount]);

  const generateSolutionDetails = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    setSolutionDetailsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      const response = await fetch('http://localhost:3001/api/business-plan/solution-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate solution details');
      }

      const data = await response.json();
      if (!data.sellingPoints || !data.workflowSteps || 
          !Array.isArray(data.sellingPoints) || !Array.isArray(data.workflowSteps)) {
        throw new Error('Invalid solution details format');
      }

      setSellingPoints(data.sellingPoints);
      setWorkflowSteps(data.workflowSteps);
      toast.success('Solution details generated successfully!');
    } catch (error: any) {
      console.error('Error generating solution details:', error);
      toast.error(error.message || 'Failed to generate solution details');
    } finally {
      setSolutionDetailsLoading(false);
    }
  }, [ideaData]);

  const generateProductOffering = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    setProductOfferingLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      const response = await fetch('http://localhost:3001/api/business-plan/product-offering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate product offering');
      }

      const data = await response.json();
      if (!data.features || !Array.isArray(data.features)) {
        throw new Error('Invalid product offering format');
      }

      setProductFeatures(data.features);
      toast.success('Product offering generated successfully!');
    } catch (error: any) {
      console.error('Error generating product offering:', error);
      toast.error(error.message || 'Failed to generate product offering');
    } finally {
      setProductOfferingLoading(false);
    }
  }, [ideaData]);

  const generateMarketSize = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    setMarketSizeLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      const response = await fetch('http://localhost:3001/api/business-plan/market-size', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate market size data');
      }

      const data = await response.json();
      if (!data.marketSizeData || !Array.isArray(data.marketSizeData)) {
        throw new Error('Invalid market size data format');
      }

      setMarketSizeData(data.marketSizeData);
      toast.success('Market size data generated successfully!');
    } catch (error: any) {
      console.error('Error generating market size data:', error);
      toast.error(error.message || 'Failed to generate market size data');
    } finally {
      setMarketSizeLoading(false);
    }
  }, [ideaData]);

  const generateSubscriptionPlans = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    setSubscriptionPlansLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      const response = await fetch('http://localhost:3001/api/business-plan/subscription-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate subscription plans');
      }

      const data = await response.json();
      if (!data.plans || !Array.isArray(data.plans)) {
        throw new Error('Invalid subscription plans format');
      }

      setSubscriptionPlans(data.plans);
      toast.success('Subscription plans generated successfully!');
    } catch (error: any) {
      console.error('Error generating subscription plans:', error);
      toast.error(error.message || 'Failed to generate subscription plans');
    } finally {
      setSubscriptionPlansLoading(false);
    }
  }, [ideaData]);

  const fetchChallenges = useCallback(async () => {
    if (!ideaData) return;
    setChallengesLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch challenges');
      }
      
      const data: ChallengesResponse = await response.json();
      setChallenges(data.challenges);
      setMitigationStrategies(data.mitigationStrategies);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges and risk mitigation strategies');
    } finally {
      setChallengesLoading(false);
    }
  }, [ideaData]);

  const fetchMarketingStrategy = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }

    setMarketingStrategyLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/business-plan/marketing-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch marketing strategy');
      }

      const data = await response.json();
      if (!data.acquisitionStrategy || !data.channelStrategy) {
        throw new Error('Invalid marketing strategy response format');
      }

      setAcquisitionStrategy(data.acquisitionStrategy);
      setChannelStrategy(data.channelStrategy);
      toast.success('Marketing strategy generated successfully!');
    } catch (error: any) {
      console.error('Error fetching marketing strategy:', error);
      toast.error(error.message || 'Failed to fetch marketing strategy');
    } finally {
      setMarketingStrategyLoading(false);
    }
  }, [ideaData]);

  const fetchRevenueProjections = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }

    setRevenueProjectionsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/business-plan/revenue-projections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch revenue projections');
      }

      const data: RevenueProjectionsResponse = await response.json();
      setYearlyRevenue(data.yearlyRevenue);
      setBurnRate(data.burnRate);
      setFinancialMilestones(data.milestones);
      toast.success('Revenue projections generated successfully!');
    } catch (error: any) {
      console.error('Error fetching revenue projections:', error);
      toast.error(error.message || 'Failed to generate revenue projections');
    } finally {
      setRevenueProjectionsLoading(false);
    }
  }, [ideaData]);

  const fetchTechnologyPlan = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      toast.error('Idea title and fitness assessment are required');
      return;
    }

    setTechnologyPlanLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/business-plan/technology-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch technology plan');
      }

      const data = await response.json();
      if (!data.coreStack || !data.integrationCapabilities) {
        throw new Error('Invalid technology plan response format');
      }

      setCoreStack(data.coreStack);
      setIntegrationCapabilities(data.integrationCapabilities);
      toast.success('Technology plan generated successfully!');
    } catch (error: any) {
      console.error('Error fetching technology plan:', error);
      toast.error(error.message || 'Failed to fetch technology plan');
    } finally {
      setTechnologyPlanLoading(false);
    }
  }, [ideaData]);

  const fetchCompetitorAnalysis = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) return;
    
    setCompetitorAnalysisLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/business-plan/competitor-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch competitor analysis');
      }

      const data: CompetitorAnalysisResponse = await response.json();
      setCompetitors(data.competitors);
      setComparisonData(data.comparisonData);
    } catch (error) {
      console.error('Error fetching competitor analysis:', error);
      toast.error('Failed to load competitor analysis');
    } finally {
      setCompetitorAnalysisLoading(false);
    }
  }, [ideaData]);



const fetchGrowthProjections = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) return;
    
    setGrowthProjectionsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/business-plan/growth-projections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch growth projections');
      }

      const data: GrowthProjectionsResponse = await response.json();
      setGrowthData(data.growthData);
    } catch (error) {
      console.error('Error fetching growth projections:', error);
      toast.error('Failed to load growth projections');
    } finally {
      setGrowthProjectionsLoading(false);
    }
  }, [ideaData]);

  const fetchCustomerSegments = useCallback(async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) {
      console.log('Missing required idea data:', ideaData);
      toast.error('Idea title and fitness assessment are required');
      return;
    }
    
    console.log('Fetching customer segments for:', ideaData);
    setCustomerSegmentsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
  controller.abort();
  toast.error('Request timed out. The backend is taking longer than expected.');
}, 120000);

      const response = await fetch('http://localhost:3001/api/business-plan/customer-segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('Customer segments response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to generate customer segments');
      }

      const data = await response.json();
      console.log('Customer segments response data:', JSON.stringify(data, null, 2));
      
      if (!data.segments || !data.marketAnalysis) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid customer segments response format');
      }
      
      setCustomerSegments(data);
      toast.success('Customer segments analysis generated successfully!');
    } catch (error: any) {
      console.error('Error fetching customer segments:', error);
      toast.error(error.message || 'Failed to generate customer segments analysis');
    } finally {
      setCustomerSegmentsLoading(false);
    }
  }, [ideaData]);

  // Track which sections have been generated
  const [generatedSections, setGeneratedSections] = useState<Set<string>>(new Set());

  // Track failed section generations for retry
  const [failedSections, setFailedSections] = useState<Set<string>>(new Set());
  const [retryAttempts, setRetryAttempts] = useState<Record<string, number>>({});
  const MAX_RETRY_ATTEMPTS = 3;

  // Function to generate content for a specific section
  const generateSection = useCallback(async (section: string) => {
    if (generatedSections.has(section)) return;

    if (section === 'roadmap') {
      if (!roadmapLoading && !roadmapData) {
        setRoadmapLoading(true);
        try {
          // Fetch fresh token
          const sessionData = await supabase.auth.getSession();
          const token = sessionData?.data.session?.access_token;

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/strategic-roadmap`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              title: ideaData.title,
              ideaFitness: ideaData.ideaFitness
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch strategic roadmap');
          }

          const data = await response.json();
          setRoadmapData(data);
          setGeneratedSections(prev => new Set([...prev, section]));
        } catch (error) {
          console.error('Error fetching strategic roadmap:', error);
          toast.error('Failed to load strategic roadmap');
          setFailedSections(prev => new Set([...prev, section]));
        } finally {
          setRoadmapLoading(false);
        }
      }
      return;
    }

    try {
      switch (section) {
        case 'challenges':
          if (!challengesLoading && challenges.length === 0) {
            setChallengesLoading(true);
            try {
              // Fetch fresh token
              const sessionData = await supabase.auth.getSession();
              const token = sessionData?.data.session?.access_token;

              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/challenges`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch challenges');
              }

              const data = await response.json();
              if (!data.challenges?.length || !data.mitigationStrategies?.length) {
                throw new Error('Invalid response data for challenges');
              }

              setChallenges(data.challenges);
              setMitigationStrategies(data.mitigationStrategies);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching challenges:', error);
              toast.error('Failed to load challenges and risk mitigation strategies');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setChallengesLoading(false);
            }
          }
          break;
        case 'solution-details':
          if (!solutionDetailsLoading && sellingPoints.length === 0) {
            setSolutionDetailsLoading(true);
            try {
              // Fetch fresh token
              const sessionData = await supabase.auth.getSession();
              const token = sessionData?.data.session?.access_token;

              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/solution-details`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch solution details');
              }

              const data = await response.json();
              if (!data.sellingPoints || !data.workflowSteps || 
                  !Array.isArray(data.sellingPoints) || !Array.isArray(data.workflowSteps)) {
                throw new Error('Invalid solution details format');
              }

              setSellingPoints(data.sellingPoints);
              setWorkflowSteps(data.workflowSteps);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching solution details:', error);
              toast.error('Failed to load solution details');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setSolutionDetailsLoading(false);
            }
          }
          break;
        case 'market-size':
          if (!marketSizeLoading && marketSizeData.length === 0) {
            setMarketSizeLoading(true);
            try {
              // Fetch fresh token
              const sessionData = await supabase.auth.getSession();
              const token = sessionData?.data.session?.access_token;

              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/market-size`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch market size data');
              }

              const data = await response.json();
              if (!data.marketSizeData || !Array.isArray(data.marketSizeData)) {
                throw new Error('Invalid market size data format');
              }

              setMarketSizeData(data.marketSizeData);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching market size data:', error);
              toast.error('Failed to load market size data');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setMarketSizeLoading(false);
            }
          }
          break;
        case 'product-offering':
          if (!productOfferingLoading && productFeatures.length === 0) {
            setProductOfferingLoading(true);
            try {
              // Fetch fresh token
              const sessionData = await supabase.auth.getSession();
              const token = sessionData?.data.session?.access_token;

              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/product-offering`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch product offering');
              }

              const data = await response.json();
              if (!data.features || !Array.isArray(data.features)) {
                throw new Error('Invalid product offering format');
              }

              setProductFeatures(data.features);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching product offering:', error);
              toast.error('Failed to load product offering');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setProductOfferingLoading(false);
            }
          }
          break;
        case 'subscription-plans':
          if (!subscriptionPlansLoading && subscriptionPlans.length === 0) {
            setSubscriptionPlansLoading(true);
            try {
              // Fetch fresh token
              const sessionData = await supabase.auth.getSession();
              const token = sessionData?.data.session?.access_token;

              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/subscription-plans`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch subscription plans');
              }

              const data = await response.json();
              if (!data.plans || !Array.isArray(data.plans)) {
                throw new Error('Invalid subscription plans format');
              }

              setSubscriptionPlans(data.plans);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching subscription plans:', error);
              toast.error('Failed to load subscription plans');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setSubscriptionPlansLoading(false);
            }
          }
          break;
        case 'customer-segments':
          if (!customerSegmentsLoading && !customerSegments) {
            setCustomerSegmentsLoading(true);
            try {
              // Fetch fresh token
              const sessionData = await supabase.auth.getSession();
              const token = sessionData?.data.session?.access_token;

              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/customer-segments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch customer segments');
              }

              const data = await response.json();
              if (!data.segments || !data.marketAnalysis) {
                throw new Error('Invalid customer segments response format');
              }

              setCustomerSegments(data);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching customer segments:', error);
              toast.error('Failed to load customer segments');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setCustomerSegmentsLoading(false);
            }
          }
          break;
        case 'growth-projections':
          if (!growthProjectionsLoading && growthData.length === 0) {
            setGrowthProjectionsLoading(true);
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/growth-projections`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch growth projections');
              }

              const data = await response.json();
              if (!data.growthData || !Array.isArray(data.growthData)) {
                throw new Error('Invalid growth projections response format');
              }

              setGrowthData(data.growthData);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching growth projections:', error);
              toast.error('Failed to load growth projections');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setGrowthProjectionsLoading(false);
            }
          }
          break;
        case 'competitor-analysis':
          if (!competitorAnalysisLoading && competitors.length === 0) {
            setCompetitorAnalysisLoading(true);
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/competitor-analysis`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch competitor analysis');
              }

              const data = await response.json();
              if (!data.competitors || !data.comparisonData) {
                throw new Error('Invalid competitor analysis response format');
              }

              setCompetitors(data.competitors);
              setComparisonData(data.comparisonData);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching competitor analysis:', error);
              toast.error('Failed to load competitor analysis');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setCompetitorAnalysisLoading(false);
            }
          }
          break;
        case 'marketing-strategy':
          if (!marketingStrategyLoading && acquisitionStrategy.length === 0) {
            setMarketingStrategyLoading(true);
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/marketing-strategy`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch marketing strategy');
              }

              const data = await response.json();
              if (!data.acquisitionStrategy || !data.channelStrategy) {
                throw new Error('Invalid marketing strategy response format');
              }

              setAcquisitionStrategy(data.acquisitionStrategy);
              setChannelStrategy(data.channelStrategy);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching marketing strategy:', error);
              toast.error('Failed to load marketing strategy');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setMarketingStrategyLoading(false);
            }
          }
          break;
        case 'technology-plan':
          if (!technologyPlanLoading && coreStack.length === 0) {
            setTechnologyPlanLoading(true);
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/technology-plan`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch technology plan');
              }

              const data = await response.json();
              if (!data.coreStack || !data.integrationCapabilities) {
                throw new Error('Invalid technology plan response format');
              }

              setCoreStack(data.coreStack);
              setIntegrationCapabilities(data.integrationCapabilities);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching technology plan:', error);
              toast.error('Failed to load technology plan');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setTechnologyPlanLoading(false);
            }
          }
          break;
        case 'revenue-projections':
          if (!revenueProjectionsLoading && yearlyRevenue.year1.revenue === 0) {
            setRevenueProjectionsLoading(true);
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/revenue-projections`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: ideaData.title,
                  ideaFitness: ideaData.ideaFitness
                })
              });

              if (!response.ok) {
                throw new Error('Failed to fetch revenue projections');
              }

              const data = await response.json();
              if (!data.yearlyRevenue || !data.burnRate || !data.milestones) {
                throw new Error('Invalid revenue projections response format');
              }

              setYearlyRevenue(data.yearlyRevenue);
              setBurnRate(data.burnRate);
              setFinancialMilestones(data.milestones);
              setGeneratedSections(prev => new Set([...prev, section]));
            } catch (error) {
              console.error('Error fetching revenue projections:', error);
              toast.error('Failed to load revenue projections');
              setFailedSections(prev => new Set([...prev, section]));
            } finally {
              setRevenueProjectionsLoading(false);
            }
          }
          break;
      }

    } catch (error) {
      console.error(`Error generating section ${section}:`, error);
      toast.error(`Failed to generate ${section}. Retrying...`);
      setFailedSections(prev => new Set([...prev, section]));
      throw error;
    }
  }, [generatedSections, challengesLoading, challenges.length, ideaData.title, ideaData.ideaFitness]);

  // Function to check if all required sections are generated
  const checkAllSectionsGenerated = useCallback(() => {
    const requiredSections = [
      'challenges',
      'solution-details',
      'market-size',
      'product-offering',
      'subscription-plans',
      'customer-segments',
      'growth-projections',
      'competitor-analysis',
      'marketing-strategy',
      'technology-plan',
      'revenue-projections'
    ];

    const missingSections = requiredSections.filter(section => 
      !generatedSections.has(section) && !failedSections.has(section)
    );

    return missingSections;
  }, [generatedSections, failedSections]);

  // Function to retry failed sections
  const retryFailedSections = useCallback(async () => {
    const failedArray = Array.from(failedSections);
    for (const section of failedArray) {
      const attempts = retryAttempts[section] || 0;
      if (attempts < MAX_RETRY_ATTEMPTS) {
        setRetryAttempts(prev => ({ ...prev, [section]: attempts + 1 }));
        try {
          await generateSection(section);
          setFailedSections(prev => {
            const newSet = new Set(prev);
            newSet.delete(section);
            return newSet;
          });
        } catch (error) {
          console.error(`Retry attempt ${attempts + 1} failed for section ${section}:`, error);
        }
      }
    }
  }, [failedSections, retryAttempts, generateSection, MAX_RETRY_ATTEMPTS]);

  // Handle section visibility
  const handleSectionInView = useCallback((section: string) => {
    if (!generatedSections.has(section) && ideaData?.title && ideaData?.ideaFitness) {
      generateSection(section);
    }
  }, [ideaData, generatedSections, generateSection]);

  useEffect(() => {
    if (activeSection === 'target-market') {
      console.log('Target market section active, current state:', {
        hasCustomerSegments: !!customerSegments,
        isLoading: customerSegmentsLoading,
        ideaData
      });
      if (!customerSegments && !customerSegmentsLoading && ideaData?.title && ideaData?.ideaFitness) {
        fetchCustomerSegments();
      }
    }
  }, [activeSection, customerSegments, customerSegmentsLoading, fetchCustomerSegments, ideaData]);

  useEffect(() => {
    const fetchSwotAnalysis = async () => {
    try {
      setSwotLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/business-plan/swot-analysis`, {
        title: ideaData?.title,
        ideaFitness: ideaData?.ideaFitness
      });
      setSwotAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching SWOT analysis:', error);
      toast.error('Failed to generate SWOT analysis');
    } finally {
      setSwotLoading(false);
    }
  };

  const fetchMarketShare = async () => {
    if (!ideaData?.title || !ideaData?.ideaFitness) return;
    
    setMarketShareLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/market-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: ideaData.title,
          ideaFitness: ideaData.ideaFitness
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market share data');
      }

      const data = await response.json();
      setMarketShareData(data);
    } catch (error) {
      console.error('Error fetching market share:', error);
      toast.error('Failed to load market share data');
    } finally {
      setMarketShareLoading(false);
    }
  };

  const fetchChallenges = async () => {
      setChallengesLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/challenges`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: ideaData.title,
            ideaFitness: ideaData.ideaFitness
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }

        const data = await response.json();
        setChallenges(data.challenges);
        setMitigationStrategies(data.mitigationStrategies);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast.error('Failed to load challenges and risk mitigation strategies');
      } finally {
        setChallengesLoading(false);
      }
    };

    if (ideaData?.title && ideaData?.ideaFitness) {
      fetchMarketShare();
    fetchChallenges();
      fetchSwotAnalysis();
    }
  }, [ideaData?.title, ideaData?.ideaFitness]);

  // Update useEffect to use the new generation logic
  useEffect(() => {
    if (ideaData?.title && ideaData?.ideaFitness) {
      // Only generate the first visible section initially
      handleSectionInView(activeSection);
    }
  }, [ideaData?.title, ideaData?.ideaFitness, activeSection, handleSectionInView]);

  // Generate all content when the component mounts
  useEffect(() => {
    if (ideaData?.title && ideaData?.ideaFitness) {
      generateIntroduction();
      generateProblemOpportunity();
      generateMarketSize();
      generateProductOffering();
      generateSolutionDetails();
      generateSubscriptionPlans();
      fetchCustomerSegments();
      fetchGrowthProjections();
      fetchCompetitorAnalysis();
      fetchTechnologyPlan();
      fetchMarketingStrategy();
      fetchRevenueProjections();
    }
  }, [
    ideaData,
    generateIntroduction,
    generateProblemOpportunity,
    generateMarketSize,
    generateProductOffering,
    generateSolutionDetails,
    generateSubscriptionPlans,
    fetchCustomerSegments,
    fetchGrowthProjections,
    fetchCompetitorAnalysis,
    fetchTechnologyPlan,
    fetchMarketingStrategy,
    fetchRevenueProjections
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section');
            if (section) {
              handleSectionInView(section);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll('[data-section]').forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [handleSectionInView]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const missingSections = checkAllSectionsGenerated();
      if (missingSections.length > 0) {
        missingSections.forEach(section => generateSection(section));
      }
      retryFailedSections();
    }, 5000); // Wait 5 seconds before retrying

    return () => clearTimeout(timer);
  }, [checkAllSectionsGenerated, generateSection, retryFailedSections]);

  const sidebar = [
    { id: 'executive-summary', label: 'Executive Summary', icon: <FileText className="h-4 w-4" /> },
    { id: 'problem-statement', label: 'Problem Statement', icon: <Target className="h-4 w-4" /> },
    { id: 'solution', label: 'Solution', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'business-model', label: 'Business Model', icon: <CircleDollarSign className="h-4 w-4" /> },
    { id: 'target-market', label: 'Target Market', icon: <Users className="h-4 w-4" /> },
    { id: 'competitor-analysis', label: 'Competitor Analysis', icon: <BarChart className="h-4 w-4" /> },
    { id: 'marketing-strategy', label: 'Marketing Strategy', icon: <PieChart className="h-4 w-4" /> },
    { id: 'technology-plan', label: 'Technology Plan', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'revenue-projections', label: 'Revenue Projections', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'challenges', label: 'Challenges & Risks', icon: <RefreshCw className="h-4 w-4" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Map className="h-4 w-4" /> },
  ];

  // Helper function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 border-r p-6 bg-card">
        <div className="flex items-center mb-8">
          <FileText className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-xl font-bold">Business Plan</h2>
        </div>
        
        <div className="mx-2 mb-6">
          <Progress value={100} className="h-2 w-full" />
          <p className="text-xs text-muted-foreground mt-2">100% Complete</p>
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="space-y-1 pr-4">
            {sidebar.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${activeSection === item.id ? 'bg-secondary font-medium' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </nav>
        </ScrollArea>
        
        <div className="mt-6 space-y-3">
          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12">
            {/* Executive Summary */}
            <section id="executive-summary" data-section="executive-summary" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Executive Summary</h2>
              <div className="space-y-8">
                <Card className="border-none shadow-sm bg-primary/5">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-4">{ideaData?.title || 'Business Plan Title'}</h3>
                    
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-3 text-muted-foreground">Generating introduction...</span>
                      </div>
                    ) : (
                      <>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                            {introduction || 'Generating introduction...'}
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {ideaData?.skills?.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="bg-primary/10 hover:bg-primary/20">
                              {skill}
                            </Badge>
                          ))}
                          <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20">
                            {ideaData?.industry || 'Industry'}
                          </Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <ExecutiveSummaryMetrics 
                  ideaTitle={ideaData?.title || ''}
                  ideaFitness={ideaData?.ideaFitness || ''}
                />
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Investment Opportunity</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                    {loading ? 'Generating investment opportunity...' : investmentOpportunity || 'Investment opportunity will be generated soon...'}
                  </p>
                </div>
              </div>
            </section>
            
            <Separator className="my-16" />
            
            {/* Problem Statement */}
            <section id="problem-statement" data-section="problem-statement" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Problem Statement & Market Opportunity</h2>
              
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>The Problem</CardTitle>
                    <CardDescription>What startups are struggling with</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {problemOpportunityLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : problemPoints.length > 0 ? (
                      <ul className="space-y-3">
                        {problemPoints.map((point, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No problem points generated yet.</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>The Opportunity</CardTitle>
                    <CardDescription>Market validation points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {problemOpportunityLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : opportunityPoints.length > 0 ? (
                      <ul className="space-y-3">
                        {opportunityPoints.map((point, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-green-500 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No opportunity points generated yet.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <MarketSizeChart className="mt-8" data={marketSizeData} loading={marketSizeLoading} />
              
              <div className="bg-secondary/30 p-6 rounded-lg mt-8">
                
              </div>
            </section>
            
            <Separator className="my-16" />
            
            {/* Solution */}
            <section id="solution" data-section="solution" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Solution / Product Offering</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {productOfferingLoading ? (
                  <div className="col-span-3 flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-muted-foreground">Generating product features...</span>
                    </div>
                  </div>
                ) : productFeatures.length > 0 ? (
                  productFeatures.map((feature, index) => (
                    <Card key={index} className="bg-gradient-to-br from-primary/5 to-primary/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                        <div className="flex mt-4">
                          <Badge variant="outline" className="bg-white/50">Core Feature</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12 text-muted-foreground">
                    Product features will be generated soon...
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Unique Selling Proposition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {solutionDetailsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-muted-foreground">Generating selling points...</span>
                        </div>
                      </div>
                    ) : sellingPoints.length > 0 ? (
                      <ul className="space-y-4">
                        {sellingPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="bg-green-100 rounded-full p-1 mt-1">
                              {index === 0 && <Lightbulb className="h-4 w-4 text-green-600" />}
                              {index === 1 && <Target className="h-4 w-4 text-green-600" />}
                              {index === 2 && <CircleDollarSign className="h-4 w-4 text-green-600" />}
                            </div>
                            <div>
                              <span className="font-medium">{point.title}</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {point.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Selling points will be generated soon...</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {solutionDetailsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-muted-foreground">Generating workflow steps...</span>
                        </div>
                      </div>
                    ) : workflowSteps.length > 0 ? (
                      <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
                        <ol className="relative space-y-4">
                          {workflowSteps.map((step) => (
                            <li className="flex items-start gap-3">
                              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center relative z-10">
                                <span className="text-sm font-medium">{step.stepNumber}</span>
                              </div>
                              <div>
                                <span className="font-medium">{step.title}</span>
                                <p className="text-muted-foreground text-sm mt-1">
                                  {step.description}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Workflow steps will be generated soon...</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              
            </section>
            
            <Separator className="my-16" />
            
            {/* Business Model */}
            <section id="business-model" data-section="business-model" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Business Model & Monetization</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Business Model & Monetization
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Our subscription-based pricing model designed for different business stages
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {subscriptionPlansLoading ? (
                    <div className="col-span-3 flex justify-center py-8">
                      <div className="flex items-center space-x-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <p>Generating subscription plans...</p>
                      </div>
                    </div>
                  ) : subscriptionPlans.length > 0 ? (
                    subscriptionPlans.map((plan, index) => (
                      <Card key={index} className={plan.isPopular ? 'border-primary' : ''}>
                        <CardHeader>
                          <CardTitle>
                            {plan.name}
                            {plan.isPopular && (
                              <Badge variant="secondary" className="ml-2">
                                Most Popular
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            <div className="mt-2 flex items-baseline gap-x-2">
                              <span className="text-3xl font-bold tracking-tight text-primary">
                                ${plan.price}
                              </span>
                              <span className="text-sm font-semibold leading-6 tracking-wide text-muted-foreground">
                                /month
                              </span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{feature.feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-8 text-muted-foreground">
                      No subscription plans generated yet
                    </div>
                  )}
                </div>
              </div>
              
              
            </section>
            
            <Separator className="my-16" />
            
            {/* Target Market */}
            <section id="target-market" data-section="target-market" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Target Market & Customer Segments</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Primary Customer Segments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerSegmentsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : customerSegments?.segments ? (
                      <div className="space-y-6">
                        {customerSegments.segments.map((segment, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="text-lg font-semibold text-primary">{segment.segment}</h3>
                            <p className="text-muted-foreground">{segment.description}</p>
                            
                            <div className="space-y-2">
                              <h4 className="font-medium">Key Characteristics:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {segment.characteristics.map((char, idx) => (
                                  <li key={idx} className="text-muted-foreground">{char}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Needs & Pain Points:</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {segment.needs.map((need, idx) => (
                                  <li key={idx} className="text-muted-foreground">{need}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-2">
                              <span className="font-medium">Estimated Market Size: </span>
                              <span className="text-muted-foreground">{segment.marketSize}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        No customer segments data available
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Market Size & Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customerSegmentsLoading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : customerSegments?.marketAnalysis ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Total Addressable Market:</h4>
                            <p className="text-muted-foreground">{customerSegments.marketAnalysis.totalMarketSize}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Growth Rate:</h4>
                            <p className="text-muted-foreground">{customerSegments.marketAnalysis.growthRate}</p>
                          </div>

                          <div>
                            <h4 className="font-medium">Key Market Trends:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {customerSegments.marketAnalysis.keyTrends.map((trend, idx) => (
                                <li key={idx} className="text-muted-foreground">{trend}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground p-8">
                          No market analysis data available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <GrowthLineChart className="mt-8" data={growthData} loading={growthProjectionsLoading} />
            </section>
            
            <Separator className="my-16" />
            
            {/* Competitor Analysis */}
            <section id="competitor-analysis" data-section="competitor-analysis" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Competitor Analysis</h2>
              
              <div className="mb-8">
                <CompetitiveAnalysisChart data={comparisonData} loading={competitorAnalysisLoading} />
              </div>
              
              {competitorAnalysisLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : competitors.length > 0 ? (
                <div className="overflow-x-auto mt-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3 text-left font-medium text-muted-foreground">Feature</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Our Solution</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Competitor A</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Competitor B</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Competitor C</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3 font-medium">Company</td>
                        <td className="p-3 text-green-600">{ideaData?.title}</td>
                        <td className="p-3">{competitors[0]?.name || '-'}</td>
                        <td className="p-3">{competitors[1]?.name || '-'}</td>
                        <td className="p-3">{competitors[2]?.name || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Description</td>
                        <td className="p-3 text-green-600">{ideaData?.ideaFitness}</td>
                        <td className="p-3">{competitors[0]?.description || '-'}</td>
                        <td className="p-3">{competitors[1]?.description || '-'}</td>
                        <td className="p-3">{competitors[2]?.description || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Key Strengths</td>
                        <td className="p-3 text-green-600">- Cloud-based security
- Affordable pricing
- User-friendly interface
- Rapid deployment</td>
                        <td className="p-3">{competitors[0]?.strengths?.join('\n') || '-'}</td>
                        <td className="p-3">{competitors[1]?.strengths?.join('\n') || '-'}</td>
                        <td className="p-3">{competitors[2]?.strengths?.join('\n') || '-'}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Weaknesses</td>
                        <td className="p-3 text-amber-600">- New market entrant
- Limited brand recognition
- Smaller feature set initially</td>
                        <td className="p-3">{competitors[0]?.weaknesses?.join('\n') || '-'}</td>
                        <td className="p-3">{competitors[1]?.weaknesses?.join('\n') || '-'}</td>
                        <td className="p-3">{competitors[2]?.weaknesses?.join('\n') || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  No competitor analysis data available
                </div>
              )}

             
            </section>
            
            <Separator className="my-16" />
            
            {/* Marketing Strategy */}
            <section id="marketing-strategy" data-section="marketing-strategy" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Marketing & Go-to-Market Strategy</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Acquisition Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {marketingStrategyLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {acquisitionStrategy.map((phase, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="bg-primary/10 rounded-full p-1 mt-1">
                              {index === 0 ? (
                                <Users className="h-4 w-4 text-primary" />
                              ) : index === 1 ? (
                                <Lightbulb className="h-4 w-4 text-primary" />
                              ) : (
                                <Circle className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <span className="font-medium">{phase.title}</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {phase.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {marketingStrategyLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {channelStrategy.map((channel, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1.5">
                              <h4 className="font-medium">{channel.channel}</h4>
                              <Badge variant="outline">{channel.percentage}%</Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${channel.percentage}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
                <MarketShareDonutChart data={marketShareData} loading={marketShareLoading} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                
                
                
              </div>
            </section>
            
            <Separator className="my-16" />
            
            {/* Technology */}
            <section id="technology-plan" data-section="technology-plan" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Technology Plan</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Core Technology Stack</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technologyPlanLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {coreStack.map((tech, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="bg-blue-100 rounded-full p-1 mt-1">
                              <ShieldCheck className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium">{tech.category}</span>
                              <p className="text-sm text-muted-foreground mt-1">{tech.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Integration Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technologyPlanLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {integrationCapabilities.description}
                        </p>
                        
                        <h4 className="font-medium mb-3">Key Integration Categories:</h4>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                          {integrationCapabilities.categories.map((category, index) => (
                            <div key={index} className="border border-border rounded-md p-2 text-center text-sm">
                              {category}
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Data Security & Compliance</h4>
                          <ul className="space-y-2">
                            {integrationCapabilities.security.map((item, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
               
              </div>
              
              
            </section>
            
            <Separator className="my-16" />
            
            {/* Revenue Projections */}
            <section id="revenue-projections" data-section="revenue-projections" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Revenue Projections</h2>
              
              <div className="mb-8">
                <RevenueProjectionsChart />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Year 1</CardTitle>
                    <CardDescription>First 12 months</CardDescription>
                  </CardHeader>
                   <CardContent>
                    {revenueProjectionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-3xl font-bold text-primary">${(yearlyRevenue.year1.revenue / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Startup Plan</span>
                            <span className="text-sm">{yearlyRevenue.year1.plans.startup}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Growth Plan</span>
                            <span className="text-sm">{yearlyRevenue.year1.plans.growth}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Scale Plan</span>
                            <span className="text-sm">{yearlyRevenue.year1.plans.scale}%</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Customers</span>
                            <span className="text-sm font-medium">{yearlyRevenue.year1.customers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Avg. Revenue Per User</span>
                            <span className="text-sm font-medium">${yearlyRevenue.year1.arpu}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Churn Rate</span>
                            <span className="text-sm font-medium">{yearlyRevenue.year1.churnRate}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Year 2</CardTitle>
                    <CardDescription>Months 13-24</CardDescription>
                  </CardHeader>
                   <CardContent>
                    {revenueProjectionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-3xl font-bold text-primary">${(yearlyRevenue.year2.revenue / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Startup Plan</span>
                            <span className="text-sm">{yearlyRevenue.year2.plans.startup}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Growth Plan</span>
                            <span className="text-sm">{yearlyRevenue.year2.plans.growth}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Scale Plan</span>
                            <span className="text-sm">{yearlyRevenue.year2.plans.scale}%</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Customers</span>
                            <span className="text-sm font-medium">{yearlyRevenue.year2.customers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Avg. Revenue Per User</span>
                            <span className="text-sm font-medium">${yearlyRevenue.year2.arpu}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Churn Rate</span>
                            <span className="text-sm font-medium">{yearlyRevenue.year2.churnRate}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Year 3</CardTitle>
                    <CardDescription>Months 25-36</CardDescription>
                  </CardHeader>
                   <CardContent>
                    {revenueProjectionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <p className="text-3xl font-bold text-primary">${(yearlyRevenue.year3.revenue / 1000000).toFixed(1)}M</p>
                          <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Startup Plan</span>
                            <span className="text-sm">{yearlyRevenue.year3.plans.startup}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Growth Plan</span>
                            <span className="text-sm">{yearlyRevenue.year3.plans.growth}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Scale Plan</span>
                            <span className="text-sm">{yearlyRevenue.year3.plans.scale}%</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Customers</span>
                            <span className="text-sm font-medium">{yearlyRevenue.year3.customers.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Avg. Revenue Per User</span>
                            <span className="text-sm font-medium">${yearlyRevenue.year3.arpu}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Churn Rate</span>
                            <span className="text-sm font-medium">{yearlyRevenue.year3.churnRate}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Burn Rate & Runway</CardTitle>
                  </CardHeader>
                   <CardContent>
                    {revenueProjectionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Burn Rate</p>
                            <p className="text-2xl font-bold">${(burnRate.monthlyBurnRate / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Runway with Funding</p>
                            <p className="text-2xl font-bold">{burnRate.runwayMonths} months</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-medium mb-2">Expense Breakdown</p>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Engineering ({burnRate.expenses.engineering.toFixed(0)}%)</span>
                                <span className="text-sm">${((burnRate.expenses.engineering * burnRate.monthlyBurnRate) / 100 / 1000).toFixed(1)}K/mo</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${burnRate.expenses.engineering}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Sales & Marketing ({burnRate.expenses.salesMarketing.toFixed(0)}%)</span>
                                <span className="text-sm">${((burnRate.expenses.salesMarketing * burnRate.monthlyBurnRate) / 100 / 1000).toFixed(1)}K/mo</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${burnRate.expenses.salesMarketing}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Operations ({burnRate.expenses.operations.toFixed(0)}%)</span>
                                <span className="text-sm">${((burnRate.expenses.operations * burnRate.monthlyBurnRate) / 100 / 1000).toFixed(1)}K/mo</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${burnRate.expenses.operations}%` }}></div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">G&A ({burnRate.expenses.generalAdmin.toFixed(0)}%)</span>
                                <span className="text-sm">${((burnRate.expenses.generalAdmin * burnRate.monthlyBurnRate) / 100 / 1000).toFixed(1)}K/mo</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${burnRate.expenses.generalAdmin}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Financial Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {revenueProjectionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {financialMilestones.map((milestone, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className={`${milestone.status === 'completed' ? 'bg-green-100' : milestone.status === 'in-progress' ? 'bg-amber-100' : 'bg-muted'} rounded-full p-1 mt-1`}>
                              {milestone.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : milestone.status === 'in-progress' ? (
                                <Circle className="h-4 w-4 text-amber-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">Month {milestone.month}: {milestone.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {milestone.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <Separator className="my-16" />
            
            {/* Challenges & Risks */}
            <section id="challenges" data-section="challenges" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Challenges & Risk Mitigation</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {challengesLoading ? (
                      <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-muted-foreground">Analyzing challenges...</span>
                      </div>
                    </div>
                    ) : challenges.length > 0 ? (
                      <ul className="space-y-4">
                        {challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="bg-red-100 rounded-full p-1 mt-1">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <span className="font-medium">{challenge.title}</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {challenge.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Key challenges will be generated soon...</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Mitigation Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {challengesLoading ? (
                      <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-muted-foreground">Analyzing mitigation strategies...</span>
                      </div>
                    </div>
                    ) : mitigationStrategies.length > 0 ? (
                      <ul className="space-y-4">
                        {mitigationStrategies.map((strategy, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="bg-green-100 rounded-full p-1 mt-1">
                              <ShieldCheck className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium">{strategy.title}</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {strategy.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">Risk mitigation strategies will be generated soon...</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>SWOT Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {swotLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="text-muted-foreground">Analyzing SWOT...</span>
                        </div>
                      </div>
                    ) : swotAnalysis ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-5 rounded-lg">
                          <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-3">Strengths</h3>
                          <ul className="space-y-2 text-sm">
                            {swotAnalysis.strengths.map((strength, index) => (
                              <li key={index} className="flex gap-2">
                                <span>•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-lg">
                          <h3 className="font-bold text-red-700 dark:text-red-400 mb-3">Weaknesses</h3>
                          <ul className="space-y-2 text-sm">
                            {swotAnalysis.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex gap-2">
                                <span>•</span>
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 dark:bg-green-950/20 p-5 rounded-lg">
                          <h3 className="font-bold text-green-700 dark:text-green-400 mb-3">Opportunities</h3>
                          <ul className="space-y-2 text-sm">
                            {swotAnalysis.opportunities.map((opportunity, index) => (
                              <li key={index} className="flex gap-2">
                                <span>•</span>
                                <span>{opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-950/20 p-5 rounded-lg">
                          <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-3">Threats</h3>
                          <ul className="space-y-2 text-sm">
                            {swotAnalysis.threats.map((threat, index) => (
                              <li key={index} className="flex gap-2">
                                <span>•</span>
                                <span>{threat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">SWOT analysis will be generated soon...</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-muted/20 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Key Success Factors</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Product-Market Fit</p>
                      <p className="text-sm text-muted-foreground">
                        Continuous validation with target customers to ensure alignment with evolving startup needs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Strategic Partnerships</p>
                      <p className="text-sm text-muted-foreground">
                        Accelerator and incubator relationships that provide access to new startups
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-1">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Technical Innovation</p>
                      <p className="text-sm text-muted-foreground">
                        Maintaining technological edge through continuous AI model improvement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <Separator className="my-16" />
            
            {/* Roadmap */}
            <section id="roadmap" data-section="roadmap" className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-primary">Strategic Roadmap</h2>
              

              
              {roadmapLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : roadmapData ? (
                <div className="space-y-8">
                  {/* Phases */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {roadmapData.roadmapPhases.map((phase, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className={`bg-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'green'}-100 dark:bg-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'green'}-900/20 rounded-full w-10 h-10 flex items-center justify-center mb-2`}>
                            <span className={`font-semibold text-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'green'}-700 dark:text-${index === 0 ? 'blue' : index === 1 ? 'purple' : 'green'}-400`}>{index + 1}</span>
                          </div>
                          <CardTitle>{phase.phase}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {phase.goals.map((goal, goalIndex) => (
                              <li key={goalIndex} className="flex items-center gap-2">
                                <Circle className={`h-4 w-4 ${index === 0 ? 'text-green-600' : index === 1 ? 'text-amber-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Milestones */}
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Milestone Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative pb-12">
                          <div className="absolute left-0 top-0 ml-5 h-full w-0.5 bg-border"></div>
                          
                          {roadmapData.milestones
                            .sort((a, b) => a.month - b.month)
                            .map((milestone, index) => (
                              <div key={index} className="relative mb-8 last:mb-0">
                                <div className="flex items-center">
                                  <div className={`absolute -left-1.5 mt-0.5 h-8 w-8 rounded-full border ${milestone.month <= 6 ? 'border-primary' : milestone.month <= 18 ? 'border-amber-500' : 'border-muted-foreground'} bg-background flex items-center justify-center`}>
                                    {milestone.month <= 6 ? (
                                      <CheckCircle2 className="h-4 w-4 text-primary" />
                                    ) : milestone.month <= 18 ? (
                                      <Circle className="h-4 w-4 text-amber-500" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div className="ml-10">
                                    <h4 className="font-medium">{milestone.title}</h4>
                                    <p className="text-sm text-muted-foreground">Month {milestone.month}</p>
                                    <p className="text-sm mt-1">{milestone.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No roadmap data available
                </div>
              )}
            </section>
            
            <div className="bg-muted/20 p-6 rounded-lg mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Investment Opportunity Summary</h3>
                <Badge variant="default" className="px-3">Seed Round</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Funding Target:</span>
                      <span className="font-medium">$850,000</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Equity Offered:</span>
                      <span className="font-medium">15%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Pre-Money Valuation:</span>
                      <span className="font-medium">$4.8M</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Use of Funds:</span>
                      <span className="font-medium">Engineering (40%), Marketing (35%), Operations (25%)</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Projected Exit:</span>
                      <span className="font-medium">Acquisition or Series C within 5 years</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Target Exit Valuation:</span>
                      <span className="font-medium">$250M-500M</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Projected ROI for Seed Investors:</span>
                      <span className="font-medium">12-15x</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Investment Minimum:</span>
                      <span className="font-medium">$50,000</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="default" className="w-full sm:w-auto">
                  Request Investor Deck
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center p-8 bg-primary/5 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Startup Marketing</h3>
              <p className="text-muted-foreground max-w-2xl mb-6">
                Our AI-powered platform helps startups reduce marketing costs while improving campaign performance. Join us in building the future of startup marketing automation.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="default" size="lg">
                  Schedule a Demo
                </Button>
                <Button variant="outline" size="lg">
                  Contact Founders
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
    <div>
      {/* Removed duplicate Executive Summary / Introduction and Investment Opportunity sections from the end of the report. */}
      </div>
    </div>
  );
}

export default BusinessPlanPage;