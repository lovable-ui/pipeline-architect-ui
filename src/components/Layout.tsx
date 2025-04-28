
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Folder, FolderOpen, Plus, Settings, Database } from 'lucide-react';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <Logo />
          </div>
          <SidebarContent className="p-2">
            <div className="space-y-1">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Database className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/models">
                <Button variant="ghost" className="w-full justify-start">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Models
                </Button>
              </Link>
              <Link to="/models/create">
                <Button variant="ghost" className="w-full justify-start">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Model
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Button>
              </Link>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex flex-col flex-1">
          <header className="h-16 border-b flex items-center px-6 justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold ml-4">MetaStore Pipeline Architect</h1>
            </div>
            <div>
              <Button variant="outline">Documentation</Button>
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
          <footer className="border-t p-4 text-center text-sm text-muted-foreground">
            MetaStore Pipeline Architect © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
