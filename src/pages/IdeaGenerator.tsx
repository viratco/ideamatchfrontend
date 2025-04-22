import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  ArrowLeft, 
  ArrowRight, 
  Rocket,
  Lightbulb, 
  Users, 
  Clock,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import FormProgress from '@/components/FormProgress';
import Navbar from '@/components/Navbar';

import { generateBusinessIdea } from '@/services/openRouterService';

// Define form schema with Zod
const formSchema = z.object({
  // Section 1: Basic Info
  userType: z.string().min(1, { message: "Please select what best describes you" }),
  otherUserType: z.string().optional(),
  industries: z.array(z.string()).min(1, { message: "Please select at least one industry" }),
  technicalSkills: z.array(z.string()).optional(),
  
  // Section 2: Strengths & Challenges
  timeCommitment: z.string().min(1, { message: "Please select your time commitment" }),
  riskLevel: z.string().min(1, { message: "Please select your risk level" }),
  challenges: z.array(z.string()).optional(),
  
  // Section 3: Business Preferences
  businessModel: z.string().min(1, { message: "Please select your preferred business model" }),
  budget: z.array(z.number()),
  
  // Section 4: AI Customization
  suggestTrending: z.boolean().default(true),
  focusNiche: z.string().optional(),
  suggestCompetitors: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const sections = [
  {
    title: "Basic Info",
    description: "Your background",
    icon: Lightbulb,
  },
  {
    title: "Strengths",
    description: "Your abilities",
    icon: Users,
  },
  {
    title: "Business",
    description: "Your preferences",
    icon: BarChart3,
  },
  {
    title: "AI Setup",
    description: "Customization",
    icon: Rocket,
  }
];

interface Option {
  value: string;
  label: string;
  category: string;
}

const industries: Option[] = [
  // Technology & Software
  { value: "saas", label: "SaaS (Software as a Service)", category: "Technology" },
  { value: "ai", label: "Artificial Intelligence & ML", category: "Technology" },
  { value: "webdev", label: "Web Development", category: "Technology" },
  { value: "mobile", label: "Mobile Apps", category: "Technology" },
  { value: "cybersecurity", label: "Cybersecurity", category: "Technology" },
  { value: "cloud", label: "Cloud Services", category: "Technology" },
  
  // Financial & Business
  { value: "fintech", label: "Financial Technology", category: "Finance" },
  { value: "blockchain", label: "Blockchain & Crypto", category: "Finance" },
  { value: "investment", label: "Investment & Trading", category: "Finance" },
  { value: "insurtech", label: "Insurance Technology", category: "Finance" },
  
  // Healthcare & Wellness
  { value: "healthtech", label: "Healthcare Technology", category: "Healthcare" },
  { value: "mentalhealth", label: "Mental Health & Wellness", category: "Healthcare" },
  { value: "fitness", label: "Fitness & Sports Tech", category: "Healthcare" },
  { value: "biotech", label: "Biotech & Life Sciences", category: "Healthcare" },
  
  // E-commerce & Retail
  { value: "ecommerce", label: "E-commerce Platform", category: "Commerce" },
  { value: "marketplace", label: "Online Marketplace", category: "Commerce" },
  { value: "retail", label: "Retail Technology", category: "Commerce" },
  { value: "subscription", label: "Subscription Services", category: "Commerce" },
  
  // Entertainment & Media
  { value: "gaming", label: "Gaming & Esports", category: "Entertainment" },
  { value: "streaming", label: "Streaming Services", category: "Entertainment" },
  { value: "content", label: "Content Creation", category: "Entertainment" },
  { value: "social", label: "Social Media", category: "Entertainment" },
  
  // Other Industries
  { value: "edtech", label: "Education Technology", category: "Education" },
  { value: "cleantech", label: "Clean Technology", category: "Sustainability" },
  { value: "iot", label: "Internet of Things", category: "Technology" },
  { value: "local", label: "Local Services", category: "Services" },
];

const technicalSkills: Option[] = [
  // Development
  { value: "frontend", label: "Frontend Development", category: "Development" },
  { value: "backend", label: "Backend Development", category: "Development" },
  { value: "mobile", label: "Mobile Development", category: "Development" },
  { value: "ai_ml", label: "AI/ML Development", category: "Development" },
  { value: "devops", label: "DevOps & Infrastructure", category: "Development" },
  
  // Design
  { value: "ui_design", label: "UI Design", category: "Design" },
  { value: "ux_design", label: "UX Design", category: "Design" },
  { value: "graphic_design", label: "Graphic Design", category: "Design" },
  { value: "product_design", label: "Product Design", category: "Design" },
  
  // Marketing
  { value: "digital_marketing", label: "Digital Marketing", category: "Marketing" },
  { value: "content_marketing", label: "Content Marketing", category: "Marketing" },
  { value: "seo", label: "SEO & Analytics", category: "Marketing" },
  { value: "social_media", label: "Social Media Marketing", category: "Marketing" },
  
  // Business
  { value: "product_management", label: "Product Management", category: "Business" },
  { value: "business_strategy", label: "Business Strategy", category: "Business" },
  { value: "finance", label: "Finance & Accounting", category: "Business" },
  { value: "operations", label: "Operations Management", category: "Business" },
  
  // Sales
  { value: "sales_management", label: "Sales Management", category: "Sales" },
  { value: "business_development", label: "Business Development", category: "Sales" },
  { value: "account_management", label: "Account Management", category: "Sales" },
  { value: "customer_success", label: "Customer Success", category: "Sales" },
  
  // Other
  { value: "data_analysis", label: "Data Analysis", category: "Analytics" },
  { value: "project_management", label: "Project Management", category: "Management" },
  { value: "none", label: "No Technical Skills", category: "Other" },
];

const industryCategories = Array.from(new Set(industries.map(i => i.category)));
const skillCategories = Array.from(new Set(technicalSkills.map(s => s.category)));

const IdeaGenerator: React.FC = () => {
  const [selectedIndustryCategory, setSelectedIndustryCategory] = useState<string>(industryCategories[0]);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>(skillCategories[0]);
  const [currentSection, setCurrentSection] = useState(0);
  const [activeTab, setActiveTab] = useState("section1");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "",
      otherUserType: "",
      industries: [],
      technicalSkills: [],
      timeCommitment: "",
      riskLevel: "medium",
      challenges: [],
      businessModel: "",
      budget: [0],
      suggestTrending: true,
      focusNiche: "",
      suggestCompetitors: true,
    },
  });

  // Watch form values to update UI
  const userType = form.watch("userType");
  const riskLevel = form.watch("riskLevel");
  
  // Update UI based on selections
  React.useEffect(() => {
    setShowOtherInput(userType === "other");
  }, [userType]);

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
      const generatedIdea = await generateBusinessIdea({
        userType: data.userType,
        industries: data.industries,
        technicalSkills: data.technicalSkills || [],
        timeCommitment: data.timeCommitment,
        riskLevel: data.riskLevel,
        challenges: data.challenges || [],
        businessModel: data.businessModel,
        budget: data.budget,
        suggestTrending: data.suggestTrending,
        focusNiche: data.focusNiche,
        suggestCompetitors: data.suggestCompetitors
      });

      // Store the generated idea and form data in localStorage
      localStorage.setItem('generatedIdea', JSON.stringify({
        timestamp: new Date().toISOString(),
        idea: generatedIdea,
        formData: data
      }));

      // Store user preferences for future use
      localStorage.setItem('userPreferences', JSON.stringify(data));

      navigate("/dashboard");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to generate business idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Budget formatter
  const formatBudget = (value: number) => {
    if (value === 0) return "$0 (Bootstrap)";
    if (value <= 5000) return `$${(value/1000).toFixed(0)}K`;
    if (value <= 10000) return `$${(value/1000).toFixed(0)}K`;
    return "$10K+";
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="container max-w-4xl mx-auto pt-24 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Generate Business Idea</h1>
          <p className="text-muted-foreground mt-1">
            Let AI help you find the perfect business idea tailored to your skills and preferences.
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
              <TabsList className="grid grid-cols-4 mb-8">
                {sections.map((section, index) => (
                  <TabsTrigger 
                    key={`section${index + 1}`}
                    value={`section${index + 1}`} 
                    className="flex items-center gap-2"
                  >
                    {React.createElement(section.icon, { className: "h-4 w-4" })}
                    <span className="hidden sm:inline">{section.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="section1">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Tell us about your background and interests.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What best describes you?</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-wrap justify-start gap-2"
                            >
                              <ToggleGroupItem value="student" className="rounded-full">
                                Student
                              </ToggleGroupItem>
                              <ToggleGroupItem value="employee" className="rounded-full">
                                Employee
                              </ToggleGroupItem>
                              <ToggleGroupItem value="freelancer" className="rounded-full">
                                Freelancer
                              </ToggleGroupItem>
                              <ToggleGroupItem value="business_owner" className="rounded-full">
                                Business Owner
                              </ToggleGroupItem>
                              <ToggleGroupItem value="other" className="rounded-full">
                                Other
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {showOtherInput && (
                      <FormField
                        control={form.control}
                        name="otherUserType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Please specify:</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your occupation" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="industries"
                      render={({ field }) => (
                        <FormItem className="space-y-6">
                          <div>
                            <FormLabel className="text-lg font-semibold">What industry are you most interested in? (Multi-select)</FormLabel>
                            <FormDescription className="text-sm text-muted-foreground mt-1">
                              Select one or more industries you'd like to focus on
                            </FormDescription>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {industryCategories.map(category => (
                              <div key={category} className="space-y-3 bg-card p-4 rounded-lg border shadow-sm">
                                <h4 className="font-medium text-primary">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {industries
                                    .filter(industry => industry.category === category)
                                    .map((industry) => (
                                      <Badge
                                        key={industry.value}
                                        variant={field.value?.includes(industry.value) ? "default" : "outline"}
                                        className={`cursor-pointer hover:bg-primary/90 transition-colors ${
                                          field.value?.includes(industry.value) ? '' : 'hover:text-primary'
                                        }`}
                                        onClick={() => {
                                          const newValue = field.value?.includes(industry.value)
                                            ? field.value.filter(v => v !== industry.value)
                                            : [...(field.value || []), industry.value];
                                          field.onChange(newValue);
                                        }}
                                      >
                                        {field.value?.includes(industry.value) && (
                                          <CheckCircle2 className="mr-1 h-3 w-3" />
                                        )}
                                        {industry.label}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="technicalSkills"
                      render={({ field }) => (
                        <FormItem className="space-y-6">
                          <div>
                            <FormLabel className="text-lg font-semibold">Do you have any technical skills? (Multi-select or Skip)</FormLabel>
                            <FormDescription className="text-sm text-muted-foreground mt-1">
                              Select all skills that apply to you
                            </FormDescription>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {skillCategories.map(category => (
                              <div key={category} className="space-y-3 bg-card p-4 rounded-lg border shadow-sm">
                                <h4 className="font-medium text-primary">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {technicalSkills
                                    .filter(skill => skill.category === category)
                                    .map((skill) => (
                                      <Badge
                                        key={skill.value}
                                        variant={field.value?.includes(skill.value) ? "default" : "outline"}
                                        className={`cursor-pointer hover:bg-primary/90 transition-colors ${
                                          field.value?.includes(skill.value) ? '' : 'hover:text-primary'
                                        }`}
                                        onClick={() => {
                                          const newValue = field.value?.includes(skill.value)
                                            ? field.value.filter(v => v !== skill.value)
                                            : [...(field.value || []), skill.value];
                                          field.onChange(newValue);
                                        }}
                                      >
                                        {field.value?.includes(skill.value) && (
                                          <CheckCircle2 className="mr-1 h-3 w-3" />
                                        )}
                                        {skill.label}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                            ))}
                          </div>
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
              
              {/* Section 2: Strengths & Challenges */}
              <TabsContent value="section2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Strengths & Challenges</CardTitle>
                    <CardDescription>
                      Help us understand what you're good at and where you need help
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <FormField
                      control={form.control}
                      name="timeCommitment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How much time can you dedicate to a business?</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {[
                                { id: "side_hustle", label: "1-2 hours/day (Side hustle)", icon: <Clock className="h-4 w-4 mr-2" /> },
                                { id: "part_time", label: "3-5 hours/day", icon: <Clock className="h-4 w-4 mr-2" /> },
                                { id: "full_time", label: "Full-time (I'm all in!)", icon: <Clock className="h-4 w-4 mr-2" /> },
                              ].map((option) => (
                                <div
                                  key={option.id}
                                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${
                                    field.value === option.id
                                      ? "bg-primary/10 border-primary"
                                      : "hover:bg-muted border-input"
                                  }`}
                                  onClick={() => field.onChange(option.id)}
                                >
                                  <div className="flex items-center">
                                    {option.icon}
                                    <span>{option.label}</span>
                                  </div>
                                  {field.value === option.id && (
                                    <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Select the time commitment that best fits your schedule
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="riskLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What's your risk level?</FormLabel>
                          <FormControl>
                            <ToggleGroup 
                              type="single" 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex justify-between gap-2"
                            >
                              <ToggleGroupItem 
                                value="low" 
                                className="rounded-full bg-green-100 data-[state=on]:bg-green-500 data-[state=on]:text-white flex-1"
                              >
                                🟢 Low (Safe & steady)
                              </ToggleGroupItem>
                              <ToggleGroupItem 
                                value="medium" 
                                className="rounded-full bg-yellow-100 data-[state=on]:bg-yellow-500 data-[state=on]:text-white flex-1"
                              >
                                🟡 Medium (Balanced)
                              </ToggleGroupItem>
                              <ToggleGroupItem 
                                value="high" 
                                className="rounded-full bg-red-100 data-[state=on]:bg-red-500 data-[state=on]:text-white flex-1"
                              >
                                🔴 High (Go big!)
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription>
                            How much risk are you willing to take?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="challenges"
                      render={() => (
                        <FormItem>
                          <FormLabel>What's your biggest challenge in starting a business? (Multi-select, optional)</FormLabel>
                          <div className="space-y-4">
                            {[
                              { id: "no_funding", label: "No funding", color: "bg-red-500" },
                              { id: "lack_time", label: "Lack of time", color: "bg-orange-500" },
                              { id: "no_idea", label: "No idea what to build", color: "bg-blue-500" },
                              { id: "no_customers", label: "Don't know how to get customers", color: "bg-purple-500" },
                              { id: "need_team", label: "Need a co-founder/team", color: "bg-teal-500" },
                            ].map((challenge) => (
                              <FormField
                                key={challenge.id}
                                control={form.control}
                                name="challenges"
                                render={({ field }) => {
                                  return (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`challenge-${challenge.id}`}
                                        checked={field.value?.includes(challenge.id)}
                                        onCheckedChange={(checked) => {
                                          const updated = checked
                                            ? [...field.value || [], challenge.id]
                                            : field.value?.filter((value) => value !== challenge.id) || [];
                                          field.onChange(updated);
                                        }}
                                      />
                                      <label
                                        htmlFor={`challenge-${challenge.id}`}
                                        className="flex items-center text-sm font-medium leading-none cursor-pointer"
                                      >
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${challenge.color}`}></span>
                                        {challenge.label}
                                      </label>
                                    </div>
                                  )
                                }}
                              />
                            ))}
                          </div>
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
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
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
              
              {/* Section 3: Business Preferences */}
              <TabsContent value="section3">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Preferences & Budget</CardTitle>
                    <CardDescription>
                      Let us know your business model and budget preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <FormField
                      control={form.control}
                      name="businessModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you prefer selling products, services, or automation?</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {[
                                { id: "product", label: "🏗️ Build & sell a product (Software, AI tool, etc.)" },
                                { id: "service", label: "💼 Offer a service (Freelancing, Consulting, Agency)" },
                                { id: "automation", label: "🤖 Automate & earn passively (AI-driven SaaS, Affiliate marketing, etc.)" },
                              ].map((option) => (
                                <div
                                  key={option.id}
                                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-all ${
                                    field.value === option.id
                                      ? "bg-primary/10 border-primary"
                                      : "hover:bg-muted border-input"
                                  }`}
                                  onClick={() => field.onChange(option.id)}
                                >
                                  <span>{option.label}</span>
                                  {field.value === option.id && (
                                    <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you have an initial budget?</FormLabel>
                          <FormControl>
                            <div className="space-y-6">
                              <Slider
                                defaultValue={[0]}
                                max={10000}
                                step={1000}
                                onValueChange={field.onChange}
                                value={field.value}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>$0 (Bootstrap)</span>
                                <span>$5K</span>
                                <span>$10K+</span>
                              </div>
                              <div className="text-center font-medium">
                                Selected: {formatBudget(field.value[0])}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Drag the slider to indicate your budget range
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
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>
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
              
              {/* Section 4: AI Customization */}
              <TabsContent value="section4">
                <Card>
                  <CardHeader>
                    <CardTitle>Final AI Customization</CardTitle>
                    <CardDescription>
                      Fine-tune how AI should generate your business idea
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="suggestTrending"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Suggest trending but less competitive ideas
                            </FormLabel>
                            <FormDescription>
                              The AI will focus on emerging trends with less competition
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="focusNiche"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Would you like AI to focus on a specific niche?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., AI-powered productivity tools (leave empty to let AI decide)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a specific niche or leave empty to let the AI decide
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="suggestCompetitors"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Suggest competitors & how to stand out
                            </FormLabel>
                            <FormDescription>
                              The AI will research competitors and suggest ways to differentiate
                            </FormDescription>
                          </div>
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
                      className="flex items-center gap-2 min-w-[200px] justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating Idea...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4" />
                          Generate Business Idea
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
export default IdeaGenerator;
