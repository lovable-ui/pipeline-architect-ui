
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';
import { ModelStep } from '@/types/models';

interface StepCardProps {
  step: ModelStep;
  modelId: string;
}

const StepCard: React.FC<StepCardProps> = ({ step, modelId }) => {
  return (
    <Card className="pipeline-step">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {step.step_order}. {step.name}
          </CardTitle>
          <Badge variant="outline">{step.write_mechanism}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm space-y-1">
          <div className="text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {step.destination_name}
          </div>
          <div className="text-xs font-mono bg-muted p-2 rounded mt-2 max-h-20 overflow-auto">
            {step.query.length > 100 ? `${step.query.substring(0, 100)}...` : step.query}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-muted-foreground">
              {Object.keys(step.schema).length} columns
            </div>
            <Link to={`/models/${modelId}/steps/${step.step_order}`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepCard;
