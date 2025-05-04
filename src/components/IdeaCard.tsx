import React, { useRef, useEffect } from 'react';
// @ts-ignore
import anime from 'animejs';
import { ArrowRight, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample data structure for an idea
interface IdeaProps {
  title: string;
  description: string;
  marketPotential: 'Low' | 'Medium' | 'High';
  competitionLevel: 'Low' | 'Medium' | 'High';
  skills: string[];
  industry: string;
  businessModel: string;
  initialInvestment: string;
  /**
   * Full analysis object (all fields needed for the IdeaDetails page: mvpFeatures, differentiation, revenueModel, scalabilityPlan, deepInsights, etc.)
   */
  analysis?: any;
  onExploreDetails?: () => void;
  showSaveButton?: boolean;
}

import { toast } from 'sonner';
import { supabase } from '../supabaseClient';
import { saveIdeaToSupabase } from '../utils/saveIdeaToSupabase';

const IdeaCard: React.FC<IdeaProps> = ({
  title,
  description,
  marketPotential,
  competitionLevel,
  skills,
  industry,
  businessModel,
  initialInvestment,
  analysis, // <-- NEW
  onExploreDetails,
  showSaveButton = true,
}) => {
  const [saved, setSaved] = React.useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const exploreBtnRef = useRef<HTMLButtonElement>(null);

  const handleSaveIdea = async () => {
  // Compose the details object with all idea components (including analysis)
  const details = {
    title,
    description,
    marketPotential,
    competitionLevel,
    skills,
    industry,
    businessModel,
    initialInvestment,
    ...(analysis || {}) // flatten all analysis fields at top level
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
    idea: { title, description, details }
  });
  if (!error) {
    setSaved(true);
    toast.success('Idea saved to your account!');
  } else {
    toast.error('Failed to save idea: ' + (error.message || error.details || JSON.stringify(error)));
  }
};

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 900,
        easing: 'easeOutExpo',
      });
    }
    if (exploreBtnRef.current) {
      exploreBtnRef.current.addEventListener('mouseenter', () => {
        anime({
          targets: exploreBtnRef.current,
          scale: 1.08,
          duration: 200,
          easing: 'easeOutBack',
        });
      });
      exploreBtnRef.current.addEventListener('mouseleave', () => {
        anime({
          targets: exploreBtnRef.current,
          scale: 1,
          duration: 200,
          easing: 'easeOutExpo',
        });
      });
      exploreBtnRef.current.addEventListener('mousedown', () => {
        anime({
          targets: exploreBtnRef.current,
          scale: 0.96,
          duration: 100,
          easing: 'easeInBack',
        });
      });
      exploreBtnRef.current.addEventListener('mouseup', () => {
        anime({
          targets: exploreBtnRef.current,
          scale: 1.08,
          duration: 100,
          easing: 'easeOutBack',
        });
      });
    }
  }, []);

  const getMarketColor = () => {
    if (marketPotential === 'High') return 'bg-green-100 text-green-800';
    if (marketPotential === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCompetitionColor = () => {
    if (competitionLevel === 'Low') return 'bg-green-100 text-green-800';
    if (competitionLevel === 'Medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getInvestmentColor = () => {
    const amount = initialInvestment.replace(/[^0-9]/g, '');
    const firstNumber = parseInt(amount.split('-')[0]);
    if (firstNumber <= 50) return 'bg-green-100 text-green-800';
    if (firstNumber <= 200) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card ref={cardRef} className="overflow-hidden card-hover border-0 glass-card" style={{ opacity: 0, transform: 'translateY(40px)' }}>
      <CardHeader className="pb-3 pt-6 px-6 bg-primary/5">
        <div className="flex items-start justify-between">
          <div className="bg-primary/10 p-2 rounded-lg mb-3">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {industry}
          </Badge>
        </div>
        <h3 className="text-2xl font-extrabold leading-tight mb-2">{title}</h3>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Market:</span>
            <Badge variant="secondary" className={`text-xs ${getMarketColor()}`}>
              {marketPotential}
            </Badge>
          </div>
          
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Competition:</span>
            <Badge variant="secondary" className={`text-xs ${getCompetitionColor()}`}>
              {competitionLevel}
            </Badge>
          </div>
          
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Model:</span>
            <span className="text-sm">{businessModel}</span>
          </div>
          
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Investment:</span>
            <Badge variant="secondary" className={`text-xs ${getInvestmentColor()}`}>
              {initialInvestment}
            </Badge>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="text-sm font-medium mb-2">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-secondary/50">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-secondary/30 flex justify-between">
        {showSaveButton && (
          <Button variant="ghost" size="sm" onClick={handleSaveIdea} disabled={saved}>
            {saved ? 'Saved!' : 'Save Idea'}
          </Button>
        )}
        <Button 
          ref={exploreBtnRef}
          size="sm" 
          className="flex items-center gap-1"
          onClick={onExploreDetails}
        >
          Explore Details <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
