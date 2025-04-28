
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Edit } from 'lucide-react';
import { Model } from '@/types/models';

// Sample data - would be fetched from API in real implementation
const sampleModels: Record<string, Model> = {
  '1': {
    id: '1',
    name: 'User Engagement Analytics',
    model_type: 'REDSHIFT',
    enabled: true,
    schedule_interval: '0 */4 * * *', // Every 4 hours
    tags: { env: 'prod', team: 'data-science', priority: 'high' },
    steps: [
      {
        model_id: '1',
        name: 'Extract User Events',
        step_order: 0,
        query: 'SELECT * FROM events WHERE event_date = CURRENT_DATE',
        destination_name: 'user_events_staging',
        schema: { user_id: 'string', event_type: 'string', timestamp: 'timestamp' },
        write_mechanism: 'OVERWRITE',
        primary_keys: ['user_id', 'timestamp'],
        partition_keys: ['timestamp'],
        sort_keys: []
      },
      {
        model_id: '1',
        name: 'Aggregate Daily Metrics',
        step_order: 1,
        query: 'SELECT user_id, COUNT(*) as event_count FROM user_events_staging GROUP BY user_id',
        destination_name: 'daily_user_metrics',
        schema: { user_id: 'string', event_count: 'integer' },
        write_mechanism: 'UPSERT',
        primary_keys: ['user_id'],
        partition_keys: [],
        sort_keys: []
      }
    ]
  }
};

const StepDetail = () => {
  const { modelId, stepOrder } = useParams<{ modelId: string; stepOrder: string }>();
  
  const model = sampleModels[modelId || ''];
  const stepIndex = parseInt(stepOrder || '0');
  const step = model?.steps.find(s => s.step_order === stepIndex);
  
  if (!model || !step) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-2xl font-semibold mb-4">Step not found</h2>
        <p className="text-muted-foreground mb-4">The requested step could not be found.</p>
        <Link to={`/models/${modelId}`}>
          <Button>Back to Model</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link to="/models" className="hover:underline">Models</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link to={`/models/${model.id}`} className="hover:underline">{model.name}</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-foreground">Step {step.step_order + 1}: {step.name}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Step {step.step_order + 1}: {step.name}
        </h1>
        <Link to={`/models/${model.id}/steps/${step.step_order}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Step
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Destination</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{step.destination_name}</p>
            <Badge className="mt-2">{step.write_mechanism}</Badge>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Keys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium">Primary Keys:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {step.primary_keys.length > 0 ? (
                  step.primary_keys.map((key, i) => (
                    <Badge key={i} variant="outline">{key}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Partition Keys:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {step.partition_keys.length > 0 ? (
                  step.partition_keys.map((key, i) => (
                    <Badge key={i} variant="outline">{key}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Sort Keys:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {step.sort_keys.length > 0 ? (
                  step.sort_keys.map((key, i) => (
                    <Badge key={i} variant="outline">{key}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None specified</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Query</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">
            {step.query}
          </pre>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Field Name</th>
                  <th className="text-left p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(step.schema).map(([field, type], i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 font-medium">{field}</td>
                    <td className="p-2">{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepDetail;
