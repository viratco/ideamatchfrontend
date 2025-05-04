import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LightbulbIcon, 
  ChevronRight, 
  Target, 
  BarChart3, 
  Layers, 
  Zap, 
  Users, 
  DollarSign, 
  Award, 
  TrendingUp, 
  LineChart, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

// Define proper type for market and competition levels
type LevelType = 'Low' | 'Medium' | 'High';

interface DetailedAnalysis {
  ideaFitness: string;
  mvpFeatures: Array<{ name: string; description: string }>;
  differentiation: Array<{ point: string; description: string }>;
  revenueModel: {
    primary: string;
    secondary: string;
  };
  scalabilityPlan: Array<{ phase: string }>;
  deepInsights: {
    marketDemand: string;
    technologicalFeasibility: string;
    customerRetention: string;
    growthStrategy: string;
  };
}

// Sample idea type
interface IdeaType {
  title: string;
  description: string;
  marketPotential: LevelType;
  competitionLevel: LevelType;
  skills: string[];
  industry: string;
  businessModel: string;
  initialInvestment: string;
  ideaFitness?: string;
  analysis?: DetailedAnalysis;
  mvpFeatures?: Array<{ name: string; description: string }>;
  differentiation?: Array<{ point: string; description: string }>;
  revenueModel?: {
    primary: string;
    secondary: string;
  };
  scalabilityPlan?: Array<{ phase: string }>;
  deepInsights?: {
    marketDemand: string;
    technologicalFeasibility: string;
    customerRetention: string;
    growthStrategy: string;
  };
}

// Parse the AI response into structured data
const parseDetailedAnalysis = (text: string): DetailedAnalysis => {
  const sections = text.split('\n\n');
  const analysis: DetailedAnalysis = {
    ideaFitness: '',
    mvpFeatures: [],
    differentiation: [],
    revenueModel: { primary: '', secondary: '' },
    scalabilityPlan: [],
    deepInsights: {
      marketDemand: '',
      technologicalFeasibility: '',
      customerRetention: '',
      growthStrategy: ''
    }
  };

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const sectionTitle = lines[0].trim();

    if (sectionTitle.startsWith('Idea Fitness:')) {
      analysis.ideaFitness = lines.slice(1).join(' ').trim();
    } 
    else if (sectionTitle === 'MVP Features:') {
      let currentFeature = { name: '', description: '' };
      lines.slice(1).forEach(line => {
        if (line.match(/^\d+\./)) {
          currentFeature.name = line.replace(/^\d+\./, '').trim();
        } else if (line.startsWith('Description:')) {
          currentFeature.description = line.replace('Description:', '').trim();
          analysis.mvpFeatures.push({ ...currentFeature });
          currentFeature = { name: '', description: '' };
        }
      });
    }
    else if (sectionTitle === 'Differentiation:') {
      let currentPoint = { point: '', description: '' };
      lines.slice(1).forEach(line => {
        if (line.match(/^\d+\./)) {
          currentPoint.point = line.replace(/^\d+\./, '').trim();
        } else if (line.startsWith('Description:')) {
          currentPoint.description = line.replace('Description:', '').trim();
          analysis.differentiation.push({ ...currentPoint });
          currentPoint = { point: '', description: '' };
        }
      });
    }
    else if (sectionTitle === 'Revenue Model:') {
      lines.slice(1).forEach(line => {
        if (line.includes('Primary Revenue:')) {
          analysis.revenueModel.primary = line.split('Primary Revenue:')[1].trim();
        } else if (line.includes('Secondary Revenue:')) {
          analysis.revenueModel.secondary = line.split('Secondary Revenue:')[1].trim();
        }
      });
    }
    else if (sectionTitle === 'Scalability Plan:') {
      lines.slice(1).forEach(line => {
        if (line.match(/^\d+\./)) {
          analysis.scalabilityPlan.push({
            phase: line.replace(/^\d+\./, '').trim()
          });
        }
      });
    }
    else if (sectionTitle === 'Deep Insights:') {
      let currentInsight = '';
      lines.slice(1).forEach(line => {
        if (line.includes('Market Demand:')) {
          currentInsight = 'marketDemand';
        } else if (line.includes('Technological Feasibility:')) {
          currentInsight = 'technologicalFeasibility';
        } else if (line.includes('Customer Retention:')) {
          currentInsight = 'customerRetention';
        } else if (line.includes('Growth Strategy:')) {
          currentInsight = 'growthStrategy';
        } else if (currentInsight && line.trim()) {
          analysis.deepInsights[currentInsight] = line.trim();
        }
      });
    }
  });

  return analysis;
};

