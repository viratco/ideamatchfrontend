import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save,
  Lightbulb, 
  Users, 
  BarChart3,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FormProgress from '@/components/FormProgress';
import Navbar from '@/components/Navbar';

// Define form schema with Zod
const formSchema = z.object({
  // Section 1: Basic Information
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  
  // Section 2: Target Audience
  targetAudience: z.string().min(5, { message: "Please describe your target audience" }),
  primaryUserAge: z.string().min(1, { message: "Please select a primary user age group" }),
  userLocation: z.string().min(1, { message: "Please select a location focus" }),
  
  // Section 3: Market Analysis
  marketPotential: z.enum(["Low", "Medium", "High"], { 
    required_error: "Please select the market potential" 
  }),
  competitionLevel: z.enum(["Low", "Medium", "High"], { 
    required_error: "Please select the competition level" 
  }),
  estimatedCost: z.string().min(1, { message: "Please select an estimated cost range" }),
  timeToMarket: z.string().min(1, { message: "Please select time to market" }),
});

type FormValues = z.infer<typeof formSchema>;

const sections = [
  {
    title: "Basics",
    description: "Idea information",
    icon: Lightbulb,
  },
  {
    title: "Audience",
    description: "Target users",
    icon: Users,
  },
  {
    title: "Market",
    description: "Business potential",
    icon: BarChart3,
  }
];

const IdeaForm: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [activeTab, setActiveTab] = useState("section1");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      targetAudience: "",
      primaryUserAge: "",
      userLocation: "",
      marketPotential: "Medium",
      competitionLevel: "Medium",
      estimatedCost: "",
      timeToMarket: "",
    },
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const sectionIndex = parseInt(value.replace("section", "")) - 1;
    setCurrentSection(sectionIndex);
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setActiveTab(`section${nextSection + 1}`);
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      setActiveTab(`section${prevSection + 1}`);
    }
  };

  const handleSectionClick = (index: number) => {
    if (index <= currentSection) {
      setCurrentSection(index);
      setActiveTab(`section${index + 1}`);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      console.log(data);
      // Save form data to localStorage
      localStorage.setItem('userPreferences', JSON.stringify({
        userType: 'startup',
        industries: ['tech', 'saas'],
        technicalSkills: ['web development', 'ai', 'cloud'],
        timeCommitment: data.timeToMarket,
        riskLevel: 'medium',
        challenges: ['market fit', 'competition'],
        budget: [10000, 50000],
        businessModel: data.category,
      }));
      
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit idea");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto pt-24 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Idea</h1>
          <p className="text-muted-foreground mt-1">
            Fill out the form below to submit your innovative idea.
          </p>
        </div>
        
        <FormProgress 
          sections={sections} 
          currentSection={currentSection} 
          onSectionClick={handleSectionClick}
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="section1" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Basics</span>
                </TabsTrigger>
                <TabsTrigger value="section2" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Audience</span>
                </TabsTrigger>
                <TabsTrigger value="section3" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Market</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Section 1: Basic Information */}
              <TabsContent value="section1">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Tell us about your idea. What is it called? What does it do?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idea Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a title for your idea" {...field} />
                          </FormControl>
                          <FormDescription>
                            A clear, concise name for your idea
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your idea in detail" 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Explain what your idea does, how it works, and what problem it solves
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2 justify-start"
                            >
                              <ToggleGroupItem value="technology" className="rounded-full">
                                Technology
                              </ToggleGroupItem>
                              <ToggleGroupItem value="health" className="rounded-full">
                                Health & Wellness
                              </ToggleGroupItem>
                              <ToggleGroupItem value="education" className="rounded-full">
                                Education
                              </ToggleGroupItem>
                              <ToggleGroupItem value="finance" className="rounded-full">
                                Finance
                              </ToggleGroupItem>
                              <ToggleGroupItem value="entertainment" className="rounded-full">
                                Entertainment
                              </ToggleGroupItem>
                              <ToggleGroupItem value="environment" className="rounded-full">
                                Environment
                              </ToggleGroupItem>
                              <ToggleGroupItem value="other" className="rounded-full">
                                Other
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            Choose the category that best fits your idea
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={goToNextSection}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Section 2: Target Audience */}
              <TabsContent value="section2">
                <Card>
                  <CardHeader>
                    <CardTitle>Target Audience</CardTitle>
                    <CardDescription>
                      Who will use your product or service?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the people who would use your product or service" 
                              className="min-h-24"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific about who your idea serves and why they need it
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="primaryUserAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary User Age Group</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2 justify-start"
                            >
                              <ToggleGroupItem value="children" className="rounded-full">
                                Children (0-12)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="teenagers" className="rounded-full">
                                Teenagers (13-17)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="youngAdults" className="rounded-full">
                                Young Adults (18-24)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="adults" className="rounded-full">
                                Adults (25-40)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="middleAged" className="rounded-full">
                                Middle-aged (41-60)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="seniors" className="rounded-full">
                                Seniors (60+)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="allAges" className="rounded-full">
                                All Ages
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            Which age group will primarily use your product?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="userLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geographic Focus</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2 justify-start"
                            >
                              <ToggleGroupItem value="local" className="rounded-full">
                                Local (City/Region)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="national" className="rounded-full">
                                National
                              </ToggleGroupItem>
                              <ToggleGroupItem value="continental" className="rounded-full">
                                Continental
                              </ToggleGroupItem>
                              <ToggleGroupItem value="global" className="rounded-full">
                                Global
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            What is the geographic scope of your idea?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPrevSection}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button 
                      type="button" 
                      onClick={goToNextSection}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Section 3: Market Analysis */}
              <TabsContent value="section3">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Analysis</CardTitle>
                    <CardDescription>
                      Analyze the business potential and market details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="marketPotential"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Market Potential</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex gap-2 justify-start"
                            >
                              <ToggleGroupItem value="Low" className="rounded-full">
                                Low
                              </ToggleGroupItem>
                              <ToggleGroupItem value="Medium" className="rounded-full">
                                Medium
                              </ToggleGroupItem>
                              <ToggleGroupItem value="High" className="rounded-full">
                                High
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            How large is the potential market for your idea?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="competitionLevel"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Competition Level</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex gap-2 justify-start"
                            >
                              <ToggleGroupItem value="Low" className="rounded-full">
                                Low
                              </ToggleGroupItem>
                              <ToggleGroupItem value="Medium" className="rounded-full">
                                Medium
                              </ToggleGroupItem>
                              <ToggleGroupItem value="High" className="rounded-full">
                                High
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            How much competition exists in this space?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="estimatedCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Development Cost</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2 justify-start"
                            >
                              <ToggleGroupItem value="low" className="rounded-full">
                                Low ($0-$10,000)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="medium" className="rounded-full">
                                Medium ($10,000-$50,000)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="high" className="rounded-full">
                                High ($50,000-$200,000)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="enterprise" className="rounded-full">
                                Enterprise ($200,000+)
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            How much would it cost to develop this idea?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeToMarket"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time to Market</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-wrap gap-2 justify-start"
                            >
                              <ToggleGroupItem value="immediate" className="rounded-full">
                                Immediate (1-3 months)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="short" className="rounded-full">
                                Short-term (3-6 months)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="medium" className="rounded-full">
                                Medium-term (6-12 months)
                              </ToggleGroupItem>
                              <ToggleGroupItem value="long" className="rounded-full">
                                Long-term (1+ years)
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            How long would it take to bring this idea to market?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={goToPrevSection}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button 
                      type="submit"
                      className="flex items-center gap-2 min-w-[160px] justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Submit Idea
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default IdeaForm;
