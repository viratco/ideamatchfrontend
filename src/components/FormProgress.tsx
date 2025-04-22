
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type FormSection = {
  title: string;
  description: string;
};

type FormProgressProps = {
  sections: FormSection[];
  currentSection: number;
  onSectionClick?: (index: number) => void;
};

const FormProgress: React.FC<FormProgressProps> = ({ 
  sections, 
  currentSection,
  onSectionClick 
}) => {
  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-muted">
          <div 
            className="h-full bg-primary transition-all" 
            style={{ 
              width: `${(currentSection / (sections.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        {/* Section Markers */}
        {sections.map((section, index) => {
          const isCompleted = index < currentSection;
          const isCurrent = index === currentSection;
          
          return (
            <div key={section.title} className="relative z-10 flex flex-col items-center">
              <button
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                  isCurrent ? "bg-primary/20 border-primary text-primary" : 
                  "bg-background border-muted text-muted-foreground"
                )}
                disabled={!onSectionClick || index > currentSection}
                onClick={() => onSectionClick?.(index)}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              <div className="mt-2 text-center">
                <p className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {section.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block max-w-[120px]">
                  {section.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormProgress;
