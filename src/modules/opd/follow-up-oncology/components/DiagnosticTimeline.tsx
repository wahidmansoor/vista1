import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Image, TestTube, Microscope, CheckCircle2 } from 'lucide-react';

interface TimelineEvent {
  type: 'first_visit' | 'imaging' | 'biopsy' | 'histopathology' | 'molecular' | 'final';
  date: string;
  detail: string;
  status: 'completed' | 'pending' | 'scheduled';
}

interface DiagnosticTimelineProps {
  events: TimelineEvent[];
}

const eventIcons = {
  first_visit: Calendar,
  imaging: Image,
  biopsy: TestTube,
  histopathology: Microscope,
  molecular: FileText,
  final: CheckCircle2
};

const eventLabels = {
  first_visit: 'First Visit',
  imaging: 'Imaging',
  biopsy: 'Biopsy',
  histopathology: 'Histopathology',
  molecular: 'Molecular Testing',
  final: 'Final Diagnosis'
};

export const DiagnosticTimeline: React.FC<DiagnosticTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-600" />
        Diagnostic Timeline
      </h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {/* Timeline events */}
        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = eventIcons[event.type];
            return (
              <motion.div
                key={event.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4 pl-8"
              >
                <div className={`absolute left-0 p-1 rounded-full bg-white ring-2 ${
                  event.status === 'completed' ? 'ring-green-500' :
                  event.status === 'scheduled' ? 'ring-blue-500' :
                  'ring-gray-300'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    event.status === 'completed' ? 'text-green-500' :
                    event.status === 'scheduled' ? 'text-blue-500' :
                    'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1 bg-white rounded-lg border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{eventLabels[event.type]}</h4>
                      <p className="text-sm text-gray-600">{event.detail}</p>
                    </div>
                    <time className="text-sm text-gray-500">{event.date}</time>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};