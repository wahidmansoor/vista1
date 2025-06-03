import React, { useState, useEffect } from 'react';
import { Search, Microscope, BookOpen, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CancerType } from '../../../types/enhanced-evaluation';

interface HistologyType {
  code: string;
  name: string;
  description: string;
  category: string;
  frequency: 'common' | 'uncommon' | 'rare';
  grade?: string[];
  subtypes?: string[];
  prognosis: 'excellent' | 'good' | 'fair' | 'poor' | 'variable';
  features: string[];
  markers?: string[];
  treatmentImplications?: string[];
}

interface HistologyData {
  histology: string;
  grade?: string;
  subtype?: string;
  percentageOfCells?: number;
  differentiationLevel?: 'well' | 'moderate' | 'poor' | 'undifferentiated';
  invasionPattern?: string;
  lymphovascularInvasion?: boolean;
  perineuralInvasion?: boolean;
  notes?: string;
}

interface HistologySelectorProps {
  cancerType: CancerType;
  value: HistologyData;
  onChange: (data: HistologyData) => void;
  showDetails?: boolean;
  showGrading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Histology configurations for different cancer types
const histologyConfigs: Record<CancerType, HistologyType[]> = {
  breast: [
    {
      code: '8500/3',
      name: 'Invasive Ductal Carcinoma (IDC)',
      description: 'Most common invasive breast cancer',
      category: 'Epithelial',
      frequency: 'common',
      grade: ['1', '2', '3'],
      prognosis: 'variable',
      features: ['Duct formation', 'Pleomorphism', 'Mitotic activity'],
      markers: ['ER', 'PR', 'HER2', 'Ki-67'],
      treatmentImplications: ['Hormone therapy sensitivity', 'HER2 targeting', 'Chemotherapy response']
    },
    {
      code: '8520/3',
      name: 'Invasive Lobular Carcinoma (ILC)',
      description: 'Second most common invasive breast cancer',
      category: 'Epithelial',
      frequency: 'common',
      grade: ['1', '2', '3'],
      prognosis: 'good',
      features: ['Single file pattern', 'Minimal desmoplasia', 'E-cadherin loss'],
      markers: ['ER+', 'PR+', 'HER2-'],
      treatmentImplications: ['Often hormone receptor positive', 'May be missed on imaging']
    },
    {
      code: '8530/3',
      name: 'Inflammatory Carcinoma',
      description: 'Aggressive form with skin involvement',
      category: 'Epithelial',
      frequency: 'rare',
      prognosis: 'poor',
      features: ['Dermal lymphatic invasion', 'Peau d\'orange appearance'],
      treatmentImplications: ['Neoadjuvant chemotherapy', 'Radiation therapy']
    },
    {
      code: '8510/3',
      name: 'Medullary Carcinoma',
      description: 'Well-circumscribed tumor with lymphoid infiltrate',
      category: 'Epithelial',
      frequency: 'uncommon',
      prognosis: 'good',
      features: ['High grade nuclei', 'Lymphoid infiltrate', 'Pushing borders'],
      markers: ['Triple negative', 'BRCA1 associated']
    },
    {
      code: '8540/3',
      name: 'Mucinous Carcinoma',
      description: 'Characterized by abundant extracellular mucin',
      category: 'Epithelial',
      frequency: 'uncommon',
      prognosis: 'excellent',
      features: ['Extracellular mucin pools', 'Low grade nuclei'],
      markers: ['ER+', 'PR+', 'HER2-']
    }
  ],
  lung: [
    {
      code: '8140/3',
      name: 'Adenocarcinoma',
      description: 'Most common lung cancer type',
      category: 'Non-small cell',
      frequency: 'common',
      subtypes: ['Lepidic', 'Acinar', 'Papillary', 'Micropapillary', 'Solid'],
      prognosis: 'variable',
      features: ['Glandular formation', 'Mucin production'],
      markers: ['TTF-1', 'Napsin A', 'EGFR', 'ALK', 'ROS1', 'PD-L1'],
      treatmentImplications: ['Targeted therapy options', 'Immunotherapy candidates']
    },
    {
      code: '8070/3',
      name: 'Squamous Cell Carcinoma',
      description: 'Second most common lung cancer',
      category: 'Non-small cell',
      frequency: 'common',
      grade: ['1', '2', '3'],
      prognosis: 'variable',
      features: ['Keratinization', 'Intercellular bridges'],
      markers: ['p40', 'p63', 'CK5/6'],
      treatmentImplications: ['Limited targeted options', 'Immunotherapy responsive']
    },
    {
      code: '8041/3',
      name: 'Small Cell Carcinoma',
      description: 'Aggressive neuroendocrine tumor',
      category: 'Small cell',
      frequency: 'uncommon',
      prognosis: 'poor',
      features: ['Small cells', 'High mitotic rate', 'Neuroendocrine markers'],
      markers: ['TTF-1', 'Synaptophysin', 'Chromogranin', 'CD56'],
      treatmentImplications: ['Chemotherapy sensitive', 'Rapid progression']
    },
    {
      code: '8012/3',
      name: 'Large Cell Carcinoma',
      description: 'Undifferentiated non-small cell carcinoma',
      category: 'Non-small cell',
      frequency: 'uncommon',
      prognosis: 'poor',
      features: ['Large cells', 'Prominent nucleoli', 'Lack of differentiation'],
      treatmentImplications: ['Limited treatment options', 'Aggressive behavior']
    }
  ],
  colorectal: [
    {
      code: '8140/3',
      name: 'Adenocarcinoma',
      description: 'Most common colorectal cancer',
      category: 'Epithelial',
      frequency: 'common',
      grade: ['1', '2', '3'],
      prognosis: 'variable',
      features: ['Glandular formation', 'Variable differentiation'],
      markers: ['CEA', 'CK20', 'CDX2', 'MSI', 'KRAS', 'BRAF'],
      treatmentImplications: ['MSI status affects immunotherapy', 'KRAS/BRAF mutations affect targeting']
    },
    {
      code: '8480/3',
      name: 'Mucinous Adenocarcinoma',
      description: 'Adenocarcinoma with abundant mucin',
      category: 'Epithelial',
      frequency: 'uncommon',
      prognosis: 'variable',
      features: ['Extracellular mucin pools', '>50% mucin component'],
      markers: ['Often MSI-H', 'BRAF mutations']
    },
    {
      code: '8490/3',
      name: 'Signet Ring Cell Carcinoma',
      description: 'Poorly differentiated with intracellular mucin',
      category: 'Epithelial',
      frequency: 'rare',
      prognosis: 'poor',
      features: ['Signet ring morphology', 'Intracellular mucin'],
      treatmentImplications: ['Aggressive behavior', 'Poor response to therapy']
    }
  ]
} as Record<CancerType, HistologyType[]>;

const getFrequencyConfig = (frequency: string) => {
  switch (frequency) {
    case 'common':
      return { color: 'text-green-700', bg: 'bg-green-50', label: 'Common' };
    case 'uncommon':
      return { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Uncommon' };
    case 'rare':
      return { color: 'text-red-700', bg: 'bg-red-50', label: 'Rare' };
    default:
      return { color: 'text-gray-700', bg: 'bg-gray-50', label: 'Unknown' };
  }
};

const getPrognosisConfig = (prognosis: string) => {
  switch (prognosis) {
    case 'excellent':
      return { color: 'text-green-700', bg: 'bg-green-50', label: 'Excellent' };
    case 'good':
      return { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Good' };
    case 'fair':
      return { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Fair' };
    case 'poor':
      return { color: 'text-red-700', bg: 'bg-red-50', label: 'Poor' };
    case 'variable':
      return { color: 'text-purple-700', bg: 'bg-purple-50', label: 'Variable' };
    default:
      return { color: 'text-gray-700', bg: 'bg-gray-50', label: 'Unknown' };
  }
};

export const HistologySelector: React.FC<HistologySelectorProps> = ({
  cancerType,
  value,
  onChange,
  showDetails = true,
  showGrading = true,
  disabled = false,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHistology, setSelectedHistology] = useState<HistologyType | null>(null);
  const [activeTab, setActiveTab] = useState('selection');
  
  const histologyOptions = histologyConfigs[cancerType] || [];
  
  // Filter histology options based on search term
  const filteredOptions = histologyOptions.filter(
    option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.code.includes(searchTerm)
  );
  
  useEffect(() => {
    // Find selected histology details
    const selected = histologyOptions.find(option => option.name === value.histology);
    setSelectedHistology(selected || null);
  }, [value.histology, histologyOptions]);
  
  const handleHistologyChange = (histologyName: string) => {
    const histology = histologyOptions.find(option => option.name === histologyName);
    onChange({
      ...value,
      histology: histologyName,
      grade: undefined, // Reset grade when changing histology
      subtype: undefined // Reset subtype when changing histology
    });
  };
  
  const handleGradeChange = (grade: string) => {
    onChange({
      ...value,
      grade
    });
  };
  
  const handleSubtypeChange = (subtype: string) => {
    onChange({
      ...value,
      subtype
    });
  };
  
  const handleFieldChange = (field: keyof HistologyData, newValue: any) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Microscope className="h-5 w-5" />
          <span>Histological Classification</span>
          {selectedHistology && (
            <Badge variant="outline" className="text-xs">
              {selectedHistology.code}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Pathological classification and tumor characteristics for {cancerType} cancer
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="selection">Histology</TabsTrigger>
            <TabsTrigger value="grading" disabled={!showGrading || !selectedHistology}>Grading</TabsTrigger>
            <TabsTrigger value="details" disabled={!showDetails || !selectedHistology}>Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="selection" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search histology types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={disabled}
              />
            </div>
            
            {/* Histology Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Histological Type</label>
              <Select
                value={value.histology}
                onValueChange={handleHistologyChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select histological type" />
                </SelectTrigger>
                <SelectContent>
                  {filteredOptions.map((option) => {
                    const frequencyConfig = getFrequencyConfig(option.frequency);
                    const prognosisConfig = getPrognosisConfig(option.prognosis);
                    
                    return (
                      <SelectItem key={option.code} value={option.name}>
                        <div className="flex flex-col py-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{option.name}</span>
                            <Badge variant="outline" className={cn('text-xs', frequencyConfig.color)}>
                              {frequencyConfig.label}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-600">{option.description}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">Code: {option.code}</span>
                            <Badge variant="outline" className={cn('text-xs', prognosisConfig.color)}>
                              {prognosisConfig.label} prognosis
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            {/* Selected Histology Summary */}
            {selectedHistology && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">{selectedHistology.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">{selectedHistology.description}</p>
                    
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge variant="outline" className={cn('text-xs', getFrequencyConfig(selectedHistology.frequency).color)}>
                        {getFrequencyConfig(selectedHistology.frequency).label}
                      </Badge>
                      <Badge variant="outline" className={cn('text-xs', getPrognosisConfig(selectedHistology.prognosis).color)}>
                        {getPrognosisConfig(selectedHistology.prognosis).label} prognosis
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {selectedHistology.features && selectedHistology.features.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-blue-800">Key Features:</span>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      {selectedHistology.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Subtypes */}
            {selectedHistology?.subtypes && selectedHistology.subtypes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtype</label>
                <Select
                  value={value.subtype || ''}
                  onValueChange={handleSubtypeChange}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subtype (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedHistology.subtypes.map((subtype) => (
                      <SelectItem key={subtype} value={subtype}>
                        {subtype}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pathology Notes</label>
              <Textarea
                value={value.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Additional pathological findings, morphology details, or special features..."
                disabled={disabled}
                rows={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="grading" className="space-y-4">
            {selectedHistology?.grade && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Histological Grade</label>
                  <Select
                    value={value.grade || ''}
                    onValueChange={handleGradeChange}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedHistology.grade.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Differentiation Level</label>
                  <Select
                    value={value.differentiationLevel || ''}
                    onValueChange={(val) => handleFieldChange('differentiationLevel', val)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select differentiation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well">Well differentiated</SelectItem>
                      <SelectItem value="moderate">Moderately differentiated</SelectItem>
                      <SelectItem value="poor">Poorly differentiated</SelectItem>
                      <SelectItem value="undifferentiated">Undifferentiated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Percentage of Tumor Cells (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={value.percentageOfCells || ''}
                    onChange={(e) => handleFieldChange('percentageOfCells', parseInt(e.target.value))}
                    disabled={disabled}
                    placeholder="e.g., 80"
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Invasion Pattern</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invasion Type</label>
                    <Input
                      value={value.invasionPattern || ''}
                      onChange={(e) => handleFieldChange('invasionPattern', e.target.value)}
                      placeholder="e.g., Expansile, Infiltrative, Pushing borders"
                      disabled={disabled}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value.lymphovascularInvasion || false}
                        onChange={(e) => handleFieldChange('lymphovascularInvasion', e.target.checked)}
                        disabled={disabled}
                        className="rounded"
                      />
                      <span className="text-sm">Lymphovascular invasion</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value.perineuralInvasion || false}
                        onChange={(e) => handleFieldChange('perineuralInvasion', e.target.checked)}
                        disabled={disabled}
                        className="rounded"
                      />
                      <span className="text-sm">Perineural invasion</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {!selectedHistology?.grade && (
              <div className="text-center py-8 text-gray-500">
                <Microscope className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Grading not applicable for selected histology type</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            {selectedHistology && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Classification Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Morphology Code:</span>
                        <span className="font-mono">{selectedHistology.code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span>{selectedHistology.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frequency:</span>
                        <Badge variant="outline" className={cn('text-xs', getFrequencyConfig(selectedHistology.frequency).color)}>
                          {getFrequencyConfig(selectedHistology.frequency).label}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prognosis:</span>
                        <Badge variant="outline" className={cn('text-xs', getPrognosisConfig(selectedHistology.prognosis).color)}>
                          {getPrognosisConfig(selectedHistology.prognosis).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedHistology.markers && selectedHistology.markers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Immunohistochemical Markers</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedHistology.markers.map((marker, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {marker}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedHistology.treatmentImplications && selectedHistology.treatmentImplications.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Treatment Implications</h4>
                    <ul className="space-y-2">
                      {selectedHistology.treatmentImplications.map((implication, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{implication}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong>Note:</strong> Histological classification should be confirmed by qualified pathologists. 
                      This tool provides reference information only.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HistologySelector;
