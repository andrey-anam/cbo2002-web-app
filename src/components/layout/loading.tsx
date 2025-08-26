// Loading Component with Glass Morphism
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'center' | 'inline';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Carregando...',
  className,
  size = 'md',
  variant = 'center'
}) => {
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Loader2 className={cn('animate-spin text-primary', iconSizes[size])} />
        <span className={cn('text-muted-foreground', textSizes[size])}>
          {message}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen flex items-center justify-center', className)}>
      <GlassCard className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 className={cn('animate-spin text-primary', iconSizes[size])} />
        </div>
        <p className={cn('text-muted-foreground', textSizes[size])}>
          {message}
        </p>
      </GlassCard>
    </div>
  );
};

export default Loading;