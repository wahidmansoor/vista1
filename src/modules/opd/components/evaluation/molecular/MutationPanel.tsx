import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DNA, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  FileText,
  Microscope,
  Zap,
  TrendingUp,
  Download,
  ExternalLink
} from 'lucide-react';
import type { MutationStatus, MutationProfile, CancerType } from '../../../types/enhanced-evaluation';

interface MutationPanelProps {
  cancerType: CancerType;
  mutations: MutationStatus;
  onMutationChange: (mutations: MutationStatus) => void;
  isReadOnly?: boolean;
  showTherapeuticImplications?: boolean;
}

const CANCER_MUTATION_PANELS = {
  breast: [
    { gene: 'TP53', significance: 'high', frequency: 60, actionable: false },
    { gene: 'PIK3CA', significance: 'high', frequency: 45, actionable: true },
    { gene: 'CDH1', significance: 'medium', frequency: 15, actionable: false },
    { gene: 'GATA3', significance: 'medium', frequency: 12, actionable: false },
    { gene: 'MAP3K1', significance: 'medium', frequency: 10, actionable: false },
    { gene: 'BRCA1', significance: 'high', frequency: 5, actionable: true },
    { gene: 'BRCA2', significance: 'high', frequency: 5, actionable: true },
    { gene: 'AKT1', significance: 'medium', frequency: 4, actionable: true },
    { gene: 'ESR1', significance: 'high', frequency: 3, actionable: true },
    { gene: 'ERBB2', significance: 'high', frequency: 3, actionable: true }
  ],
  lung: [
    { gene: 'EGFR', significance: 'high', frequency: 15, actionable: true },
    { gene: 'KRAS', significance: 'high', frequency: 25, actionable: true },
    { gene: 'ALK', significance: 'high', frequency: 5, actionable: true },
    { gene: 'ROS1', significance: 'high', frequency: 2, actionable: true },
    { gene: 'BRAF', significance: 'medium', frequency: 3, actionable: true },
    { gene: 'MET', significance: 'medium', frequency: 4, actionable: true },
    { gene: 'RET', significance: 'medium', frequency: 1, actionable: true },
    { gene: 'NTRK1', significance: 'medium', frequency: 1, actionable: true },
    { gene: 'TP53', significance: 'medium', frequency: 50, actionable: false },
    { gene: 'STK11', significance: 'medium', frequency: 10, actionable: false }
  ],
  colorectal: [
    { gene: 'KRAS', significance: 'high', frequency: 45, actionable: true },
    { gene: 'NRAS', significance: 'high', frequency: 5, actionable: true },
    { gene: 'BRAF', significance: 'high', frequency: 10, actionable: true },
    { gene: 'PIK3CA', significance: 'medium', frequency: 20, actionable: true },
    { gene: 'TP53', significance: 'medium', frequency: 60, actionable: false },
    { gene: 'APC', significance: 'medium', frequency: 80, actionable: false },
    { gene: 'FBXW7', significance: 'low', frequency: 15, actionable: false },
    { gene: 'SMAD4', significance: 'low', frequency: 20, actionable: false }
  ]
};

const THERAPEUTIC_IMPLICATIONS = {
  EGFR: {
    mutations: ['L858R', 'Exon 19 deletion', 'T790M'],
    therapies: ['Osimertinib', 'Erlotinib', 'Gefitinib', 'Afatinib'],
    resistance: ['T790M (acquired)', 'C797S', 'Amplification'],
    guidelines: 'NCCN Category 1 recommendation for first-line targeted therapy'
  },
  KRAS: {
    mutations: ['G12C', 'G12D', 'G12V', 'G13D'],
    therapies: ['Sotorasib (G12C)', 'Adagrasib (G12C)'],
    resistance: ['Multiple bypass mechanisms'],
    guidelines: 'G12C mutations are targetable with specific inhibitors'
  },
  BRCA1: {
    mutations: ['Germline pathogenic', 'Somatic pathogenic'],
    therapies: ['Olaparib', 'Talazoparib', 'Rucaparib', 'Niraparib'],
    resistance: ['Reversion mutations', 'Loss of 53BP1'],
    guidelines: 'PARP inhibitor therapy recommended for germline mutations'
  },
  BRCA2: {
    mutations: ['Germline pathogenic', 'Somatic pathogenic'],
    therapies: ['Olaparib', 'Talazoparib', 'Rucaparib', 'Niraparib'],
    resistance: ['Reversion mutations', 'Restoration of HR'],
    guidelines: 'PARP inhibitor therapy recommended for germline mutations'
  }
};

