
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Model } from '@/types/models';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{model.name}</CardTitle>
          <Badge variant={model.enabled ? "default" : "outline"}>
            {model.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <CardDescription>Type: {model.model_type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Schedule:</span> {model.schedule_interval}
          </div>
          <div className="text-sm">
            <span className="font-medium">Steps:</span> {model.steps.length}
          </div>
          {model.tags && Object.keys(model.tags).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(model.tags).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to={`/models/${model.id}`}>
          <Button variant="ghost" size="sm">
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
