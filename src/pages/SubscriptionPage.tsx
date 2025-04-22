
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, BadgeDollarSign, LightbulbIcon, BrainCog, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan: string) => {
    toast.success(`You've subscribed to the ${plan} plan!`);
    navigate('/profile');
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto pt-28 px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <BadgeDollarSign className="h-4 w-4" />
            <span>Premium AI Models</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Unlock Advanced Business Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get detailed business plans, market insights, and competitive analysis with our premium AI models.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="relative overflow-hidden border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Basic</CardTitle>
              <CardDescription>Essential business plan generation</CardDescription>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 pb-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Simple business plan generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Basic market insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Up to 3 business ideas per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Standard AI model</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe('Basic')}
                className="w-full"
                variant="outline"
              >
                Subscribe 
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className="relative border-primary overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>
            <div className="absolute -top-3 right-4">
              <Badge className="bg-primary text-white font-medium px-3 py-1">
                <Star className="h-3.5 w-3.5 mr-1" /> Popular
              </Badge>
            </div>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="text-xl">Premium</CardTitle>
              <CardDescription>Professional business planning</CardDescription>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 pb-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="bg-primary/20 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Detailed business plan generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/20 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">Comprehensive market analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/20 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">Competitor insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/20 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">Up to 10 business ideas per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-primary/20 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">Advanced GPT-4o AI model</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe('Premium')}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Subscribe <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Plan */}
          <Card className="relative overflow-hidden border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Enterprise</CardTitle>
              <CardDescription>Complete business solutions</CardDescription>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-bold">$79</span>
                <span className="text-muted-foreground ml-1">/month</span>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 pb-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Complete business plan with financials</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Deep market research & validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Unlimited business ideas</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">Executive-level reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">State-of-the-art AI model access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe('Enterprise')}
                className="w-full"
                variant="outline"
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Premium AI Models?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <BrainCog className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Advanced AI</h3>
              <p className="text-muted-foreground">
                Access to powerful AI models that deliver higher quality, more detailed business plans.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Speed & Quality</h3>
              <p className="text-muted-foreground">
                Generate complete business plans in minutes instead of weeks, with practical insights.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-xl">
              <div className="bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
              <p className="text-muted-foreground">
                Premium users report 65% higher success rates in launching and growing their businesses.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Elevate Your Business Planning?</h2>
          <p className="text-muted-foreground mb-6">
            Choose a plan above to get started and unlock the full potential of your business ideas.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Secure payments. Cancel anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
