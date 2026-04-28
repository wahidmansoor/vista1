import { ONCOLOGY_PROTOCOLS } from '../data/oncologyProtocols';
import { ProtocolMatcher } from './protocolMatcher';
const scenarios = [
    {
        name: "HER2+ Breast Cancer (1L) - Should match THP",
        disease: {
            primaryDiagnosis: 'Breast Cancer',
            stageAtDiagnosis: 'IV',
            biomarkers: [{ name: 'HER2', status: 'Positive' }]
        },
        history: [],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['BR-HER2-001'],
        forbiddenEligibleIds: ['BR-BRCA-001']
    },
    {
        name: "PD-L1 High NSCLC (1L) - Should match Pembrolizumab",
        disease: {
            primaryDiagnosis: 'Non-Small Cell Lung Cancer (NSCLC)',
            histology: 'Adenocarcinoma',
            stageAtDiagnosis: 'IV',
            biomarkers: [
                { name: 'PD-L1', status: 'High (>=50%)' },
                { name: 'EGFR', status: 'Negative' },
                { name: 'ALK', status: 'Negative' }
            ]
        },
        history: [],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['LU-PDL1-001'],
        forbiddenEligibleIds: ['LU-EGFR-001']
    },
    {
        name: "Squamous NSCLC - Should block Pemetrexed",
        disease: {
            primaryDiagnosis: 'Non-Small Cell Lung Cancer (NSCLC)',
            histology: 'Squamous Cell Carcinoma',
            stageAtDiagnosis: 'IV',
            biomarkers: [{ name: 'PD-L1', status: 'High (>=50%)' }]
        },
        history: [],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['LU-PDL1-001'],
        forbiddenEligibleIds: ['LU-ADENO-001'] // Nonsquamous specific
    },
    {
        name: "mHSPC Prostate - Should match Docetaxel ADT",
        disease: {
            primaryDiagnosis: 'Prostate Cancer',
            stageAtDiagnosis: 'IV',
            biomarkers: []
        },
        history: [],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['PR-MHSPC-001'],
        forbiddenEligibleIds: ['PR-MCRPC-001']
    },
    {
        name: "mCRPC Prostate (Post-Enzalutamide) - Should match Docetaxel",
        disease: {
            primaryDiagnosis: 'Prostate Cancer',
            stageAtDiagnosis: 'IV',
            biomarkers: []
        },
        history: [{
                treatmentLine: '1',
                agents: ['Enzalutamide'],
                startDate: '2025-01-01',
                treatmentResponse: 'Progressed'
            }],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['PR-MCRPC-001'],
        forbiddenEligibleIds: ['PR-MHSPC-001']
    },
    {
        name: "MSI-H Colorectal (1L) - Should match Pembrolizumab",
        disease: {
            primaryDiagnosis: 'Colorectal Cancer',
            stageAtDiagnosis: 'IV',
            biomarkers: [{ name: 'MSI', status: 'High' }]
        },
        history: [],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['CO-MSI-001'],
        forbiddenEligibleIds: ['CO-RAS-001']
    },
    {
        name: "RAS-mutant CRC (1L) - Should block Anti-EGFR",
        disease: {
            primaryDiagnosis: 'Colorectal Cancer',
            stageAtDiagnosis: 'IV',
            biomarkers: [{ name: 'RAS', status: 'Mutant' }]
        },
        history: [],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['CO-ADJ-001'], // Technically 1L/Adj mix for demo
        forbiddenEligibleIds: ['CO-RAS-001']
    },
    {
        name: "RCC (2L) - Should match Cabozantinib after immunotherapy",
        disease: {
            primaryDiagnosis: 'Renal Cell Carcinoma',
            histology: 'Clear Cell',
            stageAtDiagnosis: 'IV',
            biomarkers: []
        },
        history: [{
                treatmentLine: '1',
                agents: ['Oxaliplatin', '5-FU'],
                startDate: '2025-01-01',
                treatmentResponse: 'Stable'
            }],
        ps: { performanceScore: '1', performanceScale: 'ECOG' },
        expectedEligibleIds: ['RC-2L-001'],
        forbiddenEligibleIds: ['RC-1L-001']
    }
];
function runValidation() {
    console.log("=== Treatment Protocol Matcher Validation Report ===");
    let passed = 0;
    let failed = 0;
    scenarios.forEach(scenario => {
        // Fill in missing properties for type safety if needed for matcher
        const disease = {
            primaryDiagnosis: '',
            stageAtDiagnosis: 'IV',
            biomarkers: [],
            dateOfDiagnosis: '2025-01-01',
            ...scenario.disease
        };
        const history = (scenario.history || []).map(h => ({
            treatmentLine: '1',
            treatmentRegimen: '',
            agents: [],
            startDate: '2025-01-01',
            treatmentResponse: 'Stable',
            ...h
        }));
        const ps = {
            assessmentDate: '2025-01-01',
            performanceScale: 'ECOG',
            performanceScore: '1',
            ...scenario.ps
        };
        const matcher = new ProtocolMatcher(ONCOLOGY_PROTOCOLS);
        const matches = matcher.findMatches(disease, ps, history);
        const eligibleIds = matches
            .filter(m => m.isEligible)
            .map(m => m.protocol.id);
        const missingExpected = scenario.expectedEligibleIds.filter(id => !eligibleIds.includes(id));
        const containingForbidden = scenario.forbiddenEligibleIds.filter(id => eligibleIds.includes(id));
        if (missingExpected.length === 0 && containingForbidden.length === 0) {
            console.log(`✅ PASSED: ${scenario.name}`);
            passed++;
        }
        else {
            console.log(`❌ FAILED: ${scenario.name}`);
            if (missingExpected.length > 0) {
                console.log(`   - Missing expected IDs: ${missingExpected.join(', ')}`);
            }
            if (containingForbidden.length > 0) {
                console.log(`   - Incorrectly included forbidden IDs: ${containingForbidden.join(', ')}`);
            }
            console.log(`   - Found eligible IDs: ${eligibleIds.join(', ')}`);
            failed++;
        }
    });
    console.log("\n=== Summary ===");
    console.log(`Total: ${scenarios.length} | Passed: ${passed} | Failed: ${failed}`);
}
runValidation();
