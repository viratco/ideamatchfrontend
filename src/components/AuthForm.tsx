
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, ...(type === 'signup' ? { name } : {}) });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 glass-card rounded-2xl animate-scale-in">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'signin' ? 'Sign in to your account' : 'Create your account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <div className="space-y-2">
            <label htmlFor="name" className="label block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field w-full"
              placeholder="John Doe"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="label block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field w-full"
            placeholder="johndoe@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="label block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field w-full pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-all duration-300 mt-6"
        >
          {type === 'signin' ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {type === 'signin' ? (
          <p>
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link to="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
