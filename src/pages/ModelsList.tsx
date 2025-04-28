
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import ModelCard from '@/components/ModelCard';
import { Model } from '@/types/models';

// Sample data for demonstration - would be fetched from API
const sampleModels: Model[] = [
  {
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
  {
    id: '2',
    name: 'Revenue Analytics',
    model_type: 'REDSHIFT',
    enabled: true,
    schedule_interval: '0 0 * * *', // Daily
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
  {
    id: '3',
    name: 'Customer Segmentation',
    model_type: 'REDSHIFT',
    enabled: false,
    schedule_interval: '0 0 * * 1', // Weekly on Monday
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
];

const ModelsList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');

  const filteredModels = sampleModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (model.tags && Object.values(model.tags).some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
    if (filterType === 'enabled') return matchesSearch && model.enabled;
    if (filterType === 'disabled') return matchesSearch && !model.enabled;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Models</h1>
          <p className="text-muted-foreground">Manage your data pipeline models</p>
        </div>
        <Link to="/models/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Model
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Models</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
        
        {filteredModels.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No models found</p>
            <Link to="/models/create">
              <Button variant="outline" className="mt-2">
                Create your first model
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsList;
