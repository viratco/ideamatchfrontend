import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar'; // Uses the enhanced, animated, glassy Navbar

import IdeaCard from '@/components/IdeaCard';
import IdeaDetails from '@/components/IdeaDetails';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LightbulbIcon, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generateBusinessIdea } from '@/services/openRouterService';

// Sample idea data
type CompetitionLevel = 'High' | 'Medium' | 'Low';
type MarketPotential = 'High' | 'Medium' | 'Low';

const sampleIdea = {
  title: "Automated Marketing and Growth Platform for Startups",
  description: "A tool that automates marketing and growth efforts for startups using AI-driven strategies and tactics. Marketing and growth are critical but often resource-intensive, especially for early-stage startups.",
  marketPotential: "High" as MarketPotential,
  competitionLevel: "Medium" as CompetitionLevel,
  skills: ["AI Development", "Marketing Strategy", "UX Design", "Growth Hacking"],
  industry: "SaaS",
  businessModel: "Subscription",
  initialInvestment: "$10K - $50K",
  ideaFitness: "This idea shows strong potential due to the growing demand for AI-driven marketing solutions and the clear pain point it addresses for startups. The subscription model ensures recurring revenue, while the focus on automation can lead to good scalability.",
  analysis: null as any
};

// Parse the generated idea into our required format
const parseGeneratedIdea = (ideaText: string) => {
  console.log("=== FRONTEND PARSING ===");
  const sections = ideaText.split('\n\n');
  console.log("Sections:", sections);

  const idea = {
    title: '',
    description: '',
    marketPotential: 'Medium' as MarketPotential,
    competitionLevel: 'Medium' as CompetitionLevel,
    skills: [] as string[],
    industry: '',
    businessModel: '',
    initialInvestment: '',
    ideaFitness: '',
    analysis: null as any
  };

  let isDetailedAnalysis = false;
  let detailedAnalysisText = '';

  sections.forEach((section: string) => {
    const trimmedSection = section.trim();
    console.log("\nProcessing section:", trimmedSection);

    if (trimmedSection.startsWith('Title:')) {
      idea.title = trimmedSection.replace('Title:', '').trim();
      console.log("Found title:", idea.title);
    } else if (trimmedSection.startsWith('Description:')) {
      idea.description = trimmedSection.replace('Description:', '').trim();
      console.log("Found description:", idea.description);
    } else if (trimmedSection.startsWith('Market Analysis:')) {
      const lines = trimmedSection.split('\n');
      lines.forEach((line: string) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('- Market Size:')) {
          const size = trimmedLine.split(':')[1].trim();
          idea.marketPotential = size as MarketPotential;
        } else if (trimmedLine.startsWith('- Competition Level:')) {
          const level = trimmedLine.split(':')[1].trim();
          idea.competitionLevel = level as CompetitionLevel;
        } else if (trimmedLine.startsWith('- Initial Investment:')) {
          idea.initialInvestment = trimmedLine.split(':')[1].trim();
        } else if (trimmedLine.startsWith('- Industry:')) {
          idea.industry = trimmedLine.split(':')[1].trim();
        } else if (trimmedLine.startsWith('- Business Model:')) {
          idea.businessModel = trimmedLine.split(':')[1].trim();
        }
      });
    } else if (trimmedSection.startsWith('Required Skills:')) {
      const skillLines = trimmedSection
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-'))
        .map((line: string) => line.replace('-', '').trim())
        .filter((skill: string) => skill.length > 0);
      
      if (skillLines.length === 0) {
        console.warn("No skills found in section:", trimmedSection);
        idea.skills = ['Technical Skills Required'];
      } else {
        idea.skills = skillLines.slice(0, 4);
        console.log("Found skills:", idea.skills);
      }
    } else if (trimmedSection.startsWith('Idea Fitness:')) {
      // Extract the idea fitness content
      const fitnessContent = trimmedSection
        .replace('Idea Fitness:', '')
        .trim()
        .split('\n')
        .filter(line => !line.trim().startsWith('-'))
        .join(' ')
        .trim();
      idea.ideaFitness = fitnessContent;
      console.log("Found idea fitness:", idea.ideaFitness);

      // Check if this is the start of detailed analysis
      isDetailedAnalysis = true;
      detailedAnalysisText = sections.slice(sections.indexOf(trimmedSection)).join('\n\n');
    } else if (trimmedSection.startsWith('Idea Fitness:')) {
      isDetailedAnalysis = true;
      detailedAnalysisText = sections.slice(sections.indexOf(trimmedSection)).join('\n\n');
    }
  });

  // Parse detailed analysis if available
  if (isDetailedAnalysis && detailedAnalysisText) {
    try {
      idea.analysis = parseDetailedAnalysis(detailedAnalysisText);
    } catch (error) {
      console.error('Error parsing detailed analysis:', error);
    }
  }

  // Validate and set defaults for missing data
  if (!idea.title) idea.title = 'Untitled Idea';
  if (!idea.description) idea.description = 'Description not available.';
  if (!idea.industry) idea.industry = 'Technology';
  if (!idea.businessModel) idea.businessModel = 'Not Specified';
  if (!idea.initialInvestment) idea.initialInvestment = 'Investment TBD';
  if (idea.skills.length === 0) idea.skills = ['Skills TBD'];
  if (!idea.ideaFitness) idea.ideaFitness = 'Idea fitness analysis not available.';

  console.log("\nFinal parsed idea:", idea);
  console.log("=== END FRONTEND PARSING ===\n");

  return idea;
};

