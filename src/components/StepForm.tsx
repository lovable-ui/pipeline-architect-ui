
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { ModelStepInput } from '@/types/models';

interface StepFormProps {
  stepData: ModelStepInput;
  onChange: (step: ModelStepInput) => void;
  onRemove: () => void;
  isNew?: boolean;
}

const StepForm: React.FC<StepFormProps> = ({ 
  stepData, 
  onChange, 
  onRemove,
  isNew = false
}) => {
  const [schemaKeys, setSchemaKeys] = useState<string[]>(Object.keys(stepData.schema));

  const addSchemaField = () => {
    const updatedSchema = { ...stepData.schema, ['new_field']: 'string' };
    setSchemaKeys([...schemaKeys, 'new_field']);
    onChange({ ...stepData, schema: updatedSchema });
  };

  const removeSchemaField = (key: string) => {
    const updatedSchema = { ...stepData.schema };
    delete updatedSchema[key];
    setSchemaKeys(schemaKeys.filter(k => k !== key));
    onChange({ ...stepData, schema: updatedSchema });
  };

  const updateSchemaKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    
    const updatedSchema = { ...stepData.schema };
    const value = updatedSchema[oldKey];
    delete updatedSchema[oldKey];
    updatedSchema[newKey] = value;
    
    setSchemaKeys(schemaKeys.map(k => k === oldKey ? newKey : k));
    onChange({ ...stepData, schema: updatedSchema });
  };

  const updateSchemaValue = (key: string, value: string) => {
    const updatedSchema = { ...stepData.schema };
    updatedSchema[key] = value;
    onChange({ ...stepData, schema: updatedSchema });
  };

  const handleChange = (field: keyof ModelStepInput, value: any) => {
    onChange({ ...stepData, [field]: value });
  };

  const handleArrayChange = (field: keyof ModelStepInput, value: string) => {
    // Assuming value is a comma-separated string that needs to be converted to array
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    onChange({ ...stepData, [field]: arrayValue });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {isNew ? "New Step" : `Step ${stepData.step_order + 1}: ${stepData.name}`}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`step-name-${stepData.step_order}`}>Step Name</Label>
            <Input 
              id={`step-name-${stepData.step_order}`}
              value={stepData.name} 
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter step name" 
            />
          </div>
          <div>
            <Label htmlFor={`step-order-${stepData.step_order}`}>Order</Label>
            <Input 
              id={`step-order-${stepData.step_order}`}
              type="number" 
              value={stepData.step_order} 
              onChange={(e) => handleChange('step_order', parseInt(e.target.value))}
              placeholder="Order" 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor={`step-query-${stepData.step_order}`}>Query</Label>
          <Textarea 
            id={`step-query-${stepData.step_order}`}
            value={stepData.query} 
            onChange={(e) => handleChange('query', e.target.value)}
            placeholder="SQL Query" 
            rows={5}
            className="font-mono"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`step-destination-${stepData.step_order}`}>Destination</Label>
            <Input 
              id={`step-destination-${stepData.step_order}`}
              value={stepData.destination_name} 
              onChange={(e) => handleChange('destination_name', e.target.value)}
              placeholder="Destination table/path" 
            />
          </div>
          <div>
            <Label htmlFor={`step-mechanism-${stepData.step_order}`}>Write Mechanism</Label>
            <Select 
              value={stepData.write_mechanism} 
              onValueChange={(value) => handleChange('write_mechanism', value)}
            >
              <SelectTrigger id={`step-mechanism-${stepData.step_order}`}>
                <SelectValue placeholder="Select write mechanism" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPSERT">UPSERT</SelectItem>
                <SelectItem value="APPEND">APPEND</SelectItem>
                <SelectItem value="OVERWRITE">OVERWRITE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Schema</Label>
            <Button variant="outline" size="sm" onClick={addSchemaField}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Field
            </Button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto p-1">
            {schemaKeys.map((key, index) => (
              <div key={index} className="grid grid-cols-5 gap-2 items-center">
                <div className="col-span-2">
                  <Input 
                    value={key} 
                    onChange={(e) => updateSchemaKey(key, e.target.value)}
                    placeholder="Field name" 
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <Select 
                    value={stepData.schema[key]} 
                    onValueChange={(value) => updateSchemaValue(key, value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="integer">integer</SelectItem>
                      <SelectItem value="float">float</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="timestamp">timestamp</SelectItem>
                      <SelectItem value="array">array</SelectItem>
                      <SelectItem value="map">map</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeSchemaField(key)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`step-primary-keys-${stepData.step_order}`}>Primary Keys</Label>
            <Input 
              id={`step-primary-keys-${stepData.step_order}`}
              value={stepData.primary_keys.join(', ')}
              onChange={(e) => handleArrayChange('primary_keys', e.target.value)}
              placeholder="Comma separated keys"
            />
          </div>
          <div>
            <Label htmlFor={`step-partition-keys-${stepData.step_order}`}>Partition Keys</Label>
            <Input 
              id={`step-partition-keys-${stepData.step_order}`}
              value={stepData.partition_keys.join(', ')}
              onChange={(e) => handleArrayChange('partition_keys', e.target.value)}
              placeholder="Comma separated keys"
            />
          </div>
          <div>
            <Label htmlFor={`step-sort-keys-${stepData.step_order}`}>Sort Keys</Label>
            <Input 
              id={`step-sort-keys-${stepData.step_order}`}
              value={stepData.sort_keys.join(', ')}
              onChange={(e) => handleArrayChange('sort_keys', e.target.value)}
              placeholder="Comma separated keys"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepForm;
