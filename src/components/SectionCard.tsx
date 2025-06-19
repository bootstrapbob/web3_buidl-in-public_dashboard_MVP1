import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/src/lib/utils';

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function SectionCard({ 
  title, 
  description, 
  children, 
  className, 
  icon, 
  actions 
}: SectionCardProps) {
  return (
    <Card className={cn('h-fit', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <div className="text-primary">{icon}</div>}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}