# CDU Toxicity Module Full Audit

## 1. Module Location
- **Route Path**: `/cdu` (Toxicity tab)
- **Parent CDU Screen**: [src/modules/cdu/CDU.tsx](src/modules/cdu/CDU.tsx)
- **Toxicity Tab Component**: [src/modules/cdu/toxicity/Toxicity.tsx](src/modules/cdu/toxicity/Toxicity.tsx)
- **Data Source**: Supabase `toxicities` table via [src/services/toxicities.ts](src/services/toxicities.ts)
- **Accordion/Detail Component**: `AccordionItem` defined within [src/modules/cdu/toxicity/Toxicity.tsx](src/modules/cdu/toxicity/Toxicity.tsx)
- **Styling Components**: Tailwind CSS, Lucide-React icons, `@headlessui/react` for tabs.
- **Related Utility Files**: [src/services/toxicities.ts](src/services/toxicities.ts) (Data fetching/sanitization).

## 2. Files Reviewed
- [src/modules/cdu/CDU.tsx](src/modules/cdu/CDU.tsx)
- [src/modules/cdu/toxicity/Toxicity.tsx](src/modules/cdu/toxicity/Toxicity.tsx)
- [src/services/toxicities.ts](src/services/toxicities.ts)
- [supabase/migrations/20240318_insert_toxicity_data.sql](supabase/migrations/20240318_insert_toxicity_data.sql)
- [supabase/migrations/20240318_create_toxicities.sql](supabase/migrations/20240318_create_toxicities.sql)

## 3. Current Architecture
The current module follows a **Data → Renderer** pattern:
1. **Supabase**: Serves as the source of truth for toxicity definitions.
2. **Service Layer**: [src/services/toxicities.ts](src/services/toxicities.ts) fetches and sanitizes data into the `ToxicityData` interface.
3. **UI Layer**: [src/modules/cdu/toxicity/Toxicity.tsx](src/modules/cdu/toxicity/Toxicity.tsx) uses a `useEffect` hook to load all toxicities on mount and renders them in a responsive grid of accordions.

**Connections**:
- **Patient Inputs**: ❌ None found.
- **Drug/Regimen Context**: ❌ The view is global and not filtered by the current selected drug/regimen in the UI, although the service layer supports filtering by medication ID.
- **Labs**: ❌ No automated connection to patient lab results.
- **Disease Progress CDS**: ❌ No shared state or navigation links found.
- **Handbook**: ❌ No direct links to Handbook pages found in the UI code.

## 4. Toxicity Inventory

| Toxicity | Grades Shown | DLT? | Emergency? | Data Source | Actionable Guidance Present? |
|---|---|---|---|---|---|
| Peripheral Neuropathy | Grade 1-4 | No (schema allows) | No | Supabase | Yes (Management & Dose Reduction) |
| Mucositis | Grade 1-4 | No (schema allows) | No | Supabase | Yes (Oral hygiene, Hold/Reduce) |
| Fatigue | Grade 1-3 | No (schema allows) | No | Supabase | Yes (Exercise, Sleep, Breaks) |
| Rash | Grade 1-3 | No (schema allows) | No | Supabase | Yes (Antibiotics, Steroids, Hold) |
| Neutropenia | Grade 1-4 | No (schema allows) | No | Supabase | Yes (FBC, Temperature, G-CSF) |

*Note: The "Emergency?" column is marked No because the current seed data lacks explicit high-priority flags or automated escalation logic in the UI, even for Neutropenia Grade 4.*

