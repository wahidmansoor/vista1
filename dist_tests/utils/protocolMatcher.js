export class ProtocolMatcher {
    protocols;
    DATASET_DISCLAIMER = "Note: Local protocol dataset is incomplete and requires expert oncology review.";
    constructor(protocols) {
        this.protocols = protocols;
    }
    /**
     * Phase 2A Matching Engine: Support for complex logic groups and negative biomarkers
     */
    findMatches(diseaseStatus, performanceStatus, treatmentHistory) {
        if (!diseaseStatus.primaryDiagnosis)
            return [];
        const currentLine = treatmentHistory.length + 1;
        const ecogScore = parseInt(performanceStatus.performanceScore || '0', 10);
        return this.protocols
            .map(protocol => this.evaluateProtocol(protocol, diseaseStatus, ecogScore, currentLine, treatmentHistory))
            // Filter out total mismatches but keep potential options for clinician awareness
            .filter(match => match.matchScore > 0 || match.status !== 'Not eligible')
            .sort((a, b) => {
            // Sort by Preferred Option first
            if (a.protocol.preferredOption && !b.protocol.preferredOption && a.isEligible)
                return -1;
            if (!a.protocol.preferredOption && b.protocol.preferredOption && b.isEligible)
                return 1;
            // Then by eligibility
            if (a.isEligible && !b.isEligible)
                return -1;
            if (!a.isEligible && b.isEligible)
                return 1;
            return b.matchScore - a.matchScore;
        });
    }
    evaluateProtocol(protocol, disease, ecog, currentLine, history) {
        // Basic Diagnosis Check
        if (protocol.diagnosis !== disease.primaryDiagnosis) {
            return this.createEmptyMatch(protocol);
        }
        let matchScore = 15;
        const warnings = [];
        let hasSafetyViolation = false;
        let hasStrictMismatch = false;
        let hasMissingData = false;
        // 1. Histology Matching (Safety Hardening)
        if (protocol.histology && protocol.histology.length > 0) {
            if (!disease.histology) {
                hasMissingData = true;
                warnings.push(`Missing Data: Histology not specified (Protocol requires: ${protocol.histology.join(', ')})`);
            }
            else if (!protocol.histology.includes(disease.histology)) {
                hasStrictMismatch = true;
                warnings.push(`Mismatch: Patient histology (${disease.histology}) is incompatible with this protocol`);
            }
        }
        // 0. Preferred Option Bonus
        if (protocol.preferredOption)
            matchScore += 10;
        // 1. Prior Therapy Agent Check (Safety)
        const duplicateAgents = this.checkPriorAgents(protocol, history);
        if (duplicateAgents.length > 0) {
            hasSafetyViolation = true;
            warnings.push(`Safety: Prior exposure to ${duplicateAgents.join(', ')}`);
        }
        // 2. Biomarker Logic Matching (Expanded)
        const biomarkerResult = this.checkBiomarkers(protocol, disease);
        if (biomarkerResult.missingHardData)
            hasMissingData = true;
        if (biomarkerResult.isMismatched)
            hasStrictMismatch = true;
        if (biomarkerResult.hasExcludedMarkers) {
            hasSafetyViolation = true;
            warnings.push("Safety: Excluded biomarker(s) present");
        }
        warnings.push(...biomarkerResult.warnings);
        // 3. ECOG Safety Check 
        if (ecog > protocol.maxEcog) {
            hasSafetyViolation = true;
            warnings.push(`Safety: ECOG ${ecog} > Max ${protocol.maxEcog}`);
        }
        // 4. Stage Eligibility 
        const stageArray = protocol.stageEligibility;
        const isAnyStage = stageArray.includes('Any');
        if (!isAnyStage && !stageArray.includes(disease.stageAtDiagnosis)) {
            hasStrictMismatch = true;
            warnings.push(`Mismatch: Stage ${disease.stageAtDiagnosis} vs ${protocol.stageEligibility.join('/')}`);
        }
        else {
            matchScore += 5;
        }
        // 5. Line of Therapy
        if (!protocol.lineOfTherapy.includes(currentLine)) {
            hasStrictMismatch = true;
            warnings.push(`Mismatch: Line ${currentLine} vs ${protocol.lineOfTherapy.join('/')}`);
            matchScore -= 5;
        }
        else {
            matchScore += 5;
        }
        // Determine status
        let isEligible = false;
        let status = 'Not eligible';
        const hasNoMatchFactors = hasSafetyViolation || hasMissingData || hasStrictMismatch;
        if (hasSafetyViolation || hasMissingData) {
            isEligible = false;
            status = 'Not eligible';
        }
        else if (hasStrictMismatch) {
            isEligible = false;
            status = 'Potential option';
        }
        else {
            isEligible = true;
            status = 'Eligible option';
        }
        return {
            protocol,
            isEligible,
            matchScore: hasNoMatchFactors && status === 'Not eligible' ? 0 : matchScore,
            warnings,
            rationale: `${protocol.rationale} (Requires clinician review). ${this.DATASET_DISCLAIMER}`,
            status
        };
    }
    checkBiomarkers(protocol, disease) {
        const warnings = [];
        let missingHardData = false;
        let isMismatched = false;
        let hasExcludedMarkers = false;
        // A. Required Biomarkers Logic
        const results = protocol.requiredBiomarkers.map(req => {
            const patient = disease.biomarkers?.find(b => b.name.toLowerCase() === req.name.toLowerCase());
            if (!patient || !patient.status || patient.status === 'Unknown') {
                return { satisfied: false, missing: true, hard: req.urgency === 'Hard' };
            }
            return { satisfied: patient.status === req.status, missing: false };
        });
        if (protocol.biomarkerLogic === 'ALL_OF') {
            if (results.some(r => r.missing && r.hard))
                missingHardData = true;
            if (results.some(r => !r.satisfied && !r.missing))
                isMismatched = true;
        }
        else { // ANY_OF
            const anySatisfied = results.some(r => r.satisfied);
            if (!anySatisfied) {
                if (results.every(r => r.missing && r.hard))
                    missingHardData = true;
                else
                    isMismatched = true;
            }
        }
        // Add specific warnings for missing data
        protocol.requiredBiomarkers.forEach((req, i) => {
            if (results[i].missing) {
                warnings.push(`Missing Data: ${req.name}`);
            }
            else if (!results[i].satisfied) {
                warnings.push(`Mismatch: ${req.name} ${req.status} required`);
            }
        });
        // B. Excluded Biomarkers (Safety)
        if (protocol.excludedBiomarkers) {
            for (const ex of protocol.excludedBiomarkers) {
                const patient = disease.biomarkers?.find(b => b.name.toLowerCase() === ex.name.toLowerCase());
                if (patient && patient.status === ex.status) {
                    hasExcludedMarkers = true;
                    warnings.push(`Exclusion: Found ${ex.name} ${ex.status}`);
                }
            }
        }
        return { missingHardData, isMismatched, hasExcludedMarkers, warnings };
    }
    checkPriorAgents(protocol, history) {
        const pastAgents = new Set(history.flatMap(h => h.agents || []).map(a => a.toLowerCase()));
        return protocol.agents.filter(agent => pastAgents.has(agent.toLowerCase()));
    }
    createEmptyMatch(protocol) {
        return {
            protocol,
            isEligible: false,
            matchScore: 0,
            warnings: [],
            rationale: '',
            status: 'Not eligible'
        };
    }
}
