
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Database, CheckCircle, XCircle } from 'lucide-react';

// Placeholder data - would be fetched from API in real implementation
const stats = {
  totalModels: 12,
  activeModels: 8,
  totalSteps: 47,
  recentRuns: 24,
  successRate: 92
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to MetaStore Pipeline Architect</p>
        </div>
        <Link to="/models/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Model
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{stats.totalModels}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeModels} active models
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSteps}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all models
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">{stats.successRate}%</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last {stats.recentRuns} runs
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">User Engagement Model</p>
                <p className="text-sm text-muted-foreground">Updated 2 hours ago</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Revenue Analytics</p>
                <p className="text-sm text-muted-foreground">Updated 5 hours ago</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Customer Segmentation</p>
                <p className="text-sm text-muted-foreground">Updated 8 hours ago</p>
              </div>
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
