
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  MoreHorizontal, 
  Calendar, 
  File, 
  Clock,
  Plus,
  Lock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Sample documents data
const documents = [
  {
    id: 1,
    title: "Automated Marketing Platform Business Plan",
    type: "Business Plan",
    createDate: "October 24, 2023",
    isPremium: true,
    fileSize: "2.4 MB"
  },
  {
    id: 2,
    title: "Market Analysis - SaaS Industry",
    type: "Market Analysis",
    createDate: "October 20, 2023",
    isPremium: true,
    fileSize: "1.8 MB"
  },
  {
    id: 3,
    title: "Competitor Analysis Report",
    type: "Competitive Analysis",
    createDate: "October 15, 2023",
    isPremium: true,
    fileSize: "3.2 MB"
  }
];

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const isPremiumUser = false; // This would come from user context/state
  
  const handleUpgradeClick = () => {
    navigate('/subscription');
    toast.info('Redirecting to subscription page to upgrade to Premium plan');
  };
  
  const handleDocumentClick = (doc: typeof documents[0]) => {
    if (!isPremiumUser && doc.isPremium) {
      toast.error('This document requires a Premium subscription');
      return;
    }
    
    toast.success(`Opening ${doc.title}`);
    // In a real app, this would open the document
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              <FileText className="h-3.5 w-3.5" />
              <span>Documents</span>
            </div>
            <h1 className="text-3xl font-bold">Your Business Documents</h1>
            <p className="text-muted-foreground mt-2">
              Access your business plans, market analyses, and other documents
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search documents..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          {documents.map((doc) => (
            <Card 
              key={doc.id} 
              className={`hover:bg-accent/50 transition-colors ${!isPremiumUser && doc.isPremium ? 'opacity-60' : ''}`}
              onClick={() => handleDocumentClick(doc)}
            >
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="mr-4 p-2 bg-primary/10 rounded">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{doc.title}</h3>
                      {doc.isPremium && !isPremiumUser && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline">{doc.type}</Badge>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{doc.createDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <File className="h-3 w-3" />
                        <span>{doc.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isPremiumUser || !doc.isPremium ? (
                      <>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleUpgradeClick();
                      }}>
                        Unlock
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!isPremiumUser && (
          <Card className="border-dashed border-2 bg-background/50 mt-8">
            <CardContent className="py-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl mb-2">Premium Documents</CardTitle>
              <CardDescription className="max-w-md mb-6">
                Upgrade to Premium to unlock full business plans, market analyses, and more detailed documents.
              </CardDescription>
              <Button onClick={handleUpgradeClick}>
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DocumentsPage;
