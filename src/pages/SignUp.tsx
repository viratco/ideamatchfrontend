
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import { toast } from 'sonner';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSignUp = async (data: { email: string; password: string; name?: string }) => {
    try {
      const res = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'Account created! Please check your email to verify your account.');
        // Do NOT redirect to dashboard here. User should verify email first.
      } else if (res.status === 409) {
        toast.error('Email already in use.');
      } else {
        toast.error(result.error || result.message || 'Signup failed.');
      }
    } catch (err) {
      toast.error('Network/server error.');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <span>IdeaMatch</span>
        </Link>
      </div>
      
      <AuthForm type="signup" onSubmit={handleSignUp} />
      
      <p className="mt-8 text-sm text-muted-foreground text-center">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  );
};

export default SignUp;
