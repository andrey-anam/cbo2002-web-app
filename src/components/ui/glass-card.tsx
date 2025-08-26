// Glass Card Component - Liquid Glass Morphism
import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const glassCardVariants = cva(
  'glass-card transition-all duration-300 hover:shadow-glow',
  {
    variants: {
      variant: {
        default: 'glass-card',
        elevated: 'glass-card shadow-card hover:shadow-glow',
        interactive: 'glass-card cursor-pointer hover:scale-[1.02] hover:shadow-glow',
        highlight: 'glass-card border-primary/30 shadow-glow',
      },
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-xl',
        lg: 'p-8 rounded-2xl',
        xl: 'p-10 rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface GlassCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  asChild?: boolean;
  glow?: boolean;
  pulse?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, glow, pulse, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    return (
      <Comp
        className={cn(
          glassCardVariants({ variant, size }),
          glow && 'glow',
          pulse && 'pulse-glow',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };