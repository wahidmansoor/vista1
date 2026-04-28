# Sample ContentRenderer Output: Disease Monitoring Section

This document shows how the new Disease Monitoring handbook section will render in the Vista1 handbook viewer.

---

## When User Navigates to: `/handbook/medical/general-oncology/disease-monitoring/Introduction`

### Visual Rendering (Expected Output)

```
┌─────────────────────────────────────────────────────────────────┐
│  HANDBOOK > MEDICAL ONCOLOGY > GENERAL ONCOLOGY > DISEASE       │
│                                                   MONITORING   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Disease Monitoring Essentials                                   │
│  ════════════════════════════════════════════════════════════════ │
│                                                                   │
│  Systematic evaluation of cancer response to treatment and      │
│  detection of disease progression. Requires structured          │
│  documentation using standardized criteria to guide clinical    │
│  decisions.                                                      │
│                                                                   │
│  Disease Monitoring in Oncology                                 │
│  ─────────────────────────────────                              │
│  Disease monitoring is the systematic process of assessing a    │
│  patient's cancer status at defined intervals to determine     │
│  treatment response, detect progression, and guide clinical    │
│  decision-making. Standardized monitoring protocols ensure     │
│  consistency in documentation and enable reliable              │
│  communication across treatment teams.                          │
│                                                                   │
│  Key Objectives                                                 │
│  ───────────────                                                │
│  • Quantify tumor burden and measure change over time          │
│  • Classify treatment response using standardized criteria     │
│    (RECIST, PERCIST)                                           │
│  • Detect disease progression or recurrence early              │
│  • Guide decisions to continue, modify, or discontinue         │
│    treatment                                                     │
│  • Document baseline disease status for prognostic             │
│    assessment                                                    │
│  • Maintain consistent records for tumor boards and           │
│    longitudinal tracking                                        │
│                                                                   │
│  Critical Distinctions                                          │
│  ────────────────────                                           │
│  Clear terminology prevents clinical errors in treatment       │
│  planning. The following terms have distinct meanings and      │
│  different prognostic implications.                            │
│                                                                   │
│  • Disease Progression: Increase in tumor burden on active     │
│    treatment or within months of completing therapy            │
│  • Recurrence: Reappearance of cancer after a complete        │
│    response to prior treatment                                 │
│  • Metastasis: Spread of cancer to a distant anatomic site   │
│    (may be at diagnosis or develop later)                     │
│  • Treatment Resistance: Tumor growth despite adequate drug   │
│    exposure; often indicates need for drug class change       │
│                                                                   │
│  Three-Pillar Monitoring Framework                            │
│  ─────────────────────────────────                             │
│  Effective disease monitoring integrates three sources of     │
│  information:                                                   │
│                                                                   │
│  1. Imaging Assessment                                         │
│     Radiologic evaluation of measurable disease using         │
│     cross-sectional imaging (CT, MRI) or metabolic imaging    │
│     (PET). Provides objective measurement of tumor burden.    │
│                                                                   │
│  2. Biomarker Surveillance                                    │
│     Serum or tissue markers that correlate with disease      │
│     burden (e.g., CEA in colorectal cancer, PSA in          │
│     prostate cancer, CA-125 in ovarian cancer). Supports     │
│     and contextualizes imaging findings.                      │
│                                                                   │
│  3. Clinical Assessment                                       │
│     Patient symptoms, performance status changes, and        │
│     physical examination findings. May indicate progression  │
│     when imaging is stable or vice versa.                    │
│                                                                   │
│  [continues with remaining sections...]                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## When User Navigates to: `/handbook/medical/general-oncology/disease-monitoring/Definitions`

### Visual Structure

The Definitions section renders with:

1. **Definition blocks** for each term:
   - Heading: "Disease Progression (PD)" in large font
   - Core definition as main paragraph
   - "Clinical Context" subsection with bullet list
   - "Prognostic Implications" subsection with bullet list
   - "Example" subsection with scenario

2. **Quick Reference Table** at end:
   
```
┌──────────────────────────────────────────────────────────────────┐
│  QUICK REFERENCE TABLE                                           │
├──────────────────────┬──────────────┬──────────────┬────────────┤
│  Term                │  Timing      │  Starting    │  Prognostic│
│                      │              │  Point       │  Signif.   │
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ Progression          │ During/after │ Any response │ High risk; │
│                      │ therapy      │ category     │ urgent     │
│                      │              │              │ change     │
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ Recurrence           │ After CR     │ Complete    │ Indicates  │
│                      │ months-years │ response    │ incomplete │
│                      │              │              │ cure       │
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ Metastasis           │ At diagnosis │ Primary or  │ Advanced   │
│                      │ or anytime   │ existing    │ disease;   │
│                      │              │ disease     │ stage IV   │
├──────────────────────┼──────────────┼──────────────┼────────────┤
│ Resistance           │ Primary or   │ Same drug/  │ Mechanism- │
│                      │ acquired     │ class       │ based      │
│                      │              │              │ failure    │
└──────────────────────┴──────────────┴──────────────┴────────────┘
```

---

## When User Navigates to: `/handbook/medical/general-oncology/disease-monitoring/RECIST-Criteria`

### Visual Structure

The RECIST section renders with:

1. **Key Principles** - bulleted list with key RECIST fundamentals
2. **Three Lesion Categories** subsections
   - Each with description and bullet details
3. **Four Response Categories** subsections
   - CR: Bulleted criteria
   - PR: Bulleted criteria
   - SD: Bulleted criteria
   - PD: Bulleted criteria
4. **Practical Example** section:
   - "Scenario" (patient case)
   - "Calculation" (step-by-step)
   - Shows how percentage is calculated

5. **Common Measurement Issues** subsections
6. **When RECIST May Not Apply** - bulleted list
7. **Key Takeaways** - bulleted summary

---

## When User Navigates to: `/handbook/medical/general-oncology/disease-monitoring/Imaging-Strategy`

### Visual Structure

The Imaging Strategy section renders with:

1. **Five Primary Modalities** subsections:
   - CT: Advantages/Disadvantages/Typical Use
   - MRI: Advantages/Disadvantages/Typical Use
   - PET: Advantages/Disadvantages/Typical Use
   - Plain Radiography: Advantages/Disadvantages/Typical Use
   - Ultrasound: Advantages/Disadvantages/Typical Use

2. **Modality Selection Table**:

```
┌──────────────────┬─────────────────────┬─────────────────────────┐
│  Cancer Type     │  Primary Modality   │  Secondary/Complementary│
├──────────────────┼─────────────────────┼─────────────────────────┤
│  Lung Cancer     │  Chest CT           │  PET-CT if high-risk;   │
│                  │                     │  brain MRI if CNS       │
├──────────────────┼─────────────────────┼─────────────────────────┤
│  Lymphoma        │  CT chest/Abd/      │  PET-CT preferred for   │
│                  │  Pelvis ± PET       │  response assessment    │
│                  │                     │                         │
[... continues for 8 cancer types total ...]
└──────────────────┴─────────────────────┴─────────────────────────┘
```

3. **Timing of Reassessment** subsections:
   - During Active Treatment
   - Clinical Suspicion for Progression
   - Post-Treatment Surveillance

4. **Important Imaging Principles** subsections:
   - Consistency in Technique
   - Timing Relative to Treatment
   - Documentation
   - Atypical Responses

---

## When User Navigates to: `/handbook/medical/general-oncology/disease-monitoring/Treatment-Decision-Points`

### Visual Structure

The Treatment Decision Points section renders with:

1. **Response Category Decision Blocks**:
   - CR (Complete Response)
     - Considerations: bulleted list
     - Typical Decisions: numbered/bulleted
   - PR (Partial Response)
     - Considerations
     - Typical Decisions
   - SD (Stable Disease)
     - Considerations
     - Typical Decisions
   - PD (Progressive Disease)
     - Urgent Considerations
     - Typical Decisions

2. **Additional Clinical Factors** subsections:
   - Performance Status Changes
   - Biomarker Correlation
   - Symptom Trajectory
   - Toxicity Assessment

3. **Treatment Modification Strategies** subsections:
   - Continue Without Change
   - Dose Reduction / Schedule Extension
   - Add Complementary Therapy
   - Switch Drug Class
   - Stop Treatment

4. **Multidisciplinary Team Involvement** - bulleted list

5. **Key Decision Framework Summary Table**:

```
┌────────────────┬──────────────┬──────────────┬─────────────────┐
│  Response      │  Typical     │  Reassess    │  Key            │
│  Category      │  Action      │  Timeline    │  Consideration  │
├────────────────┼──────────────┼──────────────┼─────────────────┤
│  CR            │  Complete    │  Per         │  Confirm CR     │
│                │  planned     │  protocol    │  persists;      │
│  (Complete     │  course then │  (6-12       │  consider       │
│   Response)    │  stop/       │  weeks)      │  maintenance if │
│                │  surveillance│              │  high-risk      │
├────────────────┼──────────────┼──────────────┼─────────────────┤
│  PR            │  Continue    │  Per         │  Assess         │
│                │  current     │  protocol    │  tolerance;     │
│  (Partial      │  therapy     │  (6-8 weeks) │  may achieve CR │
│   Response)    │              │              │  with more      │
│                │              │              │  cycles         │
├────────────────┼──────────────┼──────────────┼─────────────────┤
│  SD            │  Continue if │  Per         │  Duration       │
│                │  tolerated   │  protocol or │  matters: early │
│  (Stable       │  and >3 mo   │  sooner if   │  SD (<3mo) may  │
│   Disease)     │  SD; else    │  concern     │  warrant change │
│                │  change      │              │                 │
├────────────────┼──────────────┼──────────────┼─────────────────┤
│  PD            │  Change      │  Urgent      │  Confirm PD;    │
│                │  therapy or  │  (1-2 weeks) │  assess cause;  │
│  (Progressive  │  stop;       │              │  consider       │
│   Disease)     │  confirm     │              │  molecular      │
│                │  diagnosis   │              │  profiling      │
└────────────────┴──────────────┴──────────────┴─────────────────┘
```

---

## Navigation and Cross-References

### Within Handbook
Users can navigate using sidebar TOC:

```
📖 Medical Oncology
  └─ General Oncology
      ├─ Cancer Biology (16 items)
      ├─ Performance Status (10 items)
      ├─ Staging Systems (11 items)
      ├─ Prognostic Scores (12 items)
      └─ Disease Monitoring (5 items) ← NEW
          ├─ Introduction
          ├─ Definitions
          ├─ RECIST Criteria
          ├─ Imaging Strategy
          └─ Treatment Decision Points ← Currently viewing
```

### Search Integration
Users searching for terms will find:
- "disease progression" → Definitions.json
- "RECIST" → RECIST-Criteria.json
- "imaging CT MRI PET" → Imaging-Strategy.json
- "treatment decision" → Treatment-Decision-Points.json

---

## Data Flow in ContentRenderer

When handbook viewer loads `general-oncology/disease-monitoring/RECIST-Criteria`:

1. **Path Resolution:**
   ```
   /handbook/medical/general-oncology/disease-monitoring/RECIST-Criteria
   ↓
   getContentPath() → /assets/handbook/medical/general-oncology/disease-monitoring/RECIST-Criteria
   ↓
   Fetch RECIST-Criteria.json
   ```

2. **JSON Parsing:**
   ```json
   {
     "title": "RECIST 1.1: Simplified Framework...",
     "content": [
       { "type": "heading", "level": 1, "text": "..." },
       { "type": "paragraph", "text": "..." },
       { "type": "heading", "level": 3, "text": "..." },
       { "type": "list", "items": [...] },
       { "type": "table", "headers": [...], "rows": [...] }
     ]
   }
   ```

3. **ContentRenderer Processing:**
   - Iterates through `content` array
   - For each block, matches `type` to rendering function
   - Heading → styled with appropriate level (h1, h2, h3, h4)
   - Paragraph → rendered with prose styling
   - List → rendered as bulleted or numbered list
   - Table → rendered with table styling

4. **Output:**
   - Markdown-like formatted content
   - Prose styling applied (font size, spacing, colors)
   - Dark mode support (via Tailwind dark: classes)

---

## Styling Example

The ContentRenderer applies these styles (from [src/modules/handbook/ContentRenderer.tsx](src/modules/handbook/ContentRenderer.tsx#L49-L62)):

```css
prose prose-slate dark:prose-invert
  prose-headings:scroll-mt-8
  max-w-none
  prose-h1:text-2xl prose-h1:font-bold prose-h1:text-gray-900
  prose-h2:text-xl prose-h2:font-semibold
  prose-h3:text-lg prose-h3:font-medium
  prose-p:text-gray-700 prose-p:leading-relaxed
  prose-li:text-gray-700
  prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
  prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
```

Result:
- ✅ Readable typography
- ✅ Good contrast
- ✅ Proper spacing
- ✅ Dark mode support
- ✅ Mobile responsive

---

## Sample: Complete Rendering of Definitions Example

### JSON Block (from Definitions.json):
```json
{
  "type": "heading",
  "level": 3,
  "text": "Example"
},
{
  "type": "paragraph",
  "text": "A patient with breast cancer treated with surgery, chemotherapy, and radiation achieved complete response. Two years later, imaging detects a new bone lesion with metabolic uptake on PET scan. This represents recurrence (specifically, late distant recurrence) and requires new systemic therapy."
}
```

### Rendered Output (HTML via ReactMarkdown):
```html
<h3 class="text-lg font-medium text-gray-800">Example</h3>
<p class="text-gray-700 leading-relaxed">
  A patient with breast cancer treated with surgery, chemotherapy, 
  and radiation achieved complete response. Two years later, imaging 
  detects a new bone lesion with metabolic uptake on PET scan. This 
  represents recurrence (specifically, late distant recurrence) and 
  requires new systemic therapy.
</p>
```

### Visual Display:
```
Example
─────────────────────────────────────────────────────────────

A patient with breast cancer treated with surgery, chemotherapy, 
and radiation achieved complete response. Two years later, imaging 
detects a new bone lesion with metabolic uptake on PET scan. This 
represents recurrence (specifically, late distant recurrence) and 
requires new systemic therapy.
```

---

## Ready for Integration

✅ All files properly formatted for ContentRenderer  
✅ All paths follow consistent pattern  
✅ All content types supported  
✅ All styling applied correctly  
✅ Dark mode compatible  
✅ Mobile responsive  
✅ Search-indexable  

**Status:** READY FOR CLINICAL TEAM REVIEW AND USER TESTING
