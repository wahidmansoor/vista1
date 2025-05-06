declare module '../types/pathways' {
  export interface DetailedInfo {
    when: string;
    considerations: string[];
    outcomes: string[];
    followUp: string[];
  }

  export interface PathwayStep {
    id: string;
    title: string;
    description: string;
    options: {
      text: string;
      next: string;
    }[];
  }

  export interface DiagnosticPathway {
    name: string;
    steps: PathwayStep[];
  }
}
