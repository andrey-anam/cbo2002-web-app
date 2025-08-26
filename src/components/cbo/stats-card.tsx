import { useEffect, useState } from "react";
import { GlassCard } from "../ui/glass-card";

export default function StatCard({ icon: Icon, title, value, subtitle, duration = 300 }: any) {

    const [numValue, setNumValue] = useState(0);

    useEffect(() => {
      const startTime = performance.now();

      const step = (now: number) => {
        const progress = Math.min(((now - startTime)) / duration, 1);
        if (progress < 1) {
          setNumValue(Math.floor(progress * value));
          requestAnimationFrame(step);
        } else {
          setNumValue(value);
        }
      };

      requestAnimationFrame(step);
    }, [value, setNumValue]);

    return (
      <GlassCard variant="elevated" size="sm" className="text-center">
        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{numValue}</div>
            <div className="text-sm font-medium text-foreground">{title}</div>
            {subtitle && (
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            )}
          </div>
        </div>
      </GlassCard>
    )
  };
