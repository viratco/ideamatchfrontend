
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, PieChart, Calendar, ArrowUpRight, ArrowDownRight, LineChart, FilterX, Clock, Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for charts and analytics
const mockPerformanceData = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 30 },
  { month: 'Mar', value: 45 },
  { month: 'Apr', value: 50 },
  { month: 'May', value: 60 },
  { month: 'Jun', value: 70 },
];

const mockIndustryData = [
  { name: 'SaaS', value: 40 },
  { name: 'Health', value: 30 },
  { name: 'Food', value: 20 },
  { name: 'E-commerce', value: 10 },
];

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const isEnterprisePlan = false; // This would come from user context/state
  
  const handleUpgradeClick = () => {
    navigate('/subscription');
    toast.info('Redirecting to subscription page to upgrade to Enterprise plan');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Analytics</span>
            </div>
            <h1 className="text-3xl font-bold">Business Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track performance metrics and market trends for your business ideas
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Select defaultValue="30d">
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isEnterprisePlan ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Ideas Generated</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold">18</p>
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          <span>+5</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-md">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Market Potential</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold">68%</p>
                        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          <span>+12%</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-md">
                      <LineChart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Competitiveness</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold">42%</p>
                        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                          <ArrowDownRight className="h-3 w-3" />
                          <span>-5%</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-md">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="market">Market Analysis</TabsTrigger>
                <TabsTrigger value="competition">Competition</TabsTrigger>
                <TabsTrigger value="growth">Growth Trends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                      <CardDescription>Monthly idea performance analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Bar chart visualization would go here
                        <BarChart3 className="ml-2 h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Industry Distribution</CardTitle>
                      <CardDescription>Breakdown by business sector</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Pie chart visualization would go here
                        <PieChart className="ml-2 h-5 w-5" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="market">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis</CardTitle>
                    <CardDescription>
                      In-depth analysis of market trends and opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-10">
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      Market analysis visualizations would go here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="competition">
                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Landscape</CardTitle>
                    <CardDescription>
                      Analysis of competitors and market positioning
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-10">
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      Competition analysis visualizations would go here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="growth">
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Projections</CardTitle>
                    <CardDescription>
                      Future growth forecasts and trend analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-10">
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                      Growth trend visualizations would go here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="border-dashed border-2 bg-background/50">
            <CardContent className="py-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-3">Enterprise Analytics</CardTitle>
              <CardDescription className="max-w-md mb-6">
                Unlock comprehensive business analytics, market insights, and competitive analysis with our Enterprise plan.
              </CardDescription>
              <div className="space-y-4 max-w-md mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm">In-depth market analysis and industry trends</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-1">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm">Competitive landscape visualization and positioning</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-1">
                    <PieChart className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-sm">Interactive dashboards and customizable reports</p>
                </div>
              </div>
              <Button onClick={handleUpgradeClick}>
                Upgrade to Enterprise Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;
