import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Brain, HeartHandshake } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { format, subDays } from 'date-fns';
import { Assessment } from '../hooks/usePsychosocialData';
import { sortByDate } from '../../../utils/palliativeUtils';

interface AssessmentTrendsProps {
  assessments: Assessment[];
  type: Assessment['type'];
}

const AssessmentTrends: React.FC<AssessmentTrendsProps> = ({ assessments, type }) => {
  const chartData = useMemo(() => {
    const typeAssessments = assessments.filter(a => a.type === type);
    const sortedAssessments = sortByDate(typeAssessments, 'asc');
    
    // Ensure we have data points for the last 30 days
    const today = new Date();
    const data = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const assessment = sortedAssessments.find(a => 
        format(new Date(a.date), 'yyyy-MM-dd') === dateStr
      );

      return {
        date: dateStr,
        score: assessment?.score ?? null
      };
    });

    return data;
  }, [assessments, type]);

  const assessmentTitle = {
    distress: "Distress Level",
    anxiety: "Anxiety Level",
    depression: "Depression Level",
    social: "Social Support"
  }[type];

  const getIcon = () => {
    switch (type) {
      case 'distress':
      case 'anxiety':
      case 'depression':
        return Brain;
      case 'social':
        return HeartHandshake;
      default:
        return Brain;
    }
  };

  const Icon = getIcon();
  const latestScore = chartData.filter(d => d.score !== null).slice(-1)[0]?.score;
  const averageScore = useMemo(() => {
    const scores = chartData.filter(d => d.score !== null).map(d => d.score!);
    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 'N/A';
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {assessmentTitle}
          </div>
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Latest</span>
            <span className="font-bold">{latestScore ?? 'N/A'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Average</span>
            <span className="font-bold">{averageScore}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf680"
                strokeWidth={2}
                dot={(props: any) => {
                  if (props.payload.score === null) return null;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={4}
                      fill="#8b5cf6"
                      stroke="#fff"
                      strokeWidth={2}
                      className="recharts-dot"
                    />
                  ) as any;
                }}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM d')}
                fontSize={12}
                tickMargin={8}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                labelFormatter={(date) => format(new Date(date), 'MMM d, yyyy')}
                formatter={(value: any) => [value || 'No data', assessmentTitle]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentTrends;