
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import { toast } from 'sonner';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSignIn = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } else if (res.status === 403 && (result.error || result.message)) {
        toast.error(result.error || result.message);
      } else if (res.status === 401) {
        toast.error('Invalid email or password.');
      } else {
        toast.error(result.error || result.message || 'Login failed.');
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
      
      <AuthForm type="signin" onSubmit={handleSignIn} />
      
      <p className="mt-8 text-sm text-muted-foreground text-center">
        By signing in, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p>
    </div>
  );
};

export default SignIn;
