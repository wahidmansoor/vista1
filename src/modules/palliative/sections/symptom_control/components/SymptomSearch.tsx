import React, { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { symptomTemplates, type SymptomTemplate } from '../data/SymptomData';

interface SymptomSearchProps {
  onSelectSymptom: (template: SymptomTemplate) => void;
  currentSymptoms: string[];
}

const SymptomSearch: React.FC<SymptomSearchProps> = ({
  onSelectSymptom,
  currentSymptoms,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(symptomTemplates.map(s => s.name.split(' ')[0]));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return symptomTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || template.name.toLowerCase().startsWith(category.toLowerCase());
      const isNotAdded = !currentSymptoms.includes(template.id);
      return matchesSearch && matchesCategory && isNotAdded;
    });
  }, [searchQuery, category, currentSymptoms]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value: string) => setCategory(value as CategoryType)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Button
            key={template.id}
            variant="outline"
            className="justify-start h-auto py-3 px-4"
            onClick={() => onSelectSymptom(template)}
          >
            <Plus className="w-4 h-4 mr-2 text-gray-500" />
            <div className="text-left">
              <div className="font-medium">{template.name}</div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {template.description}
              </div>
            </div>
          </Button>
        ))}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            No matching symptoms found
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomSearch;