import React, { useEffect, useState, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Users, BrainCircuit, Star, Lightbulb, CheckCircle, 
  Shield, MessageSquare, DollarSign, Rocket, Layers, PieChart, Target, Award, TrendingUp, 
  ArrowUpRight, ChevronRight, Play, Codesandbox, Globe, Database, Cpu, Hexagon, Diamond,
  Circle, Square, Triangle, Cloud, Sun, Moon, X, Plus, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeBrand, setActiveBrand] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRefs = useRef<HTMLElement[]>([]);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  // Anime.js animation on mount
  useEffect(() => {
    // Animate all immediate children of the page container
    if (containerRef.current) {
      import('@/utils/animePageMount').then(({ animatePageChildren }) => {
        animatePageChildren(containerRef.current!);
      });
    }
    // Animate headline and CTA for extra emphasis
    if (headlineRef.current) {
      // @ts-ignore
      anime({
        targets: headlineRef.current,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 200,
      });
    }
    if (ctaRef.current) {
      // @ts-ignore
      anime({
        targets: ctaRef.current,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 1000,
        easing: 'easeOutBack',
        delay: 600,
        complete: () => {
          // Pulse animation
          anime({
            targets: ctaRef.current,
            scale: [1, 1.08, 1],
            duration: 1400,
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate',
            delay: 0
          });
        }
      });
    }
    // Animate testimonials on scroll into view
    if (testimonialsRef.current) {
      const testimonials = testimonialsRef.current.querySelectorAll('.testimonial-card');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 900,
              delay: idx * 120,
              easing: 'easeOutExpo',
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      testimonials.forEach(card => {
        (card as HTMLElement).style.opacity = '0';
        observer.observe(card);
      });
    }
    // Animate pricing cards on mount
    if (pricingRef.current) {
      const pricingCards = pricingRef.current.querySelectorAll('.pricing-card');
      anime({
        targets: pricingCards,
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 900,
        delay: anime.stagger(180),
        easing: 'easeOutBack',
      });
    }
    // Animate brand logos with floating effect
    if (brandsRef.current) {
      const logos = brandsRef.current.querySelectorAll('.brand-logo');
      logos.forEach((logo, i) => {
        anime({
          targets: logo,
          translateY: [0, -8, 0],
          duration: 2400 + i * 200,
          delay: i * 100,
          loop: true,
          easing: 'easeInOutSine',
          direction: 'alternate',
        });
      });
    }
  }, []);

  // Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    const elements = document.querySelectorAll('.scroll-fade-in, .scroll-scale-in');
    elements.forEach(el => {
      observer.observe(el);
      scrollAnimationRefs.current.push(el as HTMLElement);
    });
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const brandTimer = setInterval(() => {
      setActiveBrand((prev) => (prev + 1) % 6);
    }, 3000);

    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(brandTimer);
      clearInterval(testimonialTimer);
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Founder, TechStart",
      content: "IdeaMatch transformed how we approach innovation. We've launched two successful products based on their AI suggestions!",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Solo Entrepreneur",
      content: "As a solo founder, having IdeaMatch feels like having a co-founder who's available 24/7. Game changer for my business.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Innovation Director, EnterpriseX",
      content: "The market analysis that comes with each idea has saved us countless hours of research. The ROI is undeniable.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      rating: 5
    },
    {
      name: "David Miller",
      role: "CEO, FutureScale",
      content: "We scaled our startup from zero to Series A in just 18 months using IdeaMatch's recommendations and co-founder matching.",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      rating: 5
    },
    {
      name: "Sophia Garcia",
      role: "Head of Product, Nexus",
      content: "The quality of business ideas we get from IdeaMatch exceeds what we'd brainstorm internally. It's become our innovation engine.",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      rating: 5
    }
  ];

  const brands = [
    "TechCrunch", "Forbes", "Entrepreneur", "Business Insider", "VentureBeat", "Inc."
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for individual entrepreneurs",
      features: [
        "5 AI-generated ideas per month",
        "Basic market analysis",
        "Email support",
        "1 user"
      ],
      button: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$29",
      description: "Ideal for startups and small teams",
      features: [
        "20 AI-generated ideas per month",
        "Advanced market analysis",
        "Priority email support",
        "3 users",
        "Co-founder matching",
        "Business plan generation"
      ],
      button: "Get Started",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$99",
      description: "For established businesses and teams",
      features: [
        "Unlimited AI-generated ideas",
        "Comprehensive market analysis",
        "24/7 priority support",
        "10+ users",
        "Co-founder matching",
        "Business plan generation",
        "Custom integrations",
        "Dedicated account manager"
      ],
      button: "Contact Sales",
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: "How does IdeaMatch generate business ideas?",
      answer: "IdeaMatch uses advanced AI algorithms to analyze market trends, your skills, interests, and resources to generate personalized business ideas with the highest potential for success. Each idea comes with market analysis and execution plans."
    },
    {
      question: "Can I customize the types of ideas I receive?",
      answer: "Absolutely! During onboarding, you'll complete a comprehensive profile that helps our AI understand your preferences, skills, and resources. You can also set industry preferences and investment capacity."
    },
    {
      question: "How accurate is the market analysis?",
      answer: "Our market analysis draws from multiple data sources including industry reports, consumer trends, and competitive landscapes. While no analysis can predict with 100% certainty, our users report high confidence in the insights provided."
    },
    {
      question: "Can I collaborate with others on the platform?",
      answer: "Yes! Our Co-founder Matching feature helps connect you with potential partners who have complementary skills. You can share ideas, collaborate on business plans, and build your startup team all within the platform."
    },
    {
      question: "Is there a limit to how many ideas I can generate?",
      answer: "The number of ideas you can generate depends on your subscription plan. Our Starter plan includes 5 ideas per month, Pro offers 20, and Enterprise provides unlimited idea generation."
    },
    {
      question: "What if I'm not satisfied with the ideas generated?",
      answer: "We offer a 14-day money-back guarantee if you're not satisfied with the quality of ideas. Additionally, you can refine your profile and preferences at any time to receive more tailored suggestions."
    }
  ];

  const caseStudies = [
    {
      company: "HealthTech Innovations",
      logo: "https://randomuser.me/api/portraits/women/11.jpg",
      description: "Healthcare startup that used IdeaMatch to identify underserved markets",
      results: "Secured $2.5M seed funding within 6 months",
      industry: "Healthcare"
    },
    {
      company: "EcoSolutions",
      logo: "https://randomuser.me/api/portraits/men/12.jpg",
      description: "Sustainable products company that pivoted based on IdeaMatch analysis",
      results: "Achieved 300% growth in first year after pivot",
      industry: "Sustainability"
    },
    {
      company: "EdTech Pioneers",
      logo: "https://randomuser.me/api/portraits/women/13.jpg",
      description: "Education platform that found its niche through IdeaMatch insights",
      results: "Reached 100,000 users in just 8 months",
      industry: "Education"
    }
  ];

  const features = [
    {
      title: "AI-Powered Ideation",
      description: "Generate unique business ideas tailored to your skills and interests",
      icon: <BrainCircuit className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-xl" />
    },
    {
      title: "Market Analysis",
      description: "Get comprehensive market insights and competitive landscape analysis",
      icon: <PieChart className="h-10 w-10 text-blue-500 p-2 bg-blue-500/10 rounded-xl" />
    },
    {
      title: "SWOT Analysis",
      description: "Analyze strengths, weaknesses, opportunities, and threats for your business",
      icon: <Users className="h-10 w-10 text-purple-500 p-2 bg-purple-500/10 rounded-xl" />
    },
    {
      title: "Business Plan Generator",
      description: "Create comprehensive business plans based on AI recommendations",
      icon: <Layers className="h-10 w-10 text-green-500 p-2 bg-green-500/10 rounded-xl" />
    },
    {
      title: "Revenue Projections",
      description: "Get data-driven revenue forecasts and financial planning tools",
      icon: <TrendingUp className="h-10 w-10 text-amber-500 p-2 bg-amber-500/10 rounded-xl" />
    },
    {
      title: "Risk Assessment",
      description: "Identify potential challenges and develop mitigation strategies",
      icon: <Shield className="h-10 w-10 text-red-500 p-2 bg-red-500/10 rounded-xl" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden" ref={containerRef}>
      {/* Enhanced Background Elements with more watermarks */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-pulse-soft"></div>
        <div className="absolute top-60 right-10 w-96 h-96 bg-blue-300/20 rounded-full filter blur-3xl opacity-40 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-pink-300/20 rounded-full filter blur-3xl opacity-30 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
        
        {/* NEW: Additional Watermarks */}
        <div className="absolute inset-0 watermark-pattern watermark-dots text-primary opacity-[0.015]"></div>
        <div className="absolute top-[20%] right-0 bottom-0 left-[60%] watermark-pattern watermark-circles text-blue-500 opacity-[0.02]"></div>
        <div className="absolute top-[60%] right-[60%] bottom-0 left-0 watermark-pattern watermark-grid opacity-[0.03]"></div>
        
        {/* Additional Decorative Elements */}
        <div className="hidden lg:block absolute top-[10%] left-[8%] text-primary/5 transform rotate-12 animate-float-slow">
          <Hexagon size={220} />
        </div>
        <div className="hidden lg:block absolute bottom-[15%] right-[12%] text-blue-500/5 transform -rotate-12 animate-float" style={{ animationDelay: '1.5s' }}>
          <Circle size={180} />
        </div>
        <div className="hidden lg:block absolute top-[40%] right-[7%] text-purple-500/5 animate-float-slow" style={{ animationDelay: '3s' }}>
          <Triangle size={160} />
        </div>
        <div className="hidden lg:block absolute bottom-[40%] left-[7%] text-green-500/5 animate-float-fast" style={{ animationDelay: '2s' }}>
          <Square size={140} />
        </div>
        <div className="hidden lg:block absolute top-[25%] left-[25%] text-amber-500/5 animate-float-slow">
          <Cloud size={200} />
        </div>
        <div className="hidden lg:block absolute top-[70%] right-[20%] text-red-500/5 animate-float-fast" style={{ animationDelay: '1s' }}>
          <Sun size={120} />
        </div>
        <div className="hidden lg:block absolute top-[15%] right-[25%] text-indigo-500/5 animate-float-slow" style={{ animationDelay: '4s' }}>
          <Moon size={100} />
        </div>
        
        {/* Small decorative shapes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="hidden lg:block absolute text-primary/5 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            {i % 5 === 0 ? <Plus size={15} /> : 
             i % 5 === 1 ? <X size={15} /> : 
             i % 5 === 2 ? <Hash size={15} /> : 
             i % 5 === 3 ? <Circle size={15} /> : 
             <Square size={15} />}
          </div>
        ))}
      </div>

      {/* Navbar - enhanced with smoother transitions */}
      <nav 
        className={`w-full px-4 sm:px-6 py-4 fixed top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">IdeaMatch</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-foreground/80 hover:text-foreground underline-animation">Features</Link>
            <Link to="#pricing" className="text-foreground/80 hover:text-foreground underline-animation">Pricing</Link>
            <Link to="#testimonials" className="text-foreground/80 hover:text-foreground underline-animation">Testimonials</Link>
            <Link to="#case-studies" className="text-foreground/80 hover:text-foreground underline-animation">Case Studies</Link>
            <Link to="#faq" className="text-foreground/80 hover:text-foreground underline-animation">FAQ</Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/sign-in" className="text-foreground/80 hover:text-foreground underline-animation hidden sm:inline-block">
              Sign In
            </Link>
            <Link to="/sign-up">
              <Button className="bg-primary/90 text-white rounded-full px-5 py-2 hover:shadow-lg hover:bg-primary transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - enhanced with smoother animations */}
      <section className="relative z-10 pt-32 pb-16 px-4 sm:px-6 container mx-auto">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-3xl mx-auto"
        >
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={0}
            className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          >
            <span className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-powered business idea generator
            </span>
          </motion.div>
          
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
          >
            Your AI Co-Founder for
            <span className="relative">
              <span className="relative z-10 text-primary ml-2">Groundbreaking Ideas</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 rounded-full -z-10 transform -rotate-1"></span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={2}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Get personalized, AI-generated business ideas tailored to your skills, interests, and goals. Let us help you find your next big thing.
          </motion.p>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/sign-up">
              <Button className="relative overflow-hidden bg-primary text-white rounded-full px-8 py-6 text-lg hover:shadow-lg hover:bg-primary/90 transition-all duration-300 w-full sm:w-auto group">
                <span className="relative z-10 flex items-center">
                  Generate Ideas 
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
            </Link>
            <Link to="/sign-in">
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 w-full sm:w-auto hover:bg-secondary/50 transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </motion.div>
          
          {/* Video Preview Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={4}
            className="mt-8 flex justify-center"
          >
            <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-primary ml-1" />
              </div>
              <span>Watch how it works</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="hidden md:block absolute -right-16 top-1/4 text-primary/10 transform rotate-12 animate-float-slow">
          <Lightbulb size={120} />
        </div>
        <div className="hidden md:block absolute -left-16 bottom-10 text-primary/10 transform -rotate-12 animate-float-fast" style={{ animationDelay: '1.5s' }}>
          <Star size={80} />
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="relative z-10 py-10 bg-secondary/50 dark:bg-gray-800/30 scroll-fade-in">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">Trusted by innovative teams worldwide</p>
          </div>
          <div className="flex justify-around items-center flex-wrap">
            {brands.map((brand, index) => (
              <motion.div 
                key={brand}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: index === activeBrand ? 1 : 0.4 }}
                transition={{ duration: 0.5 }}
                className="px-4 py-2"
              >
                <p className="text-xl md:text-2xl font-serif font-bold text-muted-foreground">
                  {brand}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm px-4 py-1.5">
              <span className="text-muted-foreground text-xs font-medium">Serving 5,000+ entrepreneurs worldwide</span>
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 container mx-auto">
        <div className="text-center mb-12 scroll-fade-in">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4 inline-block"
          >
            <span className="relative">
              Why Choose IdeaMatch
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Our intelligent platform unlocks business opportunities tailored just for you
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 bg-primary/10 rounded-full"></div>
              <div className="mb-4 relative">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Tab Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 container mx-auto bg-gradient-to-b from-transparent to-secondary/30 dark:from-transparent dark:to-gray-800/30 rounded-3xl">
        <div className="text-center mb-12 scroll-fade-in">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4"
          >
            <span className="relative">
              How IdeaMatch Works
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            From concept to execution, we guide you every step of the way
          </motion.p>
        </div>

        <Tabs defaultValue="ideation" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 w-full mb-8">
            <TabsTrigger value="ideation" className="text-sm sm:text-base py-3">1. Ideation</TabsTrigger>
            <TabsTrigger value="analysis" className="text-sm sm:text-base py-3">2. Analysis</TabsTrigger>
            <TabsTrigger value="execution" className="text-sm sm:text-base py-3">3. Business Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ideation" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4">Share Your Profile & Get Personalized Ideas</h3>
                <p className="text-muted-foreground mb-6">Our AI analyzes your skills, interests, and resources to generate business ideas with the highest potential for success.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Complete your entrepreneur profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Specify your industry preferences</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Set your investment capacity</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              >
                <div className="aspect-video rounded-lg bg-secondary/50 flex items-center justify-center">
                  <BrainCircuit size={80} className="text-primary/50" />
                </div>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg order-last md:order-first"
              >
                <div className="aspect-video rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <PieChart size={80} className="text-blue-500/50" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-4">Comprehensive Market Analysis</h3>
                <p className="text-muted-foreground mb-6">Each idea comes with detailed market insights, competitive analysis, and potential growth projections.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Market size and growth potential</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Competitive landscape analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Revenue model recommendations</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </TabsContent>
          
          <TabsContent value="execution" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4">From Idea to Business Plan</h3>
                <p className="text-muted-foreground mb-6">From idea to business plan, we guide you every step of the way.</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Get personalized guidance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Deep-dive into market analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Generate business plan and pitch deck</span>
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
              >
                <div className="aspect-video rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Rocket size={80} className="text-purple-500/50" />
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">10k+</h3>
            <p className="text-muted-foreground">Ideas Generated</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">85%</h3>
            <p className="text-muted-foreground">Success Rate</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">5k+</h3>
            <p className="text-muted-foreground">Happy Users</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-green-500 mb-2">$12M</h3>
            <p className="text-muted-foreground">Funding Secured</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section id="testimonials" className="relative z-10 py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-secondary/30 dark:from-gray-900 dark:to-gray-800/30 rounded-3xl">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              <span className="relative">
                What Our Users Say
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Success stories from entrepreneurs using IdeaMatch
            </motion.p>
          </div>
          
          <div className="max-w-3xl mx-auto relative">
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
              >
                <div className="relative">
                  <div className="text-primary/20 absolute -top-4 -left-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11.0933 4.46621L7.8467 7.12954C7.20003 7.63288 6.73336 8.23288 6.44003 8.93288C6.16003 9.61288 6.0267 10.346 6.0267 11.1129C6.0267 11.7462 6.14003 12.3796 6.36003 12.9662C6.58003 13.5529 6.90003 14.0996 7.32003 14.6062L8.90003 16.6062C9.18003 16.9529 9.56003 17.1396 9.9467 17.1396C10.32 17.1396 10.6533 17.0262 10.94 16.8129C11.2267 16.5862 11.4533 16.2929 11.6 15.9329C11.76 15.5729 11.7867 15.1862 11.6933 14.7662C11.6133 14.3462 11.3867 13.9796 11.0133 13.6596L10.68 13.3662C10.5067 13.1929 10.3733 12.9929 10.28 12.7662C10.1867 12.5396 10.1467 12.2996 10.1467 12.0462C10.1467 11.7262 10.2267 11.4262 10.3733 11.1396C10.5333 10.8396 10.7333 10.5996 10.9733 10.4062L13.8267 8.03954C14.2 7.71954 14.6267 7.55954 15.0933 7.55954C15.4 7.55954 15.6933 7.63954 15.9733 7.79954C16.2533 7.94621 16.5 8.15954 16.7 8.43954L17.08 8.90621C17.4667 9.38621 17.94 9.63954 18.5133 9.63954C18.7933 9.63954 19.0533 9.57288 19.3 9.43954C19.5467 9.29288 19.7533 9.10621 19.8933 8.87288C20.0467 8.62621 20.1267 8.35954 20.14 8.07288C20.1533 7.77288 20.0867 7.49288 19.9467 7.23954L19.5333 6.67288C19.1067 6.10621 18.5933 5.62621 18.0 5.24621C17.4067 4.86621 16.78 4.58621 16.1267 4.42621C15.4733 4.24621 14.82 4.17288 14.1667 4.17288C13.5133 4.17288 12.9 4.24621 12.3333 4.39288C11.78 4.53954 11.42 4.45288 11.0933 4.46621Z"></path><path d="M2.07326 7.23954L1.65992 6.67288C1.23326 6.10621 0.719922 5.62621 0.126589 5.24621C-0.466744 4.86621 -1.09341 4.58621 -1.74675 4.42621C-2.40008 4.24621 -3.05341 4.17288 -3.70675 4.17288C-4.36008 4.17288 -4.97341 4.24621 -5.54008 4.39288C-6.09341 4.53954 -6.45341 4.45288 -6.78008 4.46621L-10.0267 7.12954C-10.6734 7.63288 -11.14 8.23288 -11.4334 8.93288C-11.7134 9.61288 -11.8467 10.346 -11.8467 11.1129C-11.8467 11.7462 -11.7334 12.3796 -11.5134 12.9662C-11.2934 13.5529 -10.9734 14.0996 -10.5534 14.6062L-8.97341 16.6062C-8.69341 16.9529 -8.31341 17.1396 -7.92675 17.1396C-7.55341 17.1396 -7.22008 17.0262 -6.93341 16.8129C-6.64675 16.5862 -6.42008 16.2929 -6.27341 15.9329C-6.11341 15.5729 -6.08675 15.1862 -6.18008 14.7662C-6.26008 14.3462 -6.48675 13.9796 -6.86008 13.6596L-7.19341 13.3662C-7.36675 13.1929 -7.50008 12.9929 -7.59341 12.7662C-7.68675 12.5396 -7.72675 12.2996 -7.72675 12.0462C-7.72675 11.7262 -7.64675 11.4262 -7.50008 11.1396C-7.34008 10.8396 -7.14008 10.5996 -6.90008 10.4062L-4.04675 8.03954C-3.67341 7.71954 -3.24675 7.55954 -2.78008 7.55954C-2.47341 7.55954 -2.18008 7.63954 -1.90008 7.79954C-1.62008 7.94621 -1.37341 8.15954 -1.17341 8.43954L-0.793411 8.90621C-0.406745 9.38621 0.0666221 9.63954 0.639955 9.63954C0.919955 9.63954 1.17992 9.57288 1.42659 9.43954C1.67326 9.29288 1.87992 9.10621 2.01992 8.87288C2.17326 8.62621 2.25326 8.35954 2.26659 8.07288C2.27992 7.77288 2.21326 7.49288 2.07326 7.23954Z"></path></svg>
                  </div>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-14 w-14 border-2 border-primary mr-4">
                      <AvatarImage src={testimonials[activeTestimonial].avatar} alt={testimonials[activeTestimonial].name} />
                      <AvatarFallback>{testimonials[activeTestimonial].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-semibold">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                    </div>
                  </div>
                  <p className="text-xl text-muted-foreground italic mb-6">{testimonials[activeTestimonial].content}</p>
                  <div className="flex space-x-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'bg-primary scale-125' : 'bg-primary/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="relative z-10 py-20 px-4 sm:px-6 container mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4"
          >
            <span className="relative">
              Success Stories
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            See how entrepreneurs like you achieved success with IdeaMatch
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={study.logo} alt={study.company} />
                    <AvatarFallback>{study.company.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{study.company}</h3>
                    <Badge variant="outline" className="mt-1 text-xs">{study.industry}</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{study.description}</p>
                <div className="flex items-center space-x-2 text-primary font-medium">
                  <Award className="h-5 w-5" />
                  <span>{study.results}</span>
                </div>
                <Button variant="ghost" className="mt-4 p-0 h-auto text-primary font-medium flex items-center group/btn">
                  Read case study
                  <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4 sm:px-6 container mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4"
          >
            <span className="relative">
              Simple, Transparent Pricing
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Choose the plan that works best for your needs
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all hover:shadow-xl ${plan.highlighted ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:-translate-y-2'}`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground py-2 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full rounded-lg py-6 ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}
                >
                  {plan.button}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center flex justify-center items-center text-sm text-muted-foreground">
          <Shield className="h-4 w-4 mr-2" />
          <p>All plans include a 14-day money-back guarantee</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 bg-secondary/30 dark:bg-gray-800/30 rounded-3xl">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-4"
            >
              <span className="relative">
                Frequently Asked Questions
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Find answers to common questions about IdeaMatch
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md"
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="relative z-10 py-20 px-4 sm:px-6 container mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-4"
          >
            <span className="relative">
              Integrates With Your Favorite Tools
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/40 rounded-full"></span>
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Connect with the tools you already use in your workflow
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {["Slack", "Notion", "Trello", "Google Workspace", "GitHub", "Asana", "Microsoft Teams", "Hubspot", "Salesforce", "Zapier", "Airtable", "Figma"].map((tool, index) => (
            <motion.div
              key={tool}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
            >
              <p className="font-medium">{tool}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4 sm:px-6 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-blue-500/20 z-0"></div>
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-0"></div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full z-0"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full z-0"></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Rocket className="h-12 w-12 text-primary mx-auto mb-6 animate-float" />
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Find Your Next Big Idea?
            </motion.h2>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Join thousands of entrepreneurs who've found success with our AI-generated business ideas.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/sign-up">
                <Button className="relative overflow-hidden bg-primary text-white rounded-full px-8 py-6 text-lg hover:shadow-lg hover:bg-primary/90 transition-all duration-300 group">
                  <span className="relative z-10 flex items-center">
                    Get Started For Free 
                    <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" className="rounded-full px-8 py-6 text-lg border-2 w-full sm:w-auto hover:bg-secondary/50 transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-16 pb-8 px-4 sm:px-6 bg-secondary/50 dark:bg-gray-800/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">IdeaMatch</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xs">
                Your AI co-founder for groundbreaking business ideas. We help entrepreneurs discover their next big opportunity.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a></li>
                <li><a href="#case-studies" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} IdeaMatch. All rights reserved.
            </div>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;