export function MutationPanel({ 
  cancerType, 
  mutations, 
  onMutationChange, 
  isReadOnly = false,
  showTherapeuticImplications = true 
}: MutationPanelProps) {
  const [activeTab, setActiveTab] = useState('panel');
  const [selectedGene, setSelectedGene] = useState<string | null>(null);

  const relevantGenes = CANCER_MUTATION_PANELS[cancerType] || CANCER_MUTATION_PANELS.lung;
  const completionRate = calculateCompletionRate();

  function calculateCompletionRate(): number {
    const totalGenes = relevantGenes.length;
    const testedGenes = Object.keys(mutations.tested || {}).length;
    return Math.round((testedGenes / totalGenes) * 100);
  }

  const updateMutation = (gene: string, field: string, value: any) => {
    if (isReadOnly) return;

    const updatedMutations = {
      ...mutations,
      tested: {
        ...mutations.tested,
        [gene]: {
          ...mutations.tested?.[gene],
          [field]: value
        }
      }
    };

    onMutationChange(updatedMutations);
  };

  const toggleGeneTest = (gene: string) => {
    if (isReadOnly) return;

    const isCurrentlyTested = mutations.tested?.[gene];
    if (isCurrentlyTested) {
      const { [gene]: removed, ...remaining } = mutations.tested || {};
      onMutationChange({
        ...mutations,
        tested: remaining
      });
    } else {
      updateMutation(gene, 'status', 'pending');
    }
  };

  const getGeneStatus = (gene: string) => {
    const geneData = mutations.tested?.[gene];
    if (!geneData) return 'not-tested';
    
    switch (geneData.status) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      case 'variant': return 'variant';
      case 'failed': return 'failed';
      default: return 'pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'bg-red-500';
      case 'negative': return 'bg-green-500';
      case 'variant': return 'bg-yellow-500';
      case 'failed': return 'bg-gray-500';
      case 'pending': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <AlertTriangle className="h-4 w-4" />;
      case 'negative': return <CheckCircle className="h-4 w-4" />;
      case 'variant': return <Target className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Microscope className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderGeneCard = (gene: any) => {
    const status = getGeneStatus(gene.gene);
    const geneData = mutations.tested?.[gene.gene];
    const isActionable = gene.actionable && status === 'positive';

    return (
      <Card 
        key={gene.gene} 
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          selectedGene === gene.gene ? 'ring-2 ring-blue-500' : ''
        } ${isActionable ? 'border-orange-200 bg-orange-50' : ''}`}
        onClick={() => setSelectedGene(selectedGene === gene.gene ? null : gene.gene)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{gene.gene}</h3>
              {isActionable && <Zap className="h-4 w-4 text-orange-500" />}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={gene.significance === 'high' ? 'destructive' : 
                           gene.significance === 'medium' ? 'default' : 'secondary'}>
                {gene.significance}
              </Badge>
              <Switch
                checked={!!mutations.tested?.[gene.gene]}
                onCheckedChange={() => toggleGeneTest(gene.gene)}
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Frequency: {gene.frequency}%
            </span>
            {geneData && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs text-white ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span className="capitalize">{status}</span>
              </div>
            )}
          </div>

          {geneData && selectedGene === gene.gene && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`${gene.gene}-status`}>Status</Label>
                  <select
                    id={`${gene.gene}-status`}
                    value={geneData.status || 'pending'}
                    onChange={(e) => updateMutation(gene.gene, 'status', e.target.value)}
                    disabled={isReadOnly}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="variant">VUS</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor={`${gene.gene}-vaf`}>VAF (%)</Label>
                  <Input
                    id={`${gene.gene}-vaf`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={geneData.vaf || ''}
                    onChange={(e) => updateMutation(gene.gene, 'vaf', parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`${gene.gene}-variant`}>Variant Details</Label>
                <Input
                  id={`${gene.gene}-variant`}
                  value={geneData.variant || ''}
                  onChange={(e) => updateMutation(gene.gene, 'variant', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., p.L858R, Exon 19 deletion"
                />
              </div>

              <div>
                <Label htmlFor={`${gene.gene}-notes`}>Clinical Notes</Label>
                <Textarea
                  id={`${gene.gene}-notes`}
                  value={geneData.notes || ''}
                  onChange={(e) => updateMutation(gene.gene, 'notes', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Additional clinical notes..."
                  rows={2}
                />
              </div>

              {showTherapeuticImplications && THERAPEUTIC_IMPLICATIONS[gene.gene as keyof typeof THERAPEUTIC_IMPLICATIONS] && (
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Therapeutic Options:</strong> {THERAPEUTIC_IMPLICATIONS[gene.gene as keyof typeof THERAPEUTIC_IMPLICATIONS].therapies.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DNA className="h-5 w-5 text-blue-600" />
            <CardTitle>Molecular Profiling</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Completion: {completionRate}%
            </div>
            <Progress value={completionRate} className="w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="panel">Gene Panel</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="panel" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {cancerType.charAt(0).toUpperCase() + cancerType.slice(1)} Cancer Panel
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Guidelines
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relevantGenes.map(renderGeneCard)}
            </div>

            {mutations.sequencingDetails && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Sequencing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Platform</Label>
                      <p className="text-sm text-muted-foreground">
                        {mutations.sequencingDetails.platform || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label>Coverage</Label>
                      <p className="text-sm text-muted-foreground">
                        {mutations.sequencingDetails.coverage || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label>Quality Score</Label>
                      <p className="text-sm text-muted-foreground">
                        {mutations.sequencingDetails.qualityScore || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <Label>Date</Label>
                      <p className="text-sm text-muted-foreground">
                        {mutations.sequencingDetails.date || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Actionable Mutations</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(mutations.tested || {})
                    .filter(([gene, data]) => data.status === 'positive' && 
                            relevantGenes.find(g => g.gene === gene)?.actionable)
                    .map(([gene, data]) => (
                      <div key={gene} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                        <div>
                          <h4 className="font-semibold">{gene}</h4>
                          <p className="text-sm text-muted-foreground">{data.variant}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">VAF: {data.vaf}%</p>
                          <Badge variant="secondary">Actionable</Badge>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Variants of Unknown Significance</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(mutations.tested || {})
                    .filter(([, data]) => data.status === 'variant')
                    .map(([gene, data]) => (
                      <div key={gene} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                        <div>
                          <h4 className="font-semibold">{gene}</h4>
                          <p className="text-sm text-muted-foreground">{data.variant}</p>
                        </div>
                        <Badge variant="outline">VUS</Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Molecular Reports</h3>
              <p className="text-muted-foreground mb-4">
                Upload and manage molecular pathology reports
              </p>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Upload Report
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
