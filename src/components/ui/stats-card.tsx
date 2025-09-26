import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon: LucideIcon;
  className?: string;
  variant?: 'default' | 'hertz' | 'gradient';
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  variant = 'default' 
}: StatsCardProps) {
  const getCardStyles = () => {
    switch (variant) {
      case 'hertz':
        return 'bg-gradient-hertz text-hertz-navy border-hertz-gold';
      case 'gradient':
        return 'bg-gradient-status text-white border-status-progress';
      default:
        return 'bg-card text-card-foreground border-border';
    }
  };

  const getChangeColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-status-completed';
      case 'down':
        return 'text-status-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn('shadow-card hover:shadow-lg transition-shadow', getCardStyles(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium opacity-90">
          {title}
        </CardTitle>
        <Icon className={cn(
          'h-4 w-4',
          variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
        )} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-heading">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {change && (
          <p className={cn(
            'text-xs mt-1',
            variant === 'default' ? getChangeColor(change.trend) : 'opacity-75'
          )}>
            <span className={cn(
              change.trend === 'up' && '↑',
              change.trend === 'down' && '↓'
            )}>
              {change.value}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}