
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Plus } from 'lucide-react';
import StepForm from '@/components/StepForm';
import TagsInput from '@/components/TagsInput';
import { Model, ModelInput, ModelStepInput } from '@/types/models';

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

const createEmptyModelInput = (): ModelInput => ({
  name: '',
  model_type: 'REDSHIFT',
  enabled: true,
  schedule_interval: '0 0 * * *',
  tags: {},
  steps: []
});

const createEmptyStep = (modelId: string = '', order: number = 0): ModelStepInput => ({
  model_id: modelId,
  name: 'New Step',
  step_order: order,
  query: '',
  destination_name: '',
  schema: { id: 'string' },
  write_mechanism: 'UPSERT',
  primary_keys: [],
  partition_keys: [],
  sort_keys: []
});

const ModelForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  
  // Initialize form with empty model or existing data if editing
  const [formData, setFormData] = useState<ModelInput>(() => {
    if (isEditing && sampleModels[id]) {
      const model = sampleModels[id];
      return {
        name: model.name,
        model_type: model.model_type,
        enabled: model.enabled,
        schedule_interval: model.schedule_interval,
        tags: model.tags || {},
        steps: model.steps.map(step => ({...step}))
      };
    }
    return createEmptyModelInput();
  });

  const handleInputChange = (field: keyof ModelInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStep = () => {
    const newStep = createEmptyStep(id, formData.steps.length);
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const handleStepChange = (index: number, updatedStep: ModelStepInput) => {
    const newSteps = [...formData.steps];
    newSteps[index] = updatedStep;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const handleRemoveStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation logic would go here
    
    // Here we would normally send the data to the API
    console.log('Submitting model:', formData);
    
    // Show success message
    toast({
      title: isEditing ? "Model Updated" : "Model Created",
      description: `${formData.name} has been ${isEditing ? 'updated' : 'created'} successfully.`
    });
    
    // Redirect to model list or detail page
    navigate(isEditing ? `/models/${id}` : '/models');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center text-sm text-muted-foreground">
        <Link to="/models" className="hover:underline">Models</Link>
        <ChevronLeft className="h-4 w-4 mx-1 rotate-180" />
        <span className="font-medium text-foreground">
          {isEditing ? `Edit ${formData.name}` : 'Create New Model'}
        </span>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Model' : 'Create New Model'}</h1>
        <p className="text-muted-foreground">
          {isEditing 
            ? 'Update the configuration for this data pipeline model' 
            : 'Configure a new data pipeline model and its processing steps'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="model-name">Model Name</Label>
                <Input 
                  id="model-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter model name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="model-type">Model Type</Label>
                <Select 
                  value={formData.model_type} 
                  onValueChange={(value) => handleInputChange('model_type', value)}
                >
                  <SelectTrigger id="model-type">
                    <SelectValue placeholder="Select model type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REDSHIFT">REDSHIFT</SelectItem>
                    <SelectItem value="SNOWFLAKE">SNOWFLAKE</SelectItem>
                    <SelectItem value="BIGQUERY">BIGQUERY</SelectItem>
                    <SelectItem value="SPARK">SPARK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schedule">Schedule Interval</Label>
                <Input 
                  id="schedule"
                  value={formData.schedule_interval}
                  onChange={(e) => handleInputChange('schedule_interval', e.target.value)}
                  placeholder="Cron expression (e.g., 0 0 * * *)"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">Cron expression format (e.g., 0 0 * * * for daily)</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled" className="cursor-pointer">Enable Model</Label>
                <Switch 
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => handleInputChange('enabled', checked)}
                />
              </div>
            </div>
            
            <TagsInput 
              tags={formData.tags || {}}
              onChange={(tags) => handleInputChange('tags', tags)}
            />
          </CardContent>
        </Card>
        
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Model Steps</h2>
          <Button 
            type="button" 
            onClick={handleAddStep}
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.steps.map((step, index) => (
            <StepForm
              key={index}
              stepData={step}
              onChange={(updatedStep) => handleStepChange(index, updatedStep)}
              onRemove={() => handleRemoveStep(index)}
            />
          ))}
          
          {formData.steps.length === 0 && (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">No steps defined for this model yet.</p>
                <Button 
                  type="button" 
                  onClick={handleAddStep}
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Step
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        <CardFooter className="flex justify-end space-x-2 px-0 py-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/models')}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Model' : 'Create Model'}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default ModelForm;
