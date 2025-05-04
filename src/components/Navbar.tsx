import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Menu, X, User, Settings, LogOut, Home, Lightbulb, BookOpen, BarChart3, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navbarRef.current) {
      anime({
        targets: navbarRef.current,
        translateY: [-60, 0],
        opacity: [0, 1],
        duration: 900,
        easing: 'easeOutExpo',
      });
    }
    // Animate underline on hover for desktop menu links
    const links = document.querySelectorAll('.underline-animation');
    links.forEach(link => {
      let underline: HTMLSpanElement | null = null;
      link.addEventListener('mouseenter', () => {
        underline = document.createElement('span');
        underline.style.position = 'absolute';
        underline.style.left = '0';
        underline.style.bottom = '-2px';
        underline.style.height = '2px';
        underline.style.width = '0';
        underline.style.background = 'var(--primary, #6366f1)';
        underline.style.transition = 'none';
        underline.className = 'anime-underline';
        link.appendChild(underline);
        anime({
          targets: underline,
          width: ['0', '100%'],
          duration: 400,
          easing: 'easeOutExpo',
        });
      });
      link.addEventListener('mouseleave', () => {
        if (underline) {
          anime({
            targets: underline,
            width: ['100%', '0'],
            duration: 300,
            easing: 'easeInExpo',
            complete: () => {
              if (underline && underline.parentNode) {
                underline.parentNode.removeChild(underline);
              }
            },
          });
        }
      });
    });
  }, []);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear auth token on logout
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  return (
    <nav ref={navbarRef} className="glass-nav w-full px-4 sm:px-6 py-4 fixed top-0 z-50" style={{ opacity: 0, transform: 'translateY(-60px)' }}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span>IdeaMatch</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="relative text-foreground/80 hover:text-foreground flex items-center gap-1.5 underline-animation">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/idea-generator" className="relative text-foreground/80 hover:text-foreground flex items-center gap-1.5 underline-animation">
              <Lightbulb className="h-4 w-4" />
              <span>New Idea</span>
            </Link>
            <Link to="/saved-ideas" className="relative text-foreground/80 hover:text-foreground flex items-center gap-1.5 underline-animation">
              <BookOpen className="h-4 w-4" />
              <span>Saved Ideas</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer px-6 py-2 text-lg font-semibold tracking-wider uppercase">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 py-3 font-medium">My Account</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>



                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button variant="ghost" onClick={handleLogout} className="rounded-full text-white hover:bg-white/20 transition-colors duration-300 ease-in-out transform hover:scale-105 cursor-pointer px-6 py-2 text-lg font-semibold tracking-wider uppercase">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/idea-generator" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <Lightbulb className="h-5 w-5" />
                <span>New Idea</span>
              </Link>
              <Link to="/saved-ideas" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <BookOpen className="h-5 w-5" />
                <span>Saved Ideas</span>
              </Link>



              <Link to="/profile" className="flex items-center gap-2 py-2 hover:text-primary" onClick={() => setIsOpen(false)}>
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Button variant="ghost" onClick={() => {
                handleLogout();
                setIsOpen(false);
              }} className="flex items-center gap-2 py-2 text-destructive">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