const parseDetailedAnalysis = (text: string) => {
  const sections = text.split('\n\n');
  const analysis = {
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
      let currentPhase = null;
      let phaseContent = '';

      lines.slice(1).forEach(line => {
        const trimmedLine = line.trim();
        
        if (trimmedLine.match(/^\d+\./)) {
          if (currentPhase !== null) {
            analysis.scalabilityPlan.push({
              phase: phaseContent.trim()
            });
          }
          currentPhase = parseInt(trimmedLine.match(/^\d+/)[0]) - 1;
          phaseContent = trimmedLine.replace(/^\d+\./, '').trim();
        } else if (trimmedLine.startsWith('-')) {
          phaseContent += '\n• ' + trimmedLine.substring(1).trim();
        } else if (currentPhase !== null && trimmedLine) {
          phaseContent += ' ' + trimmedLine;
        }
      });

      // Add the last phase
      if (currentPhase !== null) {
        analysis.scalabilityPlan.push({
          phase: phaseContent.trim()
        });
      }
    }
    else if (sectionTitle === 'Deep Insights:') {
      let currentInsight = '';
      let currentContent = '';

      // Initialize all sections with empty strings
      analysis.deepInsights = {
        marketDemand: '',
        technologicalFeasibility: '',
        customerRetention: '',
        growthStrategy: ''
      };

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Skip empty lines and section headers
        if (!trimmedLine || trimmedLine === 'Deep Insights:') {
          return;
        }

        // Handle section headers and content
        if (trimmedLine.startsWith('1. Market Demand:')) {
          currentInsight = 'marketDemand';
          currentContent = trimmedLine.replace('1. Market Demand:', '').trim();
        } else if (trimmedLine.startsWith('2. Technological Feasibility:')) {
          if (currentInsight) {
            analysis.deepInsights[currentInsight] = currentContent;
          }
          currentInsight = 'technologicalFeasibility';
          currentContent = trimmedLine.replace('2. Technological Feasibility:', '').trim();
        } else if (trimmedLine.startsWith('3. Customer Retention:')) {
          if (currentInsight) {
            analysis.deepInsights[currentInsight] = currentContent;
          }
          currentInsight = 'customerRetention';
          currentContent = trimmedLine.replace('3. Customer Retention:', '').trim();
        } else if (trimmedLine.startsWith('4. Growth Strategy:')) {
          if (currentInsight) {
            analysis.deepInsights[currentInsight] = currentContent;
          }
          currentInsight = 'growthStrategy';
          currentContent = trimmedLine.replace('4. Growth Strategy:', '').trim();
        } else if (currentInsight && !trimmedLine.match(/^\d+\./)) {
          // Accumulate content, skipping bullet points
          if (!trimmedLine.startsWith('-')) {
            currentContent += ' ' + trimmedLine;
          }
        }

        // Save the last section's content
        if (index === lines.length - 1 && currentInsight) {
          analysis.deepInsights[currentInsight] = currentContent.trim();
        }
      });

      // Clean up and validate all sections
      Object.keys(analysis.deepInsights).forEach(key => {
        // Clean up any remaining section numbers or colons
        analysis.deepInsights[key] = analysis.deepInsights[key]
          .replace(/^\d+\.\s*/, '')  // Remove leading numbers
          .replace(/^[^:]+:\s*/, '') // Remove section headers
          .trim();

        // If section is empty, use default content
        if (!analysis.deepInsights[key]) {
          switch (key) {
            case 'technologicalFeasibility':
              analysis.deepInsights[key] = 'Implementation leverages readily available tools and technologies, with MVP built using low-code solutions and free-tier services to match budget constraints.';
              break;
            case 'customerRetention':
              analysis.deepInsights[key] = 'Focus on delivering core value proposition with personalized support and regular feedback collection to build strong customer relationships.';
              break;
            case 'growthStrategy':
              analysis.deepInsights[key] = 'Start with a focused niche market and expand gradually using organic growth and word-of-mouth marketing, scaling based on validated demand.';
              break;
            case 'marketDemand':
              analysis.deepInsights[key] = 'The idea targets a growing market segment with clear customer needs and strong potential for early adoption.';
              break;
          }
        }
      });

      console.log('Parsed deep insights:', analysis.deepInsights);
    }
  });

  return analysis;
};