## 5. Clinical Safety Findings
| Check | Status | Evidence/Note |
|---|---|---|
| Grade-specific description | ⚠️ Partial | Recognition field describes the condition but not distinct descriptions per Grade (except what's in the string). |
| Grade-specific action | ✅ Yes | Found in `dose_guidance` and `management` arrays. |
| Clinician review language | ❌ No | Missing standard "Refer to consultant" or "Medical review required" for high grades in seed data. |
| Emergency escalation | ❌ No | No red-flag highlighting for Grade 4 toxicities (e.g., Febrile Neutropenia). |
| Institutional protocol | ❌ No | No "Follow local policy" caveats found in the UI or seed data. |
| DLT explanation | ⚠️ Partial | Badge exists in UI (`toxicity.is_dose_limiting`) but no textual explanation of what DLT means for the patient. |
| Treatment hold caution | ✅ Yes | Mentioned in `dose_guidance` (e.g., "Hold until recovery"). |
| Missing urgent red flags | ⚠️ Warning | Neutropenia management mentions "Immediate review if fever" but does not trigger a UI-level alert or use high-contrast "EMERGENCY" styling beyond the red border. |

## 6. DLT / Emergency Escalation Findings
- **DLT Support**: The UI includes a DLT badge logic: `{toxicity.is_dose_limiting && (<span ...>DLT</span>)}`. However, the seed data checked did not have this flag set to `true` for any items.
- **Emergency Escalation**: The UI uses `getSeverityBorderColor` to highlight Grade 3/4 toxicities in red/orange. There is no automated "Press for Emergency Protocol" or direct link to the `EmergencyProtocols.tsx` component found in the CDU route.
- **Hospitalization**: The `requires_hospitalization` field exists in the schema but is NOT currently rendered in the `AccordionItem`.

## 7. UI / UX Findings
- **Accordion Behavior**: Standard single-open behavior (`openItem === index`).
- **Mobile Responsiveness**: Uses `grid-cols-1 md:grid-cols-2` which is good for layout, but long lists will require significant scrolling.
- **Readability**: Content is well-structured into sections (Clinical Details, Management, etc.).
- **Severity Prioritization**: ❌ The items are rendered in the order returned by the DB. There is no sorting by severity (e.g., Grade 4s at the top).
- **Filtering/Search**: ❌ No search bar or category filter found in `Toxicity.tsx`.
- **Dark Mode**: Uses `bg-white/90`, `text-gray-900`. No explicit `dark:` classes for high-contrast safety.

## 8. Safety Wording Findings
- **Unsafe wording**: ❌ None found (No "guaranteed", "safe", etc.).
- **Safe wording**: ❌ Limited. Lacks "For clinical decision support only" or "Verify clinically" disclaimers on the main page.
- **Phrasing**: Management steps are phrased as instructions (e.g., "Consider gabapentin") which is acceptable for CDS but needs the "Institutional Protocol" caveat.

## 9. Integration Findings
- **Tools**: No links to calculators (e.g., Neutropenia does not link to MASCC score).
- **Handbook**: No links to deep clinical content.
- **Medications**: While the data includes `culprit_drugs`, there is no active link to click a drug and see its full profile in the `MedicationsView`.

## 10. Test Coverage Findings
- **Unit Tests**: ❌ No tests found for `Toxicity.tsx` or `services/toxicities.ts`.
- **Integration Tests**: ❌ No tests found covering the toxicity data flow.
- **Missing**: Coverage for data sanitization, severity color logic, and Supabase fetch error handling.

## 11. P0 Issues
- **Missing Emergency Escalation**: Grade 4 toxicities (like Neutropenia) do not trigger prominent emergency UI or link to emergency protocols.
- **Lack of Disclaimer**: The module lacks a clinical safety disclaimer stating it is for CDS and requires clinician validation.
- **No Hospitalization Alert**: The `requires_hospitalization` flag is ignored by the UI.

## 12. P1 Issues
- **No Search/Filter**: Clinicians cannot quickly find a specific toxicity in a potentially long list.
- **Static Display Order**: Critical (Grade 3/4) toxicities are not moved to the top of the list.
- **Missing Integrity Checks**: No unit tests for critical grading and dose modification logic.

## 13. P2 Issues
- **Dark Mode Support**: UI may be difficult to read in low-light clinical environments.
- **Integration Gaps**: No deep linking between culprit drugs and the Medication module.
- **Redundancy**: `sanitizeToxicity` is defined in both the service and the component; should be centralized.

## 14. Recommended Fix Plan
1. **Safety Layer**: Add a global safety disclaimer and update the UI to handle `requires_hospitalization` and high-severity sorting.
2. **Search & Filter**: Implement a search bar and category filtering (e.g., "Neurological", "Gastrointestinal").
3. **Emergency Links**: Add a direct link to the `EmergencyProtocols` component for any toxicity where `severity` includes "4".
4. **Integration**: Cross-link `culprit_drugs` to the Medications tab.
5. **Testing**: Add Vitest coverage for the toxicity service and component rendering.

## 15. Do-Not-Touch Areas
- Supabase table structure (unless adding fields).
- Existing Lucide icon choices (consistent with UI).
- HeadlessUI tab implementation.
