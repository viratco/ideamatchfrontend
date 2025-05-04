
import React from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import AuthForm from '@/components/AuthForm';
import { toast } from 'sonner';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  

const handleSignIn = async (data: { email: string; password: string }) => {
  try {
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
    if (!error) {
      const user = signInData?.user;
      // Check if email is confirmed (Supabase v2: email_confirmed_at, v1: confirmed_at)
      if (user && (user.email_confirmed_at || user.confirmed_at)) {
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } else {
        toast.info('Please verify your email before signing in.');
      }
    } else if (error.message.toLowerCase().includes('invalid')) {
      toast.error('Invalid email or password.');
    } else {
      toast.error(error.message || 'Login failed.');
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
