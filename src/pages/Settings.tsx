
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your MetaStore environment</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="organization">Organization Name</Label>
            <Input id="organization" defaultValue="Your Company" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="block mb-1">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications for pipeline failures</p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          
          <div>
            <Label htmlFor="admin-email">Admin Email</Label>
            <Input id="admin-email" type="email" defaultValue="admin@example.com" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Connection Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="redshift-host">Redshift Host</Label>
              <Input id="redshift-host" defaultValue="redshift.example.com" />
            </div>
            <div>
              <Label htmlFor="redshift-port">Redshift Port</Label>
              <Input id="redshift-port" defaultValue="5439" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="redshift-user">Redshift Username</Label>
              <Input id="redshift-user" defaultValue="admin" />
            </div>
            <div>
              <Label htmlFor="redshift-password">Redshift Password</Label>
              <Input id="redshift-password" type="password" defaultValue="********" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="redshift-database">Redshift Database</Label>
            <Input id="redshift-database" defaultValue="analytics" />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <Label htmlFor="ssl" className="block mb-1">Use SSL</Label>
              <p className="text-sm text-muted-foreground">Secure the connection with SSL/TLS</p>
            </div>
            <Switch id="ssl" defaultChecked />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
