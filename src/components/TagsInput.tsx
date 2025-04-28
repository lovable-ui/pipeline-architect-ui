
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagsInputProps {
  tags: Record<string, string>;
  onChange: (tags: Record<string, string>) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onChange }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  
  const handleAddTag = () => {
    if (key && value) {
      onChange({ ...tags, [key]: value });
      setKey('');
      setValue('');
    }
  };

  const handleRemoveTag = (tagKey: string) => {
    const newTags = { ...tags };
    delete newTags[tagKey];
    onChange(newTags);
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {Object.entries(tags || {}).map(([k, v]) => (
          <Badge key={k} variant="secondary" className="px-2 py-1 text-sm">
            <span>{k}: {v}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-2"
              onClick={() => handleRemoveTag(k)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Key"
          className="flex-1"
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="flex-1"
        />
        <Button onClick={handleAddTag} type="button" variant="secondary">
          Add
        </Button>
      </div>
    </div>
  );
};

export default TagsInput;
