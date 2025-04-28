
import React from 'react';
import { Database } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur-sm opacity-75"></div>
        <div className="relative bg-white dark:bg-black rounded-full p-2">
          <Database className="h-6 w-6 text-primary" />
        </div>
      </div>
      <div className="font-bold text-xl tracking-tight">
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Meta</span>
        <span className="text-foreground">Store</span>
      </div>
    </div>
  );
};

export default Logo;
