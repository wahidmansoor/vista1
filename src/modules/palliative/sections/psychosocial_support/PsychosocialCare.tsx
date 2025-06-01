import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Brain, HeartHandshake, Plus, LucideIcon } from 'lucide-react';
import { usePsychosocialData, AssessmentType } from './hooks/usePsychosocialData';
import { sortByDate } from '../../utils/palliativeUtils';
import { formatDate } from '@/utils/formatDate';
import AssessmentTrends from './components/AssessmentTrends';

const assessmentTypes: { type: AssessmentType; label: string; icon: LucideIcon }[] = [
  { type: 'distress', label: 'Distress', icon: Brain },
  { type: 'anxiety', label: 'Anxiety', icon: Brain },
  { type: 'depression', label: 'Depression', icon: Brain },
  { type: 'social', label: 'Social Support', icon: HeartHandshake },
];

const NewAssessmentDialog: React.FC<{
  onSubmit: (type: AssessmentType, score: number, notes: string) => void;
}> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<AssessmentType>('distress');
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(type, score, notes);
    setOpen(false);
    setScore(5);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Assessment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Assessment Type</label>
            <Tabs value={type} onValueChange={(value) => setType(value as AssessmentType)}>
              <TabsList className="grid grid-cols-2 gap-2">
                {assessmentTypes.map(({ type, label }) => (
                  <TabsTrigger key={type} value={type} className="w-full">
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Score (0-10)</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[score]}
                onValueChange={([value]) => setScore(value)}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="font-medium">{score}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes..."
              className="h-24"
            />
          </div>

          <Button type="submit" className="w-full">
            Save Assessment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PsychosocialCare: React.FC = () => {
  const { assessments, addAssessment } = usePsychosocialData();
  
  const handleNewAssessment = (type: AssessmentType, score: number, notes: string) => {
    addAssessment(type, score, notes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Psychosocial Assessment</h2>
        <NewAssessmentDialog onSubmit={handleNewAssessment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessmentTypes.map(({ type }) => (
          <AssessmentTrends
            key={type}
            assessments={assessments}
            type={type}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortByDate(assessments).slice(0, 5).map((assessment) => {
              const { type, score, notes, date, id } = assessment;
              const assessmentType = assessmentTypes.find(t => t.type === type);
              const Icon = assessmentType?.icon || Brain;

              return (
                <div key={id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{assessmentType?.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(date)}
                      </p>
                    </div>
                    <p className="mt-1">Score: {score}/10</p>
                    {notes && (
                      <p className="mt-2 text-sm text-muted-foreground">{notes}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychosocialCare;