import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Edit, ArrowRight, Trash } from 'lucide-react';
import StepCard from '@/components/StepCard';
import { Model } from '@/types/models';
import { Plus } from "lucide-react";

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
  },
  '2': {
    id: '2',
    name: 'Revenue Analytics',
    model_type: 'REDSHIFT',
    enabled: true,
    schedule_interval: '0 0 * * *',
    tags: { env: 'prod', team: 'finance' },
    steps: [
      {
        model_id: '2',
        name: 'Extract Transactions',
        step_order: 0,
        query: 'SELECT * FROM transactions WHERE transaction_date >= CURRENT_DATE - 7',
        destination_name: 'transactions_staging',
        schema: { 
          transaction_id: 'string', 
          user_id: 'string', 
          amount: 'float', 
          timestamp: 'timestamp' 
        },
        write_mechanism: 'OVERWRITE',
        primary_keys: ['transaction_id'],
        partition_keys: ['timestamp'],
        sort_keys: []
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Customer Segmentation',
    model_type: 'REDSHIFT',
    enabled: false,
    schedule_interval: '0 0 * * 1',
    steps: [
      {
        model_id: '3',
        name: 'Extract Customer Data',
        step_order: 0,
        query: 'SELECT * FROM customers',
        destination_name: 'customers_staging',
        schema: { 
          customer_id: 'string', 
          name: 'string', 
          email: 'string',
          created_at: 'timestamp'
        },
        write_mechanism: 'APPEND',
        primary_keys: ['customer_id'],
        partition_keys: [],
        sort_keys: []
      }
    ]
  }
};

const ModelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const model = sampleModels[id || ''] || null;
  
  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-2xl font-semibold mb-4">Model not found</h2>
        <p className="text-muted-foreground mb-4">The requested model could not be found.</p>
        <Link to="/models">
          <Button>Back to Models</Button>
        </Link>
      </div>
    );
  }

  const sortedSteps = [...model.steps].sort((a, b) => a.step_order - b.step_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link to="/models" className="hover:underline">Models</Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-foreground">{model.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            {model.name}
            <Badge 
              variant={model.enabled ? "default" : "outline"}
              className="ml-2"
            >
              {model.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-1">Type: {model.model_type} • Schedule: {model.schedule_interval}</p>
        </div>
        
        <div className="space-x-2 mt-4 md:mt-0">
          <Link to={`/models/${model.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Model
            </Button>
          </Link>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {model.tags && Object.keys(model.tags).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {Object.entries(model.tags).map(([key, value]) => (
            <Badge key={key} variant="outline">
              {key}: {value}
            </Badge>
          ))}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Model Steps</CardTitle>
            <Link to={`/models/${model.id}/steps/create`}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSteps.map((step, index) => (
              <React.Fragment key={index}>
                <StepCard step={step} modelId={model.id || ''} />
                {index < sortedSteps.length - 1 && (
                  <div className="pipeline-arrow flex justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </React.Fragment>
            ))}
            
            {sortedSteps.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No steps defined for this model.</p>
                <Link to={`/models/${model.id}/steps/create`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    Add your first step
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelDetail;
