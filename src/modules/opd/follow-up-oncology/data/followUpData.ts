interface TimelineEvent {
  type: 'first_visit' | 'imaging' | 'biopsy' | 'histopathology' | 'molecular' | 'final';
  date: string;
  detail: string;
  status: 'completed' | 'pending' | 'scheduled';
}

interface PerformanceData {
  date: string;
  ecog: number;
  kps: number;
}

export const mockDiagnosticEvents: { [key: string]: TimelineEvent[] } = {
  breast: [
    {
      type: 'first_visit',
      date: '2025-03-15',
      detail: 'Initial consultation for breast lump',
      status: 'completed'
    },
    {
      type: 'imaging',
      date: '2025-03-18',
      detail: 'Mammogram and breast ultrasound',
      status: 'completed'
    },
    {
      type: 'biopsy',
      date: '2025-03-22',
      detail: 'Core needle biopsy performed',
      status: 'completed'
    },
    {
      type: 'histopathology',
      date: '2025-03-28',
      detail: 'Invasive ductal carcinoma confirmed',
      status: 'completed'
    },
    {
      type: 'molecular',
      date: '2025-04-02',
      detail: 'ER+/PR+, HER2-, Ki-67 25%',
      status: 'completed'
    },
    {
      type: 'final',
      date: '2025-04-05',
      detail: 'Stage IIA (T2N0M0) breast cancer diagnosis',
      status: 'completed'
    }
  ],
  lung: [
    {
      type: 'first_visit',
      date: '2025-03-10',
      detail: 'Referral for persistent cough and weight loss',
      status: 'completed'
    },
    {
      type: 'imaging',
      date: '2025-03-12',
      detail: 'Chest CT showing RUL mass',
      status: 'completed'
    },
    {
      type: 'biopsy',
      date: '2025-03-16',
      detail: 'CT-guided needle biopsy',
      status: 'completed'
    },
    {
      type: 'histopathology',
      date: '2025-03-20',
      detail: 'Non-small cell lung cancer (adenocarcinoma)',
      status: 'completed'
    },
    {
      type: 'molecular',
      date: '2025-03-25',
      detail: 'Pending molecular testing results',
      status: 'scheduled'
    },
    {
      type: 'final',
      date: '2025-03-28',
      detail: 'Awaiting complete staging workup',
      status: 'pending'
    }
  ]
};

export const mockPerformanceData: { [key: string]: PerformanceData[] } = {
  breast: [
    { date: '2025-03-15', ecog: 0, kps: 100 },
    { date: '2025-03-28', ecog: 0, kps: 90 },
    { date: '2025-04-10', ecog: 1, kps: 80 },
    { date: '2025-04-25', ecog: 1, kps: 80 },
    { date: '2025-05-01', ecog: 0, kps: 90 }
  ],
  lung: [
    { date: '2025-03-10', ecog: 1, kps: 80 },
    { date: '2025-03-24', ecog: 1, kps: 70 },
    { date: '2025-04-07', ecog: 2, kps: 60 },
    { date: '2025-04-21', ecog: 1, kps: 70 },
    { date: '2025-05-01', ecog: 1, kps: 80 }
  ]
};