const Dashboard = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null);
  const navigate = useNavigate();

  // Function to check if an idea is unique
  const isIdeaUnique = (newIdea: any, existingIdeas: any[]) => {
    // Check if the exact same title exists
    const exactTitleMatch = existingIdeas.some(idea => 
      idea.title.toLowerCase().trim() === newIdea.title.toLowerCase().trim()
    );
    if (exactTitleMatch) return false;

    // Check if the description is too similar
    const newDesc = newIdea.description.toLowerCase().trim();
    const similarDesc = existingIdeas.some(idea => {
      const existingDesc = idea.description.toLowerCase().trim();
      // Only check first 100 characters for quick similarity
      if (newDesc.slice(0, 100) === existingDesc.slice(0, 100)) return true;
      
      // Check word similarity but with a higher threshold (85%)
      const newWords = new Set(newDesc.split(' '));
      const existingWords = new Set(existingDesc.split(' '));
      const commonWords = [...newWords].filter(word => existingWords.has(word));
      return commonWords.length / newWords.size > 0.85;
    });
    return !similarDesc;
  };

  // Function to generate a unique idea with retries
  const generateUniqueIdea = async (formData: any, existingIdeas: any[], maxRetries = 3): Promise<any> => {
    let retryCount = 0;
    const existingIndustries = new Set(existingIdeas.map(idea => idea.industry.toLowerCase()));
    const existingModels = new Set(existingIdeas.map(idea => idea.businessModel.toLowerCase()));
    
    try {
      setIsLoading(true);

      while (retryCount < maxRetries) {
        try {
        let variationPrompt = '';
        
        if (retryCount > 0) {
          // Create more specific variation prompts
          const unusedIndustries = formData.industries?.filter(
            (ind: string) => !existingIndustries.has(ind.toLowerCase())
          ) || [];
          
          if (retryCount === 1) {
            variationPrompt = `\n\nPlease generate a completely different business idea. Focus on these aspects:
1. Use a different business model than ${Array.from(existingModels).join(', ')}
2. Target a different customer segment
3. Solve a different problem space
Previous ideas were: ${existingIdeas.map(idea => idea.title).join(', ')}`;
          } else {
            variationPrompt = `\n\nGenerate a unique business idea with these requirements:
1. ${unusedIndustries.length > 0 
      ? `Focus on these unused industries: ${unusedIndustries.join(', ')}`
      : 'Take a completely different industry approach'}
2. Consider unconventional combinations of technologies
3. Target an underserved market segment
4. Use innovative revenue streams
Previous ideas were: ${existingIdeas.map(idea => idea.title).join(', ')}`;
          }
        }

      // Adjust the request based on retry count
      const modifiedFormData = { ...formData };
      if (retryCount > 0) {
        // On retries, be more flexible with constraints
        modifiedFormData.riskLevel = retryCount === 2 ? 'high' : formData.riskLevel;
        modifiedFormData.suggestTrending = true; // Always look for trending ideas on retries
        
        // If we have multiple industries selected, prioritize unused ones
        if (modifiedFormData.industries?.length > 1) {
          const unusedIndustries = modifiedFormData.industries.filter(
            (ind: string) => !existingIndustries.has(ind.toLowerCase())
          );
          if (unusedIndustries.length > 0) {
            modifiedFormData.industries = unusedIndustries;
          }
        }
      }

      const response = await generateBusinessIdea({
        ...modifiedFormData,
        userType: modifiedFormData.userType || 'startup',
        industries: modifiedFormData.industries || ['tech', 'saas'],
        technicalSkills: modifiedFormData.technicalSkills || ['web development', 'ai', 'cloud'],
        timeCommitment: modifiedFormData.timeCommitment || 'full-time',
        riskLevel: modifiedFormData.riskLevel || 'medium',
        challenges: modifiedFormData.challenges || ['market fit', 'competition'],
        budget: modifiedFormData.budget || [10000, 50000],
        businessModel: modifiedFormData.businessModel || 'subscription',
        suggestTrending: modifiedFormData.suggestTrending ?? true,
        focusNiche: modifiedFormData.focusNiche || '',
        suggestCompetitors: modifiedFormData.suggestCompetitors ?? true,
        additionalContext: variationPrompt
      });
      
      const parsedIdea = parseGeneratedIdea(response);
      
      if (!parsedIdea.title || !parsedIdea.description || !parsedIdea.skills || parsedIdea.skills.length === 0) {
        throw new Error('Generated idea is missing required fields');
      }

      if (isIdeaUnique(parsedIdea, existingIdeas)) {
        return { response, parsedIdea };
      }

          retryCount++;
          console.log(`Generated similar idea, retrying with more variations... (${retryCount}/${maxRetries})`);
        } catch (error) {
          console.error('Error in attempt:', error);
          retryCount++;
        }
      }

      // If we couldn't generate a unique idea, return the last one anyway
      const lastResponse = await generateBusinessIdea({
        ...formData,
        additionalContext: "\n\nPlease generate a final business idea that is as different as possible from previous ones, even if it's more ambitious or unconventional."
      });
      
      const lastParsedIdea = parseGeneratedIdea(lastResponse);
      return { response: lastResponse, parsedIdea: lastParsedIdea };
    } catch (error) {
      console.error('Error generating unique idea:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateIdea = async () => {
    if (isLoading) return; // Prevent multiple submissions
    
    setError(null);
    
    try {
      // Get user preferences from localStorage
      const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      const savedIdea = localStorage.getItem('generatedIdea');
      let formData;

      if (savedIdea) {
        try {
          // Get form data from the saved idea's metadata
          const { formData: savedFormData } = JSON.parse(savedIdea);
          formData = savedFormData;
        } catch (error) {
          console.error('Error parsing saved form data:', error);
          formData = userPreferences;
        }
      } else {
        formData = userPreferences;
      }

      const { response, parsedIdea } = await generateUniqueIdea(formData, generatedIdeas);
      console.log('Generated unique idea:', parsedIdea);
      
      setGeneratedIdeas(prev => [...prev, parsedIdea]);
      setSelectedIdea(parsedIdea);
      setDetailsOpen(true);

      // Save the latest idea with form data
      localStorage.setItem('generatedIdea', JSON.stringify({
        timestamp: new Date().toISOString(),
        idea: response,
        formData: formData
      }));

      // Save to recentIdeas in localStorage (for Profile page)
      let recentIdeas = JSON.parse(localStorage.getItem('recentIdeas') || '[]');
      // Get userId from JWT (token in localStorage)
      let userId = null;
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.user_id || null;
        }
      } catch {}
      recentIdeas = recentIdeas.filter((idea: any) => idea.title !== parsedIdea.title);
      recentIdeas.unshift({ ...parsedIdea, userId });
      if (recentIdeas.length > 10) recentIdeas = recentIdeas.slice(0, 10);
      localStorage.setItem('recentIdeas', JSON.stringify(recentIdeas));
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || 'Failed to generate idea',
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset loading state if there's an error
  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const savedIdea = localStorage.getItem('generatedIdea');
    if (savedIdea) {
      try {
        const { idea, formData } = JSON.parse(savedIdea);
        const parsedIdea = parseGeneratedIdea(idea);
        setGeneratedIdeas([parsedIdea]);
        setSelectedIdea(parsedIdea);
        
        // Store form data in user preferences if not already set
        if (formData && !localStorage.getItem('userPreferences')) {
          localStorage.setItem('userPreferences', JSON.stringify(formData));
        }
      } catch (error) {
        console.error('Error parsing saved idea:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className={`container mx-auto px-4 sm:px-6 pt-28 pb-16 transition-all duration-300 ${detailsOpen ? 'pr-[calc(75%+2rem)]' : ''}`}>
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Welcome to your dashboard</span>
            </div>
            <h1 className="text-3xl font-bold">Your Business Ideas</h1>
            <p className="text-muted-foreground mt-2">
              Based on your profile, we've created personalized business ideas for you.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerateIdea} 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate More Ideas
                </>
              )}
            </Button>
            <Button 
              onClick={() => navigate("/idea-generator")} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <LightbulbIcon className="h-4 w-4" />
              Customize
            </Button>
          </div>
        </div>
        
        {generatedIdeas.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-24">
        <LightbulbIcon className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">No ideas yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          You haven't generated any business ideas yet. Start by generating your first idea!
        </p>
        <Button className="bg-primary text-white" onClick={handleGenerateIdea}>
          Generate Your First Idea
        </Button>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 mb-12">
        {generatedIdeas.map((idea, index) => (
          <IdeaCard 
            key={index}
            {...idea} 
            onExploreDetails={() => {
              setSelectedIdea(idea);
              setDetailsOpen(true);
            }}
          />
        ))}
      </div>
    )}
        
        {/* <div className="glass-card rounded-2xl p-6 md:p-8 mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/15 p-2 rounded-lg">
                <LightbulbIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Ready to explore your ideas further?</h2>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Get detailed execution plans, market analysis, and competitor insights for your business ideas.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="bg-primary text-white"
                onClick={() => navigate('/subscription')}
              >
                Generate Business Plan
              </Button>
              <Button variant="outline" onClick={() => navigate('/saved-ideas')}>
                View Saved Ideas
              </Button>
              <Button variant="secondary" onClick={() => navigate('/analytics')}>
                Analyze Market
              </Button>
            </div>
          </div>
        </div> */}
      </main>
      
      <IdeaDetails 
        idea={selectedIdea}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
};

export default Dashboard;
