import React, { useState } from 'react';
import { ClinicalRecommendation, RecommendationUrgency, ScreeningTestType } from '../types/clinical';

interface RecommendationPanelProps {
  recommendations: ClinicalRecommendation[];
  onAction?: (action: string, rec: ClinicalRecommendation) => void;
}

const urgencyColor = {
  [RecommendationUrgency.EMERGENT]: 'bg-red-600 text-white',
  [RecommendationUrgency.URGENT]: 'bg-red-500 text-white',
  [RecommendationUrgency.SOON]: 'bg-yellow-400 text-black',
  [RecommendationUrgency.ROUTINE]: 'bg-green-500 text-white',
  [RecommendationUrgency.FUTURE]: 'bg-green-300 text-black',
  [RecommendationUrgency.NOT_INDICATED]: 'bg-gray-300 text-gray-700',
};

const urgencyLabel = {
  [RecommendationUrgency.EMERGENT]: 'URGENT',
  [RecommendationUrgency.URGENT]: 'URGENT',
  [RecommendationUrgency.SOON]: 'DUE',
  [RecommendationUrgency.ROUTINE]: 'DUE',
  [RecommendationUrgency.FUTURE]: 'FUTURE',
  [RecommendationUrgency.NOT_INDICATED]: 'NOT INDICATED',
};

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ recommendations, onAction }) => {
  return (
    <div className="space-y-4 print:bg-white print:text-black">
      {recommendations.map((rec, idx) => (
        <RecommendationCard key={idx} recommendation={rec} onAction={onAction} />
      ))}
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: ClinicalRecommendation;
  onAction?: (action: string, rec: ClinicalRecommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const colorClass = urgencyColor[recommendation.urgency] || 'bg-gray-200';
  const label = urgencyLabel[recommendation.urgency] || 'RECOMMENDATION';

  return (
    <div className={`rounded-lg shadow-md border p-4 ${colorClass} print:border-black print:shadow-none`}>
      <div className="flex items-center justify-between">
        <div className="font-bold text-lg">{label}: {recommendation.test_recommended.replace(/_/g, ' ').toUpperCase()}</div>
        <button
          className="underline text-sm ml-2"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className="mt-2">
        <div className="font-semibold">For: {recommendation.cancer_type.replace(/_/g, ' ').toUpperCase()}</div>
        <div className="text-sm mt-1">{recommendation.rationale.key_factors.join('; ')}</div>
        <div className="text-sm mt-1 italic">{recommendation.rationale.clinical_reasoning.split('. ')[0]}.</div>
      </div>
      {expanded && (
        <div className="mt-3 bg-white bg-opacity-80 rounded p-3 text-black print:bg-transparent">
          <div className="font-semibold mb-1">Detailed Evidence Review</div>
          <div className="text-xs mb-2">{recommendation.rationale.clinical_reasoning}</div>
          <div className="mb-2">
            <span className="font-semibold">Guideline Source: </span>
            <a href={getGuidelineLink(recommendation.rationale.guideline_source)} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
              {recommendation.rationale.guideline_source}
            </a>
            {recommendation.rationale.recommendation_grade && (
              <span className="ml-2">({recommendation.rationale.recommendation_grade})</span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Risk-Benefit: </span>
            {recommendation.rationale.evidence_quality || 'Not specified'}
          </div>
          {recommendation.alternative_tests && recommendation.alternative_tests.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Alternatives: </span>
              {recommendation.alternative_tests.map((t) => t.replace(/_/g, ' ')).join(', ')}
            </div>
          )}
          {recommendation.patient_instructions && (
            <div className="mb-2">
              <span className="font-semibold">Test Preparation: </span>
              {recommendation.patient_instructions}
            </div>
          )}
          {recommendation.special_considerations && recommendation.special_considerations.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Special Considerations: </span>
              {recommendation.special_considerations.join('; ')}
            </div>
          )}
          <div className="mt-2">
            <span className="font-semibold">Patient Education: </span>
            <ul className="list-disc ml-6 text-xs">
              <li>What to expect: {getTestDescription(recommendation.test_recommended)}</li>
              <li>Risk explained: {getLayRiskExplanation(recommendation)}</li>
              <li>Shared decision: Discuss benefits, risks, and preferences with your provider.</li>
            </ul>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onAction?.('referral', recommendation)}>Generate Referral</button>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => onAction?.('order', recommendation)}>Order Test</button>
            <button className="bg-yellow-500 text-black px-3 py-1 rounded" onClick={() => onAction?.('reminder', recommendation)}>Schedule Reminder</button>
            <button className="bg-gray-700 text-white px-3 py-1 rounded" onClick={() => onAction?.('followup', recommendation)}>Setup Follow-up</button>
            <button className="bg-gray-400 text-black px-3 py-1 rounded print:hidden" onClick={() => window.print()}>Print</button>
          </div>
        </div>
      )}
    </div>
  );
};

function getGuidelineLink(source: string): string {
  if (source.toLowerCase().includes('uspstf')) return 'https://www.uspreventiveservicestaskforce.org/';
  if (source.toLowerCase().includes('acs')) return 'https://www.cancer.org/health-care-professionals/american-cancer-society-prevention-early-detection-guidelines.html';
  if (source.toLowerCase().includes('nccn')) return 'https://www.nccn.org/guidelines/category_2';
  return '#';
}

function getTestDescription(test: ScreeningTestType): string {
  switch (test) {
    case ScreeningTestType.MAMMOGRAM:
      return 'A low-dose X-ray of the breast to detect cancer early.';
    case ScreeningTestType.COLONOSCOPY:
      return 'A procedure to examine the colon and rectum for polyps or cancer.';
    case ScreeningTestType.PAP_SMEAR:
      return 'A test to detect cervical cancer by examining cervical cells.';
    case ScreeningTestType.HPV_TEST:
      return 'A test for high-risk HPV types that can cause cervical cancer.';
    case ScreeningTestType.LOW_DOSE_CT:
      return 'A CT scan to screen for lung cancer in high-risk individuals.';
    default:
      return 'A recommended screening test.';
  }
}

function getLayRiskExplanation(rec: ClinicalRecommendation): string {
  switch (rec.cancer_type) {
    case 'breast':
      return 'Screening can find breast cancer early, when it is most treatable.';
    case 'colorectal':
      return 'Colorectal screening can prevent cancer by finding and removing polyps.';
    case 'lung':
      return 'Lung screening helps detect cancer early in high-risk people.';
    default:
      return 'Screening helps find cancer early and improves outcomes.';
  }
}

export default RecommendationPanel;
