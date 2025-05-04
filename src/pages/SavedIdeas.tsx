import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import IdeaCard from '@/components/IdeaCard';
import IdeaDetails from '@/components/IdeaDetails';
import { Button } from '@/components/ui/button';
import { BookOpen, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SavedIdeas: React.FC = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const { data, error } = await supabase
          .from('ideas')
          .select('id, title, description, details, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        // details contains all fields from both IdeaCard and IdeaDetails
        setIdeas(data || []);
      } catch (err: any) {
        setError('Failed to fetch saved ideas.');
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  const handleExploreDetails = (idea: any) => {
    // Merge details (all fields) with top-level fields for IdeaDetails
    const merged = { ...idea.details, title: idea.title, description: idea.description };
    setSelectedIdea(merged);
    setDetailsOpen(true);
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Saved Ideas</span>
            </div>
            <h1 className="text-3xl font-bold">Your Saved Business Ideas</h1>
            <p className="text-muted-foreground mt-2">
              Browse and manage all your saved business ideas
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search saved ideas..." 
                className="pl-9"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Render saved ideas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              {...idea.details}
              title={idea.title}
              description={idea.description}
              showSaveButton={false}
              onExploreDetails={() => handleExploreDetails(idea)}
            />
          ))}
        </div>
        <IdeaDetails
          idea={selectedIdea}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      </main>
    </div>
  );
};

export default SavedIdeas;