interface IdeaDetailsProps {
  idea: IdeaType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { saveIdeaToSupabase } from '../utils/saveIdeaToSupabase';

export default function IdeaDetails({ idea, open, onOpenChange }: IdeaDetailsProps) {
  if (!idea) return null;
  const navigate = useNavigate();

  const [saved, setSaved] = useState(false);
  const handleGenerateBusinessPlan = () => {
    navigate('/business-plan-waiting', { state: { idea } });
  };

  const handleSaveIdea = async () => {
    // Compose the details object with all fields
    const details = {
      marketPotential: idea.marketPotential,
      competitionLevel: idea.competitionLevel,
      skills: idea.skills,
      industry: idea.industry,
      businessModel: idea.businessModel,
      initialInvestment: idea.initialInvestment,
      ...(idea.analysis ? { analysis: idea.analysis } : {})
    };
    // Get user_id from Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    const user_id = session?.user?.id;
    if (!user_id) {
      toast.error('You must be logged in to save ideas.');
      return;
    }
    // Save to Supabase
    const error = await saveIdeaToSupabase({
      user_id,
      idea: { title: idea.title, description: idea.description, details }
    });
    if (!error) {
      setSaved(true);
      toast.success('Idea saved to your account!');
    } else {
      toast.error('Failed to save idea: ' + (error.message || error.details || JSON.stringify(error)));
    }
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-3/4 border-l border-border bg-card/95 backdrop-blur-md sm:max-w-none overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/15 p-2 rounded-full">
                <LightbulbIcon className="h-7 w-7 text-primary" />
              </div>
              <SheetTitle className="text-3xl font-bold">{idea.title}</SheetTitle>
            </div>
            <div className="flex items-center gap-2 mt-1 mb-3">
              <Badge variant="outline" className="text-sm font-medium bg-primary/5 px-3">
                {idea.industry}
              </Badge>
              <Badge variant="outline" className="text-sm font-medium bg-secondary/20 px-3">
                {idea.businessModel}
              </Badge>
            </div>
            <SheetDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
              {idea.description}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-8 pb-16">
            <div className="bg-gradient-to-br from-primary/5 to-primary/15 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Idea Fitness</span>
              </h3>
              <p className="text-muted-foreground">
                {idea.ideaFitness || idea.analysis?.ideaFitness || 'Analysis not available.'}
              </p>
            </div>
            
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <span>MVP Features</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(idea.mvpFeatures || idea.analysis?.mvpFeatures || []).map((feature, index) => (
                  <div key={index} className="bg-secondary/20 p-5 rounded-xl flex gap-3">
                    <div className="bg-green-100 rounded-full h-6 w-6 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <Separator className="my-6" />
            
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Differentiation</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(idea.differentiation || idea.analysis?.differentiation || []).map((diff, index) => (
                  <div key={index} className="bg-primary/10 p-5 rounded-xl">
                    <h4 className="font-medium mb-2">{diff.point}</h4>
                    <p className="text-sm text-muted-foreground">{diff.description}</p>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Revenue Model</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-section p-5 rounded-xl">
                  <h4 className="font-medium">Primary Revenue Stream</h4>
                  <p className="text-sm text-muted-foreground mt-1">{(idea.revenueModel?.primary || idea.analysis?.revenueModel?.primary || 'Analysis not available.') }</p>
                </div>
                <div className="glass-section p-5 rounded-xl">
                  <h4 className="font-medium">Secondary Revenue Stream</h4>
                  <p className="text-sm text-muted-foreground mt-1">{(idea.revenueModel?.secondary || idea.analysis?.revenueModel?.secondary || 'Analysis not available.') }</p>
                </div>
              </div>
            </section>
            
            <Separator className="my-6" />
            
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Scalability</span>
              </h3>
              <div className="space-y-4">
                {(idea.scalabilityPlan || idea.analysis?.scalabilityPlan || []).map((plan, index) => (
                  <div key={index} className="flex gap-3 p-2">
                    <div className="bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      <span className="font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Phase {index + 1}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{plan.phase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                <span>Deep Insights</span>
              </h3>
              <div className="space-y-6">
                <div className="glass-section rounded-lg p-4">
                  <h4 className="font-medium text-primary">Market Demand</h4>
                  <p className="text-muted-foreground mt-2">
                    {(idea.deepInsights?.marketDemand || idea.analysis?.deepInsights?.marketDemand || 'Analysis not available.')}
                  </p>
                </div>
                <div className="glass-section rounded-lg p-4">
                  <h4 className="font-medium text-primary">Technological Feasibility</h4>
                  <p className="text-muted-foreground mt-2">
                    {(idea.deepInsights?.technologicalFeasibility || idea.analysis?.deepInsights?.technologicalFeasibility || 'Analysis not available.')}
                  </p>
                </div>
                <div className="glass-section rounded-lg p-4">
                  <h4 className="font-medium text-primary">Customer Retention</h4>
                  <p className="text-muted-foreground mt-2">
                    {(idea.deepInsights?.customerRetention || idea.analysis?.deepInsights?.customerRetention || 'Analysis not available.')}
                  </p>
                </div>
                <div className="glass-section rounded-lg p-4">
                  <h4 className="font-medium text-primary">Growth Strategy</h4>
                  <p className="text-muted-foreground mt-2">
                    {(idea.deepInsights?.growthStrategy || idea.analysis?.deepInsights?.growthStrategy || 'Analysis not available.')}
                  </p>
                </div>
              </div>
            </section>
            
            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleSaveIdea} className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-base" disabled={saved}>
                {saved ? 'Saved!' : 'Save Idea'}
              </Button>
              <Button onClick={handleGenerateBusinessPlan} className="w-full bg-primary/90 hover:bg-primary text-white py-6 text-lg">
                Generate Complete Business Plan
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>

    </Sheet>
  );
}
