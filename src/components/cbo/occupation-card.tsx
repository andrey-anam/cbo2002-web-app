// Occupation Card Component - CBO Specific
import React from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TCBOOccupation } from '@/types/cbo';
import { 
  Briefcase, 
  Code2, 
  ArrowRight, 
  BookOpen, 
  Settings,
  Users,
  GraduationCap,
  Dices,
  ClipboardList,
  Award
} from 'lucide-react';

export interface OccupationCardProps {
  occupation: TCBOOccupation;
  onClick?: (occupation: TCBOOccupation) => void;
  showHierarchy?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const OccupationCard: React.FC<OccupationCardProps> = ({
  occupation,
  onClick,
  showHierarchy = true,
  className,
  variant = 'default',
}) => {
  const handleClick = () => {
    onClick?.(occupation);
  };

  const getIconByLevel = (nivel: number) => {
    switch (nivel) {
      case 1: return Users;
      case 2: return Briefcase;
      case 3: return Settings;
      case 4: return BookOpen;
      case 5: return Code2;
      default: return Briefcase;
    }
  };

  const Icon = getIconByLevel(occupation.level);

  if (variant === 'compact') {
    return (
      <GlassCard
        variant="interactive"
        size="sm"
        onClick={handleClick}
        className={cn('hover:border-primary/30', className)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm text-foreground truncate">
                {occupation.label}
              </h3>
              <p className="text-xs text-muted-foreground">
                Código: {occupation.id}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </GlassCard>
    );
  }

  if (variant === 'detailed') {
    return (
      <GlassCard
        variant="interactive"
        size="lg"
        onClick={handleClick}
        className={cn('hover:border-primary/30', className)}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-primary">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg text-foreground leading-tight">
                  {occupation.label}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {occupation.id}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Nível {occupation.level}
                  </Badge>
                </div>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
          </div>

          {/* Description */}
          {occupation.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {occupation.description}
            </p>
          )}

          {/* Hierarchy */}
          {showHierarchy && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Hierarquia
              </h4>
              <div className="space-y-1 text-xs">
                {occupation.hierarchy.big_group && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Grande Grupo:</span>
                    <span className="text-foreground font-medium first-letter:uppercase">
                      {occupation.hierarchy.big_group.toLowerCase()}
                    </span>
                  </div>
                )}
                {occupation.hierarchy.sub_group && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Subgrupo:</span>
                    <span className="text-foreground font-medium first-letter:uppercase">
                      {occupation.hierarchy.sub_group.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2">
            {occupation.activities && occupation.activities.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <ClipboardList className="h-3 w-3 mr-1" />
                {occupation.activities.length} {occupation.academy.length > 1 ? ' Atividades' : ' Atividade'}
              </Badge>
            )}
            {occupation.competencies && occupation.competencies.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                {occupation.competencies.length} {occupation.competencies.length > 1 ? ' Competências' : ' Competência'}
              </Badge>
            )}
            {occupation.academy && occupation.academy.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                {occupation.academy.length} {occupation.academy.length > 1 ? ' Formações' : ' Formação'}
              </Badge>
            )}
            {occupation.synonymous && occupation.synonymous.length > 0 && (
              <Badge variant="outline" className="text-xs">
                <Dices className="h-3 w-3 mr-1" />
                {occupation.synonymous.length} {occupation.synonymous.length > 1 ? ' Sinônimos' : ' Sinônimo'}
              </Badge>
            )}
          </div>
        </div>
      </GlassCard>
    );
  }

  // Default variant
  return (
    <GlassCard
      variant="interactive"
      onClick={handleClick}
      className={cn('hover:border-primary/30', className)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground leading-tight">
                {occupation.label}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">
                  {occupation.id}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Nível {occupation.level}
                </Badge>
              </div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Description */}
        {occupation.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {occupation.description}
          </p>
        )}

        {/* Hierarchy - simplified */}
        {showHierarchy && occupation.hierarchy.big_group && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Grande Grupo:</span> {occupation.hierarchy.big_group}
          </div>
        )}
      </div>
    </GlassCard>
  );
};


// --- SKELETON ---


// Placeholder com shimmer
const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-muted/30",
      className
    )}
  />
);

interface OccupationCardSkeletonProps {
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export const OccupationCardSkeleton: React.FC<OccupationCardSkeletonProps> = ({
  variant = "default",
  className,
}) => {
  if (variant === "compact") {
    return (
      <GlassCard
        variant="interactive"
        size="sm"
        className={cn("hover:border-primary/30", className)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SkeletonBlock className="h-8 w-8 rounded-lg" />
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-3 w-16" />
            </div>
          </div>
          <SkeletonBlock className="h-4 w-4" />
        </div>
      </GlassCard>
    );
  }

  if (variant === "detailed") {
    return (
      <GlassCard
        variant="interactive"
        size="lg"
        className={cn("hover:border-primary/30", className)}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <SkeletonBlock className="h-10 w-10 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <SkeletonBlock className="h-5 w-40" />
                <div className="flex gap-2">
                  <SkeletonBlock className="h-4 w-12 rounded" />
                  <SkeletonBlock className="h-4 w-16 rounded" />
                </div>
              </div>
            </div>
            <SkeletonBlock className="h-5 w-5" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-5/6" />
            <SkeletonBlock className="h-3 w-4/6" />
          </div>

          {/* Hierarchy */}
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="h-3 w-28" />
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-5 w-20 rounded" />
            <SkeletonBlock className="h-5 w-24 rounded" />
            <SkeletonBlock className="h-5 w-16 rounded" />
          </div>
        </div>
      </GlassCard>
    );
  }

  // Default variant
  return (
    <GlassCard
      variant="interactive"
      className={cn("hover:border-primary/30", className)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <SkeletonBlock className="h-8 w-8 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-36" />
              <div className="flex gap-2">
                <SkeletonBlock className="h-3 w-12 rounded" />
                <SkeletonBlock className="h-3 w-16 rounded" />
              </div>
            </div>
          </div>
          <SkeletonBlock className="h-4 w-4" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-3/4" />
        </div>

        {/* Hierarchy */}
        <SkeletonBlock className="h-3 w-40" />
      </div>
    </GlassCard>
  );
};

export default OccupationCard;