'use client';

import { Target, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { SectionCard } from '@/src/components/SectionCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Milestone } from '@/src/lib/types';
import { generateId, formatDate } from '@/src/lib/utils';

interface MilestonesCardProps {
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
  onAdd: (milestone: Omit<Milestone, 'id'>) => void;
  onRemove: (id: string) => void;
}

export function MilestonesCard({ milestones, onUpdate, onAdd, onRemove }: MilestonesCardProps) {
  const handleAddMilestone = () => {
    const newMilestone: Omit<Milestone, 'id'> = {
      title: 'New Milestone',
      description: '',
      status: 'not-started',
      priority: 'medium',
    };
    onAdd(newMilestone);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === id ? { ...milestone, [field]: value } : milestone
    );
    onUpdate(updatedMilestones);
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <SectionCard
      title="Project Milestones"
      description="Track your project's key milestones and deadlines"
      icon={<Target className="h-5 w-5" />}
      actions={
        <Button onClick={handleAddMilestone} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      }
    >
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No milestones yet. Add your first milestone to start tracking progress.</p>
          </div>
        ) : (
          milestones.map((milestone) => (
            <Card key={milestone.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(milestone.status)}
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                      className="font-medium border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(milestone.priority)}>
                      {milestone.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(milestone.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Describe this milestone..."
                  value={milestone.description}
                  onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                  rows={2}
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Status</Label>
                    <Select
                      value={milestone.status}
                      onValueChange={(value) => updateMilestone(milestone.id, 'status', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Priority</Label>
                    <Select
                      value={milestone.priority}
                      onValueChange={(value) => updateMilestone(milestone.id, 'priority', value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Target Date</Label>
                    <Input
                      type="date"
                      value={milestone.targetDate || ''}
                      onChange={(e) => updateMilestone(milestone.id, 'targetDate', e.target.value)}
                      className="h-8"
                    />
                  </div>
                  
                  {milestone.status === 'completed' && (
                    <div>
                      <Label className="text-xs">Completed Date</Label>
                      <Input
                        type="date"
                        value={milestone.completedDate || ''}
                        onChange={(e) => updateMilestone(milestone.id, 'completedDate', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </SectionCard>
  );